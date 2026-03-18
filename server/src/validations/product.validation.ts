import { z } from 'zod';

export const ProductSchema = z.object({
    store_id: z.number({ required_error: 'Store ID is required' }).int().positive(),
    name: z.string().min(1, 'Name is required').max(150, 'Name must be 150 characters or less'),
    category: z.string().min(1, 'Category is required').max(50, 'Category must be 50 characters or less'),
    price: z.number({ required_error: 'Price is required' }).nonnegative('Price must be 0 or greater'),
    quantity: z.number({ required_error: 'Quantity is required' }).int().nonnegative('Quantity must be 0 or greater'),
    sku: z.string().max(50, 'SKU must be 50 characters or less').regex(/^[A-Z0-9-]+$/, 'Invalid SKU number').optional().nullable(),
    description: z.string().max(1000, 'Description must be 1000 characters or less').optional().nullable(),
});

export const UpdateProductSchema = ProductSchema.partial();

export const ProductQuerySchema = z.object({
    storeId: z.coerce.number().int().positive().optional(),
    category: z.string().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    minStock: z.coerce.number().int().nonnegative().optional(),
    maxStock: z.coerce.number().int().nonnegative().optional(),
    search: z.string().optional(),
    sort: z.enum(['name', 'price', 'quantity', 'created_at']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type CreateProductInput = z.infer<typeof ProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductQueryInput = z.infer<typeof ProductQuerySchema>;
