import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Knostic Inventory API',
            version: '1.0.0',
            description: 'A simple API for managing stores and products',
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server',
            },
        ],
    },
    apis: [
        './src/docs/*.ts',
        './src/routes/*.ts',
        './src/repositories/*.ts'
    ], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
