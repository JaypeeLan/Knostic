import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Package } from 'lucide-react';
import StoresPage from './pages/StoresPage';
import StoreDetailPage from './pages/StoreDetailPage';
import ProductsPage from './pages/ProductsPage';
import ProductFormPage from './pages/ProductFormPage';

function Navbar() {
    return (
        <nav style={{
            background: 'var(--bg-1)', borderBottom: '1px solid var(--border)',
            padding: '0 2rem', display: 'flex', alignItems: 'center',
            gap: '0', position: 'sticky', top: 0, zIndex: 100,
            backdropFilter: 'blur(12px)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '2rem', padding: '1rem 0' }}>
                <Package size={20} color="var(--accent)" />
                <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                    Knostic <span style={{ color: 'var(--accent-hi)' }}>Inventory</span>
                </span>
            </div>
            {[
                { to: '/', label: 'Stores' },
                { to: '/products', label: 'Products' },
            ].map(({ to, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    end
                    style={({ isActive }) => ({
                        padding: '1.25rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        transition: 'all 180ms ease',
                        textDecoration: 'none',
                    })}
                >
                    {label}
                </NavLink>
            ))}
        </nav>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<StoresPage />} />
                <Route path="/stores/:id" element={<StoreDetailPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/new" element={<ProductFormPage />} />
                <Route path="/products/:id/edit" element={<ProductFormPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}
