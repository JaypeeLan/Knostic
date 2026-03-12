import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

// Set DB to in-memory before any imports bring in the db module
process.env.DB_PATH = ':memory:';

// We import app lazily inside tests to ensure env is set first
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require('../src/app').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const supertest = require('supertest');

const request = supertest(app);

let store1Id: number;
let store2Id: number;
let productId: number;

describe('Stores API', () => {
    before(async () => {
        const health = await request.get('/health');
        assert.equal(health.status, 200);
    });

    it('GET /api/stores — empty initially', async () => {
        const res = await request.get('/api/stores');
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, []);
    });

    it('POST /api/stores — creates store 1', async () => {
        const res = await request.post('/api/stores')
            .send({ name: 'Test Store Alpha', location: 'Boston, MA', description: 'A test store' });
        assert.equal(res.status, 201);
        assert.equal(res.body.name, 'Test Store Alpha');
        store1Id = res.body.id;
    });

    it('POST /api/stores — creates store 2', async () => {
        const res = await request.post('/api/stores')
            .send({ name: 'Test Store Beta', location: 'Dallas, TX' });
        assert.equal(res.status, 201);
        store2Id = res.body.id;
    });

    it('POST /api/stores — rejects missing location', async () => {
        const res = await request.post('/api/stores').send({ name: 'No Location' });
        assert.equal(res.status, 400);
        assert.equal(res.body.error, 'Validation failed');
    });

    it('GET /api/stores — returns 2 stores', async () => {
        const res = await request.get('/api/stores');
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 2);
    });

    it('GET /api/stores/:id — specific store', async () => {
        const res = await request.get(`/api/stores/${store1Id}`);
        assert.equal(res.status, 200);
        assert.equal(res.body.name, 'Test Store Alpha');
    });

    it('GET /api/stores/:id — 404 for unknown', async () => {
        const res = await request.get('/api/stores/9999');
        assert.equal(res.status, 404);
    });

    it('PUT /api/stores/:id — updates', async () => {
        const res = await request.put(`/api/stores/${store1Id}`)
            .send({ location: 'Cambridge, MA' });
        assert.equal(res.status, 200);
        assert.equal(res.body.location, 'Cambridge, MA');
    });
});

