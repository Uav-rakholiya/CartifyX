import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-dark-950 relative overflow-hidden">
      
      <!-- Background Elements -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-md w-full space-y-8 relative z-10">
        <!-- Header -->
        <div class="text-center">
          <span class="material-icons text-5xl text-primary-500 mb-4 bg-dark-900/50 p-4 rounded-full border border-dark-800 shadow-xl">lock_reset</span>
          <h2 class="mt-4 text-3xl font-extrabold text-white tracking-tight">
            Reset password
          </h2>
          <p class="mt-2 text-sm text-gray-400">
            Enter your phone number to receive an One-Time Password (OTP).
          </p>
        </div>

        <!-- Form -->
        <div class="bg-dark-900/50 backdrop-blur-xl border border-dark-800 rounded-2xl p-8 shadow-2xl">
            <form class="space-y-6" [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
              
              <div *ngIf="step === 'request'">
                <label for="phone" class="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                <input id="phone" type="tel" formControlName="phone" 
                       class="appearance-none relative block w-full px-4 py-3 border border-dark-700 placeholder-gray-600 text-gray-100 bg-dark-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm" 
                       placeholder="+1234567890">
              </div>

              <div *ngIf="step === 'verify'">
                <label for="otp" class="block text-sm font-medium text-gray-400 mb-1">Enter OTP</label>
                <input id="otp" type="text" formControlName="otp" 
                       class="appearance-none relative block w-full px-4 py-3 border border-dark-700 placeholder-gray-600 text-gray-100 bg-dark-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm tracking-widest text-center text-xl" 
                       placeholder="XXXXXX" maxlength="6">
              </div>

              <div>
                <button type="submit" 
                        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 shadow-lg shadow-primary-900/20 transition-all duration-300 transform active:scale-[0.98]">
                  {{ step === 'request' ? 'Send OTP' : 'Verify OTP' }}
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
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  step: 'request' | 'verify' = 'request';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      phone: ['', [Validators.required]],
      otp: ['']
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    if (this.step === 'request') {
      this.authService.forgotPasswordMobile(this.forgotForm.value.phone).subscribe({
        next: (res: any) => {
          if (res.otp) alert(`DEV MODE OTP: ${res.otp}`); // Show OTP in alert for Dev
          this.step = 'verify';
          this.forgotForm.get('otp')?.setValidators([Validators.required, Validators.minLength(6)]);
          this.forgotForm.updateValueAndValidity();
        },
        error: (err) => alert(err.error?.message || 'Failed to send OTP')
      });
    } else {
      // Verify OTP
      const payload = {
        phone: this.forgotForm.value.phone,
        otp: this.forgotForm.value.otp
      };
      this.authService.verifyOtp(payload).subscribe({
        next: (res: any) => {
          alert('OTP Verified! Redirecting to Reset Password...');
          // Redirect to reset password page with the temporary reset token
          this.router.navigate(['/auth/reset-password', res.resetToken]);
        },
        error: (err) => alert(err.error?.message || 'Invalid OTP')
      });
    }
  }
}
