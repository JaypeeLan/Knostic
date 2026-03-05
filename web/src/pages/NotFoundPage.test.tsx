import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
    it('renders 404 heading and error message', () => {
        render(
            <BrowserRouter>
                <NotFoundPage />
            </BrowserRouter>
        );

        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByText(/Oops! This page doesn't exist/i)).toBeInTheDocument();
    });

    it('renders a link back to the dashboard', () => {
        render(
            <BrowserRouter>
                <NotFoundPage />
            </BrowserRouter>
        );

        const link = screen.getByRole('link', { name: /back to dashboard/i });
        expect(link).toBeInTheDocument();
        expect(link.getAttribute('href')).toBe('/');
    });
});
