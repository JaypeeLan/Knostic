import db from '../db';
import type { Product, ProductFilters, PaginatedResult } from '../types';

const ALLOWED_SORT = ['name', 'price', 'quantity', 'created_at'] as const;
const ALLOWED_ORDER = ['asc', 'desc'] as const;

export const productModel = {
    findAll(filters: ProductFilters = {}): PaginatedResult<Product> {
        const {
            storeId,
            category,
            minPrice,
            maxPrice,
            minStock,
            maxStock,
            search,
            sort = 'created_at',
            order = 'desc',
            page = 1,
            limit = 20,
        } = filters;

        const safeSortCol = ALLOWED_SORT.includes(sort as any) ? sort : 'created_at';
        const safeOrder = ALLOWED_ORDER.includes(order as any) ? order : 'desc';

        const conditions: string[] = [];
        const params: Record<string, unknown> = {};

        if (storeId !== undefined) { conditions.push('store_id = @storeId'); params.storeId = storeId; }
        if (category) { conditions.push('category = @category'); params.category = category; }
        if (minPrice !== undefined) { conditions.push('price >= @minPrice'); params.minPrice = minPrice; }
        if (maxPrice !== undefined) { conditions.push('price <= @maxPrice'); params.maxPrice = maxPrice; }
        if (minStock !== undefined) { conditions.push('quantity >= @minStock'); params.minStock = minStock; }
        if (maxStock !== undefined) { conditions.push('quantity <= @maxStock'); params.maxStock = maxStock; }
        if (search) {
            conditions.push('(name LIKE @search OR description LIKE @search OR sku LIKE @search)');
            params.search = `%${search}%`;
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        const total = (db.prepare(`SELECT COUNT(*) as n FROM products ${where}`).get(params) as { n: number }).n;

        const safePage = Math.max(1, page);
        const safeLimit = Math.min(100, Math.max(1, limit));
        const offset = (safePage - 1) * safeLimit;

        params.limit = safeLimit;
        params.offset = offset;

        const data = db.prepare(
            `SELECT * FROM products ${where} ORDER BY ${safeSortCol} ${safeOrder} LIMIT @limit OFFSET @offset`
        ).all(params) as Product[];

        return {
            data,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                total_pages: Math.ceil(total / safeLimit),
                has_next: offset + safeLimit < total,
                has_prev: safePage > 1,
            },
        };
    },

    findById(id: number): Product | undefined {
        return db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | undefined;
    },

    create(data: {
        store_id: number; name: string; category: string;
        price: number; quantity: number; sku?: string; description?: string;
    }): Product {
        const stmt = db.prepare(`
      INSERT INTO products (store_id, name, category, price, quantity, sku, description)
      VALUES (@store_id, @name, @category, @price, @quantity, @sku, @description)
    `);
        const result = stmt.run({ sku: null, description: null, ...data });
        return this.findById(result.lastInsertRowid as number)!;
    },

    update(id: number, data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Product | undefined {
        const existing = this.findById(id);
        if (!existing) return undefined;

        const merged = {
            store_id: data.store_id ?? existing.store_id,
            name: data.name ?? existing.name,
            category: data.category ?? existing.category,
            price: data.price ?? existing.price,
            quantity: data.quantity ?? existing.quantity,
            sku: data.sku !== undefined ? data.sku : existing.sku,
            description: data.description !== undefined ? data.description : existing.description,
        };

        db.prepare(`
      UPDATE products SET
        store_id = @store_id, name = @name, category = @category,
        price = @price, quantity = @quantity, sku = @sku, description = @description,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      WHERE id = @id
    `).run({ ...merged, id });

        return this.findById(id)!;
    },

    delete(id: number): boolean {
        const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
        return result.changes > 0;
    },

    getCategories(): string[] {
        return (db.prepare('SELECT DISTINCT category FROM products ORDER BY category ASC').all() as { category: string }[])
            .map(r => r.category);
    },
};
