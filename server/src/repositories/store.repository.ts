import db from '../db/index';
import type { Store, CategoryBreakdown, StoreSummary } from '../types';

// ── Store queries ─────────────────────────────────────────────────────────────

export const storeRepository = {
  findAll(): Store[] {
    return db.prepare('SELECT * FROM stores ORDER BY name ASC').all() as Store[];
  },

  findById(id: number): Store | undefined {
    return db.prepare('SELECT * FROM stores WHERE id = ?').get(id) as Store | undefined;
  },

  create(data: { name: string; location: string; description?: string | null }): Store {
    const stmt = db.prepare(`
      INSERT INTO stores (name, location, description)
      VALUES (@name, @location, @description)
    `);
    const result = stmt.run({ description: null, ...data });
    return this.findById(result.lastInsertRowid as number)!;
  },

  update(id: number, data: { name?: string; location?: string; description?: string | null }): Store | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;

    const merged = {
      name: data.name ?? existing.name,
      location: data.location ?? existing.location,
      description: data.description !== undefined ? data.description : existing.description,
    };

    db.prepare(`
      UPDATE stores SET name = @name, location = @location, description = @description,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      WHERE id = @id
    `).run({ ...merged, id });

    return this.findById(id)!;
  },

  delete(id: number): boolean {
    const result = db.prepare('DELETE FROM stores WHERE id = ?').run(id);
    return result.changes > 0;
  },

  /** Non-trivial aggregation endpoint */
  getSummary(id: number): StoreSummary | undefined {
    const store = this.findById(id);
    if (!store) return undefined;

    const metrics = db.prepare(`
      SELECT
        COUNT(*)                          AS total_products,
        COALESCE(SUM(price * quantity), 0) AS total_value,
        COUNT(*) FILTER (WHERE quantity > 0 AND quantity <= 5) AS low_stock_count,
        COUNT(*) FILTER (WHERE quantity = 0) AS out_of_stock_count
      FROM products
      WHERE store_id = ?
    `).get(id) as { total_products: number; total_value: number; low_stock_count: number; out_of_stock_count: number };

    const categories = db.prepare(`
      SELECT
        category,
        COUNT(*)                           AS product_count,
        COALESCE(SUM(price * quantity), 0) AS total_value,
        ROUND(AVG(price), 2)               AS avg_price
      FROM products
      WHERE store_id = ?
      GROUP BY category
      ORDER BY total_value DESC
    `).all(id) as CategoryBreakdown[];

    return {
      store,
      total_products: metrics.total_products,
      total_value: Math.round(metrics.total_value * 100) / 100,
      low_stock_count: metrics.low_stock_count,
      out_of_stock_count: metrics.out_of_stock_count,
      categories,
    };
  },
};
