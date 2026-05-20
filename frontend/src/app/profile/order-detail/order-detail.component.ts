import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService, Order } from '../../core/services/order.service';

@Component({
    selector: 'app-user-order-detail',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink, NgOptimizedImage],
    template: `
    <div class="min-h-screen bg-dark-950 text-sans relative overflow-x-hidden">
      
      <!-- Global Moving Background -->
      <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-900/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4"></div>
          <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
      </div>

      <div class="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">
          
          <!-- Back Button -->
          <a routerLink="/profile" class="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-all group px-4 py-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5">
            <span class="material-icons group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span class="font-bold tracking-wide text-sm">Return to Command Center</span>
          </a>
  
          <!-- Loading State -->
          <div *ngIf="loading()" class="animate-pulse space-y-8">
              <div class="h-12 bg-white/5 rounded-xl w-1/3"></div>
              <div class="h-64 bg-white/5 rounded-3xl border border-white/5"></div>
          </div>
  
          <!-- Error State -->
          <div *ngIf="error()" class="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-8 text-center text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <span class="material-icons text-5xl mb-4 text-red-500">error_outline</span>
              <h3 class="text-xl font-bold text-white mb-2">Access Error</h3>
              <p class="mb-6">{{ error() }}</p>
              <a routerLink="/profile" class="inline-block px-8 py-3 bg-red-500 hover:bg-red-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-red-500/30">Return to Safety</a>
          </div>
  
          <!-- Content -->
          <div *ngIf="!loading() && order()" class="space-y-8 animate-fade-in">
            
            <!-- Header Glass Card -->
            <div class="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden group">
               <div class="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
               
              <div class="relative z-10">
                <div class="flex items-center gap-4 mb-2">
                  <span class="material-icons text-primary-500 text-3xl">receipt_long</span>
                  <h1 class="text-3xl lg:text-4xl font-black text-white tracking-tight">
                    Order <span class="text-primary-400">#{{ (order()!._id | slice:-6 | uppercase) }}</span>
                  </h1>
                </div>
                <div class="flex items-center gap-2 text-gray-400 font-medium ml-1">
                   <span class="material-icons text-sm">schedule</span>
                   Placed on {{ order()!.createdAt | date:'longDate' }} at {{ order()!.createdAt | date:'shortTime' }}
                </div>
              </div>
              
              <button (click)="downloadInvoice()" class="relative z-10 group flex items-center justify-center gap-3 px-8 py-4 bg-primary-500 hover:bg-primary-400 text-dark-950 font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(var(--color-primary-500),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary-500),0.5)] hover:-translate-y-1 active:scale-95">
                  <span class="material-icons text-lg group-hover:translate-y-0.5 transition-transform">download</span>
                  Download Invoice
              </button>
            </div>
  
            <!-- Holographic Tracking Card -->
            <div *ngIf="order()?.status === 'Shipped' || order()?.status === 'Delivered'" class="rounded-3xl p-1 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 bg-[length:200%_100%] animate-gradient-x shadow-[0_0_30px_rgba(var(--color-primary-500),0.2)]">
                <div class="bg-dark-950/90 backdrop-blur-xl rounded-[22px] p-8 relative overflow-hidden">
                    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                    <div class="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-primary-900/20 to-transparent"></div>
                    
                    <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="flex items-center gap-4">
                            <div class="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <span class="material-icons text-2xl text-primary-400">local_shipping</span>
                            </div>
                            <div>
                                <h3 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Logistics Partner</h3>
                                <p class="text-xl font-bold text-white">{{ order()?.carrier || 'Standard Shipping' }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                             <div class="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <span class="material-icons text-2xl text-purple-400">qr_code_2</span>
                            </div>
                            <div>
                                <h3 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tracking ID</h3>
                                <p class="text-xl font-mono font-bold text-white tracking-wider">{{ order()?.trackingNumber || 'Processing' }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                             <div class="h-14 w-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                <span class="material-icons text-2xl text-green-400">event_available</span>
                            </div>
                            <div>
                              <h3 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Estimated Arrival</h3>
                              <p class="text-xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.4)]">
                                  {{ (order()?.estimatedDelivery | date:'mediumDate') || 'Arriving soon' }}
                              </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
  
            <!-- Neon Timeline (Status Stepper) -->
            <div class="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-3xl p-10 overflow-hidden relative">
                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-50"></div>
                
                <div class="relative z-10">
                    <!-- Progress Bar Background -->
                    <div class="absolute top-5 left-0 w-full h-1.5 bg-white/10 rounded-full"></div>
                    
                    <!-- Active Progress Bar (Glow) -->
                    <div class="absolute top-5 left-0 h-1.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--color-primary-500),0.6)]"
                         [style.width]="getProgressWidth()"></div>
  
                    <!-- Steps -->
                    <div class="relative flex justify-between">
                        <div class="flex flex-col items-center gap-4 group cursor-default relative z-10" *ngFor="let step of steps; let i = index">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 bg-dark-950 z-10"
                                 [class]="getCurrentStepIndex() >= i 
                                    ? 'border-primary-500 text-primary-400 shadow-[0_0_20px_rgba(var(--color-primary-500),0.4)] scale-110' 
                                    : 'border-dark-800 text-gray-700'">
                                <span class="material-icons text-lg">{{ step.icon }}</span>
                            </div>
                            <p class="text-[10px] font-black uppercase tracking-widest transition-colors duration-500 absolute -bottom-8 w-32 text-center"
                               [class]="getCurrentStepIndex() >= i ? 'text-white' : 'text-gray-600'">
                                {{ step.label }}
                            </p>
                        </div>
                    </div>
                </div>
                <!-- Spacing for labels -->
                <div class="h-8"></div>
            </div>
  
            <!-- Main Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <!-- Left Column: Items -->
              <div class="lg:col-span-2 space-y-6">
                <!-- Items Glass Panel -->
                <div class="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-3xl overflow-hidden shadow-xl">
                  <div class="p-8 border-b border-dark-800 bg-dark-950/50">
                      <h2 class="text-xl font-bold text-white flex items-center gap-3">
                          <span class="material-icons text-primary-500">shopping_bag</span>
                          Inventory Manifest <span class="text-gray-500 text-sm font-normal ml-1">({{ (order()?.items || order()?.orderItems)?.length || 0 }} Items)</span>
                      </h2>
                  </div>
                  <div class="divide-y divide-dark-800">
                      <div *ngFor="let item of (order()?.items || order()?.orderItems || [])" class="p-6 flex gap-6 hover:bg-dark-800/50 transition-colors group">
                          <div class="relative h-20 w-20 rounded-lg overflow-hidden bg-dark-950 border border-dark-800 flex-shrink-0">
                            <img [ngSrc]="item.image || 'assets/images/placeholder.png'" [alt]="item.name" fill class="object-cover">
                          </div>
                          <div class="flex-grow flex flex-col justify-center">
                              <h3 class="text-white font-bold text-lg mb-1 group-hover:text-primary-400 transition-colors tracking-tight">
                                  <a [routerLink]="['/products', item.product]">{{ item.name }}</a>
                              </h3>
                              <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Qty: {{ item.quantity }}</p>
                          </div>
                          <div class="text-right flex flex-col justify-center">
                              <p class="text-white font-black text-xl tracking-tight">{{ item.price | currency:'INR' }}</p>
                          </div>
                      </div>
                  </div>
                </div>
  
                <!-- Details Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Address Panel -->
                    <div class="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-3xl p-8 hover:bg-dark-800/50 transition-colors">
                        <h3 class="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span class="material-icons text-sm">place</span> Shipping Destination
                        </h3>
                        <div class="text-gray-300 space-y-2 text-sm">
                            <p class="text-white font-bold text-lg mb-2">{{ order()?.user?.name || 'Valued Customer' }}</p>
                            <p class="font-medium opacity-80">{{ order()?.shippingAddress?.address || 'Address Not Available' }}</p>
                            <p class="font-medium opacity-80">{{ order()?.shippingAddress?.city }}, {{ order()?.shippingAddress?.postalCode }}</p>
                            <p class="font-medium opacity-80">{{ order()?.shippingAddress?.country }}</p>
                        </div>
                    </div>
                    
                    <!-- Payment Panel -->
                    <div class="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-3xl p-8 hover:bg-dark-800/50 transition-colors">
                        <h3 class="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span class="material-icons text-sm">credit_card</span> Transaction Method
                        </h3>
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-20 bg-dark-950 rounded-lg border border-dark-800 flex items-center justify-center shadow-inner">
                                <span class="material-icons text-white opacity-50 text-2xl">payment</span>
                            </div>
                            <div>
                                <p class="text-white font-bold capitalize mb-1">{{ order()?.paymentMethod || 'Not specified' }}</p>
                                <span [class]="order()?.isPaid ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'" class="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border">
                                    {{ order()?.isPaid ? 'Verified' : 'Pending' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
  
              <!-- Right Column: Summary -->
              <div class="lg:col-span-1">
                  <div class="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-3xl p-8 sticky top-24 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
                      <h2 class="text-xl font-bold text-white mb-8">Fiscal Summary</h2>
                      
                      <div class="space-y-4 text-sm mb-8 border-b border-dark-800 pb-8">
                          <div class="flex justify-between text-gray-400 font-medium">
                              <span>Subtotal</span>
                              <span class="text-white font-bold">{{ order()?.itemsPrice | currency:'INR' }}</span>
                          </div>
                          <div class="flex justify-between text-gray-400 font-medium">
                              <span>Shipping</span>
                              <span class="text-white font-bold">{{ order()?.shippingPrice | currency:'INR' }}</span>
                          </div>
                          <div class="flex justify-between text-gray-400 font-medium">
                              <span>Tax</span>
                              <span class="text-white font-bold">{{ order()?.taxPrice | currency:'INR' }}</span>
                          </div>
                      </div>
                      
                      <div class="flex justify-between items-end mb-2">
                          <span class="text-sm font-black text-gray-400 uppercase tracking-widest">Total</span>
                          <span class="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{{ order()?.totalPrice | currency:'INR' }}</span>
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
export class UserOrderDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private orderService = inject(OrderService);

    order = signal<Order | null>(null);
    loading = signal(true);
    error = signal<string | null>(null);

    steps = [
        { label: 'Placed', icon: 'shopping_cart' },
        { label: 'Paid', icon: 'credit_card' },
        { label: 'Shipped', icon: 'local_shipping' },
        { label: 'Delivered', icon: 'check_circle' }
    ];

    getCurrentStepIndex(): number {
        const order = this.order();
        if (!order) return 0;

        const status = order.status || 'Processing';
        const isPaid = order.isPaid;

        if (status === 'Delivered') return 3;
        if (status === 'Shipped') return 2;
        if (isPaid) return 1;
        return 0;
    }

    getProgressWidth(): string {
        const step = this.getCurrentStepIndex();
        return `${(step / 3) * 100}%`;
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.fetchOrder(id);
            } else {
                this.error.set('Order ID not found');
                this.loading.set(false);
            }
        });
    }

    fetchOrder(id: string) {
        this.loading.set(true);
        // Note: Assuming getOrderById works for user's own orders. 
        // If backend restricts this to admin only, we might need a specific 'getMyOrderById' endpoint,
        // but usually 'getOrderById' checks ownership.
        this.orderService.getOrderById(id).subscribe({
            next: (res) => {
                this.order.set(res.data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error fetching order', err);
                this.error.set(err.error?.message || 'Failed to load order details. You may rarely access another user\'s order.');
                this.loading.set(false);
            }
        });
    }

    downloadInvoice() {
        const id = this.order()?._id;
        if (id) {
            this.orderService.downloadInvoice(id).subscribe({
                next: (blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Invoice-${id}.pdf`;
                    link.click();
                    window.URL.revokeObjectURL(url);
                },
                error: (err) => alert('Failed to download invoice')
            });
        }
    }
}
