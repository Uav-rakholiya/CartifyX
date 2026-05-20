import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex bg-dark-950">
      
      <!-- Left Side - Visual -->
      <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black justify-center items-center">
        <div class="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent z-10"></div>
        <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" class="absolute w-full h-full object-cover opacity-80" alt="Shopping">
        
        <div class="relative z-20 text-center p-12">
            <h2 class="text-4xl font-bold text-white mb-6">Join the CartifyX Community</h2>
            <p class="text-gray-300 text-lg max-w-md mx-auto">Create an account to unlock exclusive perks, early access to black-tier sales, and elite recommendations.</p>
        </div>
        
        <!-- Animated Blobs (Yellow/Amber only) -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl opacity-30 animate-pulse" style="animation-delay: 2s;"></div>
      </div>

      <!-- Right Side - Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-hidden">
         <!-- Background Blobs for mobile -->
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl opacity-50 lg:hidden"></div>

        <div class="w-full max-w-md space-y-8 relative z-10">
          <div class="text-center lg:text-left" style="perspective: 1200px;">
             <a routerLink="/" class="cursor-pointer block lg:inline-block mb-8 lg:mb-12 animate-fade-in-up" style="animation-delay: 100ms;">
              <img src="assets/logo.svg" alt="CartifyX" class="h-12 w-auto">
            </a>
            <div style="transform-style: preserve-3d;">
              <h2 class="text-4xl font-extrabold text-white tracking-tight leading-tight mb-2 inline-block animate-cinematic-3d" style="animation-fill-mode: both;">
                Create your account
              </h2>
            </div>
            <p class="mt-4 text-gray-300 font-light text-lg animate-ethereal-sweep" style="animation-delay: 800ms; animation-fill-mode: both;">
              Already have an account?
              <a routerLink="/auth/login" class="font-bold text-primary-500 hover:text-primary-400 transition-colors">
                Sign in
              </a>
            </p>
          </div>

          <div class="mt-8">
             <!-- Error Alert -->
            <div *ngIf="error" class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3 backdrop-blur-sm animate-fade-in" style="animation-delay: 150ms;">
                <span class="material-icons text-red-500 text-xl">error_outline</span>
                <p class="text-sm text-red-400 font-medium">{{ error }}</p>
            </div>

            <form class="space-y-6 animate-premium-fade-up" style="animation-delay: 1100ms; animation-fill-mode: both;" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              
              <div class="space-y-5">
                <div class="relative group">
                  <label for="name" class="block text-sm font-medium text-gray-400 mb-1 transition-colors group-focus-within:text-primary-400">Full Name</label>
                  <div class="relative transition-all duration-300 transform group-hover:-translate-y-0.5 group-focus-within:-translate-y-1">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="material-icons text-gray-500 text-lg group-focus-within:text-primary-500 transition-colors">person</span>
                      </div>
                      <input id="name" type="text" formControlName="name" 
                           class="block w-full pl-10 pr-3 py-3 border border-dark-700 rounded-xl bg-dark-800/50 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 sm:text-sm backdrop-blur-sm group-hover:bg-dark-800 shadow-sm focus:shadow-lg focus:shadow-primary-900/20" 
                           placeholder="John Doe">
                  </div>
                  <div *ngIf="registerForm.get('name')?.touched && registerForm.get('name')?.errors" class="text-red-500 text-xs mt-1">
                    <span *ngIf="registerForm.get('name')?.errors?.['required']">Full Name is required</span>
                  </div>
                </div>

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
                  <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.errors" class="text-red-500 text-xs mt-1">
                    <span *ngIf="registerForm.get('email')?.errors?.['required']">Email address is required</span>
                    <span *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email address</span>
                  </div>
                </div>

                <div class="relative group">
                  <label for="phoneNumber" class="block text-sm font-medium text-gray-400 mb-1 transition-colors group-focus-within:text-primary-400">Phone Number</label>
                  <div class="relative transition-all duration-300 transform group-hover:-translate-y-0.5 group-focus-within:-translate-y-1">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="material-icons text-gray-500 text-lg group-focus-within:text-primary-500 transition-colors">phone</span>
                      </div>
                      <input id="phoneNumber" type="tel" formControlName="phone" 
                           maxlength="10"
                           (keypress)="($event.charCode >= 48 && $event.charCode <= 57)"
                           class="block w-full pl-10 pr-3 py-3 border border-dark-700 rounded-xl bg-dark-800/50 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 sm:text-sm backdrop-blur-sm group-hover:bg-dark-800 shadow-sm focus:shadow-lg focus:shadow-primary-900/20" 
                           placeholder="10-digit mobile number">
                  </div>
                  <div *ngIf="registerForm.get('phone')?.touched && registerForm.get('phone')?.errors" class="text-red-500 text-xs mt-1">
                    <span *ngIf="registerForm.get('phone')?.errors?.['required']">Phone number is required</span>
                    <span *ngIf="registerForm.get('phone')?.errors?.['pattern'] || registerForm.get('phone')?.errors?.['minlength']">Please enter a valid 10-digit mobile number</span>
                  </div>
                </div>

                <div class="relative group">
                  <label for="password" class="block text-sm font-medium text-gray-400 mb-1 transition-colors group-focus-within:text-primary-400">Password</label>
                  <div class="relative transition-all duration-300 transform group-hover:-translate-y-0.5 group-focus-within:-translate-y-1">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="material-icons text-gray-500 text-lg group-focus-within:text-primary-500 transition-colors">lock</span>
                      </div>
                      <input id="password" [type]="showPassword ? 'text' : 'password'" formControlName="password" 
                           class="block w-full pl-10 pr-10 py-3 border border-dark-700 rounded-xl bg-dark-800/50 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 sm:text-sm backdrop-blur-sm group-hover:bg-dark-800 shadow-sm focus:shadow-lg focus:shadow-primary-900/20" 
                           placeholder="Min 8 characters">
                      <button type="button" (click)="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none">
                          <span class="material-icons text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                      </button>
                  </div>
                  <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors" class="text-red-500 text-xs mt-1">
                    <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</span>
                    <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 8 characters long</span>
                  </div>
                </div>

                <div class="relative group">
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-400 mb-1 transition-colors group-focus-within:text-primary-400">Confirm Password</label>
                  <div class="relative transition-all duration-300 transform group-hover:-translate-y-0.5 group-focus-within:-translate-y-1">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="material-icons text-gray-500 text-lg group-focus-within:text-primary-500 transition-colors">lock_clock</span>
                      </div>
                      <input id="confirmPassword" [type]="showConfirmPassword ? 'text' : 'password'" formControlName="confirmPassword" 
                           class="block w-full pl-10 pr-10 py-3 border border-dark-700 rounded-xl bg-dark-800/50 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 sm:text-sm backdrop-blur-sm group-hover:bg-dark-800 shadow-sm focus:shadow-lg focus:shadow-primary-900/20" 
                           placeholder="Re-enter password">
                      <button type="button" (click)="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none">
                          <span class="material-icons text-lg">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
                      </button>
                  </div>
                  <div *ngIf="registerForm.hasError('mismatch') && registerForm.get('confirmPassword')?.touched" class="text-red-500 text-xs mt-1">
                    Passwords do not match
                  </div>
                </div>
              </div>

              <div class="pt-2">
                <button type="submit" 
                        [disabled]="loading"
                        class="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 shadow-[0_0_20px_rgba(var(--color-primary-500),0.2)] hover:shadow-lg hover:shadow-primary-900/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                  <span *ngIf="!loading">Create Account</span>
                  <span *ngIf="loading" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                </button>
              </div>

              <div class="text-xs text-center text-gray-500 mt-6">
                  By signing up, you agree to our <a href="#" class="underline hover:text-gray-400 transition-colors">Terms</a> and <a href="#" class="underline hover:text-gray-400 transition-colors">Privacy Policy</a>.
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

      <!-- Success Modal Popup -->
      <div *ngIf="showSuccessPopup" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div class="bg-dark-900 border border-dark-700 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-center transform transition-all">
              <div class="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <span class="material-icons text-green-500 text-3xl">check_circle</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Account Created!</h3>
              <p class="text-gray-400 mb-6 flex flex-col items-center">Your account has been successfully created. Please log in to continue.</p>
              <button (click)="goToLogin()" class="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 shadow-lg shadow-primary-900/20 transition-all duration-300">
                  Go to Login
              </button>
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
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  showPassword = false;
  showConfirmPassword = false;
  showSuccessPopup = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';

      const { confirmPassword, ...registerData } = this.registerForm.value;

      this.authService.register(registerData).subscribe({
        next: () => {
          this.loading = false;
          this.showSuccessPopup = true;
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Registration failed';
          console.error(err);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
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

  goToLogin() {
    this.showSuccessPopup = false;
    this.router.navigate(['/auth/login']);
  }

  private handleRedirect() {
    const user = this.authService.currentUser();
    if (user?.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
