import { Component, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { RecentlyViewedService } from '../../core/services/recently-viewed.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="bg-dark-950 min-h-screen py-12 relative overflow-x-hidden">
        <!-- Background Gradients -->
        <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div class="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-primary-900/10 rounded-full blur-[120px] animate-blob"></div>
            <div class="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
            <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
        </div>

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Breadcrumb -->
        <nav class="flex mb-8 text-xs font-bold uppercase tracking-widest text-gray-500 animate-fade-in-up" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <a routerLink="/" class="inline-flex items-center hover:text-primary-400 transition-colors">
                <span class="material-icons text-sm mr-2">home</span>
                Home
              </a>
            </li>
            <li>
              <div class="flex items-center">
                <span class="material-icons text-gray-700 mx-2 text-xs">chevron_right</span>
                <a routerLink="/products" class="hover:text-primary-400 transition-colors">Products</a>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <span class="material-icons text-gray-700 mx-2 text-xs">chevron_right</span>
                <span class="text-gray-300 truncate max-w-[200px] sm:max-w-xs">{{ product()?.name }}</span>
              </div>
            </li>
          </ol>
        </nav>

        <!-- Loading Skeleton -->
        <div *ngIf="loading()" class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 animate-pulse">
            <div class="bg-white/5 rounded-3xl aspect-[4/5] border border-white/5"></div>
            <div class="space-y-8 py-8">
                <div class="h-12 bg-white/5 rounded-2xl w-3/4"></div>
                <div class="h-8 bg-white/5 rounded-xl w-1/3"></div>
                <div class="space-y-4 pt-8">
                    <div class="h-4 bg-white/5 rounded-lg w-full"></div>
                    <div class="h-4 bg-white/5 rounded-lg w-full"></div>
                    <div class="h-4 bg-white/5 rounded-lg w-2/3"></div>
                </div>
                <div class="h-24 bg-white/5 rounded-2xl w-full mt-8"></div>
            </div>
        </div>

        <!-- Product Content -->
        <div *ngIf="!loading() && product()" class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start animate-fade-in">
          
          <!-- Holographic Image Showcase -->
          <div class="relative group perspective-1000">
             <!-- Animated Glow Behind -->
            <div class="absolute -inset-4 bg-gradient-to-br from-primary-600/30 to-purple-600/30 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-500 animate-pulse-slow"></div>
            
            <div class="relative aspect-[4/5] bg-white/5 backdrop-blur-sm rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] group-hover:-translate-y-2">
                <img [src]="product()?.imageUrl || 'assets/images/placeholder.png'" 
                     (error)="handleImageError($event)"
                     [alt]="product()?.name" 
                     class="w-full h-full object-cover object-center transform transition duration-1000 ease-out group-hover:scale-110">
                
                <!-- Overlay Gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-60"></div>

                <!-- Floating Category Badge -->
                <div class="absolute top-6 left-6 z-20 flex flex-col gap-2">
                    <span class="px-5 py-2.5 bg-black/60 backdrop-blur-xl text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                        {{ product()?.category }}
                    </span>
                    <span *ngIf="product()?.productType" class="px-5 py-2.5 bg-black/60 backdrop-blur-xl text-gray-300 text-xs font-bold uppercase tracking-widest rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center w-max">
                        {{ product()?.productType }}
                    </span>
                </div>
            </div>

            <!-- Additional Images Gallery -->
            <div *ngIf="product()?.additionalImages?.length" class="mt-6 flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
                <button *ngFor="let img of product()!.additionalImages" 
                        (click)="setMainImage(img)"
                        class="snap-start shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105"
                        [ngClass]="currentImage() === img ? 'border-primary-500 shadow-[0_0_15px_rgba(var(--color-primary-500),0.4)]' : 'border-white/10 hover:border-white/30'">
                    <img [src]="img || 'assets/images/placeholder.png'" 
                         (error)="handleImageError($event)"
                         class="w-full h-full object-cover">
                </button>
            </div>
          </div>

          <!-- Product Details Panel -->
          <div class="flex flex-col py-4">
            
            <!-- Header -->
            <div class="mb-6">
                <span *ngIf="product()?.vendor" class="text-sm font-bold text-primary-400 uppercase tracking-widest mb-2 block">{{ product()?.vendor }}</span>
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 leading-tight tracking-tight drop-shadow-lg">
                    {{ product()?.name }}
                </h1>
            </div>
            
            <!-- Price & Stock -->
            <div class="flex items-end gap-6 mb-10 pb-10 border-b border-white/5">
                <div class="flex flex-col">
                    <span class="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Price</span>
                    <div class="flex items-baseline gap-4">
                        <span class="text-5xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            {{ product()?.price | currency:'INR' }}
                        </span>
                        <span *ngIf="product()?.originalPrice && product()!.originalPrice! > product()!.price" class="text-2xl text-gray-600 line-through font-medium">
                            {{ product()?.originalPrice | currency:'INR' }}
                        </span>
                    </div>
                </div>

                <div class="mb-2">
                    <span *ngIf="discountPercentage() > 0" class="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20 uppercase tracking-wider shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                        Save {{ discountPercentage() }}%
                    </span>
                </div>
            </div>

            <!-- Description -->
            <div class="prose prose-invert max-w-none text-gray-300 mb-12 text-lg leading-relaxed font-light">
              <p>{{ product()?.description }}</p>
            </div>

            <!-- Action Command Center -->
            <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] ring-1 ring-white/5 mb-12 relative overflow-hidden group/card">
                <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
                
                <div class="relative z-10 flex flex-col sm:flex-row gap-6">
                    <!-- Quantity Input -->
                    <div class="flex flex-col space-y-3">
                        <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quantity</label>
                        <div class="flex items-center bg-black/40 border border-white/10 rounded-2xl p-1.5 w-40 h-16">
                            <button (click)="decrementQuantity()" class="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors" [disabled]="quantity() <= 1">
                                <span class="material-icons">remove</span>
                            </button>
                            <span class="flex-1 text-center font-bold text-xl text-white font-mono">{{ quantity() }}</span>
                            <button (click)="incrementQuantity()" class="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors" [disabled]="quantity() >= product()!.stock">
                                <span class="material-icons">add</span>
                            </button>
                        </div>
                    </div>

                    <!-- Size Selector (if sizes exist) -->
                    <div *ngIf="product()?.sizes?.length" class="flex flex-col space-y-3 w-full sm:w-auto">
                        <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Select Size</label>
                        <div class="flex flex-wrap gap-2">
                            <button *ngFor="let size of product()!.sizes" 
                                    (click)="selectSize(size)"
                                    class="h-16 px-6 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all border"
                                    [ngClass]="selectedSize() === size ? 'bg-primary-500 text-dark-950 border-primary-500 shadow-[0_0_15px_rgba(var(--color-primary-500),0.4)]' : 'bg-black/40 text-gray-300 border-white/10 hover:border-white/30 hover:bg-white/5'">
                                {{ size }}
                            </button>
                        </div>
                    </div>

                    <!-- Add to Cart & Wishlist -->
                    <div class="flex-1 flex gap-4 items-end mt-4 sm:mt-0">
                        <button (click)="addToCart()" 
                                [disabled]="product()!.stock === 0 || (product()?.sizes?.length && !selectedSize())"
                                class="flex-1 h-16 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(var(--color-primary-500),0.3)] hover:shadow-[0_0_40px_rgba(var(--color-primary-500),0.5)] transform transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group/btn">
                            <span class="material-icons group-hover/btn:-translate-y-0.5 transition-transform">shopping_bag</span>
                            Add to Cart
                        </button>
                        
                        <button (click)="toggleWishlist()" 
                                class="h-16 w-16 flex items-center justify-center bg-black/40 border border-white/10 rounded-2xl transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 group/wishlist"
                                [ngClass]="isInWishlist() ? 'border-red-500/50 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : ''">
                            <span class="material-icons text-xl transition-colors duration-300" 
                                  [ngClass]="isInWishlist() ? 'text-red-500 animate-pulse' : 'text-gray-400 group-hover/wishlist:text-white'">
                                {{ isInWishlist() ? 'favorite' : 'favorite_border' }}
                            </span>
                        </button>
                    </div>
                </div>

                <!-- Stock Status -->
                <div class="mt-6 flex items-center gap-3">
                    <div class="h-2 flex-1 bg-dark-800 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" 
                             [style.width.%]="(product()!.stock / 100) * 100"
                             [ngClass]="{'from-red-500 to-orange-500': product()!.stock < 10}"></div>
                    </div>
                    <span class="text-xs font-bold uppercase tracking-wider" 
                          [ngClass]="product()!.stock < 10 ? 'text-red-400' : 'text-green-400'">
                        {{ product()!.stock < 10 ? 'Only ' + product()!.stock + ' Left!' : 'In Stock' }}
                    </span>
                </div>
            </div>

            <!-- Glass Benefits Grid -->
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group">
                    <div class="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(var(--color-primary-500),0.2)]">
                        <span class="material-icons">local_shipping</span>
                    </div>
                    <h4 class="text-white font-bold mb-1">Free Delivery</h4>
                    <p class="text-xs text-gray-500 font-medium">On all orders over ₹1000</p>
                </div>
                
                <div class="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group">
                    <div class="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                         <span class="material-icons">verified_user</span>
                    </div>
                    <h4 class="text-white font-bold mb-1">Secure Payment</h4>
                    <p class="text-xs text-gray-500 font-medium">100% secure checkout</p>
                </div>
            </div>

          </div>
        </div>

        <!-- Extended Product Information Sections -->
        <div *ngIf="!loading() && product()" class="space-y-12 mt-24 animate-fade-in-up">
          
          <!-- Full Description Section -->
          <div *ngIf="product()?.fullDescription" class="border-t border-white/5 pt-12">
            <div class="max-w-3xl">
              <h2 class="text-3xl font-black text-white mb-6 tracking-tight flex items-center gap-3">
                <span class="material-icons text-primary-400">description</span>
                Detailed Description
              </h2>
              <div class="prose prose-invert max-w-none text-gray-400 leading-relaxed font-light space-y-4 text-lg">
                <p *ngFor="let para of splitText(product()!.fullDescription!)" class="text-gray-300">{{ para }}</p>
              </div>
            </div>
          </div>

          <!-- Features Section -->
          <div *ngIf="product()?.features && product()!.features!.length > 0" class="border-t border-white/5 pt-12">
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight flex items-center gap-3">
              <span class="material-icons text-primary-400">star</span>
              Key Features
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div *ngFor="let feature of product()!.features" class="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 flex items-start gap-4 group">
                <div class="w-5 h-5 rounded-full bg-primary-500/30 text-primary-400 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform flex-shrink-0">
                  <span class="material-icons text-sm">check</span>
                </div>
                <span class="text-gray-300 font-medium">{{ feature }}</span>
              </div>
            </div>
          </div>

          <!-- Specifications Section -->
          <div *ngIf="product()?.specifications && hasSpecifications()" class="border-t border-white/5 pt-12">
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight flex items-center gap-3">
              <span class="material-icons text-primary-400">tune</span>
              Specifications
            </h2>
            <div class="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
              <table class="w-full text-sm">
                <tbody class="divide-y divide-white/5">
                  <tr *ngFor="let spec of getSpecsAsArray()" class="hover:bg-white/2 transition-colors">
                    <td class="px-6 py-4 text-gray-400 font-semibold capitalize min-w-[200px] bg-white/2">{{ spec.label }}</td>
                    <td class="px-6 py-4 text-gray-300">{{ spec.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Material & Care Section -->
          <div *ngIf="product()?.material" class="border-t border-white/5 pt-12 max-w-2xl">
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight flex items-center gap-3">
              <span class="material-icons text-primary-400">texture</span>
              Material & Care
            </h2>
            <div class="bg-white/5 border border-white/5 rounded-2xl p-8">
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <span class="material-icons text-primary-400 mt-1">info</span>
                  <div>
                    <p class="text-sm text-gray-400 uppercase font-bold tracking-wider mb-1">Composition</p>
                    <p class="text-lg text-gray-300 font-medium">{{ product()?.material }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dimensions Section -->
          <div *ngIf="product()?.dimensions && hasDimensions()" class="border-t border-white/5 pt-12 max-w-3xl">
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight flex items-center gap-3">
              <span class="material-icons text-primary-400">straighten</span>
              Dimensions & Weight
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div *ngIf="product()!.dimensions!.length" class="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 text-center group">
                <div class="text-3xl font-black text-primary-400 mb-2 group-hover:scale-110 transition-transform">{{ product()!.dimensions!.length }}</div>
                <p class="text-xs text-gray-400 uppercase font-bold tracking-wider">Length (cm)</p>
              </div>
              <div *ngIf="product()!.dimensions!.width" class="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 text-center group">
                <div class="text-3xl font-black text-primary-400 mb-2 group-hover:scale-110 transition-transform">{{ product()!.dimensions!.width }}</div>
                <p class="text-xs text-gray-400 uppercase font-bold tracking-wider">Width (cm)</p>
              </div>
              <div *ngIf="product()!.dimensions!.height" class="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 text-center group">
                <div class="text-3xl font-black text-primary-400 mb-2 group-hover:scale-110 transition-transform">{{ product()!.dimensions!.height }}</div>
                <p class="text-xs text-gray-400 uppercase font-bold tracking-wider">Height (cm)</p>
              </div>
              <div *ngIf="product()!.dimensions!.weight" class="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 text-center group">
                <div class="text-3xl font-black text-primary-400 mb-2 group-hover:scale-110 transition-transform">{{ product()!.dimensions!.weight }}</div>
                <p class="text-xs text-gray-400 uppercase font-bold tracking-wider">Weight (kg)</p>
              </div>
            </div>
          </div>

          <!-- Warranty & Return Policy Section -->
          <div *ngIf="(product()?.warranty && hasWarranty()) || (product()?.returnPolicy && hasReturnPolicy())" class="border-t border-white/5 pt-12">
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight flex items-center gap-3">
              <span class="material-icons text-primary-400">security</span>
              Warranty & Returns
            </h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Warranty Card -->
              <div *ngIf="product()?.warranty && hasWarranty()" class="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 group">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span class="material-icons">verified</span>
                  </div>
                  <h3 class="text-xl font-bold text-white">Warranty</h3>
                </div>
                <div class="space-y-4">
                  <div *ngIf="product()!.warranty!.period">
                    <p class="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Period</p>
                    <p class="text-lg text-gray-300 font-medium">{{ product()!.warranty!.period }}</p>
                  </div>
                  <div *ngIf="product()!.warranty!.coverage">
                    <p class="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Coverage</p>
                    <p class="text-gray-300">{{ product()!.warranty!.coverage }}</p>
                  </div>
                  <div *ngIf="product()!.warranty!.description">
                    <p class="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Details</p>
                    <p class="text-gray-300 text-sm leading-relaxed">{{ product()!.warranty!.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Return Policy Card -->
              <div *ngIf="product()?.returnPolicy && hasReturnPolicy()" class="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 group">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span class="material-icons">balance</span>
                  </div>
                  <h3 class="text-xl font-bold text-white">Return Policy</h3>
                </div>
                <div class="space-y-4">
                  <div *ngIf="product()!.returnPolicy!.daysAllowed">
                    <p class="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Return Window</p>
                    <p class="text-lg text-gray-300 font-medium">{{ product()!.returnPolicy!.daysAllowed }} Days</p>
                  </div>
                  <div *ngIf="product()!.returnPolicy!.conditions">
                    <p class="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Conditions</p>
                    <p class="text-gray-300">{{ product()!.returnPolicy!.conditions }}</p>
                  </div>
                  <div *ngIf="product()!.returnPolicy!.process">
                    <p class="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Process</p>
                    <p class="text-gray-300 text-sm leading-relaxed">{{ product()!.returnPolicy!.process }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Related Products Section -->
        <div *ngIf="relatedProducts().length > 0" class="mt-24 border-t border-white/5 pt-16 animate-fade-in-up">
            <h3 class="text-3xl font-black text-white mb-2 tracking-tight">You May Also Like</h3>
            <p class="text-gray-400 mb-8 font-medium tracking-wide">More from this collection</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div *ngFor="let rp of relatedProducts()">
                    <app-product-card [product]="rp"></app-product-card>
                </div>
            </div>
        </div>

        <!-- Recently Viewed Section -->
        <div *ngIf="recentProducts().length > 0" class="mt-24 border-t border-white/5 pt-16 animate-fade-in-up">
            <h3 class="text-3xl font-black text-white mb-8 tracking-tight">Recently Viewed</h3>
            <div class="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar">
                <div *ngFor="let rp of recentProducts()" class="snap-center shrink-0 w-[280px]">
                    <app-product-card [product]="rp"></app-product-card>
                </div>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);
  private recentlyViewedService = inject(RecentlyViewedService);
  private destroy$ = new Subject<void>();

  product = signal<Product | null>(null);
  loading = signal<boolean>(true);
  quantity = signal<number>(1);
  selectedSize = signal<string | null>(null);
  currentImage = signal<string>('');
  recentProducts = signal<Product[]>([]);
  relatedProducts = signal<Product[]>([]);

  isInWishlist = computed(() => {
    const p = this.product();
    if (!p) return false;
    return this.wishlistService.isInWishlist(p._id || p.id);
  });

  discountPercentage = computed(() => {
    const p = this.product();
    if (p && p.originalPrice && p.originalPrice > p.price) {
      return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    }
    return 0;
  });

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.fetchProduct(id);
        }
      });
  }

  fetchProduct(id: string) {
    this.loading.set(true);
    this.productService.getProductById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('📦 Product data received:', data);
          console.log('✅ fullDescription:', data.fullDescription);
          console.log('✅ features:', data.features);
          console.log('✅ specifications:', data.specifications);
          console.log('✅ material:', data.material);
          console.log('✅ dimensions:', data.dimensions);
          console.log('✅ warranty:', data.warranty);
          console.log('✅ returnPolicy:', data.returnPolicy);
          console.log('✅ additionalAttributes:', data.additionalAttributes);

          this.product.set(data);
          this.currentImage.set(data.imageUrl); // Initialize main image
          this.updateMetaTags(data);
          this.updateStructuredData(data);
          this.loading.set(false);

          // Track and load recents
          // @ts-ignore
          const pId = data._id || data.id;
          this.recentlyViewedService.addProduct(pId);
          this.loadRecentProducts(pId);

          // Load related items based on category
          if (data.category) {
            this.loadRelatedProducts(data.category, pId);
          }
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        }
      });
  }

  loadRecentProducts(currentProductId: string) {
    const ids = this.recentlyViewedService.recentIds().filter(id => id !== currentProductId);
    if (ids.length === 0) {
      this.recentProducts.set([]);
      return;
    }

    this.productService.getAllProducts('', ids)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          // Sort to match the order of IDs in local storage
          const sortedProducts = products.sort((a, b) => {
            // @ts-ignore
            return ids.indexOf(a._id || a.id) - ids.indexOf(b._id || b.id);
          });
          this.recentProducts.set(sortedProducts);
        },
        error: (err) => console.error('Failed to load recent products', err)
      });
  }

  loadRelatedProducts(category: string, currentProductId: string) {
    // Fetch 6 products from the same category
    this.productService.getAllProducts(undefined, undefined, category, 6)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          // Filter out the current product itself to prevent duplication
          // @ts-ignore
          const filtered = products.filter(p => (p._id || p.id) !== currentProductId).slice(0, 4);
          this.relatedProducts.set(filtered);
        },
        error: (err) => console.error('Failed to load related products', err)
      });
  }

  updateMetaTags(product: Product) {
    this.title.setTitle(`${product.name} | CartifyX`);

    if (product.description) {
      const description = product.description.substring(0, 160);
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
    }

    this.meta.updateTag({ property: 'og:title', content: product.name });
    if (product.imageUrl) {
      this.meta.updateTag({ property: 'og:image', content: product.imageUrl });
    }
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    if (this.document.defaultView) {
      const canonicalUrl = this.document.defaultView.location.href;
      let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
    }
  }

  updateStructuredData(product: Product) {
    this.removeStructuredData();

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-json-ld';

    const url = this.document.defaultView ? this.document.defaultView.location.href : '';

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": product.imageUrl ? [product.imageUrl] : [],
      "description": product.description,
      "offers": {
        "@type": "Offer",
        "url": url,
        "priceCurrency": "INR",
        "price": product.price,
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    };

    script.text = JSON.stringify(jsonLd);
    this.document.head.appendChild(script);
  }

  removeStructuredData() {
    const existingScript = this.document.getElementById('product-json-ld');
    if (existingScript) {
      existingScript.remove();
    }
  }

  ngOnDestroy() {
    this.removeStructuredData();
    this.destroy$.next();
    this.destroy$.complete();
  }

  incrementQuantity() {
    if (this.product() && this.quantity() < this.product()!.stock) {
      this.quantity.update(v => v + 1);
    }
  }

  decrementQuantity() {
    this.quantity.update(v => v > 1 ? v - 1 : 1);
  }

  selectSize(size: string) {
    this.selectedSize.set(size);
  }

  setMainImage(imgUrl: string) {
    this.currentImage.set(imgUrl);

    // Update the main product image url temporarily for display
    const current = this.product();
    if (current) {
      this.product.set({
        ...current,
        imageUrl: imgUrl
      });
    }
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/placeholder.png';
  }

  addToCart() {
    if (this.product()) {
      if (this.product()?.sizes?.length && !this.selectedSize()) {
        alert('Please select a size first.');
        return;
      }

      const productId = this.product()!._id || this.product()!.id;
      if (!productId) {
        alert('Product ID not found.');
        return;
      }

      this.cartService.addToCart(productId, this.quantity()).subscribe(() => {
        alert(`Added ${this.quantity()} item(s) to cart successfully!`);
      });
    }
  }

  toggleWishlist() {
    const p = this.product();
    if (p) {
      this.wishlistService.toggleWishlist(p._id || p.id).subscribe();
    }
  }

  // Helper methods for extended product information display

  hasSpecifications(): boolean {
    const specs = this.product()?.specifications;
    if (!specs) return false;
    if (Array.isArray(specs)) return specs.length > 0;
    return Object.keys(specs).length > 0;
  }

  getSpecsAsArray(): Array<{ label: string; value: string }> {
    const specs = this.product()?.specifications;
    if (!specs) return [];

    if (Array.isArray(specs)) {
      return specs;
    }

    return Object.entries(specs).map(([key, value]) => ({
      label: key,
      value: String(value)
    }));
  }

  hasDimensions(): boolean {
    const dims = this.product()?.dimensions;
    if (!dims) return false;
    return !!(dims.length || dims.width || dims.height || dims.weight);
  }

  hasWarranty(): boolean {
    const warranty = this.product()?.warranty;
    if (!warranty) return false;
    return !!(warranty.period || warranty.coverage || warranty.description);
  }

  hasReturnPolicy(): boolean {
    const policy = this.product()?.returnPolicy;
    if (!policy) return false;
    return !!(policy.daysAllowed || policy.conditions || policy.process);
  }

  splitText(text: string): string[] {
    // Split on double newlines for paragraphs, or split on single newlines
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    return paragraphs.length > 0 ? paragraphs : [text];
  }
}
