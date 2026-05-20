import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { SearchService } from '../../../core/services/search.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  template: `
    <nav class="bg-dark-950/80 backdrop-blur-md border-b border-dark-800 sticky top-0 z-50 transition-all duration-300">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center cursor-pointer group" [routerLink]="isAdminRoute() ? '/admin/dashboard' : '/'">
            <img src="assets/logo.svg" alt="CartifyX" class="h-10 w-auto group-hover:scale-105 transition-transform duration-300">
          </div>

          <!-- Search Bar -->
          <div class="hidden md:flex flex-1 max-w-lg mx-8">
            <div class="relative w-full group">
              <input 
                type="text" 
                placeholder="Search products..." 
                [formControl]="searchControl"
                (keydown.enter)="onSearch()"
                class="w-full bg-dark-900 border border-dark-700 text-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
              >
              <button (click)="openQuickSearch()" class="absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-primary-400 transition-colors">
                <span class="material-icons text-lg">search</span>
              </button>
              <span class="absolute right-16 top-2 text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors pointer-events-none">⌘K</span>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-5 lg:space-x-7">
            <a routerLink="/" routerLinkActive="text-primary-400 font-semibold" [routerLinkActiveOptions]="{exact: true}" class="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm tracking-wide uppercase font-medium">
              Home
            </a>
            <a routerLink="/products" routerLinkActive="text-primary-400 font-semibold" class="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm tracking-wide uppercase font-medium">
              Products
            </a>
            <a routerLink="/contact" routerLinkActive="text-primary-400 font-semibold" class="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm tracking-wide uppercase font-medium">
              Contact Us
            </a>
            <a routerLink="/about" routerLinkActive="text-primary-400 font-semibold" class="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm tracking-wide uppercase font-medium">
              About Us
            </a>
            <a routerLink="/blog" routerLinkActive="text-primary-400 font-semibold" class="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm tracking-wide uppercase font-medium">
              Blog
            </a>

            
            <!-- More Dropdown -->
            <div class="relative group py-2">
              <button class="flex items-center text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm tracking-wide uppercase font-medium focus:outline-none">
                More
                <span class="material-icons text-sm ml-1 transition-transform duration-300 group-hover:-rotate-180">expand_more</span>
              </button>
              
              <div class="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-dark-900 border border-dark-800 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50 overflow-hidden transform translate-y-2 group-hover:translate-y-0">
                <a routerLink="/faq" routerLinkActive="text-primary-400 bg-dark-800" class="block px-5 py-3.5 text-xs text-gray-300 hover:text-primary-400 hover:bg-dark-800 transition-colors uppercase tracking-widest font-medium">
                  FAQ
                </a>
                <a routerLink="/privacy" routerLinkActive="text-primary-400 bg-dark-800" class="block px-5 py-3.5 text-xs text-gray-300 hover:text-primary-400 hover:bg-dark-800 transition-colors uppercase tracking-widest font-medium border-t border-dark-800/50">
                  Privacy Policy
                </a>
                <a routerLink="/terms" routerLinkActive="text-primary-400 bg-dark-800" class="block px-5 py-3.5 text-xs text-gray-300 hover:text-primary-400 hover:bg-dark-800 transition-colors uppercase tracking-widest font-medium border-t border-dark-800/50">
                  Terms
                </a>
              </div>
            </div>
          </div>

          <!-- Divider & Actions -->
          <div class="flex items-center">
            <!-- Mobile Search Button -->
            <button (click)="openQuickSearch()" class="md:hidden p-2 text-gray-400 hover:text-primary-500 transition-colors">
              <span class="material-icons text-[22px]">search</span>
            </button>

            <!-- Vertical Divider (Desktop Only) -->
            <div class="hidden md:block h-6 w-px bg-dark-700 mx-4 lg:mx-6"></div>
            
            <div class="flex items-center space-x-1 sm:space-x-3 lg:space-x-4">
              <!-- Wishlist -->
              <a routerLink="/wishlist" class="p-2 text-gray-400 hover:text-red-500 transition-colors relative group">
                <span class="material-icons text-[22px]">favorite_border</span>
                <span *ngIf="wishlistCount() > 0" class="absolute top-0 right-0 h-4 w-4 bg-red-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-dark-950">
                  {{ wishlistCount() }}
                </span>
              </a>
    
              <!-- Cart Dropdown -->
              <a routerLink="/cart" class="p-2 text-gray-400 hover:text-primary-500 transition-colors relative">
                <span class="material-icons text-[22px]">shopping_bag</span>
                <span *ngIf="cartCount() > 0" class="absolute top-0 right-0 h-4 w-4 bg-primary-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-dark-950">
                  {{ cartCount() }}
                </span>
              </a>
    
              <!-- User Menu -->
              <div class="relative ml-1 sm:ml-2">
                <ng-container *ngIf="currentUser(); else loginButton">
                  <button routerLink="/profile" class="flex items-center space-x-2 bg-dark-800 hover:bg-dark-700 px-3 sm:px-4 py-2 rounded-full transition-all border border-dark-700 hover:border-primary-500/30 group">
                      <span class="material-icons text-primary-500 text-sm">person</span>
                      <span class="text-[10px] sm:text-xs font-medium text-white uppercase tracking-wider transition-colors truncate max-w-[60px] sm:max-w-[80px]">{{ currentUser().name }}</span>
                  </button>
                </ng-container>
                <ng-template #loginButton>
                  <button routerLink="/auth/login" class="flex items-center space-x-2 bg-dark-800 hover:bg-dark-700 px-3 sm:px-4 py-2 rounded-full transition-all border border-dark-700 hover:border-primary-500/30 group">
                      <span class="material-icons text-gray-400 group-hover:text-primary-400 text-sm transition-colors">login</span>
                      <span class="text-[10px] sm:text-xs font-medium text-gray-300 group-hover:text-white uppercase tracking-wider transition-colors">Login</span>
                  </button>
                </ng-template>
              </div>
    
              <!-- Mobile menu button -->
              <div class="md:hidden flex items-center">
                <button (click)="isMobileMenuOpen = !isMobileMenuOpen" class="text-gray-400 hover:text-white focus:outline-none p-2">
                  <span class="material-icons">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
      <div class="md:hidden bg-dark-900 border-t border-dark-800" *ngIf="isMobileMenuOpen">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a routerLink="/" (click)="closeMenu()" class="block px-3 py-2.5 rounded-xl text-sm tracking-wide uppercase font-medium text-gray-300 hover:text-primary-400 hover:bg-dark-800">Home</a>
          <a routerLink="/products" (click)="closeMenu()" class="block px-3 py-2.5 rounded-xl text-sm tracking-wide uppercase font-medium text-gray-300 hover:text-primary-400 hover:bg-dark-800">Products</a>
          <a routerLink="/contact" (click)="closeMenu()" class="block px-3 py-2.5 rounded-xl text-sm tracking-wide uppercase font-medium text-gray-300 hover:text-primary-400 hover:bg-dark-800">Contact Us</a>
          <a routerLink="/about" (click)="closeMenu()" class="block px-3 py-2.5 rounded-xl text-sm tracking-wide uppercase font-medium text-gray-300 hover:text-primary-400 hover:bg-dark-800">About Us</a>
          <a routerLink="/blog" (click)="closeMenu()" class="block px-3 py-2.5 rounded-xl text-sm tracking-wide uppercase font-medium text-gray-300 hover:text-primary-400 hover:bg-dark-800">Blog</a>

          
          <div class="px-3 py-2">
            <div class="text-[10px] uppercase tracking-widest text-dark-500 font-bold mb-2 ml-1">More Pages</div>
            <a routerLink="/faq" (click)="closeMenu()" class="block px-2 py-2 rounded-lg text-xs tracking-wide uppercase font-medium text-gray-400 hover:text-primary-400 hover:bg-dark-800">FAQ</a>
            <a routerLink="/privacy" (click)="closeMenu()" class="block px-2 py-2 rounded-lg text-xs tracking-wide uppercase font-medium text-gray-400 hover:text-primary-400 hover:bg-dark-800">Privacy Policy</a>
            <a routerLink="/terms" (click)="closeMenu()" class="block px-2 py-2 rounded-lg text-xs tracking-wide uppercase font-medium text-gray-400 hover:text-primary-400 hover:bg-dark-800">Terms & Conditions</a>
          </div>
          <a routerLink="/cart" (click)="closeMenu()" class="block px-3 py-2 rounded-xl text-base font-medium text-gray-300 hover:text-primary-400 hover:bg-dark-800 flex items-center">
            Cart 
            <span *ngIf="cartCount() > 0" class="ml-2 bg-primary-600 px-2 py-0.5 rounded-full text-[10px] text-white font-bold">{{ cartCount() }}</span>
          </a>
          <a routerLink="/wishlist" (click)="closeMenu()" class="block px-3 py-2 rounded-xl text-base font-medium text-gray-300 hover:text-primary-400 hover:bg-dark-800 flex items-center">
            Wishlist 
            <span *ngIf="wishlistCount() > 0" class="ml-2 bg-red-600 px-2 py-0.5 rounded-full text-[10px] text-white font-bold">{{ wishlistCount() }}</span>
          </a>
          <ng-container *ngIf="currentUser()">
             <a *ngIf="currentUser().role === 'admin'" routerLink="/admin/dashboard" (click)="closeMenu()" class="block px-3 py-2 rounded-xl text-base font-medium text-primary-400 bg-dark-800">Dashboard</a>
             <button (click)="logout()" class="block w-full text-left px-3 py-2 rounded-xl text-base font-medium text-red-400 hover:bg-dark-800">Logout</button>
          </ng-container>
          <a *ngIf="!currentUser()" routerLink="/auth/login" (click)="closeMenu()" class="block px-3 py-2 rounded-xl text-base font-medium text-primary-400 bg-dark-800">Login / Register</a>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private wishlistService = inject(WishlistService);
  private searchService = inject(SearchService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');

  cartCount = this.cartService.totalItems;
  wishlistCount = this.wishlistService.wishlistCount;
  currentUser = this.authService.currentUser;

  isAdmin = false;

  ngOnInit() {
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isAdmin = this.router.url.includes('/admin');
        }
      });
    this.isAdmin = this.router.url.includes('/admin');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isAdminRoute(): boolean {
    return this.isAdmin;
  }

  logout() {
    this.authService.logout();
    this.isMobileMenuOpen = false;
  }

  onSearch() {
    const keyword = this.searchControl.value;
    if (keyword?.trim()) {
      this.router.navigate(['/products'], { queryParams: { keyword } });
    }
  }

  openQuickSearch() {
    this.searchService.openSearch();
  }

  closeMenu() {
    this.isMobileMenuOpen = false;
  }
}
