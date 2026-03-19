import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '../api/products';
import { storesApi } from '../api/stores';
import type { Store } from '../types';

interface FormData {
    store_id: string;
    name: string;
    category: string;
    price: string;
    quantity: string;
    sku: string;
    description: string;
}

export function useProductForm(id: string | undefined, searchParams: URLSearchParams) {
    const isEdit = Boolean(id);
    const [stores, setStores] = useState<Store[]>([]);
    const [formState, setFormState] = useState({
        data: {
            store_id: searchParams.get('storeId') ?? '',
            name: '',
            category: '',
            price: '',
            quantity: '',
            sku: '',
            description: '',
        } as FormData,
        errors: {} as Partial<Record<keyof FormData, string>>,
        loading: isEdit,
        submitting: false,
        apiError: null as string | null,
    });

    const loadData = useCallback(async () => {
        try {
            const s = await storesApi.getAll();
            setStores(s);

            if (isEdit && id) {
                const p = await productsApi.getById(Number(id));
                setFormState(prev => ({
                    ...prev,
                    data: {
                        store_id: String(p.store_id),
                        name: p.name,
                        category: p.category,
                        price: String(p.price),
                        quantity: String(p.quantity),
                        sku: p.sku ?? '',
                        description: p.description ?? '',
                    },
                    loading: false,
                }));
            } else {
                setFormState(prev => ({ ...prev, loading: false }));
            }
        } catch (e: any) {
            setFormState(prev => ({ ...prev, apiError: e.message, loading: false }));
        }
    }, [id, isEdit]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const validate = (data: FormData): Partial<Record<keyof FormData, string>> => {
        const errs: Partial<Record<keyof FormData, string>> = {};
        if (!data.store_id) errs.store_id = 'Store is required';
        if (!data.name.trim()) errs.name = 'Name is required';
        if (!data.category) errs.category = 'Category is required';
        if (!data.price || isNaN(Number(data.price)) || Number(data.price) < 0) {
            errs.price = 'Price must be a non-negative number';
        }
        if (!data.quantity || isNaN(Number(data.quantity)) || Number(data.quantity) < 0 || !Number.isInteger(Number(data.quantity))) {
            errs.quantity = 'Quantity must be a non-negative integer';
        }
        return errs;
    };

    const handleChange = (name: keyof FormData, value: string) => {
        setFormState(prev => ({
            ...prev,
            data: { ...prev.data, [name]: value },
            errors: { ...prev.errors, [name]: undefined },
        }));
    };

    const submit = async () => {
        const errs = validate(formState.data);
        if (Object.keys(errs).length) {
            setFormState(prev => ({ ...prev, errors: errs }));
            return false;
        }

        setFormState(prev => ({ ...prev, submitting: true, apiError: null }));
        const payload = {
            store_id: Number(formState.data.store_id),
            name: formState.data.name.trim(),
            category: formState.data.category,
            price: Number(formState.data.price),
            quantity: Number(formState.data.quantity),
            sku: formState.data.sku.trim() || undefined,
            description: formState.data.description.trim() || undefined,
        };

        try {
            if (isEdit && id) {
                await productsApi.update(Number(id), payload);
            } else {
                await productsApi.create(payload as any);
            }
            return payload.store_id;
        } catch (e: any) {
            setFormState(prev => ({ ...prev, apiError: e.message, submitting: false }));
            return false;
        }
    };

    return {
        stores,
        formState,
        handleChange,
        submit,
    };
}
