import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, ScrollAnimationDirective],
  template: `
    <div class="flex h-screen bg-dark-950">
      <!-- Sidebar -->
      <aside class="w-64 bg-dark-900 border-r border-dark-800 flex flex-col">
        <div class="h-16 flex items-center px-6 border-b border-dark-800">
          <a routerLink="/admin/dashboard" class="cursor-pointer">
            <img src="assets/logo.svg" alt="CartifyX Admin" class="h-8 w-auto">
          </a>
        </div>

        <nav class="flex-1 px-4 py-6 space-y-2">
          <a routerLink="/admin/dashboard" routerLinkActive="bg-dark-800 text-primary-400" class="flex items-center px-4 py-3 text-gray-400 rounded-xl hover:bg-dark-800 hover:text-white transition-colors group">
            <span class="material-icons mr-3 group-hover:text-primary-400 transition-colors">dashboard</span>
            Dashboard
          </a>
          <a routerLink="/admin/analytics" routerLinkActive="bg-dark-800 text-primary-400" class="flex items-center px-4 py-3 text-gray-400 rounded-xl hover:bg-dark-800 hover:text-white transition-colors group">
            <span class="material-icons mr-3 group-hover:text-primary-400 transition-colors">analytics</span>
            Analytics
          </a>
          <a routerLink="/admin/products" routerLinkActive="bg-dark-800 text-primary-400" class="flex items-center px-4 py-3 text-gray-400 rounded-xl hover:bg-dark-800 hover:text-white transition-colors group">
            <span class="material-icons mr-3 group-hover:text-primary-400 transition-colors">inventory_2</span>
            Products
          </a>
          <a routerLink="/admin/orders" routerLinkActive="bg-dark-800 text-primary-400" class="flex items-center px-4 py-3 text-gray-400 rounded-xl hover:bg-dark-800 hover:text-white transition-colors group">
            <span class="material-icons mr-3 group-hover:text-primary-400 transition-colors">receipt_long</span>
            Orders
          </a>
          <a routerLink="/admin/users" routerLinkActive="bg-dark-800 text-primary-400" class="flex items-center px-4 py-3 text-gray-400 rounded-xl hover:bg-dark-800 hover:text-white transition-colors group">
            <span class="material-icons mr-3 group-hover:text-primary-400 transition-colors">people</span>
            Users
          </a>
          <a routerLink="/admin/messages" routerLinkActive="bg-dark-800 text-primary-400" class="flex items-center px-4 py-3 text-gray-400 rounded-xl hover:bg-dark-800 hover:text-white transition-colors group">
            <span class="material-icons mr-3 group-hover:text-primary-400 transition-colors">email</span>
            Messages
          </a>
          <a routerLink="/profile" class="flex items-center px-4 py-3 text-gray-400 rounded-xl hover:bg-dark-800 hover:text-white transition-colors group">
            <span class="material-icons mr-3 group-hover:text-primary-400 transition-colors">account_circle</span>
            My Profile
          </a>
        </nav>

      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <div class="p-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent { }
