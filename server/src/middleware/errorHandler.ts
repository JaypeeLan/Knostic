import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
}

function isSkuConstraintError(err: unknown): boolean {
    if (!err || typeof err !== 'object') return false;
    const maybeErr = err as { code?: unknown; message?: unknown };
    const code = typeof maybeErr.code === 'string' ? maybeErr.code : '';
    const message = typeof maybeErr.message === 'string' ? maybeErr.message : '';
    if (!code.startsWith('SQLITE_CONSTRAINT')) return false;
    return /products\.sku/i.test(message);
}

export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction) {
    if (isSkuConstraintError(err)) {
        res.status(409).json({ error: 'Duplicate SKU number' });
        return;
    }

    const status = err.statusCode ?? 500;
    const message = status >= 500 ? 'Internal server error' : err.message;

    if (status >= 500) {
        console.error('[ERROR]', err);
    }

    res.status(status).json({ error: message });
}

export function notFound(_req: Request, res: Response) {
    res.status(404).json({ error: 'Route not found' });
}

export function createError(message: string, statusCode: number): AppError {
    const err: AppError = new Error(message);
    err.statusCode = statusCode;
    return err;
}
