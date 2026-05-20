import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [CommonModule, ScrollAnimationDirective],
  template: `
    <div class="min-h-screen pb-20 bg-dark-950 relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      <!-- Hero Header Section -->
      <div class="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 text-center" appScrollAnimation animation="none">
        <span class="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs mb-6 inline-block animate-fade-in bg-primary-900/20 px-4 py-1.5 rounded-full border border-primary-500/20">Logistics</span>
        <h1 class="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight leading-tight relative" style="perspective: 1200px;">
           <div style="transform-style: preserve-3d;">
               <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white" style="animation-fill-mode: both;">
                   Shipping &
               </span>
           </div>
           <div class="mt-2" style="transform-style: preserve-3d;">
               <span appScrollAnimation animation="cinematic-3d" [delay]="400" class="inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500" style="animation-fill-mode: both;">
                   Returns
               </span>
           </div>
        </h1>
        <p appScrollAnimation animation="ethereal-sweep" [delay]="800" class="text-lg text-gray-400 font-light leading-relaxed max-w-2xl mx-auto" style="animation-fill-mode: both;">
          Fast, secure, and insured global delivery for all CartifyX collections.
        </p>
      </div>
      
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <div class="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden mb-8">
           <h2 class="text-2xl font-bold text-white mb-8 border-b border-white/5 pb-6">Delivery Times & Rates</h2>
           
           <div class="overflow-x-auto">
             <table class="w-full text-left border-collapse">
               <thead>
                 <tr>
                   <th class="py-4 px-6 border-b border-white/10 text-primary-400 font-bold uppercase tracking-widest text-[10px]">Method</th>
                   <th class="py-4 px-6 border-b border-white/10 text-primary-400 font-bold uppercase tracking-widest text-[10px]">Delivery Time</th>
                   <th class="py-4 px-6 border-b border-white/10 text-primary-400 font-bold uppercase tracking-widest text-[10px]">Cost</th>
                 </tr>
               </thead>
               <tbody class="text-gray-300 font-light">
                 <tr class="hover:bg-white/5 transition-colors">
                   <td class="py-4 px-6 border-b border-white/5 font-medium">Standard Ground</td>
                   <td class="py-4 px-6 border-b border-white/5">3-5 Business Days</td>
                   <td class="py-4 px-6 border-b border-white/5 font-bold text-white italic">Free over $150</td>
                 </tr>
                 <tr class="hover:bg-white/5 transition-colors">
                   <td class="py-4 px-6 border-b border-white/5 font-medium">Express Two-Day</td>
                   <td class="py-4 px-6 border-b border-white/5">2 Business Days</td>
                   <td class="py-4 px-6 border-b border-white/5">$15.00</td>
                 </tr>
                 <tr class="hover:bg-white/5 transition-colors">
                   <td class="py-4 px-6 border-b border-white/5 font-medium">Overnight Priority</td>
                   <td class="py-4 px-6 border-b border-white/5">Next Business Day</td>
                   <td class="py-4 px-6 border-b border-white/5">$35.00</td>
                 </tr>
                 <tr class="hover:bg-white/5 transition-colors">
                   <td class="py-4 px-6 font-medium">International Base</td>
                   <td class="py-4 px-6">7-14 Business Days</td>
                   <td class="py-4 px-6">Calculated at Checkout</td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>

        <div class="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
           <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/5 pb-6">Return Policy</h2>
           <p class="text-gray-400 font-light leading-relaxed mb-6">
             We gladly accept returns of unworn, unwashed, and undamaged merchandise with all original tags intact for a full refund within 30 days of the original purchase date.
           </p>
           <ul class="list-disc list-inside text-gray-400 font-light space-y-3 mb-8">
             <li>Final sale items cannot be returned or exchanged.</li>
             <li>Refunds will be credited to the original form of payment.</li>
             <li>Original shipping charges are non-refundable.</li>
           </ul>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ShippingComponent { }
