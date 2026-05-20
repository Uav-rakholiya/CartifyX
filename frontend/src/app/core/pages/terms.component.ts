import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, ScrollAnimationDirective],
  template: `
    <div class="min-h-screen pb-20 bg-dark-950 relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-primary-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      <!-- Hero Header Section -->
      <div class="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 text-center" appScrollAnimation animation="none">
        <span class="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs mb-6 inline-block animate-fade-in bg-primary-900/20 px-4 py-1.5 rounded-full border border-primary-500/20">Legal Information</span>
        <h1 class="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight leading-tight relative" style="perspective: 1200px;">
           <div style="transform-style: preserve-3d;">
               <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white" style="animation-fill-mode: both;">
                   Terms &
               </span>
           </div>
           <div class="mt-2" style="transform-style: preserve-3d;">
               <span appScrollAnimation animation="cinematic-3d" [delay]="400" class="inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500" style="animation-fill-mode: both;">
                   Conditions
               </span>
           </div>
        </h1>
        <p appScrollAnimation animation="ethereal-sweep" [delay]="800" class="text-sm text-gray-500 font-bold uppercase tracking-widest bg-dark-900 border border-dark-800 inline-block px-6 py-2 rounded-full" style="animation-fill-mode: both;">
          Effective Date: January 1, 2026
        </p>
      </div>
      
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <div class="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
           
           <!-- Decorative top border -->
           <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>

           <div class="prose prose-invert max-w-none text-gray-400 font-light leading-relaxed">
             <p class="text-lg mb-10 text-gray-300">Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the CartifyX platform operated by CartifyX Luxury Apparel.</p>
             
             <div class="space-y-12">
               <div>
                 <h2 class="text-2xl font-bold text-white flex items-center mb-6">
                   <span class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/30 text-primary-400 text-sm mr-4 border border-primary-500/20">01</span>
                   Account Protocol
                 </h2>
                 <p class="pl-12">When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
               </div>
               
               <div class="border-t border-white/5 pt-12">
                 <h2 class="text-2xl font-bold text-white flex items-center mb-6">
                   <span class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/30 text-primary-400 text-sm mr-4 border border-primary-500/20">02</span>
                   Purchases & Logistics
                 </h2>
                 <p class="pl-12">If you wish to purchase any product made available through the platform ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, expiration date, billing address, and shipping information.</p>
               </div>
               
               <div class="border-t border-white/5 pt-12">
                 <h2 class="text-2xl font-bold text-white flex items-center mb-6">
                   <span class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/30 text-primary-400 text-sm mr-4 border border-primary-500/20">03</span>
                   Content & Reviews
                 </h2>
                 <p class="pl-12">Our website allows you to securely post product reviews and feedback. You are strictly responsible for the legality and reliability of any content you post. Abusive language, hate speech, or manipulation will result in an immediate hardware ban from the CartifyX ecosystem.</p>
               </div>
               
               <div class="border-t border-white/5 pt-12">
                 <h2 class="text-2xl font-bold text-white flex items-center mb-6">
                   <span class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/30 text-primary-400 text-sm mr-4 border border-primary-500/20">04</span>
                   Intellectual Property
                 </h2>
                 <p class="pl-12">The platform and its original content (including all photography, videos, and UI elements), features, and functionality are and will remain the exclusive property of CartifyX Luxury Apparel and its licensors. The Service is fully protected by copyright and trademark laws.</p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TermsComponent { }
