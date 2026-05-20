import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex bg-dark-950">
      
      <!-- Left Side - Visual -->
      <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black justify-center items-center">
        <div class="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent z-10"></div>
        <img src="https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?q=80&w=2069&auto=format&fit=crop" class="absolute w-full h-full object-cover opacity-80" alt="Fashion">
        
        <div class="relative z-20 text-center p-12">
            <h2 class="text-4xl font-bold text-white mb-6">Welcome Back to CartifyX</h2>
            <p class="text-gray-300 text-lg max-w-md mx-auto">Discover the latest trends in our exclusive Black & Gold collection.</p>
        </div>
        
        <!-- Animated Blobs (Yellow/Amber only) -->
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl opacity-30 animate-pulse" style="animation-delay: 1s;"></div>
      </div>

      <!-- Right Side - Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-hidden">
         <!-- Background Blobs for specific mobile feel -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl opacity-50 lg:hidden"></div>

        <div class="w-full max-w-md space-y-8 relative z-10">
          <div class="text-center lg:text-left" style="perspective: 1200px;">
             <a routerLink="/" class="cursor-pointer block lg:inline-block mb-8 lg:mb-12 animate-fade-in-up" style="animation-delay: 100ms;">
              <img src="assets/logo.svg" alt="CartifyX" class="h-12 w-auto">
            </a>
            <div style="transform-style: preserve-3d;">
              <h2 class="text-4xl font-extrabold text-white tracking-tight leading-tight mb-2 inline-block animate-cinematic-3d" style="animation-fill-mode: both;">
                Sign in to your account
              </h2>
            </div>
            <p class="mt-4 text-gray-300 font-light text-lg animate-ethereal-sweep" style="animation-delay: 800ms; animation-fill-mode: both;">
              Or
              <a routerLink="/auth/register" class="font-bold text-primary-500 hover:text-primary-400 transition-colors">
                create a new account
              </a>
            </p>
          </div>

          <div class="mt-8">
             <!-- Error Alert -->
            <div *ngIf="error" class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3 backdrop-blur-sm animate-fade-in" style="animation-delay: 150ms;">
                <span class="material-icons text-red-500 text-xl">error_outline</span>
                <p class="text-sm text-red-400 font-medium">{{ error }}</p>
            </div>

            <form class="space-y-6 animate-premium-fade-up" style="animation-delay: 1100ms; animation-fill-mode: both;" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="space-y-5">
                <div class="relative group">
                  <label for="email" class="block text-sm font-medium text-gray-400 mb-1 transition-colors group-focus-within:text-primary-400">Email address</label>
                  <div class="relative transition-all duration-300 transform group-hover:-translate-y-0.5 group-focus-within:-translate-y-1">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="material-icons text-gray-500 text-lg group-focus-within:text-primary-500 transition-colors">email</span>
                      </div>
                      <input id="email" type="email" formControlName="email" 
                           class="block w-full pl-10 pr-3 py-3 border border-dark-700 rounded-xl bg-dark-800/50 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 sm:text-sm backdrop-blur-sm group-hover:bg-dark-800 shadow-sm focus:shadow-lg focus:shadow-primary-900/20" 
                           placeholder="name@example.com">
                  </div>
                </div>

                <div class="relative group">
                  <div class="flex items-center justify-between mb-1">
                      <label for="password" class="block text-sm font-medium text-gray-400 transition-colors group-focus-within:text-primary-400">Password</label>
                      <a routerLink="/auth/forgot-password" class="text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors cursor-pointer">Forgot password?</a>
                  </div>
                  <div class="relative transition-all duration-300 transform group-hover:-translate-y-0.5 group-focus-within:-translate-y-1">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="material-icons text-gray-500 text-lg group-focus-within:text-primary-500 transition-colors">lock</span>
                      </div>
                      <input id="password" [type]="showPassword ? 'text' : 'password'" formControlName="password" 
                             class="block w-full pl-10 pr-10 py-3 border border-dark-700 rounded-xl bg-dark-800/50 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 sm:text-sm backdrop-blur-sm group-hover:bg-dark-800 shadow-sm focus:shadow-lg focus:shadow-primary-900/20" 
                             placeholder="••••••••">
                      <button type="button" (click)="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none">
                          <span class="material-icons text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                      </button>
                  </div>
                </div>
              </div>

              <div class="pt-2">
                <button type="submit" 
                        [disabled]="loading"
                        class="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 shadow-[0_0_20px_rgba(var(--color-primary-500),0.2)] hover:shadow-lg hover:shadow-primary-900/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                  <span *ngIf="!loading">Sign in</span>
                  <span *ngIf="loading" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                </button>
              </div>
            </form>
            
             <!-- Social Login -->
              <div class="mt-8 animate-premium-fade-up" style="animation-delay: 1300ms; animation-fill-mode: both;">
                <div class="relative">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-dark-700"></div>
                  </div>
                  <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-dark-950 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div class="mt-6 grid grid-cols-2 gap-3">
                    <button type="button" (click)="onGoogleLogin()" class="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-xl border border-dark-700 bg-dark-800 text-sm font-medium text-gray-300 hover:bg-dark-700/80 transition-all duration-300 hover:border-dark-600 hover:-translate-y-0.5 hover:shadow-lg">
                      <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                      </svg>
                      Google
                    </button>
                    <button type="button" (click)="onFacebookLogin()" class="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-xl border border-dark-700 bg-dark-800 text-sm font-medium text-gray-300 hover:bg-dark-700/80 transition-all duration-300 hover:border-dark-600 hover:-translate-y-0.5 hover:shadow-lg">
                       <svg class="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                      </svg>
                      Facebook
                    </button>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
        display: block;
    }
    
    @keyframes premiumFadeUp {
      0% { transform: translateY(30px); opacity: 0; filter: blur(5px); }
      100% { transform: translateY(0); opacity: 1; filter: blur(0); }
    }
    .animate-premium-fade-up {
      animation: premiumFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  showPassword = false;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
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
        next: () => {
          this.loading = false;
          this.handleRedirect();
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Login failed';
          console.error(err);
        }
      });
    }
  }

  onGoogleLogin() {
    this.loading = true;
    this.error = '';
    this.authService.googleLogin().subscribe({
      next: () => {
        this.loading = false;
        this.handleRedirect();
      },
      error: (err) => {
        this.loading = false;
        const msg = typeof err === 'string' ? err : (err?.error?.message || err?.message || JSON.stringify(err) || 'Google login failed');
        this.error = msg.includes('user-cancelled') || msg.includes('IdP denied access') || msg.includes('popup-closed-by-user') || msg.includes('cancelled')
          ? 'Google sign-in was cancelled.'
          : msg;
        console.error('Google login error details:', err);
      }
    });
  }

  onFacebookLogin() {
    this.loading = true;
    this.error = '';
    this.authService.facebookLogin().subscribe({
      next: () => {
        this.loading = false;
        this.handleRedirect();
      },
      error: (err) => {
        this.loading = false;
        const msg = typeof err === 'string' ? err : (err?.error?.message || err?.message || JSON.stringify(err) || 'Facebook login failed');
        this.error = msg.includes('user-cancelled') || msg.includes('IdP denied access') || msg.includes('popup-closed-by-user') || msg.includes('cancelled')
          ? 'Facebook sign-in was cancelled.'
          : msg;
        console.error('Facebook login error details:', err);
      }
    });
  }

  private handleRedirect() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    const user = this.authService.currentUser();

    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else if (user?.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
