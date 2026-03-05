import db from './db';

// ── Clear existing data ───────────────────────────────────────────────────────
db.exec("DELETE FROM products; DELETE FROM stores; DELETE FROM sqlite_sequence WHERE name IN ('products','stores');");

// ── Seed stores ───────────────────────────────────────────────────────────────
interface StoreRow { id: number }

const storeInsert = db.prepare(`
  INSERT INTO stores (name, location, description) VALUES (@name, @location, @description)
`);

const stores: StoreRow[] = [];

const storeData = [
    {
        name: 'Downtown Flagship',
        location: 'New York, NY',
        description: 'Our original flagship store in the heart of Manhattan.',
    },
    {
        name: 'West Coast Hub',
        location: 'San Francisco, CA',
        description: 'Tech-focused store serving the Bay Area.',
    },
    {
        name: 'Midwest Depot',
        location: 'Chicago, IL',
        description: 'Large-format warehouse store with industrial supplies.',
    },
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
    // Downtown Flagship — Electronics & Accessories
    { store_id: stores[0].id, name: 'ProBook Laptop 15"', category: 'Electronics', price: 1299.99, quantity: 45, sku: 'EL-PBLAP-15', description: 'High-performance laptop with 16GB RAM and 512GB SSD.' },
    { store_id: stores[0].id, name: 'Wireless ANC Headphones', category: 'Electronics', price: 249.95, quantity: 120, sku: 'EL-WANC-HP', description: 'Premium noise-cancelling over-ear headphones.' },
    { store_id: stores[0].id, name: 'Mechanical Keyboard', category: 'Electronics', price: 139.99, quantity: 75, sku: 'EL-MKEY-01', description: 'Tenkeyless mechanical keyboard, Cherry MX Brown switches.' },
    { store_id: stores[0].id, name: 'USB-C Hub 7-in-1', category: 'Accessories', price: 59.99, quantity: 200, sku: 'AC-USBC-7', description: '7-port USB-C hub with HDMI, SD card, and PD.' },
    { store_id: stores[0].id, name: 'Monitor 27" 4K', category: 'Electronics', price: 549.00, quantity: 0, sku: 'EL-MON-27K', description: '27-inch 4K IPS display, 144Hz refresh rate.' },
    { store_id: stores[0].id, name: 'Laptop Stand', category: 'Accessories', price: 34.99, quantity: 3, sku: 'AC-LPST-01', description: 'Adjustable aluminium laptop stand.' },
    { store_id: stores[0].id, name: 'Wireless Mouse', category: 'Electronics', price: 49.99, quantity: 180, sku: 'EL-WMOU-01', description: 'Ergonomic wireless mouse with 1-year battery life.' },
    { store_id: stores[0].id, name: 'Webcam 1080p', category: 'Electronics', price: 89.99, quantity: 60, sku: 'EL-WEB-1080', description: 'Full HD webcam with built-in ring light.' },
    { store_id: stores[0].id, name: 'Cable Management Kit', category: 'Accessories', price: 19.99, quantity: 4, sku: 'AC-CBL-KIT', description: 'Velcro straps, clips, and sleeves for tidy setups.' },
    { store_id: stores[0].id, name: 'Smart Speaker Mini', category: 'Electronics', price: 79.00, quantity: 95, sku: 'EL-SSMINI-01', description: 'Compact AI-powered smart speaker, 360° sound.' },
    { store_id: stores[0].id, name: 'Portable SSD 1TB', category: 'Electronics', price: 109.99, quantity: 55, sku: 'EL-PSSD-1TB', description: 'Ultra-fast portable SSD, USB-C 3.2.' },
    { store_id: stores[0].id, name: 'Desk Mat XL', category: 'Accessories', price: 29.99, quantity: 1, sku: 'AC-DMAT-XL', description: 'Extra-large non-slip desk mat, 90×40 cm.' },

    // West Coast Hub — Tech & Software / Gadgets
    { store_id: stores[1].id, name: 'AR Developer Kit', category: 'Electronics', price: 899.00, quantity: 12, sku: 'EL-ARDK-01', description: 'Augmented reality developer kit with SDK.' },
    { store_id: stores[1].id, name: 'Smart Watch Pro', category: 'Electronics', price: 349.99, quantity: 80, sku: 'EL-SWP-01', description: 'Health-focused smartwatch with ECG and SpO2.' },
    { store_id: stores[1].id, name: 'Drone Micro X', category: 'Electronics', price: 199.99, quantity: 35, sku: 'EL-DRNX-01', description: 'Pocket-sized drone with 4K camera, 20-min flight time.' },
    { store_id: stores[1].id, name: 'Robot Vacuum Gen 3', category: 'Electronics', price: 399.00, quantity: 5, sku: 'EL-RVAC-G3', description: 'LiDAR mapping, self-emptying base, 3000 Pa suction.' },
    { store_id: stores[1].id, name: 'Wi-Fi 6E Router', category: 'Networking', price: 259.99, quantity: 0, sku: 'NW-ROUT-6E', description: 'Tri-band Wi-Fi 6E mesh router, 8 streams.' },
    { store_id: stores[1].id, name: 'NAS Enclosure 4-Bay', category: 'Networking', price: 499.00, quantity: 18, sku: 'NW-NAS-4B', description: '4-bay network-attached storage enclosure.' },
    { store_id: stores[1].id, name: 'Standing Desk Controller', category: 'Accessories', price: 44.99, quantity: 4, sku: 'AC-SDKC-01', description: 'Retrofit motorised controller for manual desks.' },
    { store_id: stores[1].id, name: 'LED Strip Kit 5m', category: 'Accessories', price: 24.99, quantity: 300, sku: 'AC-LEDSK-5M', description: 'RGBWW LED strip with app control.' },
    { store_id: stores[1].id, name: 'Mechanical Numpad', category: 'Electronics', price: 69.99, quantity: 22, sku: 'EL-NUMP-01', description: 'Standalone mechanical numpad, programmable.' },
    { store_id: stores[1].id, name: 'Privacy Screen Filter', category: 'Accessories', price: 49.00, quantity: 2, sku: 'AC-PRSF-15', description: '15" anti-glare privacy filter for laptops.' },
    { store_id: stores[1].id, name: 'USB Microphone', category: 'Electronics', price: 119.99, quantity: 40, sku: 'EL-UMIC-01', description: 'Cardioid condenser USB microphone for podcasting.' },

    // Midwest Depot — Industrial & Office
    { store_id: stores[2].id, name: 'Heavy-Duty Shelving Unit', category: 'Furniture', price: 349.00, quantity: 30, sku: 'FU-HDSH-01', description: 'Steel shelving, 500 kg capacity, 6 tiers.' },
    { store_id: stores[2].id, name: 'Industrial Tape Dispenser', category: 'Tools', price: 29.99, quantity: 150, sku: 'TL-ITDP-01', description: 'Heavy-duty 3-inch core tape dispenser.' },
    { store_id: stores[2].id, name: 'Label Printer', category: 'Office', price: 149.99, quantity: 0, sku: 'OF-LBPR-01', description: 'Thermal label printer, 4×6 in labels.' },
    { store_id: stores[2].id, name: 'Pallet Jack 2500kg', category: 'Tools', price: 789.00, quantity: 8, sku: 'TL-PLJK-25', description: 'Manual pallet truck, 1150mm forks.' },
    { store_id: stores[2].id, name: 'Safety Helmet ANSI', category: 'Safety', price: 24.99, quantity: 500, sku: 'SF-HELM-AN', description: 'ANSI Z89.1 Class E safety helmet, vented.' },
    { store_id: stores[2].id, name: 'Work Gloves L', category: 'Safety', price: 12.49, quantity: 3, sku: 'SF-WGL-L', description: 'Cut-resistant work gloves, level 5.' },
    { store_id: stores[2].id, name: 'Barcode Scanner', category: 'Office', price: 189.99, quantity: 25, sku: 'OF-BCSC-01', description: 'Laser barcode scanner, USB & Bluetooth.' },
    { store_id: stores[2].id, name: 'Stretch Wrap Film', category: 'Tools', price: 39.99, quantity: 90, sku: 'TL-SWRP-01', description: '18" × 1500ft stretch wrap, 80 gauge.' },
    { store_id: stores[2].id, name: 'Industrial Fan 24"', category: 'Tools', price: 219.99, quantity: 2, sku: 'TL-INFN-24', description: '24-inch drum fan, 3-speed, 7500 m³/h.' },
    { store_id: stores[2].id, name: 'First Aid Kit XL', category: 'Safety', price: 64.99, quantity: 45, sku: 'SF-FAKIT-XL', description: 'OSHA-compliant first aid kit, 150-person.' },
    { store_id: stores[2].id, name: 'Wireless Inventory Scanner', category: 'Office', price: 599.00, quantity: 1, sku: 'OF-WISC-01', description: 'Rugged Android wireless scanner for warehouse use.' },
    { store_id: stores[2].id, name: 'Ergonomic Office Chair', category: 'Furniture', price: 479.00, quantity: 15, sku: 'FU-ERGC-01', description: 'Lumbar-support mesh chair, adjustable armrests.' },
];

const seedAll = db.transaction(() => {
    for (const p of products) productInsert.run(p);
});

seedAll();

console.log(`✅  Seeded ${storeData.length} stores and ${products.length} products.`);
