import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { createError } from '../middleware/errorHandler';

export const productController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await productService.getAll(req.query as any);
            res.json(products);
        } catch (error) {
            next(error);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return next(createError('Invalid product ID', 400));

            const product = await productService.getById(id);
            if (!product) return next(createError('Product not found', 404));

            res.json(product);
        } catch (error) {
            next(error);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return next(createError('Invalid product ID', 400));

            const updated = await productService.update(id, req.body);
            if (!updated) return next(createError('Product not found', 404));

            res.json(updated);
        } catch (error) {
            next(error);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return next(createError('Invalid product ID', 400));

            const deleted = await productService.delete(id);
            if (!deleted) return next(createError('Product not found', 404));

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    async getCategories(_req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await productService.getCategories();
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }
};
