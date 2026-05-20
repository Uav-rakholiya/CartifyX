import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-lookbook',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollAnimationDirective],
  template: `
    <div class="min-h-screen pb-20 bg-dark-950 relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <!-- Hero Header Section -->
      <div class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 text-center mb-10">
        <span class="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs mb-6 inline-block animate-fade-in bg-primary-900/20 px-4 py-1.5 rounded-full border border-primary-500/20">Winter 2026 Collection</span>
        
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight uppercase relative z-10" style="perspective: 1200px;">
          <div style="transform-style: preserve-3d;">
             <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white tracking-wider" style="animation-fill-mode: both;">
                The 
             </span>
          </div>
          <div class="mt-2" style="transform-style: preserve-3d;">
             <span appScrollAnimation animation="cinematic-3d" [delay]="400" class="inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500" style="animation-fill-mode: both;">
                Lookbook
             </span>
          </div>
        </h1>
        
        <p appScrollAnimation animation="ethereal-sweep" [delay]="800" class="text-lg sm:text-xl font-light leading-relaxed max-w-2xl mx-auto" style="animation-fill-mode: both;">
          Explore our latest collection of premium streetwear, designed for the modern aesthetic and engineered for comfort.
        </p>
      </div>
      
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[90rem] relative z-10">
        <!-- Masonry-style Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          
          <!-- Image 1: Large -->
          <div class="lg:col-span-2 lg:row-span-2 relative group rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80" alt="Lookbook 1" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80"></div>
            <div class="absolute bottom-10 left-10">
              <span class="text-primary-400 font-bold uppercase tracking-widest text-[10px] mb-2 block">Look 01</span>
              <h3 class="text-3xl font-bold text-white mb-4">Midnight Essentials</h3>
              <a routerLink="/products" class="inline-flex items-center text-white font-medium uppercase tracking-widest text-xs hover:text-primary-400 transition-colors">
                Shop The Look <span class="material-icons text-sm ml-2">arrow_forward</span>
              </a>
            </div>
          </div>

          <!-- Image 2: Standard -->
          <div class="relative group rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" alt="Lookbook 2" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
          </div>

          <!-- Image 3: Standard -->
          <div class="relative group rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80" alt="Lookbook 3" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
          </div>

          <!-- Image 4: Tall -->
          <div class="lg:row-span-2 relative group rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            <img src="https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&q=80" alt="Lookbook 4" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80"></div>
            <div class="absolute bottom-10 left-10">
              <span class="text-primary-400 font-bold uppercase tracking-widest text-[10px] mb-2 block">Look 02</span>
              <h3 class="text-2xl font-bold text-white mb-4">Urban Layers</h3>
              <a routerLink="/products" class="inline-flex items-center text-white font-medium uppercase tracking-widest text-xs hover:text-primary-400 transition-colors">
                Shop The Look <span class="material-icons text-sm ml-2">arrow_forward</span>
              </a>
            </div>
          </div>

          <!-- Image 5: Wide -->
          <div class="lg:col-span-2 relative group rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80" alt="Lookbook 5" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80"></div>
             <div class="absolute bottom-10 left-10">
              <span class="text-primary-400 font-bold uppercase tracking-widest text-[10px] mb-2 block">Look 03</span>
              <h3 class="text-2xl font-bold text-white mb-4">The Classic Silhouette</h3>
              <a routerLink="/products" class="inline-flex items-center text-white font-medium uppercase tracking-widest text-xs hover:text-primary-400 transition-colors">
                Shop The Look <span class="material-icons text-sm ml-2">arrow_forward</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  `,
  styles: []
})
export class LookbookComponent { }
