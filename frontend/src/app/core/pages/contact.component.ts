import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../services/contact.service';
import { AuthService } from '../services/auth.service';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScrollAnimationDirective],
  template: `
    <div class="min-h-screen bg-dark-950 pt-24 pb-12 overflow-x-hidden">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto mb-16" appScrollAnimation animation="none">
          <span class="inline-block py-1 px-3 rounded-full bg-primary-900/30 border border-primary-500/30 text-primary-400 text-sm font-medium mb-6 backdrop-blur-sm">
            We're here to help
          </span>
          
          <h1 class="text-4xl md:text-5xl font-extrabold mb-6 relative z-10" style="perspective: 1200px;">
            <div style="transform-style: preserve-3d;">
                <span appScrollAnimation animation="cinematic-3d" class="inline-block text-white" style="animation-fill-mode: both;">
                   Get in Touch
                </span>
            </div>
          </h1>
          
          <p appScrollAnimation animation="ethereal-sweep" [delay]="400" class="text-gray-400 text-lg leading-relaxed" style="animation-fill-mode: both;">
            Have a question, feedback, or just want to say hello? We'd love to hear from you.
            Our team is available 24/7 to assist you.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-24">
          
          <!-- Contact Info -->
          <div class="space-y-8 animate-fade-in-left">
            <div class="p-8 rounded-xl bg-dark-900/50 backdrop-blur-sm border border-dark-800 hover:border-primary-500/30 transition-colors duration-300">
              <h2 class="text-2xl font-bold text-white mb-8">Contact Information</h2>
              
              <div class="space-y-8">
                <div class="flex items-start group">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-primary-400 group-hover:bg-primary-900/20 group-hover:text-primary-300 transition-colors duration-300">
                    <span class="material-icons">location_on</span>
                  </div>
                  <div class="ml-6">
                    <h3 class="text-white font-bold text-lg">Headquarters</h3>
                    <p class="text-gray-400 mt-1 leading-relaxed">123 Innovation Drive, Tech Valley<br>San Francisco, CA 94105</p>
                  </div>
                </div>

                <div class="flex items-start group">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-primary-400 group-hover:bg-primary-900/20 group-hover:text-primary-300 transition-colors duration-300">
                    <span class="material-icons">email</span>
                  </div>
                  <div class="ml-6">
                    <h3 class="text-white font-bold text-lg">Email Us</h3>
                    <p class="text-gray-400 mt-1">support&#64;cartifyx.com</p>
                    <p class="text-gray-500 text-sm mt-1">Response time: within 24 hours</p>
                  </div>
                </div>

                <div class="flex items-start group">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-primary-400 group-hover:bg-primary-900/20 group-hover:text-primary-300 transition-colors duration-300">
                    <span class="material-icons">phone</span>
                  </div>
                  <div class="ml-6">
                    <h3 class="text-white font-bold text-lg">Call Us</h3>
                    <p class="text-gray-400 mt-1">+1 (555) 123-4567</p>
                    <p class="text-gray-500 text-sm mt-1">Mon-Fri from 8am to 5pm</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Map Placeholder -->
            <div class="rounded-xl overflow-hidden border border-dark-800 aspect-video relative group shadow-2xl">
                <div class="absolute inset-0 bg-dark-900/20 z-10 group-hover:bg-dark-900/10 transition-colors duration-500"></div>
                <!-- Interactive overlay text/button could go here -->
                <div class="absolute bottom-4 left-4 z-20 bg-dark-900/90 backdrop-blur-md px-4 py-2 rounded-lg border border-dark-700">
                    <div class="flex items-center space-x-2">
                        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span class="text-xs font-bold text-white uppercase tracking-wider">Open Now</span>
                    </div>
                </div>
                <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" 
                    class="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-700" 
                    alt="Office"
                >
            </div>
          </div>

          <!-- Contact Form -->
          <div class="p-8 md:p-10 rounded-xl bg-dark-900/50 backdrop-blur-sm border border-dark-800 animate-fade-in-right relative overflow-hidden">
             <!-- Background decoration -->
             <div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl opacity-30"></div>

            <h2 class="text-2xl font-bold text-white mb-8 relative z-10">Send us a Message</h2>
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-6 relative z-10">
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-400">Name</label>
                  <input 
                    type="text" 
                    formControlName="name"
                    class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none placeholder-gray-600"
                    placeholder="John Doe"
                    [class.border-red-500]="contactForm.get('name')?.invalid && contactForm.get('name')?.touched"
                  >
                  <p *ngIf="contactForm.get('name')?.invalid && contactForm.get('name')?.touched" class="text-red-500 text-xs mt-1">Name is required</p>
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-400">Email</label>
                  <input 
                    type="email" 
                    formControlName="email"
                    class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none placeholder-gray-600"
                    placeholder="john@example.com"
                    [class.border-red-500]="contactForm.get('email')?.invalid && contactForm.get('email')?.touched"
                  >
                   <p *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched" class="text-red-500 text-xs mt-1">Valid email is required</p>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-400">Subject</label>
                <input 
                  type="text" 
                  formControlName="subject"
                  class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none placeholder-gray-600"
                  placeholder="How can we help?"
                   [class.border-red-500]="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched"
                >
                <p *ngIf="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched" class="text-red-500 text-xs mt-1">Subject is required</p>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-400">Message</label>
                <textarea 
                  formControlName="message"
                  rows="5"
                  class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none resize-none placeholder-gray-600"
                  placeholder="Tell us more about your inquiry..."
                   [class.border-red-500]="contactForm.get('message')?.invalid && contactForm.get('message')?.touched"
                ></textarea>
                 <p *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched" class="text-red-500 text-xs mt-1">Message is required</p>
              </div>

              <button 
                type="submit" 
                [disabled]="contactForm.invalid || loading()"
                class="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-primary-900/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center"
              >
                <span *ngIf="!loading()">Send Message</span>
                 <span *ngIf="loading()" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                </span>
              </button>

              <!-- Success Message -->
              <div *ngIf="submitted()" class="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 animate-fade-in text-green-400">
                  <span class="material-icons text-xl">check_circle</span>
                  <p class="text-sm font-medium">Message sent successfully! We will get back to you soon.</p>
              </div>
               <!-- Error Message -->
              <div *ngIf="error()" class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 animate-fade-in text-red-400">
                  <span class="material-icons text-xl">error</span>
                  <p class="text-sm font-medium">Failed to send message. Please try again.</p>
              </div>
            </form>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="max-w-4xl mx-auto mb-20 animate-fade-in-up">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                <p class="text-gray-400">Detailed answers to our most common queries.</p>
            </div>

            <div class="space-y-4">
                <button 
                    *ngFor="let faq of faqs; let i = index" 
                    (click)="toggleFaq(i)"
                    class="w-full text-left focus:outline-none border border-dark-800 rounded-xl bg-dark-900/30 overflow-hidden hover:bg-dark-800/50 transition-colors"
                >
                    <div class="flex items-center justify-between p-6">
                        <span class="text-lg font-medium text-white">{{ faq.question }}</span>
                        <span class="material-icons text-gray-500 transition-transform duration-300" [class.rotate-180]="faq.isOpen">{{ faq.isOpen ? 'expand_less' : 'expand_more' }}</span>
                    </div>
                    <div 
                        class="overflow-hidden transition-all duration-300 ease-in-out"
                        [style.max-height]="faq.isOpen ? '200px' : '0'"
                        [class.opacity-100]="faq.isOpen"
                        [class.opacity-0]="!faq.isOpen"
                    >
                        <div class="p-6 pt-0 text-gray-400 leading-relaxed border-t border-dark-800/50 mt-2">
                            {{ faq.answer }}
                        </div>
                    </div>
                </button>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ContactComponent {
  contactForm: FormGroup;
  loading = signal(false);
  submitted = signal(false);
  error = signal(false);
  private contactService = inject(ContactService);
  private authService = inject(AuthService);

  faqs = [
    {
      question: "What payment methods do you accept?",
      // ... (omitting irrelevant lines for brevity in prompt, but tool needs exact context)
      // Wait, I can't omit lines in TargetContent.
      // Let me target the injection part first.

      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. Use the method most convenient for you.",
      isOpen: false
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days. Express shipping options (1-2 business days) are available at checkout.",
      isOpen: false
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unused items in their original packaging. Simply contact our support team to initiate a return.",
      isOpen: false
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes! We currently ship to over 50 countries worldwide. International shipping times may vary depending on location.",
      isOpen: false
    }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  toggleFaq(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.loading.set(true);
      this.submitted.set(false);
      this.error.set(false);

      const formData = { ...this.contactForm.value };
      const currentUser = this.authService.currentUser();
      if (currentUser && (currentUser.id || currentUser._id)) {
        formData.userId = currentUser.id || currentUser._id;
      }

      this.contactService.sendMessage(formData).subscribe({
        next: (res) => {
          this.loading.set(false);
          this.submitted.set(true);
          this.contactForm.reset();

          // Hide success message after 5 seconds
          setTimeout(() => this.submitted.set(false), 5000);
        },
        error: (err) => {
          console.error('Error sending message', err);
          this.loading.set(false);
          this.error.set(true);
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}

