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
router.get('/', storesController.getAll);

// GET /stores/:id
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(createError('Invalid store ID', 400));

    const store = storeModel.findById(id);
    if (!store) return next(createError('Store not found', 404));

    res.json(store);
});

// GET /stores/:id/summary  — non-trivial aggregation
router.get('/:id/summary', (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(createError('Invalid store ID', 400));

    const summary = storeModel.getSummary(id);
    if (!summary) return next(createError('Store not found', 404));

    res.json(summary);
});

// POST /stores
router.post('/', validate(StoreBody), (req: Request, res: Response) => {
    const store = storeModel.create(req.body);
    res.status(201).json(store);
});

// PUT /stores/:id
router.put('/:id', validate(StoreBody.partial()), (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(createError('Invalid store ID', 400));

    const updated = storeModel.update(id, req.body);
    if (!updated) return next(createError('Store not found', 404));

    res.json(updated);
});

// DELETE /stores/:id
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(createError('Invalid store ID', 400));

    const deleted = storeModel.delete(id);
    if (!deleted) return next(createError('Store not found', 404));

    res.status(204).send();
});

export default router;
