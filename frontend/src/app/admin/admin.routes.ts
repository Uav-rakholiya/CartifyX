import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard/dashboard.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'analytics', loadComponent: () => import('./pages/sales-report/sales-report.component').then(m => m.SalesReportComponent) },
            { path: 'products', loadComponent: () => import('./products/product-list/product-list.component').then(m => m.AdminProductListComponent) },
            { path: 'products/new', loadComponent: () => import('./products/product-form/product-form.component').then(m => m.AdminProductFormComponent) },
            { path: 'products/:id', loadComponent: () => import('./products/product-form/product-form.component').then(m => m.AdminProductFormComponent) },
            { path: 'products/:id/orders', loadComponent: () => import('./products/product-orders/product-orders.component').then(m => m.AdminProductOrdersComponent) },
            { path: 'orders', loadComponent: () => import('./orders/order-list/order-list.component').then(m => m.AdminOrderListComponent) },
            { path: 'orders/:id', loadComponent: () => import('./orders/order-detail/order-detail.component').then(m => m.AdminOrderDetailComponent) },
            { path: 'users', loadComponent: () => import('./users/user-list/user-list.component').then(m => m.AdminUserListComponent) },
            { path: 'messages', loadComponent: () => import('./pages/admin-messages/admin-messages.component').then(m => m.AdminMessagesComponent) }
        ]
    }
];
