import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../core/services/cart.service';
import { OrderService } from '../core/services/order.service';
import { AuthService } from '../core/services/auth.service';
import { PaymentService } from '../core/services/payment.service';
import { ScrollAnimationDirective } from '../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScrollAnimationDirective],
  template: `
    <div class="bg-dark-950 min-h-screen py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Error Message Alert -->
        <div *ngIf="errorMessage()" class="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div class="flex-grow">
            <p class="text-red-200 font-medium">{{ errorMessage() }}</p>
          </div>
          <button (click)="clearError()" class="text-red-400 hover:text-red-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Success/Retry Message -->
        <div *ngIf="retryMessage()" class="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="flex-grow">
            <p class="text-blue-200">{{ retryMessage() }}</p>
          </div>
        </div>
        
        <h1 class="text-3xl font-bold mb-8 relative" style="perspective: 1200px;">
           <div style="transform-style: preserve-3d;">
               <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white" style="animation-fill-mode: both;">
                   Checkout
               </span>
           </div>
        </h1>

        <div class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start" *ngIf="cartItems().length > 0">
          
          <!-- Shipping Address Form -->
          <section class="lg:col-span-7">
            <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
              <div class="bg-dark-900 border border-dark-800 shadow px-4 py-6 sm:p-6 sm:rounded-lg">
                <h2 class="text-lg font-medium text-white mb-6">Delivery Address</h2>

                <div class="space-y-6">
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-300">Email Address</label>
                    <div class="mt-1">
                      <input type="email" id="email" formControlName="email" placeholder="Required for order tracking" class="block w-full rounded-md border-dark-700 bg-dark-800 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3">
                    </div>
                  </div>

                  <div>
                    <label for="address" class="block text-sm font-medium text-gray-300">Address</label>
                    <div class="mt-1">
                      <input type="text" id="address" formControlName="address" class="block w-full rounded-md border-dark-700 bg-dark-800 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3">
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label for="city" class="block text-sm font-medium text-gray-300">City</label>
                      <div class="mt-1">
                        <input type="text" id="city" formControlName="city" class="block w-full rounded-md border-dark-700 bg-dark-800 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3">
                      </div>
                    </div>

                    <div>
                      <label for="state" class="block text-sm font-medium text-gray-300">State</label>
                      <div class="mt-1">
                        <input type="text" id="state" formControlName="state" class="block w-full rounded-md border-dark-700 bg-dark-800 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3">
                      </div>
                    </div>

                    <div class="sm:col-span-2">
                      <label for="postalCode" class="block text-sm font-medium text-gray-300">Postal code</label>
                      <div class="mt-1">
                        <input type="text" id="postalCode" formControlName="postalCode" class="block w-full rounded-md border-dark-700 bg-dark-800 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3">
                      </div>
                    </div>
                  </div>

                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-300">Phone</label>
                    <div class="mt-1 flex rounded-md shadow-sm border border-dark-700 bg-dark-800 focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all duration-200">
                      
                      <!-- Country Code Dropdown -->
                      <div class="relative flex items-center border-r border-dark-700 bg-dark-900/50 hover:bg-dark-700/50 transition-colors rounded-l-md">
                        <select id="country" formControlName="country" class="appearance-none w-[130px] sm:w-[150px] bg-transparent border-none pl-3 pr-8 py-2 text-white sm:text-sm cursor-pointer outline-none focus:ring-0 truncate font-medium">
                          <option class="bg-dark-900 text-white" value="India (+91)">🇮🇳 India (+91)</option>
                          <option class="bg-dark-900 text-white" value="United States (+1)">🇺🇸 USA (+1)</option>
                          <option class="bg-dark-900 text-white" value="United Kingdom (+44)">🇬🇧 UK (+44)</option>
                          <option class="bg-dark-900 text-white" value="Canada (+1)">🇨🇦 Canada (+1)</option>
                          <option class="bg-dark-900 text-white" value="Australia (+61)">🇦🇺 Australia (+61)</option>
                          <option class="bg-dark-900 text-white" value="Germany (+49)">🇩🇪 Germany (+49)</option>
                          <option class="bg-dark-900 text-white" value="France (+33)">🇫🇷 France (+33)</option>
                          <option class="bg-dark-900 text-white" value="Japan (+81)">🇯🇵 Japan (+81)</option>
                        </select>
                        <div class="pointer-events-none absolute right-2 text-primary-500">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>

                      <!-- Phone Input -->
                      <input type="text" id="phone" formControlName="phone" maxlength="10" (keypress)="allowOnlyNumbers($event)" placeholder="Enter 10-digit number" class="block w-full bg-transparent border-none rounded-r-md text-white sm:text-sm py-2 px-3 outline-none focus:ring-0 placeholder-gray-500">
                    </div>
                    
                    <div *ngIf="checkoutForm.get('phone')?.invalid && (checkoutForm.get('phone')?.dirty || checkoutForm.get('phone')?.touched)" class="mt-1 text-sm text-red-400">
                      <span *ngIf="checkoutForm.get('phone')?.hasError('required')">Phone number is required.</span>
                      <span *ngIf="checkoutForm.get('phone')?.hasError('pattern')">Please enter only numbers.</span>
                      <span *ngIf="checkoutForm.get('phone')?.hasError('maxlength')">Max 10 digits allowed.</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="bg-dark-900 border border-dark-800 shadow px-4 py-6 sm:p-6 sm:rounded-lg mt-8">
                <h2 class="text-lg font-medium text-white mb-6">Payment Method</h2>
                <div class="space-y-4">
                  <div class="flex items-center">
                    <input id="card" value="razorpay" type="radio" formControlName="paymentMethod" class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300">
                    <label for="card" class="ml-3 block text-sm font-medium text-gray-300">
                      Credit card / Debit card (Razorpay)
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input id="paypal" value="paypal" type="radio" formControlName="paymentMethod" class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300">
                    <label for="paypal" class="ml-3 block text-sm font-medium text-gray-500">
                      PayPal (Coming soon)
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </section>

          <!-- Order Summary -->
          <section class="lg:col-span-5 mt-8 lg:mt-0">
            <div class="bg-dark-900 border border-dark-800 shadow px-4 py-6 sm:p-6 sm:rounded-lg relative">
              <h2 class="text-lg font-medium text-white mb-6">Order summary</h2>

              <div class="flow-root mb-6">
                <ul role="list" class="-my-4 divide-y divide-dark-800">
                  <li *ngFor="let item of cartItems()" class="flex py-4">
                    <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-dark-800">
                      <img [src]="item.product.imageUrl" [alt]="item.product.name" class="h-full w-full object-cover object-center">
                    </div>
                    <div class="ml-4 flex flex-1 flex-col">
                      <div>
                        <div class="flex justify-between text-base font-medium text-white">
                          <h3>{{ item.product.name }}</h3>
                          <p class="ml-4">{{ item.product.price * item.quantity | currency }}</p>
                        </div>
                        <p class="mt-1 text-sm text-gray-500">{{ item.product.category }}</p>
                      </div>
                      <div class="flex flex-1 items-end justify-between text-sm">
                        <p class="text-gray-400">Qty {{ item.quantity }}</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <dl class="space-y-4 text-sm text-gray-300 border-t border-dark-800 pt-6">
                <div class="flex items-center justify-between">
                  <dt>Subtotal</dt>
                  <dd class="font-medium text-white">{{ totalPrice() | currency }}</dd>
                </div>
                <div class="flex items-center justify-between">
                  <dt>Shipping</dt>
                  <dd class="font-medium text-white">{{ shipping() | currency }}</dd>
                </div>
                <div class="flex items-center justify-between">
                  <dt>Tax</dt>
                  <dd class="font-medium text-white">{{ tax() | currency }}</dd>
                </div>
                <div class="border-t border-dark-800 pt-4 flex items-center justify-between">
                  <dt class="text-base font-medium text-white">Order total</dt>
                  <dd class="text-base font-medium text-primary-500">{{ total() | currency }}</dd>
                </div>
              </dl>

              <div class="mt-6">
                <button (click)="onSubmit()" [disabled]="checkoutForm.invalid || isProcessing()" class="w-full bg-primary-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <span *ngIf="isProcessing()" class="flex items-center justify-center gap-2">
                    <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </span>
                  <span *ngIf="!isProcessing()">Place Order</span>
                </button>
              </div>
            </div>
          </section>

        </div>
        
         <div *ngIf="cartItems().length === 0" class="text-center py-12">
            <h2 class="text-2xl font-semibold mb-4 text-white">Your cart is empty</h2>
            <p class="text-gray-400 mb-8">Add some items before checking out.</p>
         </div>

      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private paymentService = inject(PaymentService);

  private destroy$ = new Subject<void>();

  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;

  isProcessing = signal(false);
  errorMessage = signal<string>('');
  retryMessage = signal<string>('');
  private currentOrderId: string | null = null;
  private razorpayInstance: any = null;

  // Calculations
  shipping = () => this.totalPrice() > 100 ? 0 : 15;
  tax = () => this.totalPrice() * 0.08;
  total = () => this.totalPrice() + this.shipping() + this.tax();

  checkoutForm = this.fb.group({
    email: [this.authService.currentUser()?.email || '', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['India (+91)', Validators.required],
    phone: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+$')]],
    paymentMethod: ['razorpay', Validators.required]
  });

  constructor() {
    // Listen for payment events from PaymentService
    this.paymentService.paymentEvent$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.handlePaymentEvent(event);
      });
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key;
    // Allow numbers, Backspace, Delete, arrows, and Tab
    if (!/^[0-9]$/.test(charCode) && 
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
      event.preventDefault();
    }
  }

  ngOnInit() {
    // Handle page visibility changes (user switching tabs, browser back button)
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleVisibilityChange = () => {
    // If page becomes visible again after being hidden, check if payment modal still open
    if (document.visibilityState === 'visible' && this.isProcessing() && !this.razorpayInstance) {
      console.log('Page became visible, checking payment state');
      // Don't forcefully reset - wait for actual dismissal callback
    }
  };

  private handlePaymentEvent(event: any) {
    switch (event.type) {
      case 'success':
        console.log('Payment successful event received');
        break;
      case 'failure':
        // Handle payment failures
        this.handlePaymentFailure(event.error);
        break;
      case 'cancelled':
        // Handle payment cancellation
        this.handlePaymentCancellation(event.data);
        break;
    }
  }

  private handlePaymentCancellation(data: any) {
    console.log('Payment cancelled:', data);
    this.isProcessing.set(false);
    this.errorMessage.set(data.message || 'Payment was cancelled. Please try again.');
    
    // Note: Order remains in database for admin review
    // User can retry payment without creating a new order
  }

  private handlePaymentFailure(error: any) {
    console.error('Payment failure event:', error);
    this.isProcessing.set(false);
    
    let errorMsg = 'Payment processing failed. Please try again.';
    if (error && error.description) {
      errorMsg = error.description;
    } else if (error && typeof error === 'string') {
      errorMsg = error;
    }
    
    this.errorMessage.set(errorMsg);
    // Note: Order remains in database for admin/user review
  }

  clearError() {
    this.errorMessage.set('');
    this.retryMessage.set('');
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      Object.keys(this.checkoutForm.controls).forEach(key => {
        const control = this.checkoutForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // Clear previous error messages
    this.clearError();
    this.isProcessing.set(true);

    const isGuest = !this.authService.isAuthenticated();

    const orderData = {
      orderItems: this.cartItems().map(item => ({
        product: (item.product as any)._id || item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.imageUrl
      })),
      shippingAddress: {
        address: this.checkoutForm.value.address,
        city: this.checkoutForm.value.city,
        state: this.checkoutForm.value.state,
        postalCode: this.checkoutForm.value.postalCode,
        country: this.checkoutForm.value.country,
        phone: this.checkoutForm.value.phone
      },
      paymentMethod: this.checkoutForm.value.paymentMethod,
      itemsPrice: this.totalPrice(),
      taxPrice: this.tax(),
      shippingPrice: this.shipping(),
      totalPrice: this.total(),
      ...(isGuest ? { guestEmail: this.checkoutForm.value.email } : {})
    };

    // @ts-ignore
    this.orderService.createOrder(orderData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Order created:', res);

          // Store order ID for potential cancellation/retry
          const dbOrder = res.data;
          this.currentOrderId = dbOrder._id;

          // Proceed to payment
          this.processRazorpayPayment(dbOrder, this.total());
        },
        error: (err) => {
          console.error('Create Order Error:', err);
          this.isProcessing.set(false);
          
          let msg = 'Failed to create order. Please try again.';
          if (err.error && err.error.message) {
            msg = err.error.message;
          }
          this.errorMessage.set(msg);
        }
      });
  }

  processRazorpayPayment(dbOrder: any, amount: number) {
    const currentUser = this.authService.currentUser();
    const phone = this.checkoutForm.value.phone;

    this.paymentService.createOrder(amount)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rzpRes: any) => {
          const options = {
            key: rzpRes.key || 'rzp_test_SGo9drf5bEblg3',
            amount: rzpRes.order.amount,
            currency: 'INR',
            name: 'CartifyX',
            description: 'Order Payment',
            order_id: rzpRes.order.id,
            prefill: {
              name: currentUser?.name || 'Guest User',
              email: currentUser?.email || this.checkoutForm.value.email || 'guest@example.com',
              contact: phone || '9999999999'
            },
            theme: { color: '#0ea5e9' },
            // Handlers will be set by PaymentService.openPayment()
            handler: (response: any) => {
              this.verifyPayment(response, dbOrder._id);
            }
          };

          // Open payment modal and handle cancellation/close
          this.paymentService.openPayment(options)
            .then((rzp) => {
              this.razorpayInstance = rzp;
            })
            .catch((err) => {
              console.error('Payment modal error:', err);
              // Error is already handled by PaymentService event
              this.isProcessing.set(false);
            });
        },
        error: (err) => {
          console.error('Razorpay Order Creation Failed', err);
          this.isProcessing.set(false);
          this.errorMessage.set('Failed to initialize payment gateway. Please try again.');
        }
      });
  }

  verifyPayment(response: any, dbOrderId: string) {
    this.paymentService.verifyPayment(response, dbOrderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Payment verified successfully');
          this.cartService.cart.set(null); // Clear cart signal
          this.isProcessing.set(false);
          this.currentOrderId = null;
          this.razorpayInstance = null;
          this.router.navigate(['/checkout/success', dbOrderId]);
        },
        error: (err) => {
          console.error('Payment Verification Failed', err);
          this.isProcessing.set(false);
          this.razorpayInstance = null;
          
          let msg = 'Payment verification failed. Your order may still be processing.';
          if (err.error && err.error.message) {
            msg = err.error.message;
          }
          this.errorMessage.set(msg);
        }
      });
  }
}
