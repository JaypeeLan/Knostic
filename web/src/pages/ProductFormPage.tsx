import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useProductForm } from '../hooks/useProductForm';

const CATEGORIES = [
    'Electronics', 'Accessories', 'Networking', 'Furniture',
    'Tools', 'Office', 'Safety', 'Other',
];

export default function ProductFormPage() {
    const { id } = useParams<{ id?: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const {
        stores,
        formState,
        handleChange,
        submit,
    } = useProductForm(id, searchParams);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const storeId = await submit();
        if (storeId) {
            navigate(`/stores/${storeId}`);
        }
    };

    if (formState.loading) return <main className="page"><div className="loading-center"><div className="spinner" /></div></main>;

    return (
        <main className="page">
            <Link to={formState.data.store_id ? `/stores/${formState.data.store_id}` : '/'} className="back-link"><ArrowLeft size={16} /> Back</Link>

            <div className="page-header">
                <div className="page-title-block">
                    <h1>{isEdit ? 'Edit Product' : 'New Product'}</h1>
                    <p className="page-subtitle">{isEdit ? 'Update the product details below' : 'Fill in the details to add a new product'}</p>
                </div>
            </div>

            {formState.apiError && <div className="error-banner" style={{ marginBottom: '1.5rem' }}><AlertCircle size={18} /> {formState.apiError}</div>}

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="product-form-grid">

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Store *</label>
                            <select name="store_id" className={`form-select ${formState.errors.store_id ? 'input-error' : ''}`}
                                value={formState.data.store_id} onChange={e => handleChange('store_id', e.target.value)}>
                                <option value="">Select a store…</option>
                                {stores.map((s: any) => <option key={s.id} value={s.id}>{s.name} — {s.location}</option>)}
                            </select>
                            {formState.errors.store_id && <span className="form-error">{formState.errors.store_id}</span>}
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Product Name *</label>
                            <input name="name" className={`form-input ${formState.errors.name ? 'input-error' : ''}`}
                                value={formState.data.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Wireless Mouse" />
                            {formState.errors.name && <span className="form-error">{formState.errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category *</label>
                            <select name="category" className={`form-select ${formState.errors.category ? 'input-error' : ''}`}
                                value={formState.data.category} onChange={e => handleChange('category', e.target.value)}>
                                <option value="">Select category…</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {formState.errors.category && <span className="form-error">{formState.errors.category}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">SKU</label>
                            <input name="sku" className="form-input" value={formState.data.sku} onChange={e => handleChange('sku', e.target.value)} placeholder="e.g. EL-WMOU-01" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Price (USD) *</label>
                            <input name="price" type="number" step="0.01" min="0" className={`form-input ${formState.errors.price ? 'input-error' : ''}`}
                                value={formState.data.price} onChange={e => handleChange('price', e.target.value)} placeholder="0.00" />
                            {formState.errors.price && <span className="form-error">{formState.errors.price}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Quantity *</label>
                            <input name="quantity" type="number" min="0" step="1" className={`form-input ${formState.errors.quantity ? 'input-error' : ''}`}
                                value={formState.data.quantity} onChange={e => handleChange('quantity', e.target.value)} placeholder="0" />
                            {formState.errors.quantity && <span className="form-error">{formState.errors.quantity}</span>}
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Description</label>
                            <textarea name="description" className="form-textarea" value={formState.data.description}
                                onChange={e => handleChange('description', e.target.value)} placeholder="Optional product description" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={formState.submitting}>
                            {formState.submitting ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Create Product')}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
