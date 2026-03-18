import { storeRepository } from '../repositories/store.repository';
import type { Store, StoreSummary } from '../types';
import type { CreateStoreInput, UpdateStoreInput } from '../validations/store.validation';

export const storeService = {
    async getAll(): Promise<Store[]> {
        return storeRepository.findAll();
    },

    async getById(id: number): Promise<Store | undefined> {
        return storeRepository.findById(id);
    },

    async getSummary(id: number): Promise<StoreSummary | undefined> {
        return storeRepository.getSummary(id);
    },

    async create(data: CreateStoreInput): Promise<Store> {
        return storeRepository.create(data);
    },

    async update(id: number, data: UpdateStoreInput): Promise<Store | undefined> {
        return storeRepository.update(id, data);
    },

    async delete(id: number): Promise<boolean> {
        return storeRepository.delete(id);
    }
};
