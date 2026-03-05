// Shared TypeScript types (mirrors server types)

export interface Store {
    id: number;
    name: string;
    location: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    store_id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
    sku: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface StoreSummary {
    store: Store;
    total_products: number;
    total_value: number;
    low_stock_count: number;
    out_of_stock_count: number;
    categories: CategoryBreakdown[];
}

export interface CategoryBreakdown {
    category: string;
    product_count: number;
    total_value: number;
    avg_price: number;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
        has_next: boolean;
        has_prev: boolean;
    };
}

export interface ProductFilters {
    storeId?: number;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    minStock?: string;
    maxStock?: string;
    search?: string;
    sort?: string;
    order?: string;
    page?: number;
    limit?: number;
}
