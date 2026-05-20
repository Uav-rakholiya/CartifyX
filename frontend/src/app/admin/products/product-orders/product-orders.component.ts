import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
    selector: 'app-admin-product-orders',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <div class="flex items-center gap-3">
             <a routerLink="/admin/products" class="text-gray-500 hover:text-white transition-colors">
                <span class="material-icons">arrow_back</span>
             </a>
             <h1 class="text-2xl font-bold text-white">
                Orders for <span class="text-primary-400">{{ product()?.name }}</span>
             </h1>
          </div>
          <p class="text-gray-400 mt-1 ml-9">Detailed order history and analytics</p>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage()" class="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl">
        {{ errorMessage() }}
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-dark-900 border border-dark-800 rounded-2xl p-6">
            <h3 class="text-gray-400 text-sm font-medium mb-1">Total Orders</h3>
            <p class="text-2xl font-bold text-white">{{ stats().totalOrders }}</p>
        </div>
        <div class="bg-dark-900 border border-dark-800 rounded-2xl p-6">
            <h3 class="text-gray-400 text-sm font-medium mb-1">Total Quantity Sold</h3>
            <p class="text-2xl font-bold text-primary-400">{{ stats().totalQuantity }}</p>
        </div>
        <div class="bg-dark-900 border border-dark-800 rounded-2xl p-6">
            <h3 class="text-gray-400 text-sm font-medium mb-1">Total Revenue</h3>
            <p class="text-2xl font-bold text-green-400">{{ stats().totalRevenue | currency:'INR' }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-dark-900 border border-dark-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-end md:items-center">
        <div class="w-full md:w-auto flex-1">
            <label class="block text-xs font-medium text-gray-500 mb-1">Customer Name</label>
            <input type="text" [(ngModel)]="filters.customerName" (ngModelChange)="applyFilters()" placeholder="Search customer..." 
                class="w-full bg-dark-950 border-dark-800 rounded-lg text-sm text-white px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
        </div>
        <div class="w-full md:w-auto">
            <label class="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select [(ngModel)]="filters.status" (ngModelChange)="applyFilters()"
                class="w-full bg-dark-950 border-dark-800 rounded-lg text-sm text-white px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
                <option value="">All Status</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
            </select>
        </div>
        <div class="w-full md:w-auto">
            <label class="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
            <input type="date" [(ngModel)]="filters.startDate" (ngModelChange)="applyFilters()"
                class="w-full bg-dark-950 border-dark-800 rounded-lg text-sm text-white px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
        </div>
        <div class="w-full md:w-auto">
            <label class="block text-xs font-medium text-gray-500 mb-1">End Date</label>
            <input type="date" [(ngModel)]="filters.endDate" (ngModelChange)="applyFilters()"
                class="w-full bg-dark-950 border-dark-800 rounded-lg text-sm text-white px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
        </div>
        <button (click)="resetFilters()" class="text-xs text-primary-400 hover:text-primary-300 font-medium px-2 py-2">
            Reset
        </button>
      </div>

      <!-- Orders Table -->
      <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
        <table class="w-full text-left text-sm text-gray-400">
            <thead class="bg-dark-950 text-xs uppercase font-medium">
                <tr>
                    <th class="px-6 py-4">Order ID</th>
                    <th class="px-6 py-4">Customer</th>
                    <th class="px-6 py-4">Qty</th>
                    <th class="px-6 py-4">Date</th>
                    <th class="px-6 py-4">Payment</th>
                    <th class="px-6 py-4">Status</th>
                    <th class="px-6 py-4 text-right">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-dark-800">
                <tr *ngIf="orders().length === 0">
                    <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                        No orders found matching filters.
                    </td>
                </tr>
                <tr *ngFor="let order of orders()" class="hover:bg-dark-800/50 transition-colors">
                    <td class="px-6 py-4 font-mono text-xs">{{ order._id | slice:-6 }}</td>
                     <td class="px-6 py-4 text-white">
                        {{ order.user?.name || 'Guest' }}
                        <div class="text-xs text-gray-500">{{ order.user?.email }}</div>
                    </td>
                    <td class="px-6 py-4 text-white font-medium">
                        <ng-container *ngFor="let item of order.items">
                             <span *ngIf="item.product === productId">{{ item.quantity }}</span>
                        </ng-container>
                    </td>
                    <td class="px-6 py-4">{{ order.createdAt | date:'mediumDate' }}</td>
                    <td class="px-6 py-4">
                        <span [class.text-green-400]="order.isPaid" [class.text-red-400]="!order.isPaid">
                            {{ order.isPaid ? 'Paid' : 'Unpaid' }}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded-full text-xs font-medium"
                            [ngClass]="{
                                'bg-green-500/10 text-green-500': order.status === 'Delivered',
                                'bg-blue-500/10 text-blue-500': order.status === 'Shipped',
                                'bg-yellow-500/10 text-yellow-500': order.status === 'Processing',
                                'bg-red-500/10 text-red-500': order.status === 'Cancelled'
                            }">
                            {{ order.status }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a [routerLink]="['/admin/orders', order._id]" class="text-primary-400 hover:text-primary-300 font-medium text-xs">View Details</a>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminProductOrdersComponent {
    private route = inject(ActivatedRoute);
    private orderService = inject(OrderService);
    private productService = inject(ProductService);

    productId: string = '';
    product = signal<Product | null>(null);
    orders = signal<any[]>([]);
    stats = signal({ totalOrders: 0, totalQuantity: 0, totalRevenue: 0 });
    errorMessage = signal<string | null>(null);

    filters = {
        startDate: '',
        endDate: '',
        status: '',
        customerName: ''
    };

    constructor() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.productId = id;
                this.loadProduct(id);
                this.loadOrders();
            }
        });
    }

    loadProduct(id: string) {
        this.productService.getProductById(id).subscribe(res => {
            this.product.set(res);
        });
    }

    loadOrders() {
        if (!this.productId) return;

        this.errorMessage.set(null); // Clear previous errors

        // Remove empty filters
        const cleanFilters: any = {};
        if (this.filters.startDate) cleanFilters.startDate = this.filters.startDate;
        if (this.filters.endDate) cleanFilters.endDate = this.filters.endDate;
        if (this.filters.status) cleanFilters.status = this.filters.status;
        if (this.filters.customerName) cleanFilters.customerName = this.filters.customerName;

        // @ts-ignore
        this.orderService.getOrdersByProduct(this.productId, cleanFilters).subscribe({
            next: (res) => {
                this.orders.set(res.data);
                this.stats.set(res.stats);
            },
            error: (err) => {
                console.error('Failed to load orders:', err);
                this.errorMessage.set(`Error loading data: ${err.message || 'Unknown error'}. Check console for details.`);
            }
        });
    }

    applyFilters() {
        this.loadOrders();
    }

    resetFilters() {
        this.filters = {
            startDate: '',
            endDate: '',
            status: '',
            customerName: ''
        };
        this.loadOrders();
    }
}
