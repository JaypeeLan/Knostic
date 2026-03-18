import { Request, Response, NextFunction } from 'express';
import { storeService } from '../services/store.service';
import { createError } from '../middleware/errorHandler';

export const storeController = {
    async getAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const stores = await storeService.getAll();
            res.json(stores);
        } catch (error) {
            next(error);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return next(createError('Invalid store ID', 400));

            const store = await storeService.getById(id);
            if (!store) return next(createError('Store not found', 404));

            res.json(store);
        } catch (error) {
            next(error);
        }
    },

    async getSummary(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return next(createError('Invalid store ID', 400));

            const summary = await storeService.getSummary(id);
            if (!summary) return next(createError('Store not found', 404));

            res.json(summary);
        } catch (error) {
            next(error);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const store = await storeService.create(req.body);
            res.status(201).json(store);
        } catch (error) {
            next(error);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return next(createError('Invalid store ID', 400));

            const updated = await storeService.update(id, req.body);
            if (!updated) return next(createError('Store not found', 404));

            res.json(updated);
        } catch (error) {
            next(error);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return next(createError('Invalid store ID', 400));

            const deleted = await storeService.delete(id);
            if (!deleted) return next(createError('Store not found', 404));

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};
