import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TypewriterComponent } from '../../shared/components/typewriter/typewriter.component';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, TypewriterComponent, ScrollAnimationDirective],
  template: `
    <div class="min-h-screen bg-dark-950 pt-24 pb-12 overflow-x-hidden">
      <!-- Hero Section -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative">
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        
        <div class="text-center max-w-4xl mx-auto relative z-10 animate-fade-in-up">
          <span class="inline-block py-1 px-3 rounded-full bg-primary-900/30 border border-primary-500/30 text-primary-400 text-sm font-medium mb-6 backdrop-blur-sm">
            Est. 2024
          </span>
          <h1 class="text-4xl md:text-6xl font-extrabold mb-8 relative z-10" style="perspective: 1200px;">
             <div style="transform-style: preserve-3d;">
                 <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white" style="animation-fill-mode: both;">
                   We are 
                 </span>
             </div>
             <div class="mt-2" style="transform-style: preserve-3d;">
                 <span appScrollAnimation animation="cinematic-3d" [delay]="400" class="inline-block" style="animation-fill-mode: both;">
                    <app-typewriter 
                      [phrases]="['CartifyX.', 'Quality.', 'Innovation.', 'Design.']" 
                      [typingSpeed]="100" 
                      [deletingSpeed]="50" 
                      [delayBeforeDelete]="2000"
                      class="text-yellow-400 inline-block"
                    ></app-typewriter>
                 </span>
             </div>
          </h1>
          <p appScrollAnimation animation="ethereal-sweep" [delay]="800" class="text-xl md:text-2xl text-gray-400 leading-relaxed mx-auto text-center" style="animation-fill-mode: both; text-align: center !important;">
            Redefining the digital shopping experience with a focus on quality, transparency, and design.
          </p>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="border-y border-dark-800 bg-dark-900/30 backdrop-blur-sm mb-24 relative z-10">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-dark-800/50">
            <div class="space-y-2 group">
              <div class="text-4xl font-bold text-white group-hover:text-primary-400 transition-colors duration-300">10k+</div>
              <div class="text-gray-500 text-sm font-medium uppercase tracking-wider">Happy Customers</div>
            </div>
            <div class="space-y-2 group">
              <div class="text-4xl font-bold text-white group-hover:text-primary-400 transition-colors duration-300">500+</div>
              <div class="text-gray-500 text-sm font-medium uppercase tracking-wider">Products</div>
            </div>
            <div class="space-y-2 group">
              <div class="text-4xl font-bold text-white group-hover:text-primary-400 transition-colors duration-300">50+</div>
              <div class="text-gray-500 text-sm font-medium uppercase tracking-wider">Brands</div>
            </div>
            <div class="space-y-2 group">
              <div class="text-4xl font-bold text-white group-hover:text-primary-400 transition-colors duration-300">24/7</div>
              <div class="text-gray-500 text-sm font-medium uppercase tracking-wider">Support</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Story & Mission -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="relative group animate-fade-in-left">
            <div class="absolute -inset-2 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div class="relative rounded-xl overflow-hidden aspect-[4/3] border border-dark-800 bg-dark-900">
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80" 
                alt="Our Meeting" 
                class="object-cover w-full h-full opacity-80 group-hover:opacity-100 scale-100 group-hover:scale-105 transition-all duration-700"
              >
            </div>
            <!-- Floating Card -->
            <div class="absolute -bottom-6 -right-6 bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-2xl hidden md:block transform transition-transform duration-500 hover:-translate-y-2 hover:shadow-primary-900/20">
              <p class="text-primary-400 font-bold text-lg mb-1">Our Mission</p>
              <p class="text-white text-sm">To make premium quality<br>accessible to everyone.</p>
            </div>
          </div>

          <div class="space-y-8 animate-fade-in-right">
            <h2 class="text-3xl font-bold text-white">Driven by Innovation</h2>
            <p class="text-gray-400 text-lg leading-relaxed">
              CartifyX started as a small idea in a garage (cliché, we know, but true). We looked at the e-commerce landscape and saw a lot of noise. We wanted to build a signal.
            </p>
            <p class="text-gray-400 text-lg leading-relaxed">
              Our team consists of designers, developers, and product enthusiasts who obsess over details. From the smoothness of our checkout process to the stitching on our clothing, nothing is overlooked.
            </p>
            
            <div class="flex flex-wrap gap-4 pt-4">
               <div class="flex items-center space-x-2 text-white bg-dark-900/50 px-4 py-2 rounded-lg border border-dark-700 hover:border-primary-500/50 transition-colors cursor-default">
                 <span class="material-icons text-primary-500 text-sm">check_circle</span>
                 <span>Quality First</span>
               </div>
               <div class="flex items-center space-x-2 text-white bg-dark-900/50 px-4 py-2 rounded-lg border border-dark-700 hover:border-primary-500/50 transition-colors cursor-default">
                 <span class="material-icons text-primary-500 text-sm">check_circle</span>
                 <span>Customer Obsessed</span>
               </div>
               <div class="flex items-center space-x-2 text-white bg-dark-900/50 px-4 py-2 rounded-lg border border-dark-700 hover:border-primary-500/50 transition-colors cursor-default">
                 <span class="material-icons text-primary-500 text-sm">check_circle</span>
                 <span>Global Vision</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Our Journey Timeline -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div class="text-center mb-16 animate-fade-in-up">
            <h2 class="text-3xl font-bold text-white mb-4">Our Journey</h2>
            <p class="text-gray-400 max-w-2xl mx-auto">From humble beginnings to a global community.</p>
        </div>

        <div class="relative max-w-4xl mx-auto">
            <!-- Vertical Line -->
            <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-dark-700"></div>

            <!-- Item 1 -->
            <div class="relative mb-12 group">
                <div class="flex items-center justify-between w-full">
                    <div class="w-5/12 text-right pr-8 animate-fade-in-left">
                        <div class="p-6 bg-dark-900/50 rounded-2xl border border-dark-800 hover:border-primary-500/50 hover:bg-dark-800/80 transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer">
                            <h3 class="text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">Founded</h3>
                            <p class="text-primary-500 font-medium mb-2">January 2024</p>
                            <p class="text-gray-400 text-sm mb-4">Started in a small garage with a big vision to redefine online shopping.</p>
                            <a href="#" class="inline-flex items-center text-primary-400 text-sm font-bold hover:text-primary-300">
                                Read our story <span class="material-icons text-sm ml-1">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                    <div class="absolute left-1/2 transform -translate-x-1/2 -ml-[1px] w-4 h-4 rounded-full bg-primary-500 border-4 border-dark-950 shadow-[0_0_0_4px_rgba(245,158,11,0.2)] group-hover:scale-125 transition-transform duration-300"></div>
                    <div class="w-5/12 pl-8"></div>
                </div>
            </div>

            <!-- Item 2 -->
            <div class="relative mb-12 group">
                <div class="flex items-center justify-between w-full flex-row-reverse">
                    <div class="w-5/12 text-left pl-8 animate-fade-in-right">
                         <div class="p-6 bg-dark-900/50 rounded-2xl border border-dark-800 hover:border-primary-500/50 hover:bg-dark-800/80 transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer">
                            <h3 class="text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">First 1000 Customers</h3>
                            <p class="text-primary-500 font-medium mb-2">March 2024</p>
                            <p class="text-gray-400 text-sm mb-4">Reached our first major milestone, validating our product market fit.</p>
                             <a href="#" class="inline-flex items-center text-primary-400 text-sm font-bold hover:text-primary-300">
                                See reviews <span class="material-icons text-sm ml-1">star</span>
                            </a>
                        </div>
                    </div>
                    <div class="absolute left-1/2 transform -translate-x-1/2 -ml-[1px] w-4 h-4 rounded-full bg-dark-700 border-4 border-dark-950 group-hover:bg-primary-500 group-hover:scale-125 transition-all duration-300"></div>
                    <div class="w-5/12 pr-8"></div>
                </div>
            </div>

            <!-- Item 3 -->
            <div class="relative mb-12 group">
                <div class="flex items-center justify-between w-full">
                    <div class="w-5/12 text-right pr-8 animate-fade-in-left">
                        <div class="p-6 bg-dark-900/50 rounded-2xl border border-dark-800 hover:border-primary-500/50 hover:bg-dark-800/80 transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer">
                            <h3 class="text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">Global Expansion</h3>
                            <p class="text-primary-500 font-medium mb-2">June 2024</p>
                            <p class="text-gray-400 text-sm mb-4">Launched shipping to over 50 countries worldwide.</p>
                             <a href="#" class="inline-flex items-center text-primary-400 text-sm font-bold hover:text-primary-300">
                                View regions <span class="material-icons text-sm ml-1">public</span>
                            </a>
                        </div>
                    </div>
                    <div class="absolute left-1/2 transform -translate-x-1/2 -ml-[1px] w-4 h-4 rounded-full bg-dark-700 border-4 border-dark-950 group-hover:bg-primary-500 group-hover:scale-125 transition-all duration-300"></div>
                    <div class="w-5/12 pl-8"></div>
                </div>
            </div>
             <!-- Item 4 -->
            <div class="relative group">
                <div class="flex items-center justify-between w-full flex-row-reverse">
                    <div class="w-5/12 text-left pl-8 animate-fade-in-right">
                        <div class="p-6 bg-dark-900/50 rounded-2xl border border-green-900/50 hover:border-green-500 hover:bg-dark-800/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-green-900/20 cursor-pointer">
                            <h3 class="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">Sustainable Initiative</h3>
                            <p class="text-green-500 font-medium mb-2">October 2024</p>
                            <p class="text-gray-400 text-sm mb-4">Committed to 100% eco-friendly packaging and carbon neutral shipping.</p>
                             <button class="w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold text-sm transition-colors shadow-lg shadow-green-900/40">
                                Shop Eco-Friendly
                            </button>
                        </div>
                    </div>
                    <div class="absolute left-1/2 transform -translate-x-1/2 -ml-[1px] w-4 h-4 rounded-full bg-green-600 border-4 border-dark-950 shadow-[0_0_0_4px_rgba(22,163,74,0.2)] group-hover:scale-125 transition-transform duration-300"></div>
                    <div class="w-5/12 pr-8"></div>
                </div>
            </div>
        </div>
      </div>

      <!-- Meet the Team -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-3xl font-bold text-white mb-4">Meet the Visionaries</h2>
          <p class="text-gray-400 max-w-2xl mx-auto">The people working behind the scenes to bring you the best products.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Team Member 1 -->
          <div class="group relative bg-dark-900 rounded-xl p-4 border border-dark-800 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-900/10 transition-all duration-300">
            <div class="aspect-[3/4] rounded-xl overflow-hidden bg-dark-800 mb-4 relative">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" alt="CEO" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100">
              <div class="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <div class="flex space-x-3">
                      <a href="#" class="text-white hover:text-primary-400 transition-colors"><i class="fab fa-linkedin"></i></a> <!-- Assuming fontawesome or similar icons, using text for now if not -->
                      <span class="text-white text-xs bg-primary-600 px-2 py-0.5 rounded">LinkedIn</span>
                  </div>
              </div>
            </div>
            <h3 class="text-white font-bold text-lg">Alex Morgan</h3>
            <p class="text-primary-400 text-sm">Founder & CEO</p>
          </div>

          <!-- Team Member 2 -->
          <div class="group relative bg-dark-900 rounded-2xl p-4 border border-dark-800 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-900/10 transition-all duration-300">
            <div class="aspect-[3/4] rounded-xl overflow-hidden bg-dark-800 mb-4 relative">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" alt="CTO" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100">
               <div class="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                   <span class="text-white text-xs bg-primary-600 px-2 py-0.5 rounded">Twitter</span>
              </div>
            </div>
            <h3 class="text-white font-bold text-lg">Sarah Chen</h3>
            <p class="text-primary-400 text-sm">Head of Design</p>
          </div>

          <!-- Team Member 3 -->
          <div class="group relative bg-dark-900 rounded-2xl p-4 border border-dark-800 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-900/10 transition-all duration-300">
            <div class="aspect-[3/4] rounded-xl overflow-hidden bg-dark-800 mb-4 relative">
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" alt="COO" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100">
               <div class="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span class="text-white text-xs bg-primary-600 px-2 py-0.5 rounded">LinkedIn</span>
              </div>
            </div>
            <h3 class="text-white font-bold text-lg">Marcus Johnson</h3>
            <p class="text-primary-400 text-sm">Operations Director</p>
          </div>

          <!-- Team Member 4 -->
          <div class="group relative bg-dark-900 rounded-2xl p-4 border border-dark-800 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-900/10 transition-all duration-300">
            <div class="aspect-[3/4] rounded-xl overflow-hidden bg-dark-800 mb-4 relative">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" alt="CMO" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100">
               <div class="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span class="text-white text-xs bg-primary-600 px-2 py-0.5 rounded">Instagram</span>
              </div>
            </div>
            <h3 class="text-white font-bold text-lg">Emily Davis</h3>
            <p class="text-primary-400 text-sm">Marketing Lead</p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div class="relative rounded-3xl overflow-hidden py-24 px-8 text-center border border-dark-800 group transition-all duration-500 hover:border-primary-500/30">
          <!-- Background Image & Overlay -->
          <div class="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80" 
              alt="Background" 
              class="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700 scale-100 group-hover:scale-105"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900/90 to-dark-900/80"></div>
          </div>
          
          <div class="relative z-10 max-w-3xl mx-auto space-y-8 animate-fade-in-up">
            <h2 class="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Ready to Upgrade Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Lifestyle?</span>
            </h2>
            <p class="text-gray-300 text-xl leading-relaxed">
              Join thousands of satisfied customers who have improved their daily lives with CartifyX's premium selection.
            </p>
            
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a routerLink="/products" class="group/btn relative inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-primary-900/20 px-8">
                <span>Start Shopping</span>
                <span class="material-icons group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                <div class="absolute inset-0 rounded-full ring-4 ring-primary-500/30 group-hover/btn:ring-primary-400/50 animate-pulse"></div>
              </a>
              
              <a routerLink="/contact" class="inline-flex items-center space-x-2 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300">
                <span>Contact Sales</span>
              </a>
            </div>
            
            <p class="text-sm text-gray-500 pt-8">
              No credit card required for browsing • Free shipping on orders over ₹500
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent { }
