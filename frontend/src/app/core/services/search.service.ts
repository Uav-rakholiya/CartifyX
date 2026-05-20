import { Injectable, signal, computed, DestroyRef, inject } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { Subject as RxjsSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private querySubject = new Subject<string>();
    private resultsSubject = new BehaviorSubject<Product[]>([]);
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    private destroy$ = new RxjsSubject<void>();

    query = signal<string>('');
    isOpen = signal<boolean>(false);
    results$ = this.resultsSubject.asObservable();
    isLoading$ = this.isLoadingSubject.asObservable();

    constructor(private productService: ProductService) {
        this.setupSearch();
    }

    private setupSearch() {
        this.querySubject
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe((keyword: string) => {
                if (keyword.trim().length > 0) {
                    this.performSearch(keyword);
                } else {
                    this.resultsSubject.next([]);
                }
            });
    }

    search(keyword: string) {
        this.query.set(keyword);
        this.querySubject.next(keyword);
    }

    private performSearch(keyword: string) {
        this.isLoadingSubject.next(true);
        this.productService.getAllProducts(keyword, undefined, undefined, 20)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (products: Product[]) => {
                    this.resultsSubject.next(products);
                    this.isLoadingSubject.next(false);
                },
                error: (err) => {
                    console.error('Search error:', err);
                    this.resultsSubject.next([]);
                    this.isLoadingSubject.next(false);
                }
            });
    }

    openSearch() {
        this.isOpen.set(true);
    }

    closeSearch() {
        this.isOpen.set(false);
        this.query.set('');
        this.resultsSubject.next([]);
    }

    getResults(): Product[] {
        return this.resultsSubject.value;
    }
}
