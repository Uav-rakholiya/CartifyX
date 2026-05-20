import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading-spinner',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex justify-center items-center" [class]="containerClass">
      <div class="animate-spin rounded-full border-t-2 border-b-2 border-primary-500" [ngClass]="sizeClasses"></div>
    </div>
  `,
    styles: []
})
export class LoadingSpinnerComponent {
    @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
    @Input() containerClass = 'py-12';

    get sizeClasses(): string {
        switch (this.size) {
            case 'sm': return 'h-6 w-6 border-2';
            case 'lg': return 'h-16 w-16 border-4';
            case 'xl': return 'h-24 w-24 border-4';
            default: return 'h-10 w-10 border-2';
        }
    }
}
