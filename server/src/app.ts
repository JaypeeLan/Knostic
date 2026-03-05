import express from 'express';
import cors from 'cors';
import storesRouter from './routes/stores.router';
import productsRouter from './routes/products.router';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// API routes
app.use('/api/stores', storesRouter);
app.use('/api/products', productsRouter);

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

export default app;
