import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-category-grid',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollAnimationDirective],
  template: `
    <section class="py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-white mb-8" appScrollAnimation animation="fade-in-left">Shop by Category</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <!-- Electronics -->
          <a routerLink="/products" [queryParams]="{category: 'electronics'}" 
             appScrollAnimation animation="fade-in-up" [delay]="0"
             class="group relative rounded-xl overflow-hidden aspect-[4/5] bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all cursor-pointer">
            <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&q=80" alt="Electronics" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-90"></div>
            <div class="absolute bottom-0 left-0 w-full p-4">
              <span class="block text-white font-medium text-sm group-hover:text-primary-400 transition-colors">Electronics</span>
            </div>
          </a>

          <!-- Fashion -->
          <a routerLink="/products" [queryParams]="{category: 'fashion'}" 
             appScrollAnimation animation="fade-in-up" [delay]="100"
             class="group relative rounded-xl overflow-hidden aspect-[4/5] bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all cursor-pointer">
            <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80" alt="Fashion" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-90"></div>
            <div class="absolute bottom-0 left-0 w-full p-4">
              <span class="block text-white font-medium text-sm group-hover:text-primary-400 transition-colors">Fashion</span>
            </div>
          </a>

          <!-- Home & Living -->
          <a routerLink="/products" [queryParams]="{category: 'home'}" 
             appScrollAnimation animation="fade-in-up" [delay]="200"
             class="group relative rounded-xl overflow-hidden aspect-[4/5] bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all cursor-pointer">
            <img src="https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=80" alt="Home" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-90"></div>
            <div class="absolute bottom-0 left-0 w-full p-4">
              <span class="block text-white font-medium text-sm group-hover:text-primary-400 transition-colors">Home & Living</span>
            </div>
          </a>

          <!-- Accessories -->
          <a routerLink="/products" [queryParams]="{category: 'accessories'}" 
             appScrollAnimation animation="fade-in-up" [delay]="300"
             class="group relative rounded-xl overflow-hidden aspect-[4/5] bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all cursor-pointer">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" alt="Accessories" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-90"></div>
            <div class="absolute bottom-0 left-0 w-full p-4">
              <span class="block text-white font-medium text-sm group-hover:text-primary-400 transition-colors">Accessories</span>
            </div>
          </a>

          <!-- Sports -->
          <a routerLink="/products" [queryParams]="{category: 'sports'}" 
             appScrollAnimation animation="fade-in-up" [delay]="400"
             class="group relative rounded-xl overflow-hidden aspect-[4/5] bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all cursor-pointer">
            <img src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80" alt="Sports" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-90"></div>
            <div class="absolute bottom-0 left-0 w-full p-4">
              <span class="block text-white font-medium text-sm group-hover:text-primary-400 transition-colors">Sports</span>
            </div>
          </a>

          <!-- Beauty -->
          <a routerLink="/products" [queryParams]="{category: 'beauty'}" 
             appScrollAnimation animation="fade-in-up" [delay]="500"
             class="group relative rounded-xl overflow-hidden aspect-[4/5] bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all cursor-pointer">
            <img src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&q=80" alt="Beauty" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-90"></div>
            <div class="absolute bottom-0 left-0 w-full p-4">
              <span class="block text-white font-medium text-sm group-hover:text-primary-400 transition-colors">Beauty</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class CategoryGridComponent { }
