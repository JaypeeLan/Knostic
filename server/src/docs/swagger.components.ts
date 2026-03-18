/**
 * @swagger
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       required:
 *         - name
 *         - location
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the store
 *         name:
 *           type: string
 *           description: Name of the store
 *         location:
 *           type: string
 *           description: Physical location or address
 *         description:
 *           type: string
 *           description: Short description of the store
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         name: "Tech Haven"
 *         location: "Downtown"
 *         description: "Premier electronics store"
 *         created_at: "2024-03-18T10:00:00Z"
 *         updated_at: "2024-03-18T10:00:00Z"
 *
 *     Product:
 *       type: object
 *       required:
 *         - store_id
 *         - name
 *         - category
 *         - price
 *         - quantity
 *       properties:
 *         id:
 *           type: integer
 *         store_id:
 *           type: integer
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: number
 *         quantity:
 *           type: integer
 *         sku:
 *           type: string
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 101
 *         store_id: 1
 *         name: "Wireless Mouse"
 *         category: "Accessories"
 *         price: 29.99
 *         quantity: 50
 *         sku: "MSE-001"
 *         description: "Ergonomic wireless mouse"
 *
 *     StoreSummary:
 *       type: object
 *       properties:
 *         store:
 *           $ref: '#/components/schemas/Store'
 *         total_products:
 *           type: integer
 *         total_value:
 *           type: number
 *         low_stock_count:
 *           type: integer
 *         out_of_stock_count:
 *           type: integer
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryBreakdown'
 *
 *     CategoryBreakdown:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *         product_count:
 *           type: integer
 *         total_value:
 *           type: number
 *         avg_price:
 *           type: number
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         total_pages:
 *           type: integer
 *         has_next:
 *           type: boolean
 *         has_prev:
 *           type: boolean
 *
 *     PaginatedProducts:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 */
