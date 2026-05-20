import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container mx-auto p-4 text-center">
      <h1 class="text-4xl font-bold text-red-600 mb-4">404</h1>
      <p class="text-xl">Page Not Found</p>
    </div>
  `
})
export class NotFoundComponent { }
