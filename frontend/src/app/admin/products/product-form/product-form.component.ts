import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
    selector: 'app-admin-product-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold text-white">{{ isEditMode() ? 'Edit Product' : 'Add New Product' }}</h1>

      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="bg-dark-900 border border-dark-800 rounded-2xl p-6 sm:p-8 space-y-6">
        
        <!-- Name -->
        <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Product Title</label>
            <input type="text" formControlName="name" class="block w-full rounded-md bg-dark-800 border-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4" placeholder="e.g. Classic White Hoodie">
        </div>

        <!-- Description -->
         <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea formControlName="description" rows="4" class="block w-full rounded-md bg-dark-800 border-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4"></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Price -->
            <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Price (Rs.)</label>
                <div class="relative rounded-md shadow-sm">
                    <input type="number" formControlName="price" class="block w-full rounded-md bg-dark-800 border-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4">
                </div>
            </div>

            <!-- Compare Price -->
            <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Compare Price (Rs.)</label>
                <input type="number" formControlName="originalPrice" class="block w-full rounded-md bg-dark-800 border-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4">
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <!-- Stock Quantity -->
            <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Stock Quantity</label>
                <input type="number" formControlName="stock" class="block w-full rounded-md bg-dark-800 border-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4">
            </div>

            <!-- Inventory Checks -->
            <div class="flex flex-col gap-2 pb-2">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" formControlName="inStock" class="rounded bg-dark-800 border-dark-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-dark-900 w-4 h-4">
                    <span class="text-sm text-gray-300">In Stock</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" formControlName="onSale" class="rounded bg-dark-800 border-dark-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-dark-900 w-4 h-4">
                    <span class="text-sm text-gray-300">On Sale</span>
                </label>
            </div>
        </div>

        <!-- Available Sizes -->
        <div>
            <label class="block text-sm font-medium text-gray-400 mb-3">Available Sizes</label>
            <div class="flex flex-wrap gap-4">
                <label *ngFor="let size of availableSizesList" class="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                    <input type="checkbox" 
                           [checked]="isSizeSelected(size)"
                           (change)="toggleSize(size, $event)"
                           class="rounded bg-dark-800 border-dark-600 text-primary-600 focus:ring-primary-500 w-4 h-4">
                    {{ size }}
                </label>
            </div>
        </div>

        <!-- Main Image -->
        <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Main Image URL</label>
            <input type="text" formControlName="imageUrl" class="block w-full rounded-md bg-dark-800 border-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4" placeholder="http://example.com/image.jpg">
        </div>

        <!-- Additional Images -->
        <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Additional Images (comma separated URLs)</label>
            <textarea formControlName="additionalImagesRaw" rows="2" class="block w-full rounded-md bg-dark-800 border-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4" placeholder="http://example.com/1.jpg, http://example.com/2.jpg"></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <!-- Category -->
            <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <input type="text" formControlName="category" class="block w-full rounded-md bg-dark-800 border-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4">
            </div>

             <!-- Vendor -->
            <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Vendor</label>
                <input type="text" formControlName="vendor" class="block w-full rounded-md bg-dark-800 border-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4">
            </div>
        </div>

        <!-- Product Type -->
        <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Product Type</label>
            <input type="text" formControlName="productType" class="block w-full md:w-1/2 rounded-md bg-dark-800 border-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4" placeholder="e.g. Amazon, Top">
        </div>



        <!-- Submit Button -->
        <div class="pt-4 flex justify-end border-t border-dark-800 mt-8 pt-8">
            <button type="submit" [disabled]="productForm.invalid || isProcessing()" class="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 min-w-40">
                {{ isProcessing() ? 'Saving...' : (isEditMode() ? 'Save Changes' : 'Publish Product') }}
            </button>
        </div>

      </form>

      <!-- Recent Orders Section -->
      <div *ngIf="isEditMode()" class="space-y-4 pt-4">
        <h2 class="text-xl font-bold text-white">Recent Orders Overview</h2>
        
        <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
            <div *ngIf="productOrders().length === 0" class="p-8 text-center text-gray-500">
                No purchases tracked for this item yet.
            </div>

            <table *ngIf="productOrders().length > 0" class="w-full text-left text-sm text-gray-400">
                <thead class="bg-dark-950 text-xs uppercase font-medium">
                    <tr>
                        <th class="px-6 py-4">Order ID</th>
                        <th class="px-6 py-4">Customer</th>
                        <th class="px-6 py-4">Quantity</th>
                        <th class="px-6 py-4">Date</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-dark-800">
                    <tr *ngFor="let order of productOrders()" class="hover:bg-dark-800/50 transition-colors">
                        <td class="px-6 py-4 font-mono text-xs">{{ order._id | slice:-6 }}</td>
                        <td class="px-6 py-4 text-white">
                            {{ order.user?.name || 'Guest' }}
                            <div class="text-xs text-gray-500">{{ order.user?.email }}</div>
                        </td>
                        <td class="px-6 py-4 text-white font-medium">
                            <ng-container *ngFor="let item of order.items">
                                <span *ngIf="item.product === productId">{{ item.quantity }}</span>
                            </ng-container>
                        </td>
                        <td class="px-6 py-4">{{ order.createdAt | date:'mediumDate' }}</td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 rounded-full text-xs font-medium"
                                [ngClass]="{
                                    'bg-green-500/10 text-green-500': order.status === 'Delivered',
                                    'bg-blue-500/10 text-blue-500': order.status === 'Shipped',
                                    'bg-yellow-500/10 text-yellow-500': order.status === 'Processing'
                                }">
                                {{ order.status }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right">
                             <a [routerLink]="['/admin/orders', order._id]" class="text-primary-400 hover:text-primary-300 font-medium text-xs">Manage</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  `
})
export class AdminProductFormComponent {
    private fb = inject(FormBuilder);
    private productService = inject(ProductService);
    private orderService = inject(OrderService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    isEditMode = signal(false);
    isProcessing = signal(false);
    productId: string | null = null;

    availableSizesList = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11'];
    selectedSizes = signal<string[]>([]);

    productForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        originalPrice: [null as number | null],
        stock: [0, [Validators.required, Validators.min(0)]],
        inStock: [true],
        onSale: [false],
        category: ['', Validators.required],
        vendor: ['CartifyX'],
        productType: [''],
        imageUrl: ['', Validators.required],
        additionalImagesRaw: [''] // Will split by comma on submit
    });

    constructor() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.isEditMode.set(true);
                this.productId = id;
                this.loadProduct(id);
                this.loadProductOrders(id);
            }
        });
    }

    loadProduct(id: string) {
        this.productService.getProductById(id).subscribe(product => {
            // Repopulate arrays safely
            this.selectedSizes.set(product.sizes || []);
            const additionalImgsStr = (product.additionalImages || []).join(', ');

            this.productForm.patchValue({
                ...product,
                additionalImagesRaw: additionalImgsStr
            });
        });
    }

    isSizeSelected(size: string): boolean {
        return this.selectedSizes().includes(size);
    }

    toggleSize(size: string, event: any) {
        if (event.target.checked) {
            this.selectedSizes.update(s => [...s, size]);
        } else {
            this.selectedSizes.update(s => s.filter(val => val !== size));
        }
    }

    productOrders = signal<any[]>([]);

    loadProductOrders(id: string) {
        // @ts-ignore
        this.orderService.getOrdersByProduct(id).subscribe(res => {
            this.productOrders.set(res.data);
        });
    }

    onSubmit() {
        if (this.productForm.valid) {
            this.isProcessing.set(true);
            const formVal = this.productForm.value;

            // Format arrays
            // @ts-ignore
            const addImages = formVal.additionalImagesRaw ? formVal.additionalImagesRaw.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];

            const productData = {
                ...formVal,
                sizes: this.selectedSizes(),
                additionalImages: addImages
            };

            // Remove the raw fields before saving
            // @ts-ignore
            delete productData.additionalImagesRaw;

            if (this.isEditMode() && this.productId) {
                // @ts-ignore
                this.productService.updateProduct(this.productId, productData).subscribe({
                    next: () => {
                        this.isProcessing.set(false);
                        this.router.navigate(['/admin/products']);
                    },
                    error: (err) => {
                        console.error(err);
                        this.isProcessing.set(false);
                    }
                });
            } else {
                // @ts-ignore
                this.productService.createProduct(productData).subscribe({
                    next: () => {
                        this.isProcessing.set(false);
                        this.router.navigate(['/admin/products']);
                    },
                    error: (err) => {
                        console.error(err);
                        this.isProcessing.set(false);
                    }
                });
            }
        }
    }
}
