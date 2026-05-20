import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-black text-sans mt-auto relative overflow-hidden">
      
      <!-- Subtle Moving Gradient Background - Strictly Black/Gold -->
      <div class="absolute inset-0 pointer-events-none">
          <div class="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] animate-blob"></div>
          <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
          <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
      </div>

      <div class="border-t border-white/10 relative z-10 backdrop-blur-3xl bg-black/40">
        <div class="container mx-auto px-6 py-16">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
            
            <!-- Brand Column -->
            <div class="lg:col-span-4 space-y-8">
              <div class="flex items-center gap-3">
                 <!-- Logo Placeholder -->
                 <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-black font-bold text-xl shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                    C
                 </div>
                 <span class="text-2xl font-display font-bold text-white tracking-tight">Cartify<span class="text-yellow-400">X</span></span>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed max-w-sm font-medium">
                Experience the future of shopping. Curated collections, premium aesthetics, and seamless delivery designed for the modern visionary.
              </p>
              <div class="flex items-center gap-4">
                <a href="#" class="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all duration-300 group hover:scale-110 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                  <span class="material-icons text-lg">facebook</span>
                </a>
                <a href="#" class="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all duration-300 group hover:scale-110 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                  <span class="material-icons text-lg">camera_alt</span>
                </a>
                <a href="#" class="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all duration-300 group hover:scale-110 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                  <span class="material-icons text-lg">alternate_email</span>
                </a>
              </div>
            </div>

            <!-- Links Columns -->
            <div class="lg:col-span-2 space-y-6">
              <h4 class="text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span> Explore
              </h4>
              <ul class="space-y-4 text-sm font-medium text-gray-300">
                <li><a routerLink="/" class="hover:text-yellow-400 transition-colors flex items-center gap-2 group"><span class="h-px w-0 bg-yellow-400 group-hover:w-3 transition-all duration-300"></span>Home</a></li>
                <li><a routerLink="/products" class="hover:text-yellow-400 transition-colors flex items-center gap-2 group"><span class="h-px w-0 bg-yellow-400 group-hover:w-3 transition-all duration-300"></span>Collections</a></li>
                <li><a routerLink="/about" class="hover:text-yellow-400 transition-colors flex items-center gap-2 group"><span class="h-px w-0 bg-yellow-400 group-hover:w-3 transition-all duration-300"></span>Our Story</a></li>
                <li><a routerLink="/contact" class="hover:text-yellow-400 transition-colors flex items-center gap-2 group"><span class="h-px w-0 bg-yellow-400 group-hover:w-3 transition-all duration-300"></span>Contact Us</a></li>
              </ul>
            </div>

            <div class="lg:col-span-2 space-y-6">
              <h4 class="text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                   <span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span> Customer
              </h4>
              <ul class="space-y-4 text-sm font-medium text-gray-300">
                <li><a routerLink="/profile" class="hover:text-yellow-400 transition-colors flex items-center gap-2 group"><span class="h-px w-0 bg-yellow-400 group-hover:w-3 transition-all duration-300"></span>My Profile</a></li>
                <li><a routerLink="/profile" class="hover:text-yellow-400 transition-colors flex items-center gap-2 group"><span class="h-px w-0 bg-yellow-400 group-hover:w-3 transition-all duration-300"></span>Track Order</a></li>
                <li><a routerLink="/wishlist" class="hover:text-yellow-400 transition-colors flex items-center gap-2 group"><span class="h-px w-0 bg-yellow-400 group-hover:w-3 transition-all duration-300"></span>Wishlist</a></li>
                <li><a routerLink="/contact" class="hover:text-yellow-400 transition-colors flex items-center gap-2 group"><span class="h-px w-0 bg-yellow-400 group-hover:w-3 transition-all duration-300"></span>Help Center</a></li>
              </ul>
            </div>

            <!-- Newsletter -->
            <div class="lg:col-span-4 space-y-6">
              <div class="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-yellow-500/30 transition-colors duration-500">
                <!-- Background accent -->
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-colors duration-700"></div>
                
                <h4 class="text-white font-bold text-lg mb-2 relative z-10 flex items-center gap-2">
                    <span class="material-icons text-yellow-400">mail_outline</span> Stay Inspired
                </h4>
                <p class="text-gray-300 text-sm mb-6 relative z-10 leading-relaxed font-medium">Join our inner circle for early access to drops and exclusive offers.</p>
                
                <div class="flex gap-2 relative z-10">
                  <input type="email" placeholder="Email Address" 
                         class="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all placeholder:text-gray-500 hover:bg-black/60">
                  <button class="bg-gradient-to-r from-yellow-500 to-amber-500 text-black rounded-xl px-4 py-3 font-bold text-sm hover:from-yellow-400 hover:to-amber-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                    <span class="material-icons text-xl">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium text-gray-500">
            <div class="flex items-center gap-2">
              <span>&copy; 2026 CartifyX.</span>
              <span class="h-1 w-1 bg-gray-700 rounded-full"></span>
              <span class="hover:text-yellow-400 transition-colors cursor-default">Designed for the Future.</span>
            </div>
            <div class="flex gap-8 uppercase tracking-widest">
              <a href="#" class="hover:text-white transition-colors">Privacy</a>
              <a href="#" class="hover:text-white transition-colors">Terms</a>
              <a href="#" class="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent { }
