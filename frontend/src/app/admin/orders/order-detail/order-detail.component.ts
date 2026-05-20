import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-order-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <div class="space-y-6 animate-fade-in" *ngIf="order()">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div class="flex items-center gap-3">
             <a routerLink="/admin/orders" class="text-gray-500 hover:text-white transition-colors">
                <span class="material-icons">arrow_back</span>
             </a>
             <h1 class="text-2xl font-bold text-white">Order #{{ order()?._id | slice:-6 }}</h1>
          </div>
          <p class="text-gray-400 mt-1 ml-9">Placed on {{ order()?.createdAt | date:'medium' }}</p>
        </div>
        
        <div class="flex items-center gap-3 bg-dark-900 p-2 rounded-xl border border-dark-800">
            <span class="text-sm text-gray-400 pl-2">Status:</span>
            <select 
                [ngModel]="order()?.status" 
                (ngModelChange)="updateStatus($event)"
                class="bg-dark-950 border-none text-white text-sm rounded-lg focus:ring-primary-500 py-1.5 pl-3 pr-8">
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
            </select>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Items -->
            <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden p-6">
                <h2 class="text-lg font-bold text-white mb-4">Order Items</h2>
                <div class="space-y-4">
                    <div *ngFor="let item of order()?.items" class="flex items-center gap-4 p-3 hover:bg-dark-800/50 rounded-xl transition-colors group">
                        <div class="relative w-20 h-20 bg-dark-950 rounded-lg overflow-hidden flex-shrink-0 border border-dark-800 shadow-sm">
                            <img [src]="item.image || 'assets/images/placeholder.png'" [alt]="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                        </div>
                        <div class="flex-1">
                            <h3 class="text-white font-medium">{{ item.name }}</h3>
                            <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-white font-medium">{{ item.price | currency:'INR' }}</p>
                            <p class="text-xs text-gray-500">Total: {{ item.price * item.quantity | currency:'INR' }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payment & Shipping -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-dark-900 border border-dark-800 rounded-2xl p-6">
                    <h2 class="text-lg font-bold text-white mb-4">Shipping Info</h2>
                    <div class="space-y-2 text-sm text-gray-300">
                        <p><span class="text-gray-500">Name:</span> {{ order()?.user?.name }}</p>
                        <p><span class="text-gray-500">Email:</span> {{ order()?.user?.email }}</p>
                        <p><span class="text-gray-500">Address:</span> {{ order()?.shippingAddress?.address }}</p>
                        <p><span class="text-gray-500">City:</span> {{ order()?.shippingAddress?.city }}, {{ order()?.shippingAddress?.postalCode }}</p>
                        <p><span class="text-gray-500">Country:</span> {{ order()?.shippingAddress?.country }}</p>
                    </div>
                </div>

                <div class="bg-dark-900 border border-dark-800 rounded-2xl p-6">
                    <h2 class="text-lg font-bold text-white mb-4">Payment Info</h2>
                    <div class="space-y-2 text-sm text-gray-300">
                        <p><span class="text-gray-500">Method:</span> {{ order()?.paymentMethod }}</p>
                        <p><span class="text-gray-500">Status:</span> 
                            <span [class.text-green-400]="order()?.isPaid" [class.text-red-400]="!order()?.isPaid">
                                {{ order()?.isPaid ? 'Paid' : 'Not Paid' }}
                            </span>
                        </p>
                        <p *ngIf="order()?.isPaid"><span class="text-gray-500">Paid At:</span> {{ order()?.paidAt | date:'medium' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Summary Sidebar -->
        <div class="lg:col-span-1">
             <div class="bg-dark-900 border border-dark-800 rounded-2xl p-6 sticky top-6">
                <h2 class="text-lg font-bold text-white mb-4">Order Summary</h2>
                <div class="space-y-3 text-sm border-b border-dark-800 pb-4 mb-4">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Items</span>
                        <span class="text-white">{{ order()?.itemsPrice | currency:'INR' }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Shipping</span>
                        <span class="text-white">{{ order()?.shippingPrice | currency:'INR' }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Tax</span>
                        <span class="text-white">{{ order()?.taxPrice | currency:'INR' }}</span>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-base font-bold text-white">Total</span>
                    <span class="text-xl font-bold text-primary-400">{{ order()?.totalPrice | currency:'INR' }}</span>
                </div>
             </div>
        </div>
      </div>
    </div>
  `
})
export class AdminOrderDetailComponent {
    private route = inject(ActivatedRoute);
    private orderService = inject(OrderService);

    order = signal<Order | null>(null);

    constructor() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadOrder(id);
        }
    }

    loadOrder(id: string) {
        this.orderService.getOrderById(id).subscribe({
            next: (res) => this.order.set(res.data),
            error: (err) => console.error(err)
        });
    }

    updateStatus(newStatus: string) {
        const id = this.order()?._id;
        if (id) {
            this.orderService.updateOrderStatus(id, newStatus).subscribe({
                next: (res) => {
                    this.order.set(res.data);
                    // Could add toast notification here
                },
                error: (err) => alert('Failed to update status')
            });
        }
    }
}
