import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TypewriterComponent } from '../../shared/components/typewriter/typewriter.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, TypewriterComponent, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative bg-dark-900 overflow-hidden rounded-xl mx-4 mt-8 sm:mx-6 lg:mx-8 border border-dark-800 shadow-2xl">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img ngSrc="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=1600&q=80" 
             alt="Neon Glow Banner" 
             priority
             fill
             class="object-cover opacity-80">
        <div class="absolute inset-0 bg-gradient-to-r from-dark-950/95 via-dark-950/80 to-transparent"></div>
      </div>

      <!-- Content -->
      <div class="relative px-8 py-20 sm:px-16 sm:py-32 lg:py-40 flex flex-col justify-center max-w-3xl">
        <div class="overflow-hidden mb-6">
            <span class="text-primary-400 font-bold tracking-[0.2em] uppercase text-xs inline-block animate-premium-slide-right border-l-4 border-primary-500 pl-4" style="animation-fill-mode: both;">
              New Collection 2026
            </span>
        </div>
        
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight relative z-10" style="perspective: 1200px;">
          <div style="transform-style: preserve-3d;">
             <span class="inline-block animate-cinematic-3d text-white uppercase tracking-wider" style="animation-delay: 200ms; animation-fill-mode: both;">Premium Style</span>
          </div>
          <div class="mt-2" style="transform-style: preserve-3d;">
             <span class="inline-block animate-cinematic-3d" style="animation-delay: 600ms; animation-fill-mode: both;">
                <app-typewriter 
                  [phrases]="['Everyday Comfort', 'Modern Tech', 'Elite Fashion', 'Home Decor']"
                  [typingSpeed]="80"
                  [deletingSpeed]="40"
                  class="text-amber-500"
                ></app-typewriter>
             </span>
          </div>
        </h1>
        
        <p class="text-xl mb-12 max-w-lg leading-relaxed font-light animate-ethereal-sweep" style="animation-delay: 1100ms; animation-fill-mode: both;">
          Discover our curated selection of premium electronics, fashion, and accessories designed for your modern lifestyle.
        </p>
        
        <div class="flex flex-wrap gap-6 animate-premium-fade-up" style="animation-delay: 1100ms; animation-fill-mode: both;">
          <a routerLink="/products" class="btn-primary inline-flex items-center px-8 py-4 text-base font-bold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-transform hover:-translate-y-1">
            Shop Now
            <span class="material-icons ml-2">arrow_forward</span>
          </a>
          <a href="#featured" class="px-8 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all uppercase tracking-wide text-sm flex items-center hover:-translate-y-1">
            View Collections
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes cinematic3DUnfold {
      0% {
        transform: rotateX(-85deg) translateY(100px) scale(0.8);
        opacity: 0;
        letter-spacing: 0.5em;
        filter: blur(20px);
      }
      40% {
        opacity: 1;
      }
      70% {
        transform: rotateX(15deg) translateY(-10px) scale(1.02);
        letter-spacing: -0.02em;
        filter: blur(0px);
      }
      100% {
        transform: rotateX(0deg) translateY(0) scale(1);
        opacity: 1;
        letter-spacing: normal;
        filter: blur(0);
      }
    }

    @keyframes etherealSweep {
      0% {
        background-position: 200% center;
        opacity: 0;
        transform: translateY(20px);
      }
      20% {
        opacity: 1;
      }
      100% {
        background-position: -200% center;
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes premiumSlideRight {
      0% { transform: translateX(-50px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }

    .animate-cinematic-3d {
      animation: cinematic3DUnfold 2.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
      transform-origin: bottom center;
    }

    .animate-ethereal-sweep {
      background: linear-gradient(90deg, rgba(200,200,200,0.3) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,1) 60%, rgba(200,200,200,0.3) 100%);
      background-size: 200% auto;
      color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
      animation: etherealSweep 3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    }

    .animate-premium-slide-right {
      animation: premiumSlideRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    /* Fade up for buttons so they don't use the old classes */
    @keyframes premiumFadeUp {
      0% { transform: translateY(30px); opacity: 0; filter: blur(5px); }
      100% { transform: translateY(0); opacity: 1; filter: blur(0); }
    }
    .animate-premium-fade-up {
      animation: premiumFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class HeroComponent { }
