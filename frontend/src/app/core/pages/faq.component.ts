import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollAnimationDirective],
  template: `
    <div class="min-h-screen pb-20 bg-dark-950 relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute top-0 right-0 w-[50%] h-[50%] bg-primary-900/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      
      <!-- Hero Header Section -->
      <div class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 text-center border-b border-dark-800/50 mb-16" appScrollAnimation animation="none">
        <span class="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs mb-6 inline-block animate-fade-in bg-primary-900/20 px-4 py-1.5 rounded-full border border-primary-500/20">Help Center</span>
        <h1 class="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight leading-tight relative" style="perspective: 1200px;">
           <div style="transform-style: preserve-3d;">
               <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white" style="animation-fill-mode: both;">
                   Frequently Asked
               </span>
           </div>
           <div class="mt-2" style="transform-style: preserve-3d;">
               <span appScrollAnimation animation="cinematic-3d" [delay]="400" class="inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500" style="animation-fill-mode: both;">
                   Questions
               </span>
           </div>
        </h1>
        <p appScrollAnimation animation="ethereal-sweep" [delay]="800" class="text-lg sm:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto" style="animation-fill-mode: both;">
          Everything you need to know about the CartifyX luxury experience, shipping, and returns.
        </p>
      </div>
      
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative z-10">
        <div class="space-y-4">
          <!-- FAQ Items Mapping -->
          <div *ngFor="let item of faqs; let i = index" 
               class="bg-dark-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10"
               [ngClass]="{'border-primary-500/30 shadow-[0_0_30px_rgba(var(--color-primary-500),0.05)] bg-dark-900': activeIndex() === i}">
            
            <button (click)="toggleAccordion(i)" class="w-full text-left px-8 py-6 flex items-center justify-between focus:outline-none group">
              <h3 class="text-lg font-bold text-gray-200 group-hover:text-primary-400 transition-colors" [class.text-white]="activeIndex() === i">
                {{ item.question }}
              </h3>
              <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 transition-all duration-300"
                   [ngClass]="{'bg-primary-500 border-primary-500 rotate-180': activeIndex() === i, 'group-hover:bg-white/10': activeIndex() !== i}">
                <span class="material-icons text-sm" [class.text-white]="activeIndex() === i" [class.text-gray-400]="activeIndex() !== i">expand_more</span>
              </div>
            </button>
            
            <div class="overflow-hidden transition-all duration-300 ease-in-out"
                 [style.maxHeight]="activeIndex() === i ? '500px' : '0px'"
                 [style.opacity]="activeIndex() === i ? '1' : '0'">
              <div class="px-8 pb-8 pt-0">
                <p class="text-gray-400 text-base leading-relaxed font-light border-t border-white/5 pt-6">
                  {{ item.answer }}
                </p>
              </div>
            </div>
            
          </div>
        </div>
        
        <!-- Contact CTA -->
        <div class="mt-16 text-center border border-white/5 bg-gradient-to-b from-white/5 to-transparent rounded-3xl p-10 backdrop-blur-md">
          <h3 class="text-2xl font-bold text-white mb-4">Still have questions?</h3>
          <p class="text-gray-400 mb-8 font-light">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          <a routerLink="/contact" class="inline-flex items-center px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-bold uppercase tracking-widest text-xs transition-colors shadow-[0_0_20px_rgba(var(--color-primary-500),0.3)]">
            Get in touch <span class="material-icons text-sm ml-2">chat_bubble_outline</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FaqComponent {
  activeIndex = signal<number | null>(0);

  faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We securely accept all major credit cards, PayPal, and integration with Razorpay for seamless domestic transactions. Your payment information is always encrypted using bank-level security.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days within the continental US. Express 2-day shipping is available at checkout for an additional fee. International shipping times vary by region.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day hassle-free return window for unworn and undamaged items with tags attached. Premium members enjoy free return shipping. Refunds are issued to the original payment method within 5-7 business days of processing.'
    },
    {
      question: 'Do you restock sold-out items?',
      answer: 'Our core collections are restocked regularly. However, special seasonal drops are limited edition and generally not reproduced. To get notified of restocks, please add the out-of-stock item to your Wishlist.'
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order ships, you will receive an email confirmation with a tracking number. You can also view the real-time status of your delivery by logging into your account and navigating to the Orders section.'
    }
  ];

  toggleAccordion(index: number) {
    this.activeIndex.set(this.activeIndex() === index ? null : index);
  }
}
