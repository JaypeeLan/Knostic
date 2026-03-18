import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, AlertCircle, Package, Pencil, Trash2, RotateCcw, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { productsApi } from '../api/products';
import { storesApi } from '../api/stores';
import type { Product, PaginatedResult, Store } from '../types';
import Modal from '../components/Modal';

function fmt(n: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function StockBadge({ quantity }: { quantity: number }) {
    if (quantity === 0) return <span className="badge badge-danger">Out of stock</span>;
    if (quantity <= 5) return <span className="badge badge-warning">Low ({quantity})</span>;
    return <span className="badge badge-success">{quantity}</span>;
}

const LIMIT = 15;

export default function ProductsPage() {
    const navigate = useNavigate();
    const [result, setResult] = useState<PaginatedResult<Product> | null>(null);
    const [stores, setStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [storeId, setStoreId] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minStock, setMinStock] = useState('');
    const [maxStock, setMaxStock] = useState('');
    const [sort, setSort] = useState('created_at');
    const [order, setOrder] = useState('desc');
    const [page, setPage] = useState(1);

    // Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        setError(null);
        productsApi.getAll({
            search: search || undefined,
            storeId: storeId ? Number(storeId) : undefined,
            category: category || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
            minStock: minStock || undefined,
            maxStock: maxStock || undefined,
            sort,
            order,
            page,
            limit: LIMIT,
        })
            .then(setResult)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [search, storeId, category, minPrice, maxPrice, minStock, maxStock, sort, order, page]);

    useEffect(() => { load(); }, [load]);

    useEffect(() => {
        Promise.all([storesApi.getAll(), productsApi.getCategories()])
            .then(([s, c]) => { setStores(s); setCategories(c); });
    }, []);

    const handleDeleteClick = (id: number) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            await productsApi.delete(productToDelete);
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
            load();
        } catch (e: any) {
            setError(e.message);
            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const resetFilters = () => {
        setSearch(''); setStoreId(''); setCategory('');
        setMinPrice(''); setMaxPrice(''); setMinStock(''); setMaxStock('');
        setSort('created_at'); setOrder('desc'); setPage(1);
    };

    const { data: products = [], pagination } = result ?? {};

    const storeMap = Object.fromEntries(stores.map(s => [s.id, s.name]));

    return (
        <main className="page">
            <div className="page-header">
                <div className="page-title-block">
                    <h1>All Products</h1>
                    <p className="page-subtitle">
                        {pagination ? `${pagination.total} product${pagination.total !== 1 ? 's' : ''} across all stores` : 'Loading…'}
                    </p>
                </div>
                <Link to="/products/new" className="btn btn-primary"><Plus size={16} /> New Product</Link>
            </div>

            {error && <div className="error-banner" style={{ marginBottom: '1.5rem' }}><AlertCircle size={18} /> {error}</div>}

            <div className="filter-layout">
                {/* Filter panel */}
                <aside className="filter-card">
                    <h3>Filters</h3>

                    <div className="filter-section">
                        <label className="filter-section-label">Search</label>
                        <div className="search-wrap">
                            <span className="search-icon" style={{ fontSize: '0.85rem' }}><Search size={14} /></span>
                            <input className="form-input" placeholder="Name, SKU…" value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }} />
                        </div>
                    </div>

                    <div className="filter-section">
                        <label className="filter-section-label">Store</label>
                        <select className="form-select" value={storeId} onChange={e => { setStoreId(e.target.value); setPage(1); }}>
                            <option value="">All stores</option>
                            {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="filter-section">
                        <label className="filter-section-label">Category</label>
                        <select className="form-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
                            <option value="">All categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="filter-section">
                        <label className="filter-section-label">Price (USD)</label>
                        <div className="range-row">
                            <input className="form-input" type="number" placeholder="Min" min={0} value={minPrice}
                                onChange={e => { setMinPrice(e.target.value); setPage(1); }} />
                            <input className="form-input" type="number" placeholder="Max" min={0} value={maxPrice}
                                onChange={e => { setMaxPrice(e.target.value); setPage(1); }} />
                        </div>
                    </div>

                    <div className="filter-section">
                        <label className="filter-section-label">Stock Level</label>
                        <div className="range-row">
                            <input className="form-input" type="number" placeholder="Min" min={0} value={minStock}
                                onChange={e => { setMinStock(e.target.value); setPage(1); }} />
                            <input className="form-input" type="number" placeholder="Max" min={0} value={maxStock}
                                onChange={e => { setMaxStock(e.target.value); setPage(1); }} />
                        </div>
                    </div>

                    <div className="filter-section">
                        <label className="filter-section-label">Sort By</label>
                        <select className="form-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
                            <option value="created_at">Date Added</option>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                            <option value="quantity">Stock</option>
                        </select>
                    </div>

                    <div className="filter-section">
                        <label className="filter-section-label">Order</label>
                        <select className="form-select" value={order} onChange={e => { setOrder(e.target.value); setPage(1); }}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>

                    <button className="btn btn-ghost" style={{ width: '100%', marginTop: '0.5rem' }} onClick={resetFilters}>
                        <RotateCcw size={14} /> Reset Filters
                    </button>
                </aside>

                {/* Product table */}
                <div>
                    {loading ? (
                        <div className="loading-center"><div className="spinner" /></div>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon"><Package size={48} /></div>
                            <h3>No products found</h3>
                            <p>Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Store</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(p => (
                                            <tr key={p.id}>
                                                <td>
                                                    <div>{p.name}</div>
                                                    {p.sku && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.sku}</div>}
                                                </td>
                                                <td>
                                                    <Link to={`/stores/${p.store_id}`} style={{ color: 'var(--accent-hi)', fontSize: '0.85rem' }}>
                                                        {storeMap[p.store_id] ?? `Store #${p.store_id}`}
                                                    </Link>
                                                </td>
                                                <td><span className="badge badge-neutral">{p.category}</span></td>
                                                <td>{fmt(p.price)}</td>
                                                <td><StockBadge quantity={p.quantity} /></td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/products/${p.id}/edit`)}><Pencil size={14} /></button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(p.id)}><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.total_pages > 1 && (
                                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        disabled={!pagination.has_prev}
                                        onClick={() => setPage(p => p - 1)}
                                    ><ChevronLeft size={16} /></button>
                                    {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                                        .filter(n => Math.abs(n - page) <= 2)
                                        .map(n => (
                                            <button
                                                key={n}
                                                className={`btn btn-sm ${n === page ? 'btn-primary' : 'btn-ghost'}`}
                                                onClick={() => setPage(n)}
                                            >{n}</button>
                                        ))}
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        disabled={!pagination.has_next}
                                        onClick={() => setPage(p => p + 1)}
                                    ><ChevronRight size={16} /></button>
                                    <span className="pagination-info">
                                        {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, pagination.total)} of {pagination.total}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Product"
                confirmLabel="Delete Product"
                onConfirm={handleConfirmDelete}
                confirmVariant="danger"
                isSubmitting={isDeleting}
            >
                <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            </Modal>
        </main>
    );
}
