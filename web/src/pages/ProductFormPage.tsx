import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { productsApi } from '../api/products';
import { storesApi } from '../api/stores';
import type { Store } from '../types';

interface FormState {
    store_id: string;
    name: string;
    category: string;
    price: string;
    quantity: string;
    sku: string;
    description: string;
}

const CATEGORIES = [
    'Electronics', 'Accessories', 'Networking', 'Furniture',
    'Tools', 'Office', 'Safety', 'Other',
];

export default function ProductFormPage() {
    const { id } = useParams<{ id?: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [stores, setStores] = useState<Store[]>([]);
    const [form, setForm] = useState<FormState>({
        store_id: searchParams.get('storeId') ?? '',
        name: '', category: '', price: '', quantity: '', sku: '', description: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        storesApi.getAll().then(setStores);
        if (isEdit && id) {
            productsApi.getById(Number(id))
                .then(p => {
                    setForm({
                        store_id: String(p.store_id),
                        name: p.name,
                        category: p.category,
                        price: String(p.price),
                        quantity: String(p.quantity),
                        sku: p.sku ?? '',
                        description: p.description ?? '',
                    });
                })
                .catch(e => setApiError(e.message))
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    const validate = (): Partial<Record<keyof FormState, string>> => {
        const errs: Partial<Record<keyof FormState, string>> = {};
        if (!form.store_id) errs.store_id = 'Store is required';
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.category) errs.category = 'Category is required';
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) {
            errs.price = 'Price must be a non-negative number';
        }
        if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) < 0 || !Number.isInteger(Number(form.quantity))) {
            errs.quantity = 'Quantity must be a non-negative integer';
        }
        return errs;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        setErrors(e => ({ ...e, [name]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        setApiError(null);
        const payload = {
            store_id: Number(form.store_id),
            name: form.name.trim(),
            category: form.category,
            price: Number(form.price),
            quantity: Number(form.quantity),
            sku: form.sku.trim() || undefined,
            description: form.description.trim() || undefined,
        };

        try {
            if (isEdit && id) {
                await productsApi.update(Number(id), payload);
                navigate(`/stores/${payload.store_id}`);
            } else {
                await productsApi.create(payload as any);
                navigate(`/stores/${payload.store_id}`);
            }
        } catch (e: any) {
            setApiError(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <main className="page"><div className="loading-center"><div className="spinner" /></div></main>;

    return (
        <main className="page">
            <Link to={form.store_id ? `/stores/${form.store_id}` : '/'} className="back-link"><ArrowLeft size={16} /> Back</Link>

            <div className="page-header">
                <div className="page-title-block">
                    <h1>{isEdit ? 'Edit Product' : 'New Product'}</h1>
                    <p className="page-subtitle">{isEdit ? 'Update the product details below' : 'Fill in the details to add a new product'}</p>
                </div>
            </div>

            {apiError && <div className="error-banner" style={{ marginBottom: '1.5rem' }}><AlertCircle size={18} /> {apiError}</div>}

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="product-form-grid">

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Store *</label>
                            <select name="store_id" className={`form-select ${errors.store_id ? 'input-error' : ''}`}
                                value={form.store_id} onChange={handleChange}>
                                <option value="">Select a store…</option>
                                {stores.map(s => <option key={s.id} value={s.id}>{s.name} — {s.location}</option>)}
                            </select>
                            {errors.store_id && <span className="form-error">{errors.store_id}</span>}
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Product Name *</label>
                            <input name="name" className={`form-input ${errors.name ? 'input-error' : ''}`}
                                value={form.name} onChange={handleChange} placeholder="e.g. Wireless Mouse" />
                            {errors.name && <span className="form-error">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category *</label>
                            <select name="category" className={`form-select ${errors.category ? 'input-error' : ''}`}
                                value={form.category} onChange={handleChange}>
                                <option value="">Select category…</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.category && <span className="form-error">{errors.category}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">SKU</label>
                            <input name="sku" className="form-input" value={form.sku} onChange={handleChange} placeholder="e.g. EL-WMOU-01" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Price (USD) *</label>
                            <input name="price" type="number" step="0.01" min="0" className={`form-input ${errors.price ? 'input-error' : ''}`}
                                value={form.price} onChange={handleChange} placeholder="0.00" />
                            {errors.price && <span className="form-error">{errors.price}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Quantity *</label>
                            <input name="quantity" type="number" min="0" step="1" className={`form-input ${errors.quantity ? 'input-error' : ''}`}
                                value={form.quantity} onChange={handleChange} placeholder="0" />
                            {errors.quantity && <span className="form-error">{errors.quantity}</span>}
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Description</label>
                            <textarea name="description" className="form-textarea" value={form.description}
                                onChange={handleChange} placeholder="Optional product description" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Create Product')}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
