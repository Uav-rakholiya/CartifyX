import { Injectable, computed, signal, inject, effect, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';
import { tap, catchError, switchMap, forkJoin, of, Observable, take } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private productService = inject(ProductService);
    private destroyRef = inject(DestroyRef);
    private apiUrl = `${environment.apiUrl}/wishlist`;

    // Signals
    wishlist = signal<Product[]>([]);

    // Computed Signals
    wishlistCount = computed(() => this.wishlist().length);

    constructor() {
        this.initWishlist();

        // Use a more robust sync/fetch on auth state change
        effect(() => {
            const user = this.authService.currentUser();

            if (user) {
                const localItems = localStorage.getItem('guest_wishlist');
                if (localItems && JSON.parse(localItems).length > 0) {
                    this.syncWishlist().pipe(
                        catchError(err => {
                            console.error('WishlistService: Sync failed.', err);
                            return of(null);
                        })
                    ).subscribe();
                } else {
                    this.getWishlist().pipe(
                        catchError(err => {
                            console.error('Error loading wishlist:', err);
                            return of(null);
                        })
                    ).subscribe();
                }
            } else {
                this.loadGuestWishlist();
            }
        });
    }

    private loadGuestWishlist() {
        const localItems = localStorage.getItem('guest_wishlist');
        if (localItems) {
            try {
                this.wishlist.set(JSON.parse(localItems));
            } catch (e) {
                this.wishlist.set([]);
            }
        } else {
            this.wishlist.set([]);
        }
    }

    private initWishlist() {
        if (this.authService.isAuthenticated()) {
            this.getWishlist().pipe(
                catchError(err => {
                    console.error('Error initializing wishlist:', err);
                    return of(null);
                })
            ).subscribe();
        } else {
            const localWishlist = localStorage.getItem('guest_wishlist');
            if (localWishlist) {
                try {
                    this.wishlist.set(JSON.parse(localWishlist));
                } catch (e) {
                    console.error('Error parsing guest wishlist:', e);
                    this.wishlist.set([]);
                }
            } else {
                this.wishlist.set([]);
            }
        }
    }

    getWishlist() {
        return this.http.get<{ status: string, data: Product[] }>(this.apiUrl).pipe(
            tap(res => {
                this.wishlist.set(res.data);
            })
        );
    }

    toggleWishlist(productId: string) {

        if (this.authService.isAuthenticated()) {
            // Optimistic update would be complex here because we need product object
            // So we'll just handle the request and show results
            return this.http.post<{ status: string, data: Product[] }>(`${this.apiUrl}/toggle`, { productId }).pipe(
                tap(res => {
                    if (res && res.data) {
                        this.wishlist.set(res.data);
                    }
                }),
                catchError(err => {
                    console.error('Error toggling wishlist:', err);
                    const errorMsg = err.error?.message || err.message || 'Unknown error';
                    alert(`Could not update wishlist: ${errorMsg}`);
                    return of(null);
                })
            );
        } else {
            // Guest Logic
            let currentWishlist = [...this.wishlist()];
            const index = currentWishlist.findIndex(p => (p._id || p.id) === productId);

            if (index > -1) {
                currentWishlist = currentWishlist.filter((_, i) => i !== index);
                this.saveLocalWishlist(currentWishlist);
                return of({ status: 'success', data: currentWishlist });
            } else {
                return this.productService.getProductById(productId).pipe(
                    tap(product => {
                        if (product) {
                            this.saveLocalWishlist([...currentWishlist, product]);
                        }
                    }),
                    switchMap(() => of({ status: 'success', data: this.wishlist() })),
                    catchError(err => {
                        console.error('Error in guest toggle:', err);
                        alert('Could not find product details.');
                        return of(null);
                    })
                );
            }
        }
    }

    isInWishlist(productId: string): boolean {
        return this.wishlist().some(p => (p._id || p.id) === productId);
    }

    private saveLocalWishlist(items: Product[]) {
        localStorage.setItem('guest_wishlist', JSON.stringify(items));
        this.wishlist.set(items);
    }

    syncWishlist(): Observable<any> {
        const localItems = localStorage.getItem('guest_wishlist');
        if (!localItems) return of(null);

        const items: Product[] = JSON.parse(localItems);
        if (items.length === 0) {
            localStorage.removeItem('guest_wishlist');
            return of(null);
        }

        const productIds = items.map(p => p._id || p.id);

        return this.http.post<{ status: string, data: Product[] }>(`${this.apiUrl}/sync`, { productIds }).pipe(
            take(1),
            tap(res => {
                localStorage.removeItem('guest_wishlist');
                this.wishlist.set(res.data);
            }),
            catchError(err => {
                console.error('Error syncing wishlist:', err);
                return of(null);
            })
        );
    }
}
