import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
    selector: 'app-admin-product-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-white">Products</h1>
        <a routerLink="/admin/products/new" class="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
            <span class="material-icons mr-2">add</span>
            Add Product
        </a>
      </div>

      <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
        <table class="w-full text-left text-sm text-gray-400">
            <thead class="bg-dark-950 text-xs uppercase font-medium">
                <tr>
                    <th class="px-6 py-4">Product</th>
                    <th class="px-6 py-4">Category</th>
                    <th class="px-6 py-4">Price</th>
                    <th class="px-6 py-4">Stock</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-dark-800">
                <tr *ngFor="let product of products()" class="hover:bg-dark-800/50 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center">
                            <div class="h-10 w-10 flex-shrink-0">
                                <img [src]="product.imageUrl" [alt]="product.name" class="h-10 w-10 rounded-lg object-cover">
                            </div>
                            <div class="ml-4">
                                <div class="font-medium text-white">{{ product.name }}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4">{{ product.category }}</td>
                    <td class="px-6 py-4">{{ product.price | currency:'INR' }}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded-full text-xs font-medium" 
                            [ngClass]="product.stock > 10 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'">
                            {{ product.stock }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right space-x-2">
                        <a [routerLink]="['/admin/products', product._id || product.id, 'orders']" class="text-xs bg-dark-800 hover:bg-dark-700 text-gray-300 px-2 py-1.5 rounded-md transition-colors mr-2">
                            <span class="material-icons text-[14px] align-middle mr-1">analytics</span>Orders
                        </a>
                        <a [routerLink]="['/admin/products', product._id || product.id]" class="text-blue-400 hover:text-blue-300 transition-colors">Edit</a>
                        <button (click)="deleteProduct(product._id || product.id)" class="text-red-400 hover:text-red-300 transition-colors">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminProductListComponent {
    private productService = inject(ProductService);
    products = signal<Product[]>([]);

    constructor() {
        this.loadProducts();
    }

    loadProducts() {
        this.productService.getProducts().subscribe(res => {
            this.products.set(res.data);
        });
    }

    deleteProduct(id: string) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.productService.deleteProduct(id).subscribe(() => {
                this.loadProducts();
            });
        }
    }
}
