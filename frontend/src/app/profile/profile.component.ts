import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { OrderService, Order } from '../core/services/order.service';
import { FormsModule } from '@angular/forms';
import { ScrollAnimationDirective } from '../shared/directives/scroll-animation.directive';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink, FormsModule, NgOptimizedImage, ScrollAnimationDirective],
    template: `
    <div class="min-h-screen bg-dark-950 text-sans relative overflow-x-hidden pt-24">
      
      <!-- Global Moving Background -->
      <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-900/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4"></div>
          <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        <!-- Profile Header: Glass Card -->
        <div class="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-3xl p-8 lg:p-12 shadow-2xl mb-12 relative overflow-hidden group">
            <!-- Neon Glow Line -->
            <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
            
            <div class="relative z-10 md:flex items-center justify-between gap-8">
                <div class="flex flex-col md:flex-row items-center gap-8">
                    <!-- Avatar with Neon Ring -->
                    <div class="relative group/avatar">
                        <div class="absolute inset-0 bg-primary-500 rounded-full blur-xl opacity-20 group-hover/avatar:opacity-40 transition-opacity duration-500 animate-pulse"></div>
                        <div class="relative h-32 w-32 rounded-full p-[3px] bg-gradient-to-tr from-primary-400 via-primary-500 to-amber-600 group-hover/avatar:animate-[spin_10s_linear_infinite] transition-all">
                            <div class="h-full w-full rounded-full bg-dark-950 flex items-center justify-center overflow-hidden relative z-10">
                                <span class="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-tr from-primary-300 to-white">
                                    {{ currentUser()?.name?.charAt(0) | uppercase }}
                                </span>
                            </div>
                        </div>
                        <div class="absolute bottom-1 right-1 h-5 w-5 bg-green-500 rounded-full border-[3px] border-dark-950 shadow-[0_0_10px_rgba(34,197,94,0.6)] z-20"></div>
                    </div>

                    <!-- User Info -->
                    <div class="text-center md:text-left">
                        <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 class="text-4xl lg:text-5xl font-display font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] relative" style="perspective: 1200px;">
                               <div style="transform-style: preserve-3d;">
                                   <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white" style="animation-fill-mode: both;">
                                       {{ currentUser()?.name || 'Loading...' }}
                                   </span>
                               </div>
                            </h1>
                            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary-500/20 text-primary-300 border border-primary-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(var(--color-primary-500),0.2)]">
                                {{ currentUser()?.role }}
                            </span>
                        </div>
                        <p class="text-gray-400 font-medium text-lg flex items-center justify-center md:justify-start gap-2 mb-6">
                            <span class="material-icons text-primary-500/70 text-sm">alternate_email</span>
                            {{ currentUser()?.email }}
                        </p>
                        <div class="flex flex-wrap justify-center md:justify-start gap-4">
                            <div class="flex items-center gap-2 text-xs font-bold text-gray-400 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                <span class="material-icons text-sm">calendar_today</span>
                                Member since Jan 2024
                            </div>
                            <div class="flex items-center gap-2 text-xs font-bold text-green-400/80 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                                <span class="material-icons text-sm">verified_user</span>
                                Verified Account
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="mt-8 md:mt-0 flex flex-wrap justify-center md:justify-end gap-4">
                    <button *ngIf="currentUser()?.role === 'admin'"
                            routerLink="/admin/dashboard"
                            class="group relative px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-400 text-dark-950 font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(var(--color-primary-500),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary-500),0.5)] hover:scale-105 active:scale-95 flex items-center gap-2">
                        <span class="material-icons text-lg group-hover:rotate-12 transition-transform">dashboard</span>
                        Command Center
                    </button>

                    <button (click)="logout()" 
                            class="group relative px-6 py-3 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-gray-300 hover:text-red-400 font-bold text-sm tracking-wide transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] active:scale-95 flex items-center gap-2">
                        <span class="material-icons text-lg group-hover:rotate-90 transition-transform">power_settings_new</span>
                        Disconnect
                    </button>
                </div>
            </div>
        </div>

        <!-- Navigation Tabs (Floating Pill) -->
        <div class="flex justify-center mb-12">
            <div class="bg-dark-900/80 backdrop-blur-xl border border-dark-800 p-1.5 rounded-2xl flex items-center gap-1 shadow-xl">
                <button *ngFor="let tab of tabs"
                        (click)="activeTab.set(tab.id)"
                        [class]="activeTab() === tab.id 
                            ? 'bg-primary-500 text-dark-950 shadow-[0_0_20px_rgba(var(--color-primary-500),0.4)]' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'"
                        class="px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2 relative overflow-hidden group">
                    <span class="material-icons text-lg relative z-10">{{ tab.icon }}</span>
                    <span class="relative z-10">{{ tab.label }}</span>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <!-- Sidebar Stats (Holographic Tiles) -->
            <div class="lg:col-span-4 space-y-6">
                <!-- Activity Hub -->
                <div class="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-primary-500/30 transition-colors">
                    <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                    <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span> Activity Hub
                    </h3>
                    <div class="space-y-4">
                        <div class="p-4 rounded-2xl bg-dark-950 border border-dark-800 hover:border-primary-500/30 transition-all group/stat relative overflow-hidden">
                             <div class="absolute inset-0 bg-primary-500/5 translate-y-full group-hover/stat:translate-y-0 transition-transform duration-500"></div>
                            <div class="flex items-center gap-4 relative z-10">
                                <div class="h-12 w-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 group-hover/stat:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(var(--color-primary-500),0.15)]">
                                    <span class="material-icons">shopping_bag</span>
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Total Orders</p>
                                    <p class="text-2xl font-black text-white tracking-tight">{{ orders().length }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="p-4 rounded-2xl bg-dark-950 border border-dark-800 hover:border-primary-500/30 transition-all group/stat relative overflow-hidden">
                             <div class="absolute inset-0 bg-gray-500/5 translate-y-full group-hover/stat:translate-y-0 transition-transform duration-500"></div>
                            <div class="flex items-center gap-4 relative z-10">
                                <div class="h-12 w-12 rounded-xl bg-gray-500/10 flex items-center justify-center text-gray-400 group-hover/stat:scale-110 transition-transform duration-300 shadow-inner">
                                    <span class="material-icons">payments</span>
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Lifetime Value</p>
                                    <p class="text-2xl font-black text-white tracking-tight">{{ totalSpent() | currency:'INR' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Support Card (Deep Gradient) -->
                <div class="relative rounded-3xl p-8 overflow-hidden group border border-primary-500/20 bg-dark-900/80 backdrop-blur-xl">
                    <div class="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-dark-900 opacity-90"></div>
                    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    
                    <span class="material-icons absolute -bottom-10 -right-10 text-[10rem] text-white/5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">support_agent</span>
                    
                    <div class="relative z-10">
                        <div class="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-6 border border-white/20">
                             <span class="material-icons">headset_mic</span>
                        </div>
                        <h4 class="text-2xl font-bold text-white mb-2">Priority Support</h4>
                        <p class="text-gray-400 text-sm mb-8 font-medium leading-relaxed">Access our dedicated concierge team for assistance with your orders.</p>
                        <button class="w-full py-4 bg-primary-500 text-white rounded-xl font-bold tracking-wider text-sm hover:bg-primary-600 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                            Contact Agent
                        </button>
                    </div>
                </div>
            </div>

            <!-- Content Area -->
            <div class="lg:col-span-8">
                
                <!-- Dashboard Tab -->
                <div *ngIf="activeTab() === 'dashboard'" class="space-y-8 animate-fade-in">
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <span class="material-icons text-primary-500">history</span> Recent Acquisitions
                        </h2>
                        <button (click)="activeTab.set('orders')" class="text-gray-400 text-sm font-bold hover:text-white hover:underline underline-offset-4 tracking-wide transition-colors flex items-center gap-1">
                            View Archive <span class="material-icons text-base">arrow_forward</span>
                        </button>
                    </div>

                    <div *ngIf="!loading() && orders().length === 0" class="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                        <div class="relative mb-6">
                            <div class="absolute inset-0 bg-primary-500/20 rounded-full blur-xl animate-pulse"></div>
                            <div class="relative h-24 w-24 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
                                <span class="material-icons text-5xl text-gray-600">visibility_off</span>
                            </div>
                        </div>
                        <h3 class="text-2xl font-bold text-white mb-2">No active history</h3>
                        <p class="text-gray-500 max-w-xs mb-8 font-medium">Ready to start your collection? Explore our premium selection.</p>
                        <a routerLink="/products" class="px-8 py-3.5 bg-primary-500 text-dark-950 rounded-xl font-bold hover:bg-primary-400 transition-all shadow-[0_0_20px_rgba(var(--color-primary-500),0.3)] hover:scale-105">Start Exploring</a>
                    </div>

                    <div *ngIf="!loading() && orders().length > 0" class="space-y-4">
                        <div *ngFor="let order of recentOrders()" 
                             [routerLink]="['/profile', order._id]"
                             class="group bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-2xl p-6 hover:bg-dark-800 hover:border-primary-500/30 transition-all cursor-pointer relative overflow-hidden">
                             
                             <!-- Side Glow Stick -->
                             <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div class="flex items-center justify-between relative z-10">
                                <div class="flex items-center gap-6">
                                    <div class="h-16 w-16 rounded-xl bg-black/40 flex items-center justify-center border border-white/10 group-hover:border-primary-500/50 transition-colors shadow-lg">
                                        <span class="material-icons text-2xl text-gray-500 group-hover:text-primary-500 transition-colors">inventory_2</span>
                                    </div>
                                    <div>
                                        <h4 class="text-lg font-bold text-white group-hover:text-primary-400 transition-colors mb-1">Order #{{ (order._id | slice:0:8) || 'UNKNOWN' }}</h4>
                                        <div class="flex items-center gap-3">
                                            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ (order.createdAt | date:'mediumDate') }}</span>
                                            <span class="w-1 h-1 rounded-full bg-gray-600"></span>
                                            <span [class]="order.isPaid ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'text-yellow-400'" class="text-xs font-bold uppercase tracking-wider">
                                                {{ order.isPaid ? 'Completed' : 'Processing' }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-right flex flex-col items-end gap-3">
                                    <p class="text-2xl font-black text-white tracking-tight">{{ (order.totalPrice | currency:'INR') || '0' }}</p>
                                    <button (click)="$event.stopPropagation(); downloadInvoice(order._id!)" 
                                            class="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 group/btn">
                                        <span class="material-icons text-sm group-hover/btn:translate-y-0.5 transition-transform">download</span>
                                        Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Orders Tab -->
                <div *ngIf="activeTab() === 'orders'" class="animate-fade-in space-y-8">
                    <div class="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
                        <div class="relative flex-1">
                            <span class="material-icons absolute left-4 top-3.5 text-gray-500">search</span>
                            <input type="text" [(ngModel)]="searchQuery" 
                                   placeholder="Search by Order ID..." 
                                   class="w-full bg-black/20 border border-transparent rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:bg-black/40 focus:border-white/10 text-sm font-bold transition-all outline-none">
                        </div>
                        <div class="relative min-w-[200px]">
                            <select [(ngModel)]="statusFilter" 
                                    class="w-full appearance-none bg-dark-950/50 border border-transparent rounded-xl py-3 pl-4 pr-10 text-white text-sm font-bold focus:bg-dark-800 focus:border-dark-700 transition-all cursor-pointer outline-none">
                                <option value="all">All Statuses</option>
                                <option value="paid">Completed</option>
                                <option value="unpaid">Pending</option>
                            </select>
                            <span class="material-icons absolute right-4 top-3.5 text-gray-500 pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    <div *ngIf="filteredOrders().length === 0" class="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                        <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                             <span class="material-icons text-4xl text-gray-600">folder_off</span>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-1">No orders found</h3>
                        <p class="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                    </div>

                    <div class="space-y-4">
                        <div *ngFor="let order of filteredOrders()" 
                             [routerLink]="['/profile', order._id]"
                             class="group bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-2xl p-6 hover:bg-dark-800 border-transparent hover:border-primary-500/30 transition-all cursor-pointer relative overflow-hidden">
                             
                             <!-- Side Glow Stick -->
                             <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div class="flex flex-col gap-6 relative z-10">
                                <div class="flex justify-between items-start">
                                    <div class="flex items-center gap-4">
                                        <div class="h-12 w-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/10 text-gray-400 font-bold text-xs uppercase shadow-inner">
                                            #{{ (order._id | slice:-4) || '??' }}
                                        </div>
                                        <div>
                                            <span [class]="order.isPaid ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md">
                                                {{ order.isPaid ? 'Verified Purchase' : 'Payment Pending' }}
                                            </span>
                                            <p class="text-xs font-bold text-gray-500 mt-2 uppercase tracking-wide">{{ (order.createdAt | date:'medium') }}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-2xl font-black text-white tracking-tight">{{ (order.totalPrice | currency:'INR') || '---' }}</p>
                                        <p class="text-[10px] font-bold text-gray-500 uppercase mt-1">{{ (order.items || order.orderItems)?.length || 0 }} Items</p>
                                    </div>
                                </div>
                                
                                <div class="h-px bg-white/5 w-full"></div>

                                <div class="flex items-center justify-between">
                                    <!-- Item Previews -->
                                    <div class="flex -space-x-3">
                                        <ng-container *ngIf="(order.items || order.orderItems) && (order.items || order.orderItems)!.length > 0; else noItems">
                                            <div *ngFor="let item of (order.items || order.orderItems)! | slice:0:4" 
                                                 class="relative h-10 w-10 rounded-lg overflow-hidden border-2 border-dark-950 bg-dark-800 transition-transform hover:-translate-y-2 hover:scale-110 hover:z-30 duration-300 shadow-lg">
                                                <img [ngSrc]="item.image || 'assets/images/placeholder.png'" [alt]="item.name || 'Product'" fill class="object-cover opacity-80 group-hover/item:opacity-100 transition-opacity">
                                            </div>
                                            <div *ngIf="(order.items || order.orderItems)!.length > 4" 
                                                 class="h-10 w-10 rounded-lg border-2 border-dark-950 bg-dark-800 flex items-center justify-center text-[10px] font-bold text-white">
                                                +{{ (order.items || order.orderItems)!.length - 4 }}
                                            </div>
                                        </ng-container>
                                        <ng-template #noItems>
                                            <span class="text-xs text-gray-600 font-medium italic">No preview available</span>
                                        </ng-template>
                                    </div>

                                    <button (click)="$event.stopPropagation(); downloadInvoice(order._id!)" 
                                            class="flex items-center gap-2 px-5 py-2.5 bg-primary-500/10 hover:bg-primary-500 text-primary-400 hover:text-dark-950 rounded-xl text-xs font-bold transition-all border border-primary-500/20 hover:border-primary-500 hover:shadow-[0_0_15px_rgba(var(--color-primary-500),0.3)]">
                                        <span class="material-icons text-sm">download</span>
                                        Download Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Addresses Tab -->
                <div *ngIf="activeTab() === 'addresses'" class="animate-fade-in space-y-8">
                     <!-- Add New Address Card -->
                    <div class="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
                        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                        <h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                             <span class="material-icons text-primary-500">add_location_alt</span>
                             Add New Address
                        </h3>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div class="md:col-span-2">
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Street Address</label>
                                <input type="text" [(ngModel)]="newAddress.street" class="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 px-4 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-600">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">City</label>
                                <input type="text" [(ngModel)]="newAddress.city" class="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 px-4 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-600">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">State / Province</label>
                                <input type="text" [(ngModel)]="newAddress.state" class="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 px-4 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-600">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Postal Code</label>
                                <input type="text" [(ngModel)]="newAddress.postalCode" class="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 px-4 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-600">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Country</label>
                                <input type="text" [(ngModel)]="newAddress.country" class="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 px-4 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-600">
                            </div>
                             <div class="md:col-span-2 flex items-center gap-3">
                                <input type="checkbox" id="isDefault" [(ngModel)]="newAddress.isDefault" class="w-5 h-5 rounded bg-dark-900 border-white/10 text-primary-500 focus:ring-primary-500">
                                <label for="isDefault" class="text-sm font-medium text-gray-300">Set as default shipping address</label>
                            </div>
                        </div>
                        <div class="mt-8 flex justify-end relative z-10">
                            <button (click)="saveAddress()" class="px-8 py-3 bg-primary-500 text-dark-950 font-bold rounded-xl hover:bg-primary-400 transition-all shadow-[0_0_20px_rgba(var(--color-primary-500),0.3)] hover:scale-105 active:scale-95">
                                Save Address
                            </button>
                        </div>
                    </div>

                    <!-- Saved Addresses List -->
                    <div class="space-y-4">
                        <h3 class="text-xl font-bold text-white mb-4 pl-2 border-l-4 border-primary-500">Saved Locations</h3>
                        
                        <div *ngIf="!currentUser()?.addresses?.length" class="text-center py-12 bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-2xl">
                             <span class="material-icons text-4xl text-gray-700 mb-2">location_off</span>
                             <p class="text-gray-500 font-medium">No addresses saved yet.</p>
                        </div>

                        <div *ngFor="let addr of currentUser()?.addresses" class="bg-dark-950 border border-dark-800 rounded-2xl p-6 hover:border-primary-500/30 transition-all group relative overflow-hidden">
                             <div class="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button (click)="deleteAddress(addr._id || '')" class="text-gray-500 hover:text-red-500 transition-colors">
                                    <span class="material-icons">delete</span>
                                </button>
                             </div>
                             
                             <div class="flex items-start gap-4">
                                <div class="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-primary-500 border border-white/5">
                                    <span class="material-icons text-lg">home</span>
                                </div>
                                <div>
                                    <div class="flex items-center gap-3 mb-1">
                                        <p class="text-white font-bold">{{ addr.street }}</p>
                                        <span *ngIf="addr.isDefault" class="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-[10px] font-bold uppercase tracking-widest rounded border border-primary-500/30">Default</span>
                                    </div>
                                    <p class="text-gray-400 text-sm">{{ addr.city }}, {{ addr.state }} {{ addr.postalCode }}</p>
                                    <p class="text-gray-500 text-xs font-bold uppercase tracking-wide mt-1">{{ addr.country }}</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                <!-- Settings Tab -->
                <div *ngIf="activeTab() === 'settings'" class="animate-fade-in">
                    <div class="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                        
                        <div class="relative z-10">
                            <div class="flex items-center gap-4 mb-10">
                                <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-amber-500/20 flex items-center justify-center text-primary-300 border border-white/5 shadow-inner">
                                    <span class="material-icons text-2xl">security</span>
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold text-white">Security Protocol</h3>
                                    <p class="text-sm text-gray-400 font-medium mt-1">Configure your account protection level and preferences.</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div>
                                    <label class="block text-[10px] font-bold text-primary-400/80 uppercase tracking-widest mb-3">Identity Name</label>
                                    <div class="w-full bg-dark-950 border border-dark-800 rounded-xl py-4 px-5 text-gray-300 text-sm font-bold flex items-center gap-3">
                                        <span class="material-icons text-gray-600 text-sm">badge</span>
                                        {{ currentUser()?.name }}
                                        <span class="ml-auto material-icons text-gray-700 text-xs">lock</span>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-primary-400/80 uppercase tracking-widest mb-3">Target Coordinate (Email)</label>
                                    <div class="w-full bg-dark-950 border border-dark-800 rounded-xl py-4 px-5 text-gray-300 text-sm font-bold flex items-center gap-3">
                                        <span class="material-icons text-gray-600 text-sm">email</span>
                                        {{ currentUser()?.email }}
                                        <span class="ml-auto material-icons text-gray-700 text-xs">lock</span>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4 mb-10">
                                 <label *ngFor="let opt of settingsOptions" class="flex items-center gap-4 p-5 rounded-xl border border-white/5 bg-dark-900 hover:bg-black transition-all cursor-pointer group">
                                    <div class="relative flex items-center">
                                        <input type="checkbox" [checked]="opt.checked" class="peer h-0 w-0 opacity-0 absolute">
                                        <div class="h-7 w-12 bg-dark-800 rounded-full peer-checked:bg-primary-500 transition-colors duration-300 shadow-inner border border-white/5"></div>
                                        <div class="absolute h-5 w-5 bg-white rounded-full left-1 peer-checked:translate-x-5 transition-transform duration-300 shadow-md"></div>
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-white group-hover:text-primary-300 transition-colors">{{ opt.label }}</p>
                                        <p class="text-xs text-gray-500 font-medium mt-0.5">{{ opt.desc }}</p>
                                    </div>
                                </label>
                            </div>
                            
                            <div class="pt-8 border-t border-dark-800 flex justify-end">
                                 <button (click)="saveSettings()" class="px-12 py-4 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-xl text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 transform border border-primary-500/20">
                                    Update Configuration
                                 </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
    `,
    styles: [`
        .text-sans { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Poppins', sans-serif; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `]
})
export class ProfileComponent implements OnInit, OnDestroy {
    private authService = inject(AuthService);
    private orderService = inject(OrderService);
    private router = inject(Router);
    private destroy$ = new Subject<void>();

