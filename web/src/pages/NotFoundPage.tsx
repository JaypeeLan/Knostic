import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <main className="page" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            textAlign: 'center'
        }}>
            <div style={{
                background: 'var(--bg-card)',
                padding: '3rem',
                borderRadius: '1.5rem',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                maxWidth: '480px',
                width: '100%'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(217, 104, 104, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: 'var(--accent)'
                }}>
                    <FileQuestion size={40} />
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>404</h1>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Oops! This page doesn't exist.
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                    The page you are looking for might have been moved, deleted, or never existed in the first place.
                </p>

                <Link to="/" className="btn btn-primary" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem'
                }}>
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>
            </div>
        </main>
    );
}
