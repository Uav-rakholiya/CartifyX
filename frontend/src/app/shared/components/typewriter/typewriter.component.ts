import { Component, Input, OnInit, OnDestroy, Signal, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-typewriter',
    standalone: true,
    imports: [CommonModule],
    template: `
    <span class="inline-block relative">
      {{ currentText() }}
      <span class="animate-pulse ml-1 text-yellow-500">|</span>
    </span>
  `,
    styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class TypewriterComponent implements OnInit, OnDestroy {
    @Input() phrases: string[] = [];
    @Input() typingSpeed = 100;
    @Input() deletingSpeed = 50;
    @Input() delayBeforeDelete = 2000;

    private currentPhraseIndex = 0;
    private charIndex = 0;
    private isDeleting = false;
    private timeoutId: any;

    // Signal for reactive UI updates
    currentText = signal('');

    ngOnInit() {
        if (this.phrases.length > 0) {
            this.type();
        }
    }

    ngOnDestroy() {
        clearTimeout(this.timeoutId);
    }

    private type() {
        const currentPhrase = this.phrases[this.currentPhraseIndex];

        if (this.isDeleting) {
            this.currentText.set(currentPhrase.substring(0, this.charIndex - 1));
            this.charIndex--;
        } else {
            this.currentText.set(currentPhrase.substring(0, this.charIndex + 1));
            this.charIndex++;
        }

        let typeSpeed = this.typingSpeed;

        if (this.isDeleting) {
            typeSpeed = this.deletingSpeed;
        }

        if (!this.isDeleting && this.charIndex === currentPhrase.length) {
            typeSpeed = this.delayBeforeDelete;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
            typeSpeed = 500;
        }

        this.timeoutId = setTimeout(() => this.type(), typeSpeed);
    }
}
