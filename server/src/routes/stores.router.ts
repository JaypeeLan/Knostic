import { Router } from 'express';
import { storeController } from '../controllers/store.controller';
import { validate } from '../middleware/validate';
import { StoreSchema, UpdateStoreSchema } from '../validations/store.validation';
import { IdParamSchema } from '../validations/common.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Store management API
 */

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: Retrieve a list of all stores
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: A list of stores.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.get('/', storeController.getAll);

/**
 * @swagger
 * /api/stores/{id}:
 *   get:
 *     summary: Get a store by its ID
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The store ID
 *     responses:
 *       200:
 *         description: Detailed store information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       404:
 *         description: Store not found
 */
router.get('/:id', validate({ params: IdParamSchema }), storeController.getById);

/**
 * @swagger
 * /api/stores/{id}/summary:
 *   get:
 *     summary: Get inventory summary for a store
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inventory summary and category breakdown
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreSummary'
 *       404:
 *         description: Store not found
 */
router.get('/:id/summary', validate({ params: IdParamSchema }), storeController.getSummary);

/**
 * @swagger
 * /api/stores:
 *   post:
 *     summary: Create a new store
 *     tags: [Stores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       214:
 *         description: Store created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 */
router.post('/', validate({ body: StoreSchema }), storeController.create);

/**
 * @swagger
 * /api/stores/{id}:
 *   put:
 *     summary: Update an existing store
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       200:
 *         description: Store updated successfully
 *       404:
 *         description: Store not found
 */
router.put('/:id', validate({ params: IdParamSchema, body: UpdateStoreSchema }), storeController.update);

/**
 * @swagger
 * /api/stores/{id}:
 *   delete:
 *     summary: Delete a store and its products
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Store deleted successfully
 *       404:
 *         description: Store not found
 */
router.delete('/:id', validate({ params: IdParamSchema }), storeController.delete);

export default router;
