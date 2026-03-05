import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Package, AlertCircle, Pencil, Trash2, ArrowLeft, Plus } from 'lucide-react';
import { storesApi } from '../api/stores';
import { productsApi } from '../api/products';
import type { StoreSummary, Product } from '../types';

function fmt(n: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function StockBadge({ quantity }: { quantity: number }) {
    if (quantity === 0) return <span className="badge badge-danger">Out of stock</span>;
    if (quantity <= 5) return <span className="badge badge-warning">Low ({quantity})</span>;
    return <span className="badge badge-success">{quantity}</span>;
}

export default function StoreDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [summary, setSummary] = useState<StoreSummary | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        Promise.all([
            storesApi.getSummary(Number(id)),
            productsApi.getAll({ storeId: Number(id), limit: 100 }),
        ])
            .then(([sum, prods]) => {
                setSummary(sum);
                setProducts(prods.data);
            })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [id]);

    const handleDeleteProduct = async (productId: number) => {
        if (!confirm('Delete this product?')) return;
        try {
            await productsApi.delete(productId);
            load();
        } catch (e: any) {
            setError(e.message);
        }
    };

    if (loading) return <main className="page"><div className="loading-center"><div className="spinner" /></div></main>;
    if (error) return <main className="page"><div className="error-banner"><AlertCircle size={18} /> {error}</div></main>;
    if (!summary) return null;

    const { store } = summary;

    return (
        <main className="page">
            <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to Stores</Link>

            <div className="page-header">
                <div className="page-title-block">
                    <h1>{store.name}</h1>
                    <p className="page-subtitle"><MapPin size={14} /> {store.location}</p>
                    {store.description && <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9rem' }}>{store.description}</p>}
                </div>
                <Link to={`/products/new?storeId=${id}`} className="btn btn-primary"><Plus size={16} /> Add Product</Link>
            </div>

            {/* Summary stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Products</div>
                    <div className="stat-value accent">{summary.total_products}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Inventory Value</div>
                    <div className="stat-value success">{fmt(summary.total_value)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Low Stock</div>
                    <div className="stat-value warning">{summary.low_stock_count}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Out of Stock</div>
                    <div className="stat-value danger">{summary.out_of_stock_count}</div>
                </div>
            </div>

            {/* Category breakdown */}
            {summary.categories.length > 0 && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Category Breakdown</h3>
                    <div className="table-wrap">
                        <table className="cat-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Products</th>
                                    <th>Avg Price</th>
                                    <th>Total Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.categories.map(cat => (
                                    <tr key={cat.category}>
                                        <td><span className="badge badge-accent">{cat.category}</span></td>
                                        <td>{cat.product_count}</td>
                                        <td>{fmt(cat.avg_price)}</td>
                                        <td style={{ color: 'var(--success)', fontWeight: 600 }}>{fmt(cat.total_value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Products table */}
            <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Products ({products.length})</h3>
                {products.length === 0 ? (
                    <div className="empty-state" style={{ minHeight: 'unset', padding: '2rem' }}>
                        <div className="empty-state-icon"><Package size={48} /></div>
                        <h3>No products yet</h3>
                        <p>Add your first product to this store.</p>
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>SKU</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Value</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.name}</td>
                                        <td><span className="badge badge-neutral">{p.category}</span></td>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.sku ?? '—'}</td>
                                        <td>{fmt(p.price)}</td>
                                        <td><StockBadge quantity={p.quantity} /></td>
                                        <td style={{ color: 'var(--success)' }}>{fmt(p.price * p.quantity)}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => navigate(`/products/${p.id}/edit`)}
                                                ><Pencil size={14} /></button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeleteProduct(p.id)}
                                                ><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}
