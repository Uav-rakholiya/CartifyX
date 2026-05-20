import { Component, OnInit, signal, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, ProductCardComponent, ScrollAnimationDirective, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="bg-dark-950 min-h-screen w-full relative overflow-x-hidden">
    <!-- Global Moving Background (Fixed to prevent scroll repaint) -->
        <div class="fixed inset-0 z-0 pointer-events-none transform-gpu overflow-hidden">
            <div class="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-amber-400/5 rounded-full blur-[150px] animate-blob"></div>
            <div class="absolute bottom-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-orange-400/5 rounded-full blur-[150px] animate-blob animation-delay-2000"></div>
            <div class="absolute top-[30%] left-[30%] w-[50vw] h-[50vw] bg-yellow-400/5 rounded-full blur-[150px] animate-blob animation-delay-4000"></div>
            <!-- mix-blend-mode is a massive performance killer during scrolling. Reduced opacity achieves the same noise effect natively -->
            <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        </div>

    <!-- Main Content -->
    <div class="relative min-h-screen pt-4 z-10">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        


        <!-- Floating Command Bar -->
        <div class="sticky top-6 z-40 mx-auto max-w-7xl mb-12" appScrollAnimation animation="fade-in-up">
            <div class="bg-black/60 backdrop-blur-2xl transform-gpu gpu-layer border border-white/10 rounded-2xl p-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex flex-col md:flex-row gap-4 items-center justify-between ring-1 ring-white/5">
                
                <!-- Search -->
                <div class="relative w-full md:w-[28rem] group">
                    <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                        <span class="material-icons text-gray-400 group-focus-within:text-primary-400 transition-colors text-xl group-focus-within:animate-pulse">search</span>
                    </div>
                    <input 
                        type="text" 
                        [ngModel]="searchQuery()"
                        (ngModelChange)="searchQuery.set($event)"
                        placeholder="Search for perfection..." 
                        class="w-full bg-white/5 border border-white/5 text-white rounded-xl pl-14 pr-4 py-3.5 text-sm focus:outline-none focus:bg-white/10 focus:border-primary-500/50 transition-all placeholder-gray-500 font-medium shadow-inner"
                    >
                    <div class="absolute inset-y-0 right-2 flex items-center">
                        <kbd class="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-gray-500">CTRL + K</kbd>
                    </div>
                </div>

                <!-- Right Side Controls -->
                <div class="flex items-center gap-3 w-full md:w-auto px-2">
                    <span class="text-xs font-bold text-gray-500 uppercase tracking-widest hidden lg:block mr-2">Sort By</span>
                    
                    <div class="relative group w-full md:w-auto min-w-[220px]">
                        <!-- Custom Dropdown Trigger -->
                        <button 
                            (click)="isSortDropdownOpen.set(!isSortDropdownOpen())"
                            class="w-full flex items-center justify-between bg-white/5 border border-white/5 text-white rounded-xl pl-5 pr-4 py-3.5 text-sm focus:outline-none focus:bg-white/10 focus:border-primary-500/50 transition-all font-medium hover:bg-white/10 backdrop-blur-md"
                        >
                            <span class="truncate">
                                <ng-container [ngSwitch]="sortBy()">
                                    <span *ngSwitchCase="'featured'">✨ Recommended</span>
                                    <span *ngSwitchCase="'price-low'">💰 Price: Low to High</span>
                                    <span *ngSwitchCase="'price-high'">💎 Price: High to Low</span>
                                    <span *ngSwitchCase="'newest'">🔥 Newest Arrivals</span>
                                </ng-container>
                            </span>
                            <span class="material-icons text-gray-500 text-sm transition-transform duration-300 transform" [class.rotate-180]="isSortDropdownOpen()">expand_more</span>
                        </button>

                        <!-- Custom Dropdown Menu -->
                        <div *ngIf="isSortDropdownOpen()" 
                             class="absolute top-full right-0 mt-2 w-full bg-dark-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up origin-top ring-1 ring-white/5">
                            <div class="py-2">
                                <button (click)="updateSort('featured')" class="w-full text-left px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 group/item" [class.bg-primary-500-10]="sortBy() === 'featured'" [class.text-primary-400]="sortBy() === 'featured'">
                                    <span class="material-icons text-base opacity-0 group-hover/item:opacity-100 transition-opacity text-primary-500" [class.opacity-100]="sortBy() === 'featured'">check</span>
                                    ✨ Recommended
                                </button>
                                <button (click)="updateSort('price-low')" class="w-full text-left px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 group/item" [class.bg-primary-500-10]="sortBy() === 'price-low'" [class.text-primary-400]="sortBy() === 'price-low'">
                                    <span class="material-icons text-base opacity-0 group-hover/item:opacity-100 transition-opacity text-primary-500" [class.opacity-100]="sortBy() === 'price-low'">check</span>
                                    💰 Price: Low to High
                                </button>
                                <button (click)="updateSort('price-high')" class="w-full text-left px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 group/item" [class.bg-primary-500-10]="sortBy() === 'price-high'" [class.text-primary-400]="sortBy() === 'price-high'">
                                    <span class="material-icons text-base opacity-0 group-hover/item:opacity-100 transition-opacity text-primary-500" [class.opacity-100]="sortBy() === 'price-high'">check</span>
                                    💎 Price: High to Low
                                </button>
                                <button (click)="updateSort('newest')" class="w-full text-left px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 group/item" [class.bg-primary-500-10]="sortBy() === 'newest'" [class.text-primary-400]="sortBy() === 'newest'">
                                    <span class="material-icons text-base opacity-0 group-hover/item:opacity-100 transition-opacity text-primary-500" [class.opacity-100]="sortBy() === 'newest'">check</span>
                                    🔥 Newest Arrivals
                                </button>
                            </div>
                        </div>
                        
                        <!-- Overlay to close dropdown -->
                        <div *ngIf="isSortDropdownOpen()" (click)="isSortDropdownOpen.set(false)" class="fixed inset-0 z-40 bg-transparent cursor-default"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-8 xl:gap-12 pl-2">
            
            <!-- Glass Filter Panel -->
            <aside class="w-full lg:w-72 shrink-0 space-y-8" appScrollAnimation animation="fade-in-left">
                <div class="lg:sticky lg:top-36 p-6 bg-white/5 backdrop-blur-2xl transform-gpu gpu-layer border border-white/10 rounded-3xl shadow-2xl ring-1 ring-white/5">
                    
                    <div class="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
                        <div class="p-2.5 bg-primary-500/10 rounded-xl text-primary-400 ring-1 ring-primary-500/20">
                            <span class="material-icons text-xl">tune</span>
                        </div>
                        <h3 class="text-white font-bold text-lg tracking-wide">Refine</h3>
                    </div>

                    <!-- Categories -->
                    <div class="space-y-6">
                        <h4 class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] pl-1 mb-4">Categories</h4>
                        <div class="space-y-2">
                           <label class="flex items-center group cursor-pointer p-3 rounded-xl transition-all duration-300" 
                                  [ngClass]="selectedCategory() === null ? 'bg-primary-500/10 border border-primary-500/20 shadow-[0_0_20px_rgba(var(--color-primary-500),0.1)]' : 'hover:bg-white/5 border border-transparent hover:border-white/5'">
                                <div class="relative flex items-center justify-center w-5 h-5 mr-3">
                                    <div class="w-2.5 h-2.5 rounded-full bg-current transition-all duration-500"
                                         [ngClass]="selectedCategory() === null ? 'bg-primary-400 scale-125 shadow-[0_0_10px_rgba(var(--color-primary-500),0.8)]' : 'bg-gray-600 group-hover:bg-gray-400'"></div>
                                </div>
                                <span class="text-sm font-bold transition-colors capitalize"
                                      [ngClass]="selectedCategory() === null ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'">All Collections</span>
                                <input type="radio" name="category" [value]="null" [checked]="selectedCategory() === null" (change)="selectedCategory.set(null)" class="hidden">
                           </label>

                            <label *ngFor="let cat of categories()" class="flex items-center group cursor-pointer p-3 rounded-xl transition-all duration-300"
                                   [ngClass]="selectedCategory() === cat ? 'bg-primary-500/10 border border-primary-500/20 shadow-[0_0_20px_rgba(var(--color-primary-500),0.1)]' : 'hover:bg-white/5 border border-transparent hover:border-white/5'">
                                <div class="relative flex items-center justify-center w-5 h-5 mr-3">
                                    <div class="w-2.5 h-2.5 rounded-full bg-current transition-all duration-500"
                                         [ngClass]="selectedCategory() === cat ? 'bg-primary-400 scale-125 shadow-[0_0_10px_rgba(var(--color-primary-500),0.8)]' : 'bg-gray-600 group-hover:bg-gray-400'"></div>
                                </div>
                                <span class="text-sm font-bold transition-colors capitalize"
                                      [ngClass]="selectedCategory() === cat ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'">{{ cat }}</span>
                                <input type="radio" name="category" [value]="cat" [checked]="selectedCategory() === cat" (change)="selectedCategory.set(cat)" class="hidden">
                            </label>
                        </div>
                    </div>

                    <div class="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8"></div>

                    <!-- Price Range -->
                    <div class="space-y-6">
                        <h4 class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] pl-1 mb-4">Price Range</h4>
                        
                        <div class="px-1 pt-2">
                             <!-- Visual Slider -->
                             <div class="relative h-1.5 bg-dark-900 rounded-full mb-8 shadow-inner">
                                <div class="absolute h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full opacity-80" style="left: 0; right: 0;"></div>
                                <div class="absolute h-5 w-5 bg-dark-800 rounded-full -top-1.5 shadow-[0_0_15px_rgba(255,255,255,0.3)] cursor-ew-resize left-0 -ml-2 border-2 border-primary-500 z-10 hover:scale-110 transition-transform"></div>
                                <div class="absolute h-5 w-5 bg-dark-800 rounded-full -top-1.5 shadow-[0_0_15px_rgba(255,255,255,0.3)] cursor-ew-resize right-0 -mr-2 border-2 border-purple-500 z-10 hover:scale-110 transition-transform"></div>
                            </div>
                            
                            <div class="flex items-center justify-between gap-3">
                                <div class="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 w-full flex flex-col group focus-within:border-primary-500/50 transition-colors">
                                    <span class="text-[9px] text-gray-500 uppercase font-black mb-1 tracking-wider">Min</span>
                                    <input 
                                        type="number" 
                                        [ngModel]="priceRange().min"
                                        (ngModelChange)="updateMinPrice($event)"
                                        class="w-full bg-transparent border-none text-white text-sm font-bold p-0 focus:ring-0 placeholder-gray-700 font-mono"
                                    >
                                </div>
                                <div class="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 w-full flex flex-col group focus-within:border-primary-500/50 transition-colors">
                                    <span class="text-[9px] text-gray-500 uppercase font-black mb-1 tracking-wider">Max</span>
                                    <input 
                                        type="number" 
                                        [ngModel]="priceRange().max"
                                        (ngModelChange)="updateMaxPrice($event)"
                                        class="w-full bg-transparent border-none text-white text-sm font-bold p-0 focus:ring-0 placeholder-gray-700 font-mono"
                                    >
                                </div>
                            </div>
                        </div>
                        
                        <button (click)="resetFilters()" class="w-full py-4 rounded-xl border border-white/10 bg-white/5 text-xs font-black text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest group shadow-lg">
                            <span class="material-icons text-sm group-hover:rotate-180 transition-transform">refresh</span> Reset Filters
                        </button>
                    </div>
                </div>
            </aside>

            <!-- Product Grid Area -->
            <div class="flex-1">
                <!-- Active Filters -->
                <div class="flex flex-wrap gap-3 mb-8" *ngIf="selectedCategory() || searchQuery() || priceRange().min > 0">
                    <div *ngIf="selectedCategory()" class="bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md shadow-[0_0_15px_rgba(var(--color-primary-500),0.2)] animate-fade-in-right">
                        {{ selectedCategory() }}
                        <button (click)="selectedCategory.set(null)" class="hover:text-white transition-colors"><span class="material-icons text-sm">close</span></button>
                    </div>
                    <div *ngIf="searchQuery()" class="bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md shadow-[0_0_15px_rgba(var(--color-primary-500),0.2)] animate-fade-in-right">
                        "{{ searchQuery() }}"
                        <button (click)="searchQuery.set('')" class="hover:text-white transition-colors"><span class="material-icons text-sm">close</span></button>
                    </div>
                </div>

                <!-- Loading State -->
                <div *ngIf="loading()" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    <div *ngFor="let i of [1,2,3,4,5,6]" class="animate-pulse bg-white/5 rounded-3xl p-4 border border-white/5 h-[450px]">
                        <div class="bg-white/5 h-72 rounded-2xl mb-6 w-full opacity-30"></div>
                        <div class="h-4 bg-white/10 rounded w-3/4 mb-4 opacity-30"></div>
                        <div class="h-4 bg-white/10 rounded w-1/2 opacity-30"></div>
                    </div>
                </div>

                <!-- Empty State -->
                <div *ngIf="!loading() && filteredProducts().length === 0" class="flex flex-col items-center justify-center py-32 text-center bg-white/5 backdrop-blur-xl rounded-3xl border border-white/5 mx-auto max-w-2xl shadow-2xl">
                    <div class="relative w-32 h-32 mb-6">
                        <div class="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full animate-pulse"></div>
                        <div class="relative w-full h-full bg-black/40 rounded-full flex items-center justify-center border border-white/10">
                             <span class="material-icons text-5xl text-gray-500">search_off</span>
                        </div>
                    </div>
                    <h2 class="text-3xl font-bold mb-3 tracking-tight relative z-10" style="perspective: 1200px;">
                        <div style="transform-style: preserve-3d;">
                            <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white tracking-wider" style="animation-fill-mode: both;">
                                No Products Found
                            </span>
                        </div>
                    </h2>
                    <p appScrollAnimation animation="ethereal-sweep" [delay]="500" class="text-gray-400 max-w-md mx-auto mb-8 text-lg" style="animation-fill-mode: both;">We couldn't find matches for your search. Try different keywords or filters.</p>
                    <button (click)="resetFilters()" class="btn-primary px-8 py-3.5 font-bold rounded-xl shadow-[0_0_25px_rgba(var(--color-primary-500),0.3)] hover:scale-105 transition-transform flex items-center gap-2">
                        <span class="material-icons">restart_alt</span> Reset All
                    </button>
                </div>

                <!-- Product Grid -->
                <div *ngIf="!loading() && filteredProducts().length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 transform-gpu gpu-layer">
                    <app-product-card *ngFor="let product of filteredProducts(); trackBy: trackByProduct; let i = index" [product]="product" [index]="i"></app-product-card>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class ProductListComponent implements OnInit {
    private productService = inject(ProductService);
    private route = inject(ActivatedRoute);

    // State
    allProducts = signal<Product[]>([]);
    loading = signal<boolean>(true);

    // Filters
    searchQuery = signal<string>('');
    selectedCategory = signal<string | null>(null);
    priceRange = signal<{ min: number; max: number }>({ min: 0, max: 10000 });
    sortBy = signal<string>('featured');
    isSortDropdownOpen = signal<boolean>(false);

    // Computed
    categories = computed(() => {
        const products = this.allProducts();
        return [...new Set(products.map(p => p.category))];
    });

    filteredProducts = computed(() => {
        let products = this.allProducts();
        const query = this.searchQuery().toLowerCase();
        const category = this.selectedCategory();
        const price = this.priceRange();
        const sort = this.sortBy();

        // 1. Search Filter
        if (query) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.category?.toLowerCase().includes(query)
            );
        }

        // 2. Category Filter
        if (category) {
            products = products.filter(p => p.category === category);
        }

        // 3. Price Filter
        products = products.filter(p => p.price >= price.min && p.price <= price.max);

        // 4. Sorting
        switch (sort) {
            case 'price-low':
                products = products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products = products.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                // Assuming we had a date field, for now mock or rely on ID/order
                products.reverse();
                break;
            case 'featured':
            default:
                // Keep original order or implement specific logic
                break;
        }

        return products;
    });


    ngOnInit() {
        // Initial load - fetch ALL products for client-side filtering
        this.fetchProducts();

        this.route.queryParams.subscribe(params => {
            if (params['category']) {
                this.selectedCategory.set(params['category']);
            }
            if (params['search']) {
                this.searchQuery.set(params['search']);
            }
            if (params['keyword']) {
                this.searchQuery.set(params['keyword']);
            }
        });
    }

    fetchProducts() {
        this.loading.set(true);
        // Fetch all products (no keyword)
        this.productService.getAllProducts().subscribe({
            next: (data) => {
                this.allProducts.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);
            }
        });
    }

    updateSort(value: string) {
        this.sortBy.set(value);
        this.isSortDropdownOpen.set(false);
    }

    updateMinPrice(value: number) {
        this.priceRange.update(curr => ({ ...curr, min: value }));
    }

    updateMaxPrice(value: number) {
        this.priceRange.update(curr => ({ ...curr, max: value }));
    }

    resetFilters() {
        this.searchQuery.set('');
        this.selectedCategory.set(null);
        this.priceRange.set({ min: 0, max: 1000000 });
        this.sortBy.set('featured');
    }

    trackByProduct(index: number, product: Product): string {
        return product._id || product.id || index.toString();
    }
}
