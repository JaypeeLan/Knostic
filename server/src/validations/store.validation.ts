import { z } from 'zod';

export const StoreSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
    location: z.string().min(1, 'Location is required').max(200, 'Location must be 200 characters or less'),
    description: z.string().max(500, 'Description must be 500 characters or less').optional().nullable(),
});

export const UpdateStoreSchema = StoreSchema.partial();

export type CreateStoreInput = z.infer<typeof StoreSchema>;
export type UpdateStoreInput = z.infer<typeof UpdateStoreSchema>;
