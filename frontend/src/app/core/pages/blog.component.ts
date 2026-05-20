import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollAnimationDirective],
  template: `
    <div class="min-h-screen pb-20 bg-dark-950 relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <!-- Hero Header Section -->
      <div class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 text-center border-b border-dark-800/50 mb-16" appScrollAnimation animation="none">
        <span class="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs mb-6 inline-block animate-fade-in bg-primary-900/20 px-4 py-1.5 rounded-full border border-primary-500/20">The Editorial</span>
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight relative" style="perspective: 1200px;">
           <div style="transform-style: preserve-3d;">
               <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white" style="animation-fill-mode: both;">
                   CartifyX 
               </span>
           </div>
           <div class="mt-2" style="transform-style: preserve-3d;">
               <span appScrollAnimation animation="cinematic-3d" [delay]="400" class="inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500" style="animation-fill-mode: both;">
                   Journal
               </span>
           </div>
        </h1>
        <div class="flex justify-center w-full">
          <p appScrollAnimation animation="ethereal-sweep" [delay]="800" class="text-lg sm:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center" style="animation-fill-mode: both;">
            Insights, style guides, and an inside look at the fashion industry's most premium collections.
          </p>
        </div>
      </div>
      
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <!-- Featured Main Article -->
        <div class="relative rounded-[2.5rem] overflow-hidden mb-16 group border border-white/5 shadow-2xl bg-dark-900">
           <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
             <div class="relative h-[300px] lg:h-auto overflow-hidden">
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80" alt="Featured Post" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/40 to-transparent lg:hidden"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent lg:hidden"></div>
             </div>
             <div class="p-10 lg:p-16 flex flex-col justify-center relative bg-gradient-to-l from-dark-900 via-dark-900 to-transparent">
                <div class="flex items-center text-xs text-primary-400 mb-6 space-x-4 uppercase font-bold tracking-widest">
                  <span>Oct 24, 2026</span>
                  <span class="w-1 h-1 rounded-full bg-primary-500"></span>
                  <span>5 Min Read</span>
                </div>
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.15] group-hover:text-gray-200 transition-colors">The Future of Minimalist Luxury Architecture.</h2>
                <p class="text-gray-400 text-lg leading-relaxed mb-10 font-light max-w-md">
                  We explore how premium streetwear is adopting the sharp edges and monochromatic palettes of modern architecture.
                </p>
                <div class="flex">
                  <a routerLink="/blog" class="inline-flex items-center px-8 py-3.5 border border-white/10 hover:border-primary-500 rounded-full text-white font-medium uppercase tracking-widest text-xs transition-all hover:bg-white/5">
                    Read Story
                  </a>
                </div>
             </div>
           </div>
        </div>

        <!-- Grid Articles -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div class="rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent hover:from-white/10 transition-all duration-500 overflow-hidden shadow-xl group">
            <div class="h-56 relative overflow-hidden p-3">
               <div class="w-full h-full rounded-2xl overflow-hidden relative">
                 <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" alt="Style Guide" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                 <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
               </div>
               <div class="absolute top-6 left-6 bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">Style Guide</div>
            </div>
            <div class="p-8">
              <h3 class="text-xl font-bold text-white mb-4 leading-tight group-hover:text-primary-400 transition-colors">5 Ways to Style the Classic Sweatshirt</h3>
              <p class="text-gray-400 text-sm leading-relaxed mb-8 font-light">
                Elevate your everyday comfort. We break down five distinct looks centered around everyone's favorite premium sweatshirt.
              </p>
              <div class="flex items-center justify-between border-t border-white/10 pt-6">
                 <span class="text-xs text-gray-500 uppercase font-semibold tracking-wider">Oct 18, 2026</span>
                 <a routerLink="/blog" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white group-hover:bg-primary-500 group-hover:border-primary-500 transition-all">
                   <span class="material-icons text-sm">arrow_forward</span>
                 </a>
              </div>
            </div>
          </div>

          <div class="rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent hover:from-white/10 transition-all duration-500 overflow-hidden shadow-xl group">
            <div class="h-56 relative overflow-hidden p-3">
               <div class="w-full h-full rounded-2xl overflow-hidden relative">
                 <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" alt="Accessories" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                 <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
               </div>
               <div class="absolute top-6 left-6 bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">Accessories</div>
            </div>
            <div class="p-8">
              <h3 class="text-xl font-bold text-white mb-4 leading-tight group-hover:text-primary-400 transition-colors">Choosing the Perfect Minimalist Watch</h3>
              <p class="text-gray-400 text-sm leading-relaxed mb-8 font-light">
                A watch does more than tell time; it defines your aesthetic. Learn what to look for when selecting your next luxury timepiece.
              </p>
              <div class="flex items-center justify-between border-t border-white/10 pt-6">
                 <span class="text-xs text-gray-500 uppercase font-semibold tracking-wider">Oct 10, 2026</span>
                 <a routerLink="/blog" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white group-hover:bg-primary-500 group-hover:border-primary-500 transition-all">
                   <span class="material-icons text-sm">arrow_forward</span>
                 </a>
              </div>
            </div>
          </div>

          <div class="rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent hover:from-white/10 transition-all duration-500 overflow-hidden shadow-xl group">
            <div class="h-56 relative overflow-hidden p-3">
               <div class="w-full h-full rounded-2xl overflow-hidden relative">
                 <img src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=600&q=80" alt="Lifestyle" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                 <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
               </div>
               <div class="absolute top-6 left-6 bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">Lifestyle</div>
            </div>
            <div class="p-8">
              <h3 class="text-xl font-bold text-white mb-4 leading-tight group-hover:text-primary-400 transition-colors">The Integration of Neon Aesthetics</h3>
              <p class="text-gray-400 text-sm leading-relaxed mb-8 font-light">
                How modern fashion is leaning heavily into cyberpunk undertones and neon colorways for the upcoming 2026 season.
              </p>
              <div class="flex items-center justify-between border-t border-white/10 pt-6">
                 <span class="text-xs text-gray-500 uppercase font-semibold tracking-wider">Sep 28, 2026</span>
                 <a routerLink="/blog" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white group-hover:bg-primary-500 group-hover:border-primary-500 transition-all">
                   <span class="material-icons text-sm">arrow_forward</span>
                 </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BlogComponent { }
