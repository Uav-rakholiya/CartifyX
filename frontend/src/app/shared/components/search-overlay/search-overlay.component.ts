import { Component, OnInit, ViewChild, ElementRef, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SearchService } from '../../../core/services/search.service';
import { Product } from '../../../core/models/product.model';

@Component({
    selector: 'app-search-overlay',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
        <div *ngIf="isOpen" class="search-overlay">
            <!-- Dark backdrop -->
            <div class="backdrop" (click)="close()"></div>

            <!-- Search container -->
            <div class="search-container">
                <!-- Search input -->
                <div class="search-input-wrapper">
                    <span class="search-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </span>
                    <input
                        #searchInput
                        type="text"
                        placeholder="Search products..."
                        class="search-input"
                        [(ngModel)]="query"
                        (ngModelChange)="onSearch($event)"
                        (keydown)="handleKeydown($event)"
                    />
                    <button *ngIf="query" class="clear-btn" (click)="clearSearch()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <!-- Results -->
                <div class="search-results">
                    <!-- Loading state -->
                    <div *ngIf="isLoading" class="loading-state">
                        <div class="spinner"></div>
                        <p>Searching...</p>
                    </div>

                    <!-- No results -->
                    <div *ngIf="!isLoading && query && results.length === 0" class="no-results">
                        <p>No products found for "{{ query }}"</p>
                    </div>

                    <!-- Results list -->
                    <div *ngIf="!isLoading && results.length > 0" class="results-list">
                        <a
                            *ngFor="let product of results; let i = index"
                            [routerLink]="['/products', product.id]"
                            (click)="close()"
                            class="result-item"
                            [class.active]="i === selectedIndex"
                        >
                            <img
                                [src]="product.imageUrl"
                                [alt]="product.name"
                                class="product-image"
                                onerror="this.src='https://via.placeholder.com/60?text=No+Image'"
                            />
                            <div class="product-details">
                                <h3 class="product-name">{{ product.name }}</h3>
                                <p class="product-category">{{ product.category }}</p>
                            </div>
                            <div class="product-price">
                                <span class="current-price">₹{{ product.price | number: '1.0-2' }}</span>
                                <span *ngIf="product.originalPrice" class="original-price">
                                    ₹{{ product.originalPrice | number: '1.0-2' }}
                                </span>
                            </div>
                        </a>
                    </div>

                    <!-- Help text -->
                    <div *ngIf="!query" class="help-text">
                        <p>Start typing to search products...</p>
                        <div class="keyboard-hints">
                            <span class="hint">↑↓ Navigate</span>
                            <span class="hint">⏎ Select</span>
                            <span class="hint">ESC Close</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .search-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 80px;
            animation: fadeIn 0.15s ease-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        .backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            cursor: pointer;
        }

        .search-container {
            position: relative;
            z-index: 1;
            width: 90%;
            max-width: 600px;
            max-height: 70vh;
            background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .search-input-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            background: rgba(0, 0, 0, 0.2);
        }

        .search-icon {
            color: #cbd5e1;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .search-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: #f1f5f9;
            font-size: 16px;
            font-family: inherit;
            caret-color: #fbbf24;
        }

        .search-input::placeholder {
            color: #64748b;
        }

        .clear-btn {
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
        }

        .clear-btn:hover {
            color: #f1f5f9;
        }

        .search-results {
            flex: 1;
            overflow-y: auto;
            min-height: 100px;
        }

        .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 40px;
            color: #cbd5e1;
        }

        .spinner {
            width: 24px;
            height: 24px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-top-color: #fbbf24;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        .no-results {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            text-align: center;
            color: #94a3b8;
        }

        .help-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            padding: 40px 20px;
            color: #64748b;
            font-size: 14px;
        }

        .keyboard-hints {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .hint {
            background: rgba(255, 255, 255, 0.08);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .results-list {
            display: flex;
            flex-direction: column;
        }

        .result-item {
            display: flex;
            gap: 12px;
            padding: 12px 16px;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            cursor: pointer;
            text-decoration: none;
            transition: background 0.2s;
        }

        .result-item:hover,
        .result-item.active {
            background: rgba(251, 191, 36, 0.1);
        }

        .product-image {
            width: 56px;
            height: 56px;
            border-radius: 8px;
            object-fit: cover;
            border: 1px solid rgba(255, 255, 255, 0.1);
            flex-shrink: 0;
        }

        .product-details {
            flex: 1;
            min-width: 0;
        }

        .product-name {
            color: #f8fafc;
            font-size: 14px;
            font-weight: 500;
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .product-category {
            color: #94a3b8;
            font-size: 12px;
            margin: 4px 0 0 0;
        }

        .product-price {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
            flex-shrink: 0;
        }

        .current-price {
            color: #fbbf24;
            font-weight: 600;
            font-size: 14px;
        }

        .original-price {
            color: #64748b;
            font-size: 12px;
            text-decoration: line-through;
        }

        /* Scrollbar styling */
        .search-results::-webkit-scrollbar {
            width: 6px;
        }

        .search-results::-webkit-scrollbar-track {
            background: transparent;
        }

        .search-results::-webkit-scrollbar-thumb {
            background: rgba(100, 116, 139, 0.5);
            border-radius: 3px;
        }

        .search-results::-webkit-scrollbar-thumb:hover {
            background: rgba(100, 116, 139, 0.8);
        }

        @media (max-width: 640px) {
            .search-overlay {
                padding-top: 20px;
            }

            .search-container {
                width: 95%;
                max-height: 80vh;
            }

            .result-item {
                gap: 10px;
                padding: 10px 12px;
            }

            .product-image {
                width: 48px;
                height: 48px;
            }
        }
    `]
})
export class SearchOverlayComponent implements OnInit {
    @ViewChild('searchInput') searchInput!: ElementRef;

    private searchService = inject(SearchService);

    query = '';
    results: Product[] = [];
    isOpen = false;
    isLoading = false;
    selectedIndex = -1;

    constructor() {
        effect(() => {
            this.isOpen = this.searchService.isOpen();
            if (this.isOpen) {
                setTimeout(() => this.searchInput?.nativeElement?.focus(), 100);
            }
        });

        // Subscribe to query signal - moved from ngOnInit to constructor (injection context)
        effect(() => {
            this.query = this.searchService.query();
        });
    }

    ngOnInit() {
        this.searchService.results$.subscribe(results => {
            this.results = results;
            this.selectedIndex = -1;
        });

        this.searchService.isLoading$.subscribe(loading => {
            this.isLoading = loading;
        });
    }

    ngAfterViewInit() {
        // Focus is handled in the effect
    }

    onSearch(query: string) {
        this.searchService.search(query);
    }

    handleKeydown(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.results.length - 1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                break;
            case 'Enter':
                event.preventDefault();
                if (this.selectedIndex >= 0 && this.results[this.selectedIndex]) {
                    const product = this.results[this.selectedIndex];
                    // Navigation happens via routerLink
                    this.close();
                }
                break;
            case 'Escape':
                event.preventDefault();
                this.close();
                break;
        }
    }

    clearSearch() {
        this.searchService.query.set('');
        this.searchService.search('');
        setTimeout(() => this.searchInput?.nativeElement?.focus(), 0);
    }

    close() {
        this.searchService.closeSearch();
    }
}
