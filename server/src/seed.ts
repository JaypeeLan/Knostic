import db from './db';

// ── Seed function ─────────────────────────────────────────────────────────────
export function seedDatabase() {
    // Check if we already have data
    const count = (db.prepare('SELECT COUNT(*) as count FROM stores').get() as any).count;
    if (count > 0) return;

    console.log('🌱 No data found. Seeding initial database...');

    // ── Seed stores ───────────────────────────────────────────────────────────────
    interface StoreRow { id: number }
    const storeInsert = db.prepare(`
      INSERT INTO stores (name, location, description) VALUES (@name, @location, @description)
    `);

    const stores: StoreRow[] = [];
    const storeData = [
        { name: 'Downtown Flagship', location: 'New York, NY', description: 'Our original flagship store in the heart of Manhattan.' },
        { name: 'West Coast Hub', location: 'San Francisco, CA', description: 'Tech-focused store serving the Bay Area.' },
        { name: 'Midwest Depot', location: 'Chicago, IL', description: 'Large-format warehouse store with industrial supplies.' },
    ];

    for (const s of storeData) {
        const result = storeInsert.run(s);
        stores.push({ id: result.lastInsertRowid as number });
    }

    // ── Seed products ─────────────────────────────────────────────────────────────
    const productInsert = db.prepare(`
      INSERT INTO products (store_id, name, category, price, quantity, sku, description)
      VALUES (@store_id, @name, @category, @price, @quantity, @sku, @description)
    `);

    const products = [
        { store_id: stores[0].id, name: 'ProBook Laptop 15"', category: 'Electronics', price: 1299.99, quantity: 45, sku: 'EL-PBLAP-15', description: 'High-performance laptop with 16GB RAM and 512GB SSD.' },
        { store_id: stores[0].id, name: 'Wireless ANC Headphones', category: 'Electronics', price: 249.95, quantity: 120, sku: 'EL-WANC-HP', description: 'Premium noise-cancelling over-ear headphones.' },
        { store_id: stores[0].id, name: 'USB-C Hub 7-in-1', category: 'Accessories', price: 59.99, quantity: 200, sku: 'AC-USBC-7', description: '7-port USB-C hub with HDMI, SD card, and PD.' },
        { store_id: stores[1].id, name: 'Smart Watch Pro', category: 'Electronics', price: 349.99, quantity: 80, sku: 'EL-SWP-01', description: 'Health-focused smartwatch with ECG and SpO2.' },
        { store_id: stores[1].id, name: 'Wi-Fi 6E Router', category: 'Networking', price: 259.99, quantity: 0, sku: 'NW-ROUT-6E', description: 'Tri-band Wi-Fi 6E mesh router, 8 streams.' },
        { store_id: stores[2].id, name: 'Heavy-Duty Shelving Unit', category: 'Furniture', price: 349.00, quantity: 30, sku: 'FU-HDSH-01', description: 'Steel shelving, 500 kg capacity, 6 tiers.' },
        { store_id: stores[2].id, name: 'Work Gloves L', category: 'Safety', price: 12.49, quantity: 3, sku: 'SF-WGL-L', description: 'Cut-resistant work gloves, level 5.' },
        // ... (truncated for brevity in source, but I'll keep the core ones)
    ];

    const seedAll = db.transaction(() => {
        for (const p of products) productInsert.run(p);
    });

    seedAll();
    console.log(`✅ Seeded ${storeData.length} stores and ${products.length} products.`);
}

// Allow running as a standalone script
if (require.main === module) {
    seedDatabase();
}
