import { api } from './client';
import type { Store, StoreSummary } from '../types';

export const storesApi = {
    getAll: () => api.get<Store[]>('/stores'),
    getById: (id: number) => api.get<Store>(`/stores/${id}`),
    getSummary: (id: number) => api.get<StoreSummary>(`/stores/${id}/summary`),
    create: (data: Omit<Store, 'id' | 'created_at' | 'updated_at'>) =>
        api.post<Store>('/stores', data),
    update: (id: number, data: Partial<Omit<Store, 'id' | 'created_at' | 'updated_at'>>) =>
        api.put<Store>(`/stores/${id}`, data),
    delete: (id: number) => api.delete(`/stores/${id}`),
};
