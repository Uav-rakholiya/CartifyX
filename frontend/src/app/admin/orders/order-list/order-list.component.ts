import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/services/order.service';

@Component({
    selector: 'app-admin-order-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">Orders</h1>

      <div *ngIf="errorMessage()" class="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl">
        {{ errorMessage() }}
      </div>

      <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
        <table class="w-full text-left text-sm text-gray-400">
            <thead class="bg-dark-950 text-xs uppercase font-medium">
                <tr>
                    <th class="px-6 py-4">Order ID</th>
                    <th class="px-6 py-4">Customer</th>
                    <th class="px-6 py-4">Date</th>
                    <th class="px-6 py-4">Total</th>
                    <th class="px-6 py-4">Status</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-dark-800">
                <tr *ngFor="let order of orders()" class="hover:bg-dark-800/50 transition-colors">
                    <td class="px-6 py-4 font-mono text-xs">{{ order._id | slice:-6 }}</td>
                     <td class="px-6 py-4 text-white">
                        {{ order.user?.name || 'Guest' }}
                        <div class="text-xs text-gray-500">{{ order.user?.email }}</div>
                    </td>
                    <td class="px-6 py-4">{{ order.createdAt | date:'short' }}</td>
                    <td class="px-6 py-4 text-white">{{ order.totalPrice | currency:'INR' }}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded-full text-xs font-medium"
                            [ngClass]="{
                                'bg-green-500/10 text-green-500': order.status === 'Delivered',
                                'bg-blue-500/10 text-blue-500': order.status === 'Shipped',
                                'bg-yellow-500/10 text-yellow-500': order.status === 'Processing'
                            }">
                            {{ order.status }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a [routerLink]="['/admin/orders', order._id]" class="text-primary-400 hover:text-primary-300 font-medium text-xs">View</a>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminOrderListComponent {
    private orderService = inject(OrderService);
    orders = signal<Order[]>([]);

    errorMessage = signal<string | null>(null);

    constructor() {
        this.orderService.getAllOrders().subscribe({
            next: (res) => {
                this.orders.set(res.data);
                if (res.data.length === 0) {
                    this.errorMessage.set('No orders found in the database.');
                }
            },
            error: (err) => {
                console.error('Error fetching orders:', err);
                this.errorMessage.set(`Failed to load orders: ${err.message || 'Unknown error'}`);
            }
        });
    }
}
