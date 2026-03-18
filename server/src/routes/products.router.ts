import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { validate } from '../middleware/validate';
import { ProductSchema, ProductQuerySchema, UpdateProductSchema } from '../validations/product.validation';
import { IdParamSchema } from '../validations/common.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List products with filtering and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: storeId
 *         schema: { type: integer }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: A paginated list of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProducts'
 */
router.get('/', validate({ query: ProductQuerySchema }), productController.getAll);

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Get all unique product categories
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of category names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { type: string }
 */
router.get('/categories', productController.getCategories);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', validate({ params: IdParamSchema }), productController.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       214:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post('/', validate({ body: ProductSchema }), productController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.put('/:id', validate({ params: IdParamSchema, body: UpdateProductSchema }), productController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete('/:id', validate({ params: IdParamSchema }), productController.delete);

export default router;
