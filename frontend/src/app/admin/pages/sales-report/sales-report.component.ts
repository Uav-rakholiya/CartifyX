import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, tap, switchMap, startWith } from 'rxjs/operators';
import { ScrollAnimationDirective } from '../../../shared/directives/scroll-animation.directive';
import { BehaviorSubject, of } from 'rxjs';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, ScrollAnimationDirective],
  template: `
    <div class="space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 class="text-3xl font-bold text-white">Sales Analytics</h1>
          
          <!-- Period Selector -->
          <div class="bg-dark-900 p-1 rounded-xl border border-dark-800 flex">
              <button *ngFor="let p of periods" 
                      (click)="setPeriod(p.value)"
                      class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      [class.bg-primary-600]="currentPeriod() === p.value"
                      [class.text-white]="currentPeriod() === p.value"
                      [class.text-gray-400]="currentPeriod() !== p.value"
                      [class.hover:text-white]="currentPeriod() !== p.value">
                  {{ p.label }}
              </button>
          </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="error()" class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 mb-6">
        Error loading sales data: {{ error() }}
      </div>
      
      <!-- Loading State -->
      <div *ngIf="!salesData() && !error()" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p class="text-gray-400 mt-4">Loading analytics...</p>
      </div>

      <ng-container *ngIf="salesData()">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Total Revenue -->
          <div appScrollAnimation class="bg-dark-900 border border-dark-800 p-6 rounded-2xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-gray-400 font-medium">Total Revenue</h3>
              <span class="p-2 bg-green-500/10 rounded-lg text-green-500">
                <span class="material-icons">attach_money</span>
              </span>
            </div>
            <p class="text-3xl font-bold text-white">{{ salesData()?.totalRevenue | currency:'INR' }}</p>
          </div>
  
          <!-- Total Orders -->
          <div appScrollAnimation class="bg-dark-900 border border-dark-800 p-6 rounded-2xl" style="transition-delay: 100ms;">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-gray-400 font-medium">Total Orders</h3>
              <span class="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <span class="material-icons">shopping_cart</span>
              </span>
            </div>
            <p class="text-3xl font-bold text-white">{{ salesData()?.totalOrders }}</p>
          </div>
  
          <!-- Avg Order Value -->
          <div appScrollAnimation class="bg-dark-900 border border-dark-800 p-6 rounded-2xl" style="transition-delay: 200ms;">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-gray-400 font-medium">Avg. Order Value</h3>
              <span class="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <span class="material-icons">functions</span>
              </span>
            </div>
            <p class="text-3xl font-bold text-white">
              {{ ((salesData()?.totalRevenue || 0) / (salesData()?.totalOrders || 1)) | currency:'INR' }}
            </p>
          </div>
        </div>
  
        <!-- Sales Trend Chart -->
        <div appScrollAnimation class="bg-dark-900 border border-dark-800 p-6 rounded-xl" style="transition-delay: 300ms;">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-white">Sales Trend</h2>
                <span class="text-gray-500 text-sm capitalize">{{ currentPeriod() }} View</span>
            </div>
        
            <div class="h-64 flex items-end justify-between gap-2" *ngIf="salesData()?.dailySales?.length; else noChartData">
                <div *ngFor="let item of salesData()?.dailySales; let i = index" 
                    class="relative flex-1 group flex flex-col justify-end items-center h-full">
                    
                    <!-- Tooltip -->
                    <div class="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-800 border border-dark-700 p-2 rounded text-xs whitespace-nowrap z-10 pointer-events-none">
                        <div class="text-gray-400">{{ formatLabel(item._id) }}</div>
                        <div class="text-white font-bold">{{ item.totalSales | currency:'INR' }}</div>
                        <div class="text-blue-400">{{ item.totalOrders }} orders</div>
                    </div>

                    <!-- Value Label (Visible) -->
                    <div class="text-[10px] text-gray-400 mb-1 rotate-0 hidden sm:block">{{ item.totalSales | currency:'INR':'symbol':'1.0-0' }}</div>

                    <!-- Bar -->
                    <div class="w-full bg-blue-500 hover:bg-blue-400 rounded-t transition-all duration-300 relative min-h-[4px]"
                        [style.height.%]="(item.totalSales / maxDailySales()) * 100">
                    </div>
                    
                    <!-- Label -->
                    <div class="mt-2 text-[10px] sm:text-xs text-gray-500 rotate-45 origin-left truncate w-full text-center">
                        {{ formatShortLabel(item._id) }}
                    </div>
                </div>
            </div>
            <ng-template #noChartData>
            <div class="h-64 flex items-center justify-center text-gray-500">
                No sales data to display for this period
            </div>
            </ng-template>
        </div>
  
        <!-- Top Selling Products -->
        <div appScrollAnimation class="bg-dark-900 border border-dark-800 p-6 rounded-xl" style="transition-delay: 400ms;">
          <h2 class="text-xl font-bold text-white mb-6">Top Selling Products (All Time)</h2>
          <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-gray-400">
                  <thead class="bg-dark-950 text-xs uppercase font-medium">
                      <tr>
                          <th class="px-6 py-4">Product Name</th>
                          <th class="px-6 py-4 text-right">Units Sold</th>
                          <th class="px-6 py-4 text-right">Revenue</th>
                      </tr>
                  </thead>
                  <tbody class="divide-y divide-dark-800">
                      <tr *ngFor="let product of salesData()?.topProducts" class="hover:bg-dark-800/50">
                          <td class="px-6 py-4 text-white font-medium">{{ product.name }}</td>
                          <td class="px-6 py-4 text-right">{{ product.totalSold }}</td>
                          <td class="px-6 py-4 text-right text-green-500">{{ product.revenue | currency:'INR' }}</td>
                      </tr>
                      <tr *ngIf="!salesData()?.topProducts?.length">
                          <td colspan="3" class="px-6 py-8 text-center text-gray-500">No sales data available yet.</td>
                      </tr>
                  </tbody>
              </table>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class SalesReportComponent {
  private orderService = inject(OrderService);

  error = signal<string | null>(null);
  currentPeriod = signal<Period>('daily');
  periodSubject = new BehaviorSubject<Period>('daily');

  periods: { label: string, value: Period }[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' }
  ];

  salesData = toSignal(
    this.periodSubject.pipe(
      tap(() => this.error.set(null)),
      switchMap(period => this.orderService.getSalesData(period).pipe(
        tap(res => console.log('Sales Data Response:', res)),
        map(res => res.data),
        catchError(err => {
          console.error('Error fetching sales data:', err);
          const errorMessage = err.error?.message || err.message || 'Failed to load sales data';
          this.error.set(errorMessage);
          return of(null);
        })
      ))
    ),
    { initialValue: null }
  );

  maxDailySales = computed(() => {
    const data = this.salesData();
    if (!data?.dailySales?.length) return 1;
    return Math.max(...data.dailySales.map((d: any) => d.totalSales || 0)) || 1;
  });

  setPeriod(period: Period) {
    this.currentPeriod.set(period);
    this.periodSubject.next(period);
  }

  formatLabel(dateStr: string): string {
    const date = new Date(dateStr); // Might need adjustment depending on format
    switch (this.currentPeriod()) {
      case 'monthly': return dateStr; // Already YYYY-MM
      case 'yearly': return dateStr; // Already YYYY
      case 'weekly': return `Week ${dateStr.split('W')[1]}, ${dateStr.split('-')[0]}`;
      default: return new Date(dateStr).toLocaleDateString();
    }
  }

  formatShortLabel(dateStr: string): string {
    if (this.currentPeriod() === 'yearly') return dateStr;
    if (this.currentPeriod() === 'monthly') {
      const [year, month] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
    if (this.currentPeriod() === 'weekly') {
      return `W${dateStr.split('W')[1]}`;
    }
    const date = new Date(dateStr);
    return `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  }
}
