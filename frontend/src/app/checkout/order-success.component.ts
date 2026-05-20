import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService, Order } from '../core/services/order.service';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-dark-950 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto space-y-8" *ngIf="order(); else loadingTpl">
        
        <!-- Success Header -->
        <div class="bg-dark-900 rounded-xl p-8 border border-green-500/20 text-center relative overflow-hidden">
          <div class="absolute inset-0 bg-green-500/5"></div>
          <div class="relative z-10">
            <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <span class="material-icons text-4xl text-green-500">check_circle</span>
            </div>
            <h1 class="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
            <p class="text-gray-400">Order #{{ order()?._id }}</p>
            <p class="text-primary-400 font-medium mt-2">Estimated Delivery: {{ estimatedDelivery | date:'fullDate' }}</p>
            
            <!-- Guest Upsell -->
            <div *ngIf="isGuestOrder()" class="max-w-md mx-auto mt-6 bg-primary-900/20 border border-primary-500/20 rounded-xl p-4 animate-fade-in-up">
              <h4 class="text-primary-400 font-bold mb-2 flex items-center justify-center">
                 <span class="material-icons mr-2 text-sm">person_add</span>
                 Track Your Order Faster
              </h4>
              <p class="text-xs text-gray-300 mb-3">Create an account with {{ order()?.guestEmail }} to easily track this order and speed up your next checkout.</p>
              <a [routerLink]="['/auth/register']" [queryParams]="{ email: order()?.guestEmail }" class="inline-block bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold py-2 px-6 rounded-full transition-colors">
                 Create Account
              </a>
            </div>
          </div>
        </div>

        <!-- Order Timeline -->
        <div class="bg-dark-900 rounded-xl p-8 border border-dark-800">
           <h2 class="text-lg font-medium text-white mb-8">Order Status</h2>
           <div class="relative">
              <div class="absolute left-0 top-1/2 w-full h-1 bg-dark-800 -translate-y-1/2"></div>
              <div class="relative flex justify-between">
                 <!-- Step 1 -->
                 <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full bg-primary-500 border-4 border-dark-900 flex items-center justify-center z-10">
                       <span class="material-icons text-white text-xs">done</span>
                    </div>
                    <p class="text-xs text-white mt-2 font-medium">Placed</p>
                 </div>
                 <!-- Step 2 -->
                 <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full bg-primary-500 border-4 border-dark-900 flex items-center justify-center z-10 animate-pulse">
                       <span class="material-icons text-white text-xs">sync</span>
                    </div>
                    <p class="text-xs text-primary-400 mt-2 font-medium">Processing</p>
                 </div>
                 <!-- Step 3 -->
                  <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full bg-dark-700 border-4 border-dark-900 flex items-center justify-center z-10">
                    </div>
                    <p class="text-xs text-gray-500 mt-2">Shipped</p>
                 </div>
                 <!-- Step 4 -->
                  <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full bg-dark-700 border-4 border-dark-900 flex items-center justify-center z-10">
                    </div>
                     <p class="text-xs text-gray-500 mt-2">Delivered</p>
                 </div>
              </div>
           </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Order Details -->
            <div class="bg-dark-900 rounded-xl p-8 border border-dark-800">
                <h3 class="text-lg font-medium text-white mb-6">Order Details</h3>
                <ul class="space-y-4">
                    <li *ngFor="let item of (order()?.items || order()?.orderItems || [])" class="flex items-center space-x-4">
                         <div class="w-12 h-12 rounded-lg bg-dark-800 overflow-hidden flex-shrink-0">
                             <img [src]="item.image || 'assets/images/placeholder.svg'" [alt]="item.name" class="w-full h-full object-cover">
                         </div>
                         <div class="flex-1">
                             <p class="text-white font-medium text-sm line-clamp-1">{{ item.name }}</p>
                             <p class="text-gray-500 text-xs">Qty: {{ item.quantity }}</p>
                         </div>
                         <p class="text-white font-bold text-sm">{{ item.price * item.quantity | currency:'INR' }}</p>
                    </li>
                </ul>
                <div class="border-t border-dark-800 mt-6 pt-6 flex justify-between items-center">
                    <span class="text-gray-400">Total Amount</span>
                    <span class="text-xl font-bold text-primary-400">{{ order()?.totalPrice | currency:'INR' }}</span>
                </div>
            </div>

            <!-- Shipping Info -->
            <div class="bg-dark-900 rounded-xl p-8 border border-dark-800 h-full">
                 <h3 class="text-lg font-medium text-white mb-6">Shipping to</h3>
                 <div class="space-y-4 text-gray-400">
                     <p class="text-white font-medium">{{ order()?.user?.name }}</p>
                     <p>{{ order()?.shippingAddress?.address }}</p>
                     <p>{{ order()?.shippingAddress?.city }}, {{ order()?.shippingAddress?.postalCode }}</p>
                     <p>{{ order()?.shippingAddress?.country }}</p>
                     <p class="mt-6 pt-6 border-t border-dark-800 text-sm">
                        <span class="block text-gray-500 mb-1">Payment Method</span>
                        <span class="text-white flex items-center">
                            <span class="material-icons text-sm mr-2">credit_card</span>
                            {{ order()?.paymentMethod }}
                        </span>
                     </p>
                 </div>
                 
                 <div class="mt-8 pt-6 border-t border-dark-800 space-y-4">
                    <button (click)="downloadInvoice()" class="block w-full text-center bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-primary-900/20">
                        <span class="flex items-center justify-center">
                            <span class="material-icons mr-2">download</span>
                            Download Invoice
                        </span>
                    </button>

                    <a routerLink="/products" class="block w-full text-center bg-dark-800 hover:bg-dark-700 text-white font-medium py-3 rounded-xl transition-colors">
                        Continue Shopping
                    </a>
                 </div>
            </div>
        </div>

      </div>

      <ng-template #loadingTpl>
        <div class="flex items-center justify-center h-[60vh]">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </ng-template>
    </div>
  `
})
export class OrderSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order = signal<Order | null>(null);
  estimatedDelivery = new Date();

  isGuestOrder() {
    const o = this.order();
    return o && !o.user && o.guestEmail;
  }

  ngOnInit() {
    this.estimatedDelivery.setDate(new Date().getDate() + 5);

    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (orderId) {
      this.orderService.getOrderById(orderId).subscribe({
        next: (res) => {
          this.order.set(res.data);
          if (res.data.createdAt) {
            const date = new Date(res.data.createdAt);
            date.setDate(date.getDate() + 5);
            this.estimatedDelivery = date;
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  downloadInvoice() {
    const orderData = this.order();
    if (orderData && orderData._id) {
      this.orderService.downloadInvoice(orderData._id).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `invoice-${orderData._id}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Download failed', err);
          alert('Invoice Download Failed. Please try again later.');
        }
      });
    }
  }
}
