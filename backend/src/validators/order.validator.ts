import { z } from 'zod';

export const checkoutValidator = z.object({
    orderItems: z.array(
        z.object({
            product: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
            name: z.string(),
            price: z.number().positive(),
            quantity: z.number().int().positive(),
            image: z.string()
        })
    ).min(1, 'Order must contain at least one item'),
    shippingAddress: z.object({
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        phone: z.string().optional()
    }).passthrough(),
    paymentMethod: z.string().min(2),
    itemsPrice: z.number().nonnegative(),
    taxPrice: z.number().nonnegative(),
    shippingPrice: z.number().nonnegative(),
    totalPrice: z.number().nonnegative(),
    guestEmail: z.string().email('Invalid email address').optional()
});
