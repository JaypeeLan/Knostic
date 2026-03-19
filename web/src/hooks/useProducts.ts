import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '../api/products';
import { storesApi } from '../api/stores';
import type { Product, PaginatedResult, Store, ProductFilters } from '../types';

const LIMIT = 15;

export function useProducts() {
    const [result, setResult] = useState<PaginatedResult<Product> | null>(null);
    const [stores, setStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<ProductFilters>({
        search: '',
        storeId: undefined,
        category: '',
        minPrice: '',
        maxPrice: '',
        minStock: '',
        maxStock: '',
        sort: 'created_at',
        order: 'desc',
        page: 1,
    });

    const load = useCallback(() => {
        setLoading(true);
        setError(null);
        productsApi.getAll({
            ...filters,
            limit: LIMIT,
        })
            .then(setResult)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [filters]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        Promise.all([storesApi.getAll(), productsApi.getCategories()])
            .then(([s, c]) => {
                setStores(s);
                setCategories(c);
            });
    }, []);

    const updateFilter = (newFilters: Partial<ProductFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: newFilters.page || 1, // Reset to page 1 unless page is explicitly set
        }));
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            storeId: undefined,
            category: '',
            minPrice: '',
            maxPrice: '',
            minStock: '',
            maxStock: '',
            sort: 'created_at',
            order: 'desc',
            page: 1,
        });
    };

    const deleteProduct = async (id: number) => {
        try {
            await productsApi.delete(id);
            load();
        } catch (e: any) {
            setError(e.message);
            throw e;
        }
    };

    return {
        products: result?.data ?? [],
        pagination: result?.pagination,
        stores,
        categories,
        loading,
        error,
        filters,
        updateFilter,
        resetFilters,
        deleteProduct,
        setPage: (page: number) => setFilters(prev => ({ ...prev, page })),
    };
}
