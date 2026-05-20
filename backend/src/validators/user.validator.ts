import { z } from 'zod';

export const registerValidator = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be under 50 characters').trim(),
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters').max(100),
    phone: z.string().optional()
});

export const loginValidator = z.object({
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    password: z.string().min(1, 'Password is required')
});
