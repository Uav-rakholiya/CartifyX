import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, ScrollAnimationDirective],
  template: `
    <div class="min-h-screen pb-20 bg-dark-950 relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      <!-- Hero Header Section -->
      <div class="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 text-center" appScrollAnimation animation="none">
        <span class="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs mb-6 inline-block animate-fade-in bg-primary-900/20 px-4 py-1.5 rounded-full border border-primary-500/20">Legal Information</span>
        <h1 class="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight leading-tight relative" style="perspective: 1200px;">
           <div style="transform-style: preserve-3d;">
               <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white" style="animation-fill-mode: both;">
                   Privacy
               </span>
           </div>
           <div class="mt-2" style="transform-style: preserve-3d;">
               <span appScrollAnimation animation="cinematic-3d" [delay]="400" class="inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500" style="animation-fill-mode: both;">
                   Policy
               </span>
           </div>
        </h1>
        <p appScrollAnimation animation="ethereal-sweep" [delay]="800" class="text-sm text-gray-500 font-bold uppercase tracking-widest bg-dark-900 border border-dark-800 inline-block px-6 py-2 rounded-full" style="animation-fill-mode: both;">
          Last Updated: January 1, 2026
        </p>
      </div>
      
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <div class="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
           
           <!-- Decorative top border -->
           <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>

           <div class="prose prose-invert max-w-none text-gray-400 font-light leading-relaxed">
             <p class="text-lg mb-10 text-gray-300">At CartifyX, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our premium digital platforms.</p>
             
             <div class="space-y-12">
               <div>
                 <h2 class="text-2xl font-bold text-white flex items-center mb-6">
                   <span class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/30 text-primary-400 text-sm mr-4 border border-primary-500/20">01</span>
                   Information We Collect
                 </h2>
                 <p class="pl-12">We collect information that you provide directly to us, including your name, email address, shipping address, and payment details when you create an account, place an order, or subscribe to our exclusive newsletter.</p>
               </div>
               
               <div class="border-t border-white/5 pt-12">
                 <h2 class="text-2xl font-bold text-white flex items-center mb-6">
                   <span class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/30 text-primary-400 text-sm mr-4 border border-primary-500/20">02</span>
                   How We Use Your Information
                 </h2>
                 <p class="pl-12">Your data securely allows us to process orders, communicate shipping updates, provide 24/7 customer support, and improve our high-end platform. <strong>We strictly never sell your personal data to third parties.</strong></p>
               </div>
               
               <div class="border-t border-white/5 pt-12">
                 <h2 class="text-2xl font-bold text-white flex items-center mb-6">
                   <span class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/30 text-primary-400 text-sm mr-4 border border-primary-500/20">03</span>
                   Security Architecture
                 </h2>
                 <p class="pl-12">We implement strict security measures, including modern AES encryption and secure server hosting, to maintain the absolute safety of your personal footprint. Database tokens and passwords are cryptographically hashed and never stored in plain text.</p>
               </div>
               
               <div class="border-t border-white/5 pt-12">
                 <h2 class="text-2xl font-bold text-white flex items-center mb-6">
                   <span class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/30 text-primary-400 text-sm mr-4 border border-primary-500/20">04</span>
                   Cookies & Tracking
                 </h2>
                 <p class="pl-12">We use essential cookies to enhance your browsing experience, maintain your secure cart session, and analyze our website traffic to optimize load times. You can choose to disable non-essential cookies through your browser settings.</p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PrivacyComponent { }
