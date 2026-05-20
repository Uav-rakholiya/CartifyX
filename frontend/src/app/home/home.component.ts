import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../core/services/product.service';
import { Product } from '../core/models/product.model';
import { HeroComponent } from './hero/hero.component';
import { ProductCardComponent } from '../shared/components/product-card/product-card.component';
import { AnnouncementBarComponent } from '../shared/components/announcement-bar/announcement-bar.component';
import { EditorialPromoComponent } from './editorial-promo/editorial-promo.component';
import { CategoryGridComponent } from './category-grid/category-grid.component';
import { BenefitsComponent } from './benefits/benefits.component';

import { ScrollAnimationDirective } from '../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, ProductCardComponent, CategoryGridComponent, BenefitsComponent, ScrollAnimationDirective, AnnouncementBarComponent, EditorialPromoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero></app-hero>

    <div class="py-10">
        <app-announcement-bar></app-announcement-bar>
    </div>

    <app-category-grid></app-category-grid>

    <app-editorial-promo></app-editorial-promo>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10" id="featured">
      <div class="flex items-center justify-between mb-10">
        <div>
          <h2 class="text-3xl font-bold mb-2 relative z-10" style="perspective: 1200px;">
            <div style="transform-style: preserve-3d;">
              <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white tracking-wider" style="animation-fill-mode: both;">
                Featured Products
              </span>
            </div>
          </h2>
          <p appScrollAnimation animation="ethereal-sweep" [delay]="500" class="text-gray-400" style="animation-fill-mode: both;">
            Handpicked favorites just for you
          </p>
        </div>
        <div class="relative z-50 pointer-events-auto">
          <button (click)="goToProducts()" class="bg-primary-500/10 border border-primary-500/20 text-primary-400 hover:bg-primary-500 hover:text-white px-4 py-2 rounded-lg font-medium flex items-center transition-all cursor-pointer">
              View All <span class="material-icons ml-1 text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div *ngFor="let i of [1,2,3,4]" class="animate-pulse bg-dark-900 rounded-2xl p-4 border border-dark-800">
            <div class="bg-dark-800 h-64 rounded-xl mb-4 w-full"></div>
            <div class="h-4 bg-dark-800 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-dark-800 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Product Grid -->
      <div *ngIf="!loading() && products().length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <app-product-card 
          *ngFor="let product of products(); trackBy: trackByProduct; let i = index" 
          [product]="product"
          appScrollAnimation 
          animation="fade-in-up" 
          [delay]="i * 30"
        ></app-product-card>
      </div>
      
      <!-- No Data State -->
      <div *ngIf="!loading() && products().length === 0" class="text-center py-24">
        <div class="bg-dark-900 border border-dark-800 p-8 rounded-2xl inline-block">
            <span class="material-icons text-4xl text-gray-600 mb-4">search_off</span>
            <p class="font-medium text-gray-300">No products loaded.</p>
            <p class="text-sm mt-2 text-gray-500">Check console for API errors.</p>
        </div>
      </div>
    </div>

    <app-benefits appScrollAnimation animation="fade-in-up"></app-benefits>

    <!-- Cinematic Collection Showcase -->
    <div class="w-full relative mt-32 h-[600px] overflow-hidden group">
      <!-- Background Image with Parallax-like slow zoom effect -->
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-[center_top_20%] bg-no-repeat transition-transform duration-[20s] group-hover:scale-110"></div>
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent"></div>

      <!-- Content Container -->
      <div class="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div class="max-w-xl">
            <div class="flex items-center gap-4 mb-6">
                <span class="h-[1px] w-12 bg-primary-500 block"></span>
                <span class="text-primary-400 font-medium tracking-[0.3em] uppercase text-sm">Exclusive Drop</span>
            </div>
            
            <h2 class="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter leading-[0.9] relative z-10" style="perspective: 1200px;">
                <div style="transform-style: preserve-3d;">
                    <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white" style="animation-fill-mode: both;">
                        The<br/>Obsidian<br/>Capsule
                    </span>
                </div>
            </h2>
            
            <p appScrollAnimation animation="ethereal-sweep" [delay]="400" class="text-gray-300 mb-10 text-lg md:text-xl font-light leading-relaxed max-w-md" style="animation-fill-mode: both;">
                Discover our most exclusive release yet. Tailored silhouettes, premium monochromatic fabrics, and uncompromising design for the modern urbanista.
            </p>
            
            <div class="flex flex-wrap gap-4">
                <button (click)="goToProducts()" class="bg-white text-black hover:bg-gray-200 px-8 py-4 font-bold tracking-[0.2em] uppercase text-xs transition-colors">
                    Shop The Drop
                </button>
                <button (click)="goToProducts()" class="border border-white/30 text-white hover:bg-white hover:text-black px-8 py-4 font-bold tracking-[0.2em] uppercase text-xs transition-all backdrop-blur-sm">
                    View Lookbook
                </button>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal<boolean>(true);

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit() {
    // Check for cached products to show UI instantly
    const cached = this.productService.getCachedProducts();
    if (cached && cached.length > 0) {
      this.products.set(cached.slice(0, 8));
      this.loading.set(false);
    }

    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products.set(data.slice(0, 8));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.loading.set(false);
      }
    });
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  trackByProduct(index: number, product: Product): string {
    return product._id || product.id || index.toString();
  }


}
