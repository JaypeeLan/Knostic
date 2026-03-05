import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { storeModel } from '../models/store.model';
import { validate } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';

const router = Router();

const StoreBody = z.object({
    name: z.string().min(1).max(100),
    location: z.string().min(1).max(200),
    description: z.string().max(500).optional(),
});

// GET /stores
/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: Get all stores
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: List of all stores
 */
router.get('/', (_req: Request, res: Response) => {
    const stores = storeModel.findAll();
    res.json(stores);
});

// GET /stores/:id
/**
 * @swagger
 * /api/stores/{id}:
 *   get:
 *     summary: Get a store by ID
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The store object
 *       404:
 *         description: Store not found
 */
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(createError('Invalid store ID', 400));

    const store = storeModel.findById(id);
    if (!store) return next(createError('Store not found', 404));

    res.json(store);
});

// GET /stores/:id/summary
/**
 * @swagger
 * /api/stores/{id}/summary:
 *   get:
 *     summary: Get a store performance summary
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Store summary with category breakdown
 *       404:
 *         description: Store not found
 */
router.get('/:id/summary', (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(createError('Invalid store ID', 400));

    const summary = storeModel.getSummary(id);
    if (!summary) return next(createError('Store not found', 404));

    res.json(summary);
});

// POST /stores
/**
 * @swagger
 * /api/stores:
 *   post:
 *     summary: Create a new store
 *     tags: [Stores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, location]
 *             properties:
 *               name: { type: string }
 *               location: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Store created
 */
router.post('/', validate(StoreBody), (req: Request, res: Response) => {
    const store = storeModel.create(req.body);
    res.status(201).json(store);
});

// PUT /stores/:id
/**
 * @swagger
 * /api/stores/{id}:
 *   put:
 *     summary: Update a store
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               location: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Store updated
 */
router.put('/:id', validate(StoreBody.partial()), (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(createError('Invalid store ID', 400));

    const updated = storeModel.update(id, req.body);
    if (!updated) return next(createError('Store not found', 404));

    res.json(updated);
});

// DELETE /stores/:id
/**
 * @swagger
 * /api/stores/{id}:
 *   delete:
 *     summary: Delete a store
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       244:
 *         description: Store deleted
 */
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(createError('Invalid store ID', 400));

    const deleted = storeModel.delete(id);
    if (!deleted) return next(createError('Store not found', 404));

    res.status(204).send();
});

export default router;
