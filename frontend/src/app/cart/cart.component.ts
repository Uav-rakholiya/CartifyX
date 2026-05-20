import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../core/services/cart.service';
import { ScrollAnimationDirective } from '../shared/directives/scroll-animation.directive';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterLink, ScrollAnimationDirective],
    template: `
    <div class="bg-dark-950 min-h-screen py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 class="text-3xl font-bold mb-8 relative" style="perspective: 1200px;">
           <div style="transform-style: preserve-3d;">
               <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white" style="animation-fill-mode: both;">
                   Shopping Cart
               </span>
           </div>
        </h1>

        <div *ngIf="cartItems().length === 0" class="text-center py-20 bg-dark-900 rounded-xl border border-dark-800">
            <span class="material-icons text-6xl text-dark-700 mb-4">shopping_cart</span>
            <h2 class="text-xl text-gray-300 font-medium mb-2">Your cart is empty</h2>
            <p class="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <a routerLink="/products" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors">
                Start Shopping
            </a>
        </div>

        <div *ngIf="cartItems().length > 0" class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          
          <!-- Cart Items List -->
          <section class="lg:col-span-8">
            <div class="bg-dark-900 rounded-xl border border-dark-800 overflow-hidden">
                <ul role="list" class="divide-y divide-dark-800">
                    <li *ngFor="let item of cartItems()" class="p-6 sm:flex sm:items-center">
                        <!-- Image -->
                        <div class="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-dark-800 rounded-xl overflow-hidden border border-dark-700">
                            <img [src]="item.product.imageUrl" [alt]="item.product.name" class="w-full h-full object-center object-cover">
                        </div>

                        <!-- Details -->
                        <div class="mt-4 sm:mt-0 sm:ml-6 flex-1 flex flex-col justify-between sm:flex-row">
                            <div class="sm:pr-8">
                                <h3 class="text-lg font-medium text-white">
                                    <a [routerLink]="['/products', item.product._id || item.product.id]" class="hover:text-primary-400 transition-colors">{{ item.product.name }}</a>
                                </h3>
                                <p class="mt-1 text-sm text-gray-400">{{ item.product.category }}</p>
                                <p class="mt-2 text-lg font-bold text-primary-400">{{ item.product.price | currency }}</p>
                            </div>

                            <div class="mt-4 sm:mt-0 sm:items-start sm:justify-end flex items-center justify-between sm:flex-col sm:space-y-4">
                                <!-- Quantity Controls -->
                                <div class="flex items-center border border-dark-700 rounded-lg">
                                    <button (click)="updateQuantity(item.product._id || item.product.id, item.quantity - 1)" class="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50" [disabled]="item.quantity <= 1">
                                        <span class="material-icons text-sm">remove</span>
                                    </button>
                                    <span class="px-2 text-white font-medium">{{ item.quantity }}</span>
                                    <button (click)="updateQuantity(item.product._id || item.product.id, item.quantity + 1)" class="p-2 text-gray-400 hover:text-white transition-colors">
                                        <span class="material-icons text-sm">add</span>
                                    </button>
                                </div>

                                <!-- Remove Button -->
                                <button (click)="removeItem(item.product._id || item.product.id)" type="button" class="text-sm font-medium text-red-500 hover:text-red-400 flex items-center transition-colors">
                                    <span class="material-icons text-sm mr-1">delete</span>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
          </section>

          <!-- Order Summary -->
          <section class="lg:col-span-4 mt-8 lg:mt-0">
            <div class="bg-dark-900 rounded-xl border border-dark-800 p-6 sticky top-24">
                <h2 class="text-lg font-medium text-white mb-6">Order Summary</h2>

                <dl class="space-y-4 text-sm">
                    <div class="flex items-center justify-between">
                        <dt class="text-gray-400">Subtotal</dt>
                        <dd class="font-medium text-white">{{ totalPrice() | currency }}</dd>
                    </div>
                    <div class="flex items-center justify-between">
                        <dt class="text-gray-400">Shipping estimate</dt>
                        <dd class="font-medium text-white">{{ shipping() | currency }}</dd>
                    </div>
                    <div class="flex items-center justify-between">
                        <dt class="text-gray-400">Tax estimate</dt>
                        <dd class="font-medium text-white">{{ tax() | currency:'INR' }}</dd>
                    </div>

                    <div class="border-t border-dark-700 pt-4 flex items-center justify-between">
                        <dt class="text-base font-bold text-white">Order total</dt>
                        <dd class="text-xl font-bold text-primary-400">{{ total() | currency:'INR' }}</dd>
                    </div>
                </dl>

                <div class="mt-8">
                    <button routerLink="/checkout" class="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-900/20 transition-all transform active:scale-[0.98]">
                        Proceed to Checkout
                    </button>
                </div>
                
                <div class="mt-6 text-center text-xs text-gray-500">
                    <p>Secure Checkout powered by Stripe</p>
                </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  `
})
export class CartComponent {
    private cartService = inject(CartService);

    cartItems = this.cartService.cartItems;
    totalPrice = this.cartService.totalPrice;

    // Mock calculations
    shipping = () => this.totalPrice() > 100 ? 0 : 15;
    tax = () => this.totalPrice() * 0.08;
    total = () => this.totalPrice() + this.shipping() + this.tax();

    updateQuantity(productId: string | undefined, quantity: number) {
        if (productId && quantity > 0) {
            this.cartService.updateItem(productId, quantity).subscribe();
        }
    }

    removeItem(productId: string | undefined) {
        if (productId) {
            this.cartService.removeItem(productId).subscribe();
        }
    }
}
