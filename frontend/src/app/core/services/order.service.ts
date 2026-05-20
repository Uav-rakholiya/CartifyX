import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface OrderItem {
    product: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Order {
    _id?: string;
    orderItems?: OrderItem[];
    items?: OrderItem[];
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid?: boolean;
    paidAt?: string;
    isDelivered?: boolean;
    deliveredAt?: string;
    shippedAt?: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
    status?: string;
    createdAt?: string;
    user?: {
        _id: string;
        name: string;
        email: string;
    };
    guestEmail?: string;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/orders`;

    createOrder(order: Order): Observable<any> {
        return this.http.post(this.apiUrl, order);
    }

    getOrderById(id: string): Observable<{ status: string, data: Order }> {
        return this.http.get<{ status: string, data: Order }>(`${this.apiUrl}/${id}`);
    }

    getMyOrders(): Observable<{ status: string, data: Order[] }> {
        return this.http.get<{ status: string, data: Order[] }>(`${this.apiUrl}/myorders`);
    }

    getAllOrders(): Observable<{ status: string, data: Order[] }> {
        return this.http.get<{ status: string, data: Order[] }>(this.apiUrl);
    }

    updateOrderStatus(id: string, status: string): Observable<{ status: string, data: Order }> {
        return this.http.patch<{ status: string, data: Order }>(`${this.apiUrl}/${id}/status`, { status });
    }

    downloadInvoice(orderId: string): Observable<Blob> {
        return this.http.get(`${environment.apiUrl}/invoices/download/${orderId}`, { responseType: 'blob' });
    }

    getSalesData(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily'): Observable<{ status: string, data: { dailySales: any[], totalRevenue: number, totalOrders: number, topProducts: any[] } }> {
        return this.http.get<{ status: string, data: any }>(`${this.apiUrl}/analytics`, {
            params: { period }
        });
    }

    getOrdersByProduct(productId: string, filters?: any): Observable<{ status: string, stats: any, count: number, data: Order[] }> {
        return this.http.get<{ status: string, stats: any, count: number, data: Order[] }>(`${this.apiUrl}/product/${productId}`, {
            params: filters
        });
    }
}