describe('Products API', () => {
    it('POST /api/products — creates product', async () => {
        const res = await request.post('/api/products').send({
            store_id: store1Id, name: 'Wireless Keyboard',
            category: 'Electronics', price: 79.99, quantity: 50, sku: 'EL-WKB-01',
        });
        assert.equal(res.status, 201);
        assert.equal(res.body.name, 'Wireless Keyboard');
        productId = res.body.id;
    });

    it('POST /api/products — rejects duplicate SKU', async () => {
        const res = await request.post('/api/products').send({
            store_id: store1Id, name: 'Wireless Keyboard 2',
            category: 'Electronics', price: 89.99, quantity: 20, sku: 'EL-WKB-01',
        });
        assert.equal(res.status, 409);
        assert.equal(res.body.error, 'Duplicate SKU number');
    });

    it('POST /api/products — rejects invalid SKU', async () => {
        const res = await request.post('/api/products').send({
            store_id: store1Id, name: 'Invalid SKU Item',
            category: 'Electronics', price: 19.99, quantity: 5, sku: 'EL#BAD',
        });
        assert.equal(res.status, 400);
        assert.equal(res.body.error, 'Invalid SKU number');
    });

    it('POST /api/products — rejects negative price', async () => {
        const res = await request.post('/api/products').send({
            store_id: store1Id, name: 'Bad', category: 'Misc', price: -5, quantity: 10,
        });
        assert.equal(res.status, 400);
    });

    it('POST /api/products — rejects unknown store_id', async () => {
        const res = await request.post('/api/products').send({
            store_id: 9999, name: 'Orphan', category: 'Misc', price: 9.99, quantity: 1,
        });
        assert.equal(res.status, 404);
    });

    it('POST /api/products — bulk adds for filter/pagination tests', async () => {
        const items = [
            { store_id: store1Id, name: 'Mouse Pad', category: 'Accessories', price: 14.99, quantity: 3 },
            { store_id: store1Id, name: 'USB Hub', category: 'Electronics', price: 39.99, quantity: 0 },
            { store_id: store2Id, name: 'Coffee Mug', category: 'Office', price: 12.99, quantity: 100 },
            { store_id: store2Id, name: 'Desk Lamp', category: 'Office', price: 45.0, quantity: 25 },
        ];
        for (const p of items) {
            const res = await request.post('/api/products').send(p);
            assert.equal(res.status, 201);
        }
    });

    it('GET /api/products — offset pagination', async () => {
        const res = await request.get('/api/products?page=1&limit=3');
        assert.equal(res.status, 200);
        assert.equal(res.body.data.length, 3);
        assert.ok(res.body.pagination.total >= 5);
        assert.equal(res.body.pagination.has_next, true);
    });

    it('GET /api/products?category= — filter by category', async () => {
        const res = await request.get('/api/products?category=Electronics');
        assert.equal(res.status, 200);
        assert.ok(res.body.data.every((p: any) => p.category === 'Electronics'));
    });

    it('GET /api/products?storeId= — filter by store', async () => {
        const res = await request.get(`/api/products?storeId=${store2Id}`);
        assert.equal(res.status, 200);
        assert.ok(res.body.data.every((p: any) => p.store_id === store2Id));
    });

    it('GET /api/products?minPrice&maxPrice — price range filter', async () => {
        const res = await request.get('/api/products?minPrice=40&maxPrice=100');
        assert.equal(res.status, 200);
        assert.ok(res.body.data.every((p: any) => p.price >= 40 && p.price <= 100));
    });

    it('GET /api/products?sort=price&order=asc — sorted correctly', async () => {
        const res = await request.get('/api/products?sort=price&order=asc');
        const prices: number[] = res.body.data.map((p: any) => p.price);
        assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
    });

    it('GET /api/products/:id — by id', async () => {
        const res = await request.get(`/api/products/${productId}`);
        assert.equal(res.status, 200);
        assert.equal(res.body.id, productId);
    });

    it('PUT /api/products/:id — update quantity', async () => {
        const res = await request.put(`/api/products/${productId}`).send({ quantity: 42 });
        assert.equal(res.status, 200);
        assert.equal(res.body.quantity, 42);
    });
});

describe('Store Summary — non-trivial aggregation', () => {
    it('GET /api/stores/:id/summary — returns correct shape and metrics', async () => {
        const res = await request.get(`/api/stores/${store1Id}/summary`);
        assert.equal(res.status, 200);
        assert.ok('store' in res.body);
        assert.ok('total_products' in res.body);
        assert.ok('total_value' in res.body);
        assert.ok('low_stock_count' in res.body);
        assert.ok('out_of_stock_count' in res.body);
        assert.ok(Array.isArray(res.body.categories));
        assert.ok(res.body.total_products > 0);
        assert.ok(res.body.total_value > 0);
        assert.ok(res.body.low_stock_count >= 1);    // Mouse Pad qty=3 is low stock
        assert.ok(res.body.out_of_stock_count >= 1); // USB Hub qty=0 is out of stock
    });

    it('GET /api/stores/:id/summary — 404 for unknown', async () => {
        const res = await request.get('/api/stores/9999/summary');
        assert.equal(res.status, 404);
    });
});

describe('Delete & cascade', () => {
    it('DELETE /api/products/:id — removes product', async () => {
        const del = await request.delete(`/api/products/${productId}`);
        assert.equal(del.status, 204);
        const check = await request.get(`/api/products/${productId}`);
        assert.equal(check.status, 404);
    });

    it('DELETE /api/stores/:id — cascades to products', async () => {
        const before = await request.get(`/api/products?storeId=${store1Id}`);
        assert.ok(before.body.pagination.total > 0);
        const del = await request.delete(`/api/stores/${store1Id}`);
        assert.equal(del.status, 204);
        const after = await request.get(`/api/products?storeId=${store1Id}`);
        assert.equal(after.body.pagination.total, 0);
    });
});
