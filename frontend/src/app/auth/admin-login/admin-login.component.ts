import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-dark-950 relative overflow-hidden">
      
      <!-- Background Elements -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div class="absolute top-1/2 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div class="max-w-md w-full space-y-8 relative z-10">
        <!-- Header -->
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <div class="h-16 w-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                <span class="material-icons text-white text-3xl">admin_panel_settings</span>
            </div>
          </div>
          <h2 class="mt-2 text-3xl font-extrabold text-white tracking-tight">
            Admin Portal
          </h2>
          <p class="mt-2 text-sm text-gray-400">
            Secure access for CartifyX administrators
          </p>
        </div>

        <!-- Login Form -->
        <div class="bg-dark-900/50 backdrop-blur-xl border border-dark-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            
            <!-- Error Alert -->
            <div *ngIf="error" class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-3">
                <span class="material-icons text-red-500">error_outline</span>
                <p class="text-sm text-red-400">{{ error }}</p>
            </div>

            <form class="space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              
              <div class="space-y-4">
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-400 mb-1">Admin Email</label>
                  <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="material-icons text-gray-500 text-lg">email</span>
                      </div>
                      <input id="email" type="email" formControlName="email" 
                             class="block w-full pl-10 pr-3 py-3 border border-dark-700 rounded-lg bg-dark-800/50 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all sm:text-sm" 
                             placeholder="admin@gmail.com">
                  </div>
                </div>
                
                <div>
                   <label for="password" class="block text-sm font-medium text-gray-400 mb-1">Password</label>
                   <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="material-icons text-gray-500 text-lg">lock</span>
                      </div>
                      <input id="password" [type]="showPassword ? 'text' : 'password'" formControlName="password" 
                             class="block w-full pl-10 pr-10 py-3 border border-dark-700 rounded-lg bg-dark-800/50 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all sm:text-sm" 
                             placeholder="••••••••">
                      <button type="button" (click)="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none">
                          <span class="material-icons text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                      </button>
                    </div>
                </div>
              </div>

              <div>
                <button type="submit" 
                        [disabled]="loading"
                        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-red-500 shadow-lg shadow-red-900/20 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                   <span *ngIf="!loading">Access Dashboard</span>
                   <span *ngIf="loading" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                </button>
              </div>

              <div class="text-center mt-4">
                <a routerLink="/auth/login" class="text-sm text-gray-500 hover:text-white transition-colors">
                  &larr; Back to Store
                </a>
              </div>

            </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.user.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.error = 'Access Denied: You do not have admin privileges.';
            this.authService.logout();
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Login failed';
          console.error(err);
        }
      });
    }
  }
}
