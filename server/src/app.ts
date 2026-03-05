import path from 'path';
import express from 'express';
import cors from 'cors';
import storesRouter from './routes/stores.router';
import productsRouter from './routes/products.router';
import { errorHandler, notFound } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

const app = express();

app.use(cors());
app.use(express.json());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// API routes
app.use('/api/stores', storesRouter);
app.use('/api/products', productsRouter);

// Serve static files in production
const DIST_PATH = path.join(__dirname, '../../web/dist');
app.use(express.static(DIST_PATH));

// Catch-all for SPA (must be after API routes)
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(DIST_PATH, 'index.html'), (err) => {
        if (err) next();
    });
});

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

export default app;
