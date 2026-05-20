import { z } from 'zod';

export const productValidator = z.object({
    name: z.string().min(3, 'Product name must be at least 3 characters').max(100).trim(),
    description: z.string().min(10, 'Description must be at least 10 characters').trim(),
    price: z.number().positive('Price must be a positive number'),
    originalPrice: z.number().positive('Original price must be a positive number').optional().nullable(),
    imageUrl: z.string().url('Invalid image URL'),
    category: z.string().min(2, 'Category must be at least 2 characters').trim(),
    stock: z.number().int().nonnegative('Stock cannot be negative'),
    isFeatured: z.boolean().optional().default(false),
    inStock: z.boolean().optional().default(true),
    onSale: z.boolean().optional().default(false),
    sizes: z.array(z.string()).optional().default([]),
    additionalImages: z.array(z.string()).optional().default([]),
    vendor: z.string().optional().default('CartifyX'),
    productType: z.string().optional().default('Standard'),
    status: z.enum(['Active', 'Inactive', 'Draft']).optional().default('Active')
});
