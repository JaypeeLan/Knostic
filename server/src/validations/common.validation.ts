import { z } from 'zod';

export const IdParamSchema = z.object({
    id: z.coerce.number().int().positive('ID must be a positive integer'),
});

export type IdParamInput = z.infer<typeof IdParamSchema>;
