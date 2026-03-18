import path from 'path';
import express from 'express';
import cors from 'cors';
import storesRouter from './routes/stores.router';
import productsRouter from './routes/products.router';
import { errorHandler, notFound } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

const app = express();

// Security Headers
app.use(helmet());

// Strict CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Protect against HTTP Parameter Pollution
app.use(hpp());

// Body parser with size limit
app.use(express.json({ limit: '10kb' }));

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
