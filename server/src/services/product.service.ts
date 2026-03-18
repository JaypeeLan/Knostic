import { productRepository } from '../repositories/product.repository';
import { storeRepository } from '../repositories/store.repository';
import { createError } from '../middleware/errorHandler';
import type { Product, PaginatedResult } from '../types';
import type { CreateProductInput, UpdateProductInput, ProductQueryInput } from '../validations/product.validation';

export const productService = {
    async getAll(filters: ProductQueryInput): Promise<PaginatedResult<Product>> {
        return productRepository.findAll(filters);
    },

    async getById(id: number): Promise<Product | undefined> {
        return productRepository.findById(id);
    },

    async create(data: CreateProductInput): Promise<Product> {
        const store = storeRepository.findById(data.store_id);
        if (!store) throw createError('Store not found', 404);
        return productRepository.create(data);
    },

    async update(id: number, data: UpdateProductInput): Promise<Product | undefined> {
        return productRepository.update(id, data);
    },

    async delete(id: number): Promise<boolean> {
        return productRepository.delete(id);
    },

    async getCategories(): Promise<string[]> {
        return productRepository.getCategories();
    }
};
