import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, AlertCircle, Package, Pencil, Trash2, RotateCcw, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Store } from '../types';
import Modal from '../components/Modal';
import { useProducts } from '../hooks/useProducts';

function fmt(n: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function StockBadge({ quantity }: { quantity: number }) {
    if (quantity === 0) return <span className="badge badge-danger">Out of stock</span>;
    if (quantity <= 5) return <span className="badge badge-warning">Low ({quantity})</span>;
    return <span className="badge badge-success">{quantity}</span>;
}

export default function ProductsPage() {
    const navigate = useNavigate();
    const {
        products,
        pagination,
        stores,
        categories,
        loading,
        error,
        filters,
        updateFilter,
        resetFilters,
        deleteProduct,
    } = useProducts();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (id: number) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            await deleteProduct(productToDelete);
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        } catch (error) {
            // Error is handled in hook
            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const storeMap = Object.fromEntries(stores.map((s: Store) => [s.id, s.name]));

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
                            <input className="form-input" placeholder="Name, SKU…" value={filters.search}
                                onChange={e => updateFilter({ search: e.target.value })} />
                        </div>
                    </div>

                    <div className="filter-section">
                        <label className="filter-section-label">Store</label>
                        <select className="form-select" value={filters.storeId || ''} onChange={e => updateFilter({ storeId: e.target.value ? Number(e.target.value) : undefined })}>
                            <option value="">All stores</option>
                            {stores.map((s: Store) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="filter-section">
                        <label className="filter-section-label">Category</label>
                        <select className="form-select" value={filters.category} onChange={e => updateFilter({ category: e.target.value })}>
                            <option value="">All categories</option>
                            {categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="filter-section">
                        <label className="filter-section-label">Price (USD)</label>
                        <div className="range-row">
                            <input className="form-input" type="number" placeholder="Min" min={0} value={filters.minPrice}
                                onChange={e => updateFilter({ minPrice: e.target.value })} />
                            <input className="form-input" type="number" placeholder="Max" min={0} value={filters.maxPrice}
                                onChange={e => updateFilter({ maxPrice: e.target.value })} />
                        </div>
                    </div>

                    <div className="filter-section">
                        <label className="filter-section-label">Stock Level</label>
                        <div className="range-row">
                            <input className="form-input" type="number" placeholder="Min" min={0} value={filters.minStock}
                                onChange={e => updateFilter({ minStock: e.target.value })} />
                            <input className="form-input" type="number" placeholder="Max" min={0} value={filters.maxStock}
                                onChange={e => updateFilter({ maxStock: e.target.value })} />
                        </div>
                    </div>

                    <div className="filter-section">
                        <label className="filter-section-label">Sort By</label>
                        <select className="form-select" value={filters.sort} onChange={e => updateFilter({ sort: e.target.value })}>
                            <option value="created_at">Date Added</option>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                            <option value="quantity">Stock</option>
                        </select>
                    </div>

                    <div className="filter-section">
                        <label className="filter-section-label">Order</label>
                        <select className="form-select" value={filters.order} onChange={e => updateFilter({ order: e.target.value })}>
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
                                        {products.map((p: any) => (
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
                                        onClick={() => updateFilter({ page: filters.page! - 1 })}
                                    ><ChevronLeft size={16} /></button>
                                    {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                                        .filter(n => Math.abs(n - (filters.page || 1)) <= 2)
                                        .map(n => (
                                            <button
                                                key={n}
                                                className={`btn btn-sm ${n === (filters.page || 1) ? 'btn-primary' : 'btn-ghost'}`}
                                                onClick={() => updateFilter({ page: n })}
                                            >{n}</button>
                                        ))}
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        disabled={!pagination.has_next}
                                        onClick={() => updateFilter({ page: filters.page! + 1 })}
                                    ><ChevronRight size={16} /></button>
                                    <span className="pagination-info">
                                        {(((filters.page || 1) - 1) * 15) + 1}–{Math.min((filters.page || 1) * 15, pagination.total)} of {pagination.total}
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
