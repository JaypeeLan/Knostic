import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertCircle, Store, MapPin, Trash2, Plus, X } from 'lucide-react';
import type { Store as StoreType } from '../types';
import Modal from '../components/Modal';
import { useStores } from '../hooks/useStores';

export default function StoresPage() {
    const {
        stores,
        loading,
        error,
        createStore,
        deleteStore,
    } = useStores();

    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formState, setFormState] = useState({
        data: { name: '', location: '', description: '' },
        errors: {} as Record<string, string>,
        submitting: false,
    });

    // Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [storeToDelete, setStoreToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const filtered = stores.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.location.toLowerCase().includes(search.toLowerCase())
    );

    const validateForm = () => {
        const errs: Record<string, string> = {};
        if (!formState.data.name.trim()) errs.name = 'Name is required';
        if (!formState.data.location.trim()) errs.location = 'Location is required';
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validateForm();
        if (Object.keys(errs).length) {
            setFormState(f => ({ ...f, errors: errs }));
            return;
        }

        setFormState(f => ({ ...f, submitting: true }));
        try {
            await createStore(formState.data);
            setFormState({
                data: { name: '', location: '', description: '' },
                errors: {},
                submitting: false,
            });
            setShowForm(false);
        } catch (e: any) {
            // Error is handled in hook or through global error
            setFormState(f => ({ ...f, submitting: false }));
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
            await deleteStore(storeToDelete);
            setIsDeleteModalOpen(false);
            setStoreToDelete(null);
        } catch (e: any) {
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
                                    className={`form-input ${formState.errors.name ? 'input-error' : ''}`}
                                    value={formState.data.name}
                                    onChange={e => {
                                        setFormState(f => ({
                                            ...f,
                                            data: { ...f.data, name: e.target.value },
                                            errors: { ...f.errors, name: '' }
                                        }));
                                    }}
                                    placeholder="e.g. Downtown Flagship"
                                />
                                {formState.errors.name && <span className="form-error">{formState.errors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location *</label>
                                <input
                                    className={`form-input ${formState.errors.location ? 'input-error' : ''}`}
                                    value={formState.data.location}
                                    onChange={e => {
                                        setFormState(f => ({
                                            ...f,
                                            data: { ...f.data, location: e.target.value },
                                            errors: { ...f.errors, location: '' }
                                        }));
                                    }}
                                    placeholder="e.g. New York, NY"
                                />
                                {formState.errors.location && <span className="form-error">{formState.errors.location}</span>}
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={formState.data.description}
                                    onChange={e => setFormState(f => ({
                                        ...f,
                                        data: { ...f.data, description: e.target.value }
                                    }))}
                                    placeholder="Optional store description"
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={formState.submitting}>
                                {formState.submitting ? 'Creating…' : 'Create Store'}
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
                    {filtered.map((store: StoreType) => (
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
