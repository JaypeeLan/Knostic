import db from './db/index';

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
        // Store 0 - Downtown Flagship
        { store_id: stores[0].id, name: 'ProBook Laptop 15"', category: 'Electronics', price: 1299.99, quantity: 45, sku: 'EL-PBLAP-15', description: 'High-performance laptop with 16GB RAM and 512GB SSD.' },
        { store_id: stores[0].id, name: 'Wireless ANC Headphones', category: 'Electronics', price: 249.95, quantity: 120, sku: 'EL-WANC-HP', description: 'Premium noise-cancelling over-ear headphones.' },
        { store_id: stores[0].id, name: 'Smart Watch Pro', category: 'Electronics', price: 349.99, quantity: 80, sku: 'EL-SWP-01', description: 'Health-focused smartwatch with ECG and SpO2.' },
        { store_id: stores[0].id, name: 'USB-C Hub 7-in-1', category: 'Accessories', price: 59.99, quantity: 200, sku: 'AC-USBC-7', description: '7-port USB-C hub with HDMI, SD card, and PD.' },
        { store_id: stores[0].id, name: 'Mechanical Keyboard', category: 'Accessories', price: 129.99, quantity: 55, sku: 'AC-MECH-KB', description: 'Tactile mechanical keyboard with RGB lighting.' },
        { store_id: stores[0].id, name: 'Ergonomic Mouse', category: 'Accessories', price: 79.99, quantity: 90, sku: 'AC-ERGO-MS', description: 'Wireless ergonomic mouse with thumb support.' },
        { store_id: stores[0].id, name: '1080p Webcam', category: 'Electronics', price: 89.99, quantity: 30, sku: 'EL-WCAM-1080', description: 'Full HD webcam with dual microphones.' },
        { store_id: stores[0].id, name: 'Thunderbolt 4 Dock', category: 'Accessories', price: 299.99, quantity: 15, sku: 'AC-TB4-DK', description: 'High-speed docking station for dual 4K monitors.' },
        { store_id: stores[0].id, name: 'Gel Mouse Pad', category: 'Accessories', price: 19.99, quantity: 250, sku: 'AC-GEL-MP', description: 'Mouse pad with wrist support.' },
        { store_id: stores[0].id, name: 'HDMI 2.1 Cable 2m', category: 'Electronics', price: 24.99, quantity: 500, sku: 'EL-HDMI-21', description: 'Ultra High Speed HDMI cable.' },
        { store_id: stores[0].id, name: 'Noise-Isolating Earbuds', category: 'Electronics', price: 49.99, quantity: 0, sku: 'EL-NIE-01', description: 'Wired earbuds with multiple tip sizes.' },

        // Store 1 - West Coast Hub
        { store_id: stores[1].id, name: 'Wi-Fi 6E Router', category: 'Networking', price: 259.99, quantity: 0, sku: 'NW-ROUT-6E', description: 'Tri-band Wi-Fi 6E mesh router, 8 streams.' },
        { store_id: stores[1].id, name: 'Managed 24-Port Switch', category: 'Networking', price: 449.99, quantity: 12, sku: 'NW-SW24-MG', description: 'Layer 3 managed gigabit ethernet switch.' },
        { store_id: stores[1].id, name: 'Cat6a Cable 100ft', category: 'Networking', price: 34.99, quantity: 150, sku: 'NW-C6A-100', description: 'Bulk ethernet cable for high-speed networking.' },
        { store_id: stores[1].id, name: 'Outdoor Access Point', category: 'Networking', price: 189.99, quantity: 25, sku: 'NW-OAP-01', description: 'Weatherproof long-range Wi-Fi access point.' },
        { store_id: stores[1].id, name: 'Travel Router', category: 'Networking', price: 59.99, quantity: 8, sku: 'NW-TRAV-01', description: 'Portable Wi-Fi router for secure travel.' },
        { store_id: stores[1].id, name: 'Air Purifier Pro', category: 'Kitchenware', price: 399.99, quantity: 45, sku: 'KT-AP-PRO', description: 'HEPA air purifier for large rooms.' },
        { store_id: stores[1].id, name: 'Smart Kettle', category: 'Kitchenware', price: 129.99, quantity: 60, sku: 'KT-SKET-01', description: 'Variable temperature kettle with app control.' },
        { store_id: stores[1].id, name: 'Digital Scale', category: 'Kitchenware', price: 29.99, quantity: 120, sku: 'KT-DSCALE-01', description: 'Precision digital kitchen scale.' },
        { store_id: stores[1].id, name: 'Espresso Machine', category: 'Kitchenware', price: 799.99, quantity: 5, sku: 'KT-ESPR-01', description: 'Manual espresso machine with milk frother.' },
        { store_id: stores[1].id, name: 'Air Fryer XL', category: 'Kitchenware', price: 159.99, quantity: 0, sku: 'KT-AF-XL', description: 'Large capacity air fryer with presets.' },
        { store_id: stores[1].id, name: 'Dot Grid Notebook', category: 'Stationery', price: 15.99, quantity: 300, sku: 'ST-DGN-01', description: 'Hardcover notebook with 120gsm paper.' },
        { store_id: stores[1].id, name: 'Gel Pens Black 12pk', category: 'Stationery', price: 24.99, quantity: 450, sku: 'ST-GEL-B12', description: 'Smooth writing gel pens, archival ink.' },

        // Store 2 - Midwest Depot
        { store_id: stores[2].id, name: 'Heavy-Duty Shelving Unit', category: 'Furniture', price: 349.00, quantity: 30, sku: 'FU-HDSH-01', description: 'Steel shelving, 500 kg capacity, 6 tiers.' },
        { store_id: stores[2].id, name: 'Work Gloves L', category: 'Safety', price: 12.49, quantity: 3, sku: 'SF-WGL-L', description: 'Cut-resistant work gloves, level 5.' },
        { store_id: stores[2].id, name: 'Standing Desk Frame', category: 'Furniture', price: 299.99, quantity: 20, sku: 'FU-SDF-01', description: 'Dual-motor electric standing desk base.' },
        { store_id: stores[2].id, name: 'Office Chair', category: 'Furniture', price: 499.99, quantity: 15, sku: 'FU-CH-ERGO', description: 'Ergonomic mesh chair with adjustable lumbar.' },
        { store_id: stores[2].id, name: 'LED Desk Lamp', category: 'Furniture', price: 45.99, quantity: 100, sku: 'FU-LAMP-LED', description: 'Dimmable desk lamp with USB charging port.' },
        { store_id: stores[2].id, name: 'Safety Vest XL', category: 'Safety', price: 9.99, quantity: 2, sku: 'SF-VEST-XL', description: 'High-visibility safety vest, reflective.' },
        { store_id: stores[2].id, name: 'Safety Glasses', category: 'Safety', price: 14.99, quantity: 50, sku: 'SF-GLASS-01', description: 'Anti-fog protective eyewear.' },
        { store_id: stores[2].id, name: 'Hard Hat White', category: 'Safety', price: 24.99, quantity: 35, sku: 'SF-HAT-WH', description: 'Vented hard hat with suspension system.' },
        { store_id: stores[2].id, name: 'First Aid Kit 100pc', category: 'Safety', price: 39.99, quantity: 60, sku: 'SF-FAK-100', description: 'Comprehensive first aid kit for home/office.' },
        { store_id: stores[2].id, name: 'Filing Cabinet 3-Drawer', category: 'Furniture', price: 189.99, quantity: 0, sku: 'FU-FC-3D', description: 'Steel filing cabinet with lock.' },
        { store_id: stores[2].id, name: 'Whiteboard 4x3ft', category: 'Stationery', price: 59.99, quantity: 25, sku: 'ST-WB-43', description: 'Magnetic dry-erase whiteboard.' },
        { store_id: stores[2].id, name: 'Desktop Stapler', category: 'Stationery', price: 12.99, quantity: 2, sku: 'ST-STAP-01', description: 'Full-size heavy-duty stapler.' },
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
