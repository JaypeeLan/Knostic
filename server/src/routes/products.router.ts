import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { productModel } from '../models/product.model';
import { storeModel } from '../models/store.model';
import { validate } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';

const router = Router();

const SKU_PATTERN = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

const ProductBody = z.object({
    store_id: z.number().int().positive(),
    name: z.string().min(1).max(200),
    category: z.string().min(1).max(100),
    price: z.number().min(0),
    quantity: z.number().int().min(0),
    sku: z.string().max(100).regex(SKU_PATTERN, 'Invalid SKU number').optional(),
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
 *     summary: Get products with filtering and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: storeId
 *         schema: { type: integer }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated list of products
 */
router.get('/', validate(ProductQuery, 'query'), (req: Request, res: Response) => {
    const q = (req as any).validatedQuery;
    const result = productModel.findAll(q);
    res.json(result);
});

// GET /products/categories
/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Get unique product categories
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of category strings
 */
router.get('/categories', (_req: Request, res: Response) => {
    res.json(productModel.getCategories());
});

// GET /products/:id
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The product object
 *       404:
 *         description: Product not found
 */
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(createError('Invalid product ID', 400));

    const product = productModel.findById(id);
    if (!product) return next(createError('Product not found', 404));

    res.json(product);
});

// POST /products
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [store_id, name, category, price, quantity]
 *             properties:
 *               store_id: { type: integer }
 *               name: { type: string }
 *               category: { type: string }
 *               price: { type: number }
 *               quantity: { type: integer }
 *               sku: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', validate(ProductBody), (req: Request, res: Response, next: NextFunction) => {
    const store = storeModel.findById(req.body.store_id);
    if (!store) return next(createError('Store not found', 404));

    const product = productModel.create(req.body);
    res.status(201).json(product);
});

// PUT /products/:id
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               price: { type: number }
 *               quantity: { type: integer }
 *     responses:
 *       200:
 *         description: Product updated
 */
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
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Product deleted
 */
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(createError('Invalid product ID', 400));

    const deleted = productModel.delete(id);
    if (!deleted) return next(createError('Product not found', 404));

    res.status(204).send();
});

export default router;
