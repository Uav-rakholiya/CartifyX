import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../core/services/wishlist.service';
import { CartService } from '../core/services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-dark-950 min-h-screen py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-white">My Wishlist</h1>
            <p class="text-gray-400 mt-2">Saved items you love</p>
          </div>
          <span class="bg-dark-900 border border-dark-800 text-gray-300 px-4 py-2 rounded-full text-sm font-medium">
            {{ wishlist().length }} Items
          </span>
        </div>

        <div *ngIf="wishlist().length === 0" class="flex flex-col items-center justify-center text-center py-24 bg-dark-900 rounded-xl border border-dark-800">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-dark-800 rounded-full mb-6">
              <span class="material-icons text-4xl text-gray-500">favorite_border</span>
            </div>
            <h2 class="text-xl text-gray-300 font-medium mb-2">No items in wishlist</h2>
            <p class="text-gray-500 text-center mb-8 max-w-xs mx-auto">Start saving your favorite pieces to see them here.</p>
            <a routerLink="/products" class="inline-flex items-center px-8 py-3 border border-transparent text-base font-bold rounded-xl shadow-lg text-white bg-primary-600 hover:bg-primary-700 transition-all transform hover:scale-105 active:scale-95">
                Explore Products
            </a>
        </div>

        <div *ngIf="wishlist().length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div *ngFor="let product of wishlist()" class="group bg-dark-900 rounded-xl border border-dark-800 overflow-hidden hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-900/10">
            
            <!-- Image Area -->
            <div class="relative aspect-square overflow-hidden bg-dark-800">
              <img [src]="product.imageUrl" [alt]="product.name" 
                   class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
              
              <!-- Remove Tooltip -->
              <button (click)="removeItem(product._id || product.id!)" 
                      class="absolute top-3 right-3 p-2 bg-dark-950/80 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg z-50 pointer-events-auto">
                <span class="material-icons text-sm">close</span>
              </button>

              <div class="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 pointer-events-none group-hover:pointer-events-auto z-20">
                 <button (click)="addToCart(product._id || product.id!)" 
                         class="w-full bg-white text-dark-950 font-bold py-2.5 rounded-lg flex items-center justify-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform pointer-events-auto">
                   <span class="material-icons text-sm">shopping_bag</span>
                   <span>Add to Bag</span>
                 </button>
              </div>
            </div>

            <!-- Content Area -->
            <div class="p-5">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold text-white leading-tight">
                  <a [routerLink]="['/products', product._id || product.id]" class="hover:text-primary-400 transition-colors">
                    {{ product.name }}
                  </a>
                </h3>
                <span class="text-primary-400 font-bold text-lg">{{ product.price | currency:'INR' }}</span>
              </div>
              <p class="text-gray-400 text-sm mb-4 line-clamp-1">{{ product.category }}</p>
              
              <div class="flex items-center space-x-3">
                 <button [routerLink]="['/products', product._id || product.id]" 
                         class="flex-1 text-center py-2 text-sm font-medium text-gray-300 border border-dark-700 rounded-lg hover:bg-dark-800 hover:text-white transition-all">
                   View Details
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class WishlistComponent {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);

  wishlist = this.wishlistService.wishlist;

  removeItem(productId: string) {
    this.wishlistService.toggleWishlist(productId).subscribe();
  }

  addToCart(productId: string) {
    this.cartService.addToCart(productId).subscribe();
  }
}
