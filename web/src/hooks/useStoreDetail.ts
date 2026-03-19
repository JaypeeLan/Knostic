import { useState, useEffect, useCallback } from 'react';
import { storesApi } from '../api/stores';
import { productsApi } from '../api/products';
import type { StoreSummary, Product } from '../types';

export function useStoreDetail(id: string | undefined) {
    const [summary, setSummary] = useState<StoreSummary | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(() => {
        if (!id) return;
        setLoading(true);
        setError(null);
        Promise.all([
            storesApi.getSummary(Number(id)),
            productsApi.getAll({ storeId: Number(id), limit: 100 }),
        ])
            .then(([sum, prods]) => {
                setSummary(sum);
                setProducts(prods.data);
            })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    const deleteProduct = async (productId: number) => {
        try {
            await productsApi.delete(productId);
            load();
        } catch (e: any) {
            setError(e.message);
            throw e;
        }
    };

    return {
        summary,
        products,
        loading,
        error,
        deleteProduct,
        refresh: load,
    };
}
