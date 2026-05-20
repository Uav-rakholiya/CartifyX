import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule],
    template: `
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-dark-950 relative overflow-hidden">
      
      <!-- Background Elements -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-md w-full space-y-8 relative z-10">
        <!-- Header -->
        <div class="text-center">
          <span class="material-icons text-5xl text-primary-500 mb-4 bg-dark-900/50 p-4 rounded-full border border-dark-800 shadow-xl">vpn_key</span>
          <h2 class="mt-4 text-3xl font-extrabold text-white tracking-tight">
            Set new password
          </h2>
          <p class="mt-2 text-sm text-gray-400">
            Your new password must be different to previously used passwords.
          </p>
        </div>

        <!-- Form -->
        <div class="bg-dark-900/50 backdrop-blur-xl border border-dark-800 rounded-2xl p-8 shadow-2xl">
            <form class="space-y-6" [formGroup]="resetForm" (ngSubmit)="onSubmit()">
              
              <div class="space-y-4">
                  <div>
                    <label for="password" class="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                    <div class="relative">
                        <input id="password" [type]="showPassword ? 'text' : 'password'" formControlName="password" 
                            class="appearance-none relative block w-full px-4 py-3 pr-10 border border-dark-700 placeholder-gray-600 text-gray-100 bg-dark-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm" 
                            placeholder="••••••••">
                        <button type="button" (click)="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none">
                            <span class="material-icons text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                        </button>
                    </div>
                    <div *ngIf="resetForm.get('password')?.touched && resetForm.get('password')?.errors?.['minlength']" class="mt-1 text-xs text-red-400">
                        Password must be at least 6 characters.
                    </div>
                  </div>

                  <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
                    <div class="relative">
                        <input id="confirmPassword" [type]="showConfirmPassword ? 'text' : 'password'" formControlName="confirmPassword" 
                            class="appearance-none relative block w-full px-4 py-3 pr-10 border border-dark-700 placeholder-gray-600 text-gray-100 bg-dark-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm" 
                            placeholder="••••••••">
                        <button type="button" (click)="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none">
                            <span class="material-icons text-lg">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
                        </button>
                    </div>
                    <div *ngIf="resetForm.errors?.['mismatch'] && resetForm.get('confirmPassword')?.touched" class="mt-1 text-xs text-red-400">
                        Passwords do not match.
                    </div>
                  </div>
              </div>

              <div>
                <button type="submit" 
                        [disabled]="resetForm.invalid || loading"
                        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 shadow-lg shadow-primary-900/20 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                  <span *ngIf="loading" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </span>
                  <span *ngIf="!loading">Reset Password</span>
                </button>
              </div>
              
              <div class="text-center">
                <a routerLink="/auth/login" class="font-medium text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center">
                  <span class="material-icons text-sm mr-1">arrow_back</span>
                  Back to Login
                </a>
              </div>
            </form>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class ResetPasswordComponent implements OnInit {
    resetForm: FormGroup;
    loading = false;
    showPassword = false;
    showConfirmPassword = false;
    token = '';
    email = '';

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private authService: AuthService,
        private router: Router
    ) {
        this.resetForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validator: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        this.token = this.route.snapshot.paramMap.get('token') || '';
        this.email = this.route.snapshot.queryParamMap.get('email') || '';
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { 'mismatch': true };
    }

    onSubmit() {
        if (this.resetForm.valid && this.token) {
            this.loading = true;
            const payload = {
                resetToken: this.token,
                email: this.email,
                password: this.resetForm.value.password
            };

            this.authService.resetPassword(payload).subscribe({
                next: () => {
                    this.loading = false;
                    alert('Password reset successful! You will be redirected to the home page.');
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    this.loading = false;
                    console.error(err);
                    alert(err.error?.message || 'Password reset failed. Token might be invalid or expired.');
                }
            });
        }
    }
}
