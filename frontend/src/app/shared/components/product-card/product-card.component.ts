import { Component, Input, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, MatSnackBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group relative h-full flex flex-col bg-dark-900 rounded-2xl overflow-hidden border border-white/5 transition-[transform,box-shadow,border-color] duration-500 hover:shadow-[0_0_50px_-15px_rgba(var(--color-primary-500),0.4)] hover:border-primary-500/50 hover:-translate-y-2 ring-1 ring-white/5 gpu-card">
      
      <!-- Image Container (Skeleton while loading) -->
      <div class="relative pt-[115%] overflow-hidden bg-dark-900 group/image-wrapper">
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0"></div>
        <img [ngSrc]="product.imageUrl" [alt]="product.name" 
             fill
             [priority]="index < 2"
             decoding="async"
             class="object-cover transition-transform duration-700 ease-out group-hover:scale-110 transform-gpu">
        
        <!-- Overlay (Lightened completely so it does not dim) -->
        <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-0 transition-opacity duration-300 pointer-events-none"></div>

        <!-- Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-2 z-20 pointer-events-none gpu-layer">
            <span *ngIf="product.stock < 10 && product.stock > 0" class="bg-red-500/80 backdrop-blur-md transform-gpu text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
               Few Left
            </span>
             <span *ngIf="product.stock === 0" class="bg-black/60 backdrop-blur-md transform-gpu text-gray-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
               Out of Stock
            </span>
            <span *ngIf="discountPercentage() > 0" class="bg-primary-500/90 backdrop-blur-md transform-gpu text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(var(--color-primary-500),0.4)]">
               -{{ discountPercentage() }}%
            </span>
        </div>

                <!-- Wishlist Button -->
        <button (click)="toggleWishlist($event)" 
                class="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 z-20 hover:scale-110 active:scale-95"
                [ngClass]="{
                    'bg-dark-800 border border-white/10 text-white hover:bg-white hover:text-red-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0': !isInWishlist(),
                    'bg-red-500/20 border border-red-500/50 text-red-500 opacity-100 translate-y-0 shadow-[0_0_15px_rgba(239,68,68,0.4)]': isInWishlist()
                }">
            <span class="material-icons text-lg" [ngClass]="{'animate-pulse': isInWishlist()}">
                {{ isInWishlist() ? 'favorite' : 'favorite_border' }}
            </span>
        </button>

        <!-- Quick View Button (Center) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
             <button class="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 bg-white/10 border border-white/20 text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-black hover:scale-105 shadow-[0_0_30px_rgba(0,0,0,0.5)] pointer-events-auto"
                    [routerLink]="['/products', product._id || product.id]">
                Quick View
            </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-grow flex flex-col p-5 relative z-10">
        <!-- Glow Reflection at top of content -->
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div class="text-[10px] text-primary-300 mb-2 uppercase tracking-widest font-bold drop-shadow-[0_0_5px_rgba(var(--color-primary-500),0.3)]">
            {{ product.category }}
        </div>
        
        <h3 class="font-bold text-white mb-2 text-lg leading-snug line-clamp-2 group-hover:text-primary-300 transition-colors cursor-pointer drop-shadow-md">
          <a [routerLink]="['/products', product._id || product.id]">{{ product.name }}</a>
        </h3>
        
        <div class="mt-auto pt-4 flex items-center justify-between">
           <div class="flex flex-col">
            <span *ngIf="product.originalPrice && product.originalPrice > product.price" class="text-xs text-gray-400 line-through mb-0.5">
                {{ product.originalPrice | currency:'INR' }}
            </span>
            <span class="text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{{ product.price | currency:'INR' }}</span>
          </div>
          
           <!-- Add to Cart -->
           <button (click)="addToCart($event)" 
                  class="bg-dark-800 hover:bg-primary-500 text-white hover:text-black border border-white/20 hover:border-primary-400 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 group/btn shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(var(--color-primary-500),0.5)]">
            <span class="material-icons text-base leading-none group-hover/btn:-translate-y-0.5 transition-transform">shopping_bag</span>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() index: number = 0;
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  isInWishlist = computed(() => {
    const id = this.product._id || this.product.id;
    return id ? this.wishlistService.isInWishlist(id) : false;
  });

  discountPercentage = computed(() => {
    if (this.product.originalPrice && this.product.originalPrice > this.product.price) {
      return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }
    return 0;
  });

  addToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const productId = this.product._id || this.product.id;
    if (productId) {
      this.cartService.addToCart(productId).subscribe({
        next: () => {
          const snackBarRef = this.snackBar.open(`${this.product.name} added to cart!`, 'View Cart', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['bg-green-600', 'text-white', 'font-bold']
          });
          
          snackBarRef.onAction().subscribe(() => {
             this.router.navigate(['/cart']);
          });
        },
        error: () => {
           this.snackBar.open('Error adding to cart.', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['bg-red-600', 'text-white']
          });
        }
      });
    }
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const productId = this.product._id || this.product.id;
    if (productId) {
      this.wishlistService.toggleWishlist(productId).subscribe(() => {
          const isNowInWishlist = this.isInWishlist();
          const message = isNowInWishlist ? `${this.product.name} added to wishlist!` : `${this.product.name} removed from wishlist`;
          this.snackBar.open(message, 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: isNowInWishlist ? ['bg-red-500', 'text-white', 'font-bold'] : ['bg-dark-800', 'text-white']
          });
      });
    }
  }
}