    currentUser = this.authService.currentUser;
    orders = signal<Order[]>([]);
    loading = signal(true);

    activeTab = signal<'dashboard' | 'orders' | 'addresses' | 'settings'>('dashboard');
    searchQuery = '';
    statusFilter = 'all';

    tabs = [
        { id: 'dashboard', label: 'Overview', icon: 'dashboard' },
        { id: 'orders', label: 'History', icon: 'local_mall' },
        { id: 'addresses', label: 'Addresses', icon: 'location_on' },
        { id: 'settings', label: 'Security', icon: 'tune' }
    ] as const;

    settingsOptions = [
        { label: 'Cloud Notifications', desc: 'Sync alerts across all authorized devices.', checked: true },
        { label: 'Security Safeguard', desc: 'Auto-lock session after 30 minutes of inactivity.', checked: true },
        { label: 'Insight Analytics', desc: 'Allow data processing for personalized experience.', checked: false }
    ];

    newAddress = {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false
    };

    saveAddress() {
        if (!this.newAddress.street || !this.newAddress.city || !this.newAddress.postalCode || !this.newAddress.country) {
            alert('Please fill in all required fields');
            return;
        }

        this.authService.addAddress(this.newAddress)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    alert('Address added successfully');
                    this.newAddress = { street: '', city: '', state: '', postalCode: '', country: '', isDefault: false };
                    // authService updates current user signal automatically
                },
                error: (err) => {
                    console.error('Error adding address', err);
                    alert('Failed to add address');
                }
            });
    }

    deleteAddress(addressId: string) {
        if (confirm('Are you sure you want to delete this address?')) {
            this.authService.deleteAddress(addressId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => alert('Address deleted'),
                    error: (err) => {
                        console.error('Error deleting address', err);
                        alert('Failed to delete address');
                    }
                });
        }
    }

    ngOnInit() {
        this.fetchOrders();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    fetchOrders() {
        this.orderService.getMyOrders()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.orders.set(res.data);
                    this.loading.set(false);
                },
                error: (err) => {
                    console.error('Error fetching orders', err);
                    this.loading.set(false);
                }
            });
    }

    totalSpent = computed(() => {
        return this.orders().reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    });

    recentOrders = computed(() => {
        return this.orders().slice(0, 3);
    });

    filteredOrders = computed(() => {
        let result = this.orders();

        if (this.statusFilter === 'paid') {
            result = result.filter(o => o.isPaid);
        } else if (this.statusFilter === 'unpaid') {
            result = result.filter(o => !o.isPaid);
        }

        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(o => o._id?.toLowerCase().includes(query));
        }

        // Filter out ghost orders - ensure ID exists (relaxed filter)
        const validOrders = result.filter(o => !!o._id);

        return validOrders;
    });

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }

    saveSettings() {
        alert('Security framework updated successfully!');
    }

    downloadInvoice(orderId: string) {
        if (!orderId) return;

        // Show immediate feedback
        const originalText = document.activeElement?.textContent;
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.textContent = 'Downloading...';
            document.activeElement.classList.add('opacity-75', 'cursor-wait');
        }

        this.orderService.downloadInvoice(orderId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Invoice-${orderId}.pdf`;
                    link.click();
                    window.URL.revokeObjectURL(url);

                    // Restore button state
                    if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.textContent = originalText || 'Download Invoice';
                        document.activeElement.classList.remove('opacity-75', 'cursor-wait');
                    }
                },
                error: (err) => {
                    console.error('Download failed', err);
                    alert('Failed to download invoice. Please try again.');

                    // Restore button state
                    if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.textContent = originalText || 'Download Invoice';
                        document.activeElement.classList.remove('opacity-75', 'cursor-wait');
                    }
                }
            });
    }
}
