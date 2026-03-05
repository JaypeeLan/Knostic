import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { productModel } from '../models/product.model';
import { storeModel } from '../models/store.model';
import { validate } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';

const router = Router();

const ProductBody = z.object({
    store_id: z.number().int().positive(),
    name: z.string().min(1).max(200),
    category: z.string().min(1).max(100),
    price: z.number().min(0),
    quantity: z.number().int().min(0),
    sku: z.string().max(100).optional(),
    description: z.string().max(1000).optional(),
});

const ProductQuery = z.object({
    storeId: z.coerce.number().int().positive().optional(),
    category: z.string().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    minStock: z.coerce.number().int().min(0).optional(),
    maxStock: z.coerce.number().int().min(0).optional(),
    search: z.string().optional(),
    sort: z.enum(['name', 'price', 'quantity', 'created_at']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
});

// GET /products
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get('/', validate(ProductQuery, 'query'), (req: Request, res: Response) => {
    const q = (req as any).validatedQuery;
    const result = productModel.findAll(q);
    res.json(result);
});

// GET /products/categories
router.get('/categories', (_req: Request, res: Response) => {
    res.json(productModel.getCategories());
});

// GET /products/:id
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(createError('Invalid product ID', 400));

    const product = productModel.findById(id);
    if (!product) return next(createError('Product not found', 404));

    res.json(product);
});

// POST /products
router.post('/', validate(ProductBody), (req: Request, res: Response, next: NextFunction) => {
    const store = storeModel.findById(req.body.store_id);
    if (!store) return next(createError('Store not found', 404));

    const product = productModel.create(req.body);
    res.status(201).json(product);
});

// PUT /products/:id
router.put('/:id', validate(ProductBody.partial()), (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(createError('Invalid product ID', 400));

    if (req.body.store_id !== undefined) {
        const store = storeModel.findById(req.body.store_id);
        if (!store) return next(createError('Store not found', 404));
    }

    const updated = productModel.update(id, req.body);
    if (!updated) return next(createError('Product not found', 404));

    res.json(updated);
});

// DELETE /products/:id
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(createError('Invalid product ID', 400));

    const deleted = productModel.delete(id);
    if (!deleted) return next(createError('Product not found', 404));

    res.status(204).send();
});

export default router;
