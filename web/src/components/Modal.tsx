import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    confirmLabel?: string;
    onConfirm?: () => void;
    confirmVariant?: 'primary' | 'danger';
    isSubmitting?: boolean;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    confirmLabel,
    onConfirm,
    confirmVariant = 'primary',
    isSubmitting = false
}: ModalProps) {
    if (!isOpen) return null;

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h2 className="modal-title">{title}</h2>
                    <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '0.25rem', border: 'none' }}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="modal-body">
                    {children}
                </div>

                <div className="modal-actions">
                    <button className="btn btn-ghost" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </button>
                    {confirmLabel && onConfirm && (
                        <button 
                            className={`btn ${confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary'}`} 
                            onClick={onConfirm}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : confirmLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
