import { useState, useEffect, useCallback } from 'react';
import { storesApi } from '../api/stores';
import type { Store } from '../types';

export function useStores() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(() => {
        setLoading(true);
        setError(null);
        storesApi.getAll()
            .then(setStores)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const createStore = async (data: { name: string; location: string; description: string }) => {
        setError(null);
        try {
            await storesApi.create(data);
            load();
        } catch (e: any) {
            setError(e.message);
            throw e;
        }
    };

    const deleteStore = async (id: number) => {
        setError(null);
        try {
            await storesApi.delete(id);
            load();
        } catch (e: any) {
            setError(e.message);
            throw e;
        }
    };

    return {
        stores,
        loading,
        error,
        setError,
        createStore,
        deleteStore,
        refresh: load,
    };
}
