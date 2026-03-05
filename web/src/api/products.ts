import { api } from './client';
import type { Product, PaginatedResult, ProductFilters } from '../types';

function buildQuery(filters: ProductFilters): string {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '' && v !== null) params.set(k, String(v));
    });
    const q = params.toString();
    return q ? `?${q}` : '';
}

export const productsApi = {
    getAll: (filters: ProductFilters = {}) =>
        api.get<PaginatedResult<Product>>(`/products${buildQuery(filters)}`),
    getById: (id: number) => api.get<Product>(`/products/${id}`),
    getCategories: () => api.get<string[]>('/products/categories'),
    create: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) =>
        api.post<Product>('/products', data),
    update: (id: number, data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>) =>
        api.put<Product>(`/products/${id}`, data),
    delete: (id: number) => api.delete(`/products/${id}`),
};
