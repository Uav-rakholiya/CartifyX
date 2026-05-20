import { Injectable, computed, signal, inject, effect, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';
import { tap, catchError, switchMap, forkJoin, of, filter, take, Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    _id?: string;
    user?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private productService = inject(ProductService);
    private destroyRef = inject(DestroyRef);
    private apiUrl = `${environment.apiUrl}/cart`;

    // Signals
    cart = signal<Cart | null>(null);

    // Computed Signals
    cartItems = computed(() => this.cart()?.items || []);

    totalItems = computed(() => {
        return this.cartItems().reduce((total, item) => total + item.quantity, 0);
    });

    totalPrice = computed(() => {
        return this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0);
    });

    constructor() {
        this.initCart();

        // Use effect to watch for login and sync cart
        effect(() => {
            const user = this.authService.currentUser();
            if (user) {
                // Use a non-blocking sync with error handling
                this.syncCart().pipe(
                    catchError(err => {
                        console.error('Cart sync error:', err);
                        return of(null);
                    })
                ).subscribe();
            }
        });
    }

    private initCart() {
        if (this.authService.isAuthenticated()) {
            this.getCart().pipe(
                catchError(err => {
                    console.error('Error loading cart:', err);
                    this.cart.set({ items: [] });
                    return of(null);
                })
            ).subscribe();
        } else {
            const localCart = localStorage.getItem('guest_cart');
            if (localCart) {
                try {
                    this.cart.set(JSON.parse(localCart));
                } catch (e) {
                    console.error('Error parsing local cart', e);
                    this.cart.set({ items: [] });
                }
            } else {
                this.cart.set({ items: [] });
            }
        }
    }

    getCart() {
        return this.http.get<{ status: string, data: Cart }>(this.apiUrl).pipe(
            tap(res => {
                this.cart.set(res.data);
            })
        );
    }

    addToCart(productId: string, quantity: number = 1) {
        if (this.authService.isAuthenticated()) {
            return this.http.post<{ status: string, data: Cart }>(this.apiUrl, { productId, quantity }).pipe(
                tap(res => {
                    this.cart.set(res.data);
                })
            );
        } else {
            // Guest Cart Logic
            return this.productService.getProductById(productId).pipe(
                tap(product => {
                    const currentCart = this.cart() || { items: [] };
                    const items = [...currentCart.items];
                    const itemIndex = items.findIndex(item => (item.product._id || item.product.id) === productId);

                    if (itemIndex > -1) {
                        items[itemIndex] = {
                            ...items[itemIndex],
                            quantity: items[itemIndex].quantity + quantity
                        };
                    } else {
                        items.push({ product, quantity });
                    }

                    this.saveLocalCart({ ...currentCart, items });
                }),
                switchMap(product => of({ status: 'success', data: this.cart()! }))
            );
        }
    }

    updateItem(productId: string, quantity: number) {
        if (this.authService.isAuthenticated()) {
            return this.http.put<{ status: string, data: Cart }>(this.apiUrl, { productId, quantity }).pipe(
                tap(res => {
                    this.cart.set(res.data);
                })
            );
        } else {
            const currentCart = this.cart() || { items: [] };
            let items = [...currentCart.items];
            const itemIndex = items.findIndex(item => (item.product._id || item.product.id) === productId);

            if (itemIndex > -1) {
                if (quantity > 0) {
                    items[itemIndex] = { ...items[itemIndex], quantity };
                } else {
                    items = items.filter((_, i) => i !== itemIndex);
                }
                this.saveLocalCart({ ...currentCart, items });
            }
            return of({ status: 'success', data: this.cart()! });
        }
    }

    removeItem(productId: string) {
        if (this.authService.isAuthenticated()) {
            return this.http.delete<{ status: string, data: Cart }>(`${this.apiUrl}/${productId}`).pipe(
                tap(res => {
                    this.cart.set(res.data);
                })
            );
        } else {
            const currentCart = this.cart() || { items: [] };
            const items = currentCart.items.filter(item => (item.product._id || item.product.id) !== productId);
            this.saveLocalCart({ ...currentCart, items });
            return of({ status: 'success', data: this.cart()! });
        }
    }

    private saveLocalCart(cart: Cart) {
        localStorage.setItem('guest_cart', JSON.stringify(cart));
        this.cart.set({ ...cart });
    }

    syncCart(): Observable<any> {
        const localCart = localStorage.getItem('guest_cart');
        if (!localCart) return of(null);

        const cart: Cart = JSON.parse(localCart);
        if (!cart.items || cart.items.length === 0) {
            localStorage.removeItem('guest_cart');
            return of(null);
        }

        // Send each item to backend
        const requests = cart.items.map(item =>
            this.addToCart(item.product._id || item.product.id!, item.quantity)
        );

        return forkJoin(requests).pipe(
            take(1),
            tap(() => {
                localStorage.removeItem('guest_cart');
                // Refresh cart from server
                this.getCart().pipe(
                    catchError(err => {
                        console.error('Error refreshing cart after sync:', err);
                        return of(null);
                    })
                ).subscribe();
            }),
            catchError(err => {
                console.error('Error syncing cart:', err);
                return of(null);
            })
        );
    }
}
