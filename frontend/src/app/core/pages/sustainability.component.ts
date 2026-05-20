import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-sustainability',
  standalone: true,
  imports: [CommonModule, ScrollAnimationDirective],
  template: `
    <div class="min-h-screen pb-20 bg-dark-950 relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      <!-- Hero Header Section -->
      <div class="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 text-center" appScrollAnimation animation="none">
        <span class="text-emerald-400 font-bold tracking-[0.3em] uppercase text-xs mb-6 inline-block animate-fade-in bg-emerald-900/20 px-4 py-1.5 rounded-full border border-emerald-500/20">Our Commitment</span>
        <h1 class="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight leading-tight relative" style="perspective: 1200px;">
           <div style="transform-style: preserve-3d;">
               <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white" style="animation-fill-mode: both;">
                   Ethical &
               </span>
           </div>
           <div class="mt-2" style="transform-style: preserve-3d;">
               <span appScrollAnimation animation="cinematic-3d" [delay]="400" class="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-600" style="animation-fill-mode: both;">
                   Sustainable
               </span>
           </div>
        </h1>
        <p appScrollAnimation animation="ethereal-sweep" [delay]="800" class="text-lg text-gray-400 font-light leading-relaxed max-w-2xl mx-auto" style="animation-fill-mode: both;">
          Luxury shouldn't come at the cost of the Earth. Learn how CartifyX is engineering fashion for a responsible future.
        </p>
      </div>
      
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div class="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-500">
             <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <span class="material-icons text-8xl text-emerald-400">eco</span>
             </div>
             <h3 class="text-2xl font-bold text-white mb-4 relative z-10">Organic Materials</h3>
             <p class="text-gray-400 font-light leading-relaxed relative z-10">100% of our cotton is organically farmed without the use of toxic pesticides or synthetic fertilizers, ensuring healthier soils and safer farming communities.</p>
          </div>

          <div class="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-500">
             <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <span class="material-icons text-8xl text-emerald-400">recycling</span>
             </div>
             <h3 class="text-2xl font-bold text-white mb-4 relative z-10">Circular Packaging</h3>
             <p class="text-gray-400 font-light leading-relaxed relative z-10">Every CartifyX order arrives in our signature minimalist packaging made entirely from 100% post-consumer recycled cardboard and biodegradable inks.</p>
          </div>
        </div>

        <div class="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center">
           <h2 class="text-3xl font-bold text-white mb-6">Carbon Neutral by 2028.</h2>
           <p class="text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto mb-10">We are aggressively reducing our supply chain emissions and investing in verified carbon offsets to eliminate our footprint.</p>
           
           <div class="w-full bg-dark-800 rounded-full h-4 mb-4">
             <div class="bg-gradient-to-r from-emerald-600 to-emerald-400 h-4 rounded-full" style="width: 75%"></div>
           </div>
           <p class="text-sm font-bold text-emerald-400 uppercase tracking-widest">75% Goal Reached</p>
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class SustainabilityComponent { }
