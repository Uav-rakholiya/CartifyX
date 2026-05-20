import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ScrollAnimationDirective],
  template: `
    <div class="space-y-8">
      <h1 class="text-3xl font-bold text-white">Dashboard Overview</h1>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Sales -->
        <div appScrollAnimation class="bg-dark-900 border border-dark-800 p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-400 font-medium">Total Sales</h3>
            <span class="p-2 bg-green-500/10 rounded-lg text-green-500">
              <span class="material-icons">attach_money</span>
            </span>
          </div>
          <p class="text-3xl font-bold text-white">{{ totalSales() | currency:'INR' }}</p>
          <p class="text-sm text-green-500 mt-2 flex items-center">
            <span class="material-icons text-sm mr-1">trending_up</span>
            +12.5% from last month
          </p>
        </div>

        <!-- Total Orders -->
        <div appScrollAnimation class="bg-dark-900 border border-dark-800 p-6 rounded-2xl" style="transition-delay: 100ms;">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-400 font-medium">Total Orders</h3>
            <span class="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <span class="material-icons">shopping_cart</span>
            </span>
          </div>
          <p class="text-3xl font-bold text-white">{{ totalOrders() }}</p>
          <p class="text-sm text-blue-500 mt-2 flex items-center">
            <span class="material-icons text-sm mr-1">trending_up</span>
            +5 new today
          </p>
        </div>

        <!-- Total Products -->
        <div appScrollAnimation class="bg-dark-900 border border-dark-800 p-6 rounded-xl" style="transition-delay: 200ms;">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-400 font-medium">Total Products</h3>
            <span class="p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <span class="material-icons">inventory_2</span>
            </span>
          </div>
          <p class="text-3xl font-bold text-white">{{ totalProducts() }}</p>
          <p class="text-sm text-gray-500 mt-2">Active in store</p>
        </div>
      </div>

      <!-- Recent Orders Preview -->
      <div appScrollAnimation class="bg-dark-900 border border-dark-800 rounded-xl overflow-hidden" style="transition-delay: 300ms;">
        <div class="p-6 border-b border-dark-800">
            <h2 class="text-xl font-bold text-white">Recent Orders</h2>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-400">
                <thead class="bg-dark-950 text-xs uppercase font-medium">
                    <tr>
                        <th class="px-6 py-4">Order ID</th>
                        <th class="px-6 py-4">Customer</th>
                        <th class="px-6 py-4">Total</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4">Date</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-dark-800">
                    <tr *ngFor="let order of recentOrders()" class="hover:bg-dark-800/50 transition-colors">
                        <td class="px-6 py-4 font-mono text-xs text-gray-500">{{ order._id | slice:-6 }}</td>
                        <td class="px-6 py-4 text-white">
                            {{ order.user?.name || 'Guest' }}
                        </td>
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
                        <td class="px-6 py-4">{{ order.createdAt | date:'short' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);

  // Stats Signals
  orders = toSignal(this.orderService.getAllOrders().pipe(map(res => res.data)), { initialValue: [] });
  products = toSignal(this.productService.getAllProducts(), { initialValue: [] });

  totalSales = toSignal(
    this.orderService.getAllOrders().pipe(
      map(res => res.data.reduce((sum, order) => sum + (order.totalPrice || 0), 0))
    ),
    { initialValue: 0 }
  );

  totalOrders = toSignal(
    this.orderService.getAllOrders().pipe(map(res => res.data.length)),
    { initialValue: 0 }
  );

  totalProducts = toSignal(
    this.productService.getProducts().pipe(map(res => res.results)),
    { initialValue: 0 }
  );

  recentOrders = toSignal(
    this.orderService.getAllOrders().pipe(map(res => res.data.slice(0, 5))),
    { initialValue: [] }
  );
}
