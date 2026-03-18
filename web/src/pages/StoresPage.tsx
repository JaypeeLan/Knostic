import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertCircle, Store, MapPin, Trash2, Plus, X } from 'lucide-react';
import { storesApi } from '../api/stores';
import type { Store as StoreType } from '../types';
import Modal from '../components/Modal';

export default function StoresPage() {
    const [stores, setStores] = useState<StoreType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', location: '', description: '' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    // Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [storeToDelete, setStoreToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const load = () => {
        setLoading(true);
        setError(null);
        storesApi.getAll()
            .then(setStores)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const filtered = stores.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.location.toLowerCase().includes(search.toLowerCase())
    );

    const validateForm = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.location.trim()) errs.location = 'Location is required';
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validateForm();
        if (Object.keys(errs).length) { setFormErrors(errs); return; }
        setSubmitting(true);
        try {
            await storesApi.create(form);
            setForm({ name: '', location: '', description: '' });
            setShowForm(false);
            load();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (id: number) => {
        setStoreToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!storeToDelete) return;
        setIsDeleting(true);
        try {
            await storesApi.delete(storeToDelete);
            setIsDeleteModalOpen(false);
            setStoreToDelete(null);
            load();
        } catch (e: any) {
            setError(e.message);
            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <main className="page">
            <div className="page-header">
                <div className="page-title-block">
                    <h1>Stores</h1>
                    <p className="page-subtitle">{stores.length} store{stores.length !== 1 ? 's' : ''} in your network</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
                    {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> New Store</>}
                </button>
            </div>

            {error && (
                <div className="error-banner" style={{ marginBottom: '1.5rem' }}>
                    <AlertCircle size={18} /><span>{error}</span>
                </div>
            )}

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--accent)', boxShadow: '0 0 0 1px var(--accent)' }}>
                    <h3 style={{ marginBottom: '1.25rem' }}>New Store</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="product-form-grid">
                            <div className="form-group">
                                <label className="form-label">Store Name *</label>
                                <input
                                    className={`form-input ${formErrors.name ? 'input-error' : ''}`}
                                    value={form.name}
                                    onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setFormErrors(f => ({ ...f, name: '' })); }}
                                    placeholder="e.g. Downtown Flagship"
                                />
                                {formErrors.name && <span className="form-error">{formErrors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location *</label>
                                <input
                                    className={`form-input ${formErrors.location ? 'input-error' : ''}`}
                                    value={form.location}
                                    onChange={e => { setForm(f => ({ ...f, location: e.target.value })); setFormErrors(f => ({ ...f, location: '' })); }}
                                    placeholder="e.g. New York, NY"
                                />
                                {formErrors.location && <span className="form-error">{formErrors.location}</span>}
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Optional store description"
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Creating…' : 'Create Store'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
                <div className="search-wrap" style={{ maxWidth: 360 }}>
                    <span className="search-icon"><Search size={16} /></span>
                    <input
                        className="form-input"
                        placeholder="Search stores…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-center"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon"><Store size={48} /></div>
                    <h3>{search ? 'No matching stores' : 'No stores yet'}</h3>
                    <p>{search ? 'Try a different search.' : 'Click "New Store" to add your first one.'}</p>
                </div>
            ) : (
                <div className="stores-grid">
                    {filtered.map(store => (
                        <div key={store.id} style={{ position: 'relative' }}>
                            <Link to={`/stores/${store.id}`} className="store-card-link">
                                <div className="card store-card">
                                    <div className="store-name">{store.name}</div>
                                    <div className="store-location"><MapPin size={14} /> {store.location}</div>
                                    {store.description && (
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineClamp: 2 }}>
                                            {store.description}
                                        </p>
                                    )}
                                    <div className="store-meta" style={{ marginTop: 'auto' }}>
                                        <span className="badge badge-accent">View Products</span>
                                    </div>
                                </div>
                            </Link>
                            <button
                                className="btn btn-ghost btn-sm btn-danger"
                                onClick={() => handleDeleteClick(store.id)}
                                style={{ position: 'absolute', top: '1rem', right: '1rem' }}
                                title="Delete store"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Store"
                confirmLabel="Delete Store"
                onConfirm={handleConfirmDelete}
                confirmVariant="danger"
                isSubmitting={isDeleting}
            >
                <p>Are you sure you want to delete this store? This action will also delete all associated products and cannot be undone.</p>
            </Modal>
        </main>
    );
}
