import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 border-y border-dark-800 bg-dark-900/50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <!-- Free Shipping -->
          <div class="flex items-start space-x-4 p-4 rounded-xl hover:bg-dark-800 transition-colors">
            <div class="flex-shrink-0">
              <span class="material-icons text-4xl text-primary-500">local_shipping</span>
            </div>
            <div>
              <h3 class="text-white font-bold mb-1">Free Shipping</h3>
              <p class="text-gray-400 text-sm">On all orders over ₹500</p>
            </div>
          </div>

          <!-- Secure Payment -->
          <div class="flex items-start space-x-4 p-4 rounded-xl hover:bg-dark-800 transition-colors">
            <div class="flex-shrink-0">
              <span class="material-icons text-4xl text-primary-500">security</span>
            </div>
            <div>
              <h3 class="text-white font-bold mb-1">Secure Payment</h3>
              <p class="text-gray-400 text-sm">100% secure payment</p>
            </div>
          </div>

          <!-- 24/7 Support -->
          <div class="flex items-start space-x-4 p-4 rounded-xl hover:bg-dark-800 transition-colors">
            <div class="flex-shrink-0">
              <span class="material-icons text-4xl text-primary-500">headset_mic</span>
            </div>
            <div>
              <h3 class="text-white font-bold mb-1">24/7 Support</h3>
              <p class="text-gray-400 text-sm">Dedicated support</p>
            </div>
          </div>

          <!-- Returns -->
          <div class="flex items-start space-x-4 p-4 rounded-xl hover:bg-dark-800 transition-colors">
            <div class="flex-shrink-0">
              <span class="material-icons text-4xl text-primary-500">cached</span>
            </div>
            <div>
              <h3 class="text-white font-bold mb-1">30 Day Returns</h3>
              <p class="text-gray-400 text-sm">Money back guarantee</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: []
})
export class BenefitsComponent { }
