import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

// Declare Razorpay window object
declare var Razorpay: any;

export interface PaymentEvent {
    type: 'success' | 'failure' | 'cancelled';
    data?: any;
    error?: any;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = `${environment.apiUrl}/payment`; // Make sure environment has apiUrl
    private paymentEventSubject = new Subject<PaymentEvent>();
    paymentEvent$ = this.paymentEventSubject.asObservable();

    constructor(private http: HttpClient) { }

    createOrder(amount: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/create-order`, { amount });
    }

    verifyPayment(response: any, orderId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/verify-payment`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order_id: orderId
        });
    }

    cancelOrder(orderId: string): Observable<any> {
        return this.http.patch(`${environment.apiUrl}/orders/${orderId}/cancel`, {});
    }

    simulatePayment(orderId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/verify-payment`, {
            is_simulation: true,
            order_id: orderId
        });
    }

    openPayment(options: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                // Add close/cancel handler for when user exits payment modal
                options.modal = options.modal || {};
                options.modal.ondismiss = () => {
                    console.log('Payment modal dismissed by user');
                    this.paymentEventSubject.next({
                        type: 'cancelled',
                        data: { message: 'Payment was cancelled. Please try again.' }
                    });
                    reject(new Error('Payment cancelled by user'));
                };

                // Backup handler for when Razorpay close button is clicked
                const originalHandler = options.handler;
                options.handler = (response: any) => {
                    console.log('Payment handler called', response);
                    this.paymentEventSubject.next({
                        type: 'success',
                        data: response
                    });
                    if (originalHandler) {
                        originalHandler(response);
                    }
                    resolve(response);
                };

                const rzp = new Razorpay(options);
                
                // Catch any Razorpay errors
                rzp.on('payment.failed', (response: any) => {
                    console.error('Razorpay payment failed', response);
                    this.paymentEventSubject.next({
                        type: 'failure',
                        error: response.error
                    });
                    reject(response.error);
                });

                rzp.open();
                resolve(rzp);
            } catch (err) {
                console.error('Razorpay initialization error', err);
                this.paymentEventSubject.next({
                    type: 'failure',
                    error: err
                });
                reject(err);
            }
        });
    }
}
