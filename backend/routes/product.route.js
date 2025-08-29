import Router from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createListing, deleteListingById, getAllListings, getListingById, updateListingQunantity } from '../controllers/listing.controller.js';

const productRouter = Router();

/**
 * @swagger
 * /api/v1/product/add:
 *   post:
 *     summary: Add a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               sku:
 *                 type: string
 *               image_url:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 */
productRouter.post('/add', authenticateToken, createListing);

/**
 * @swagger
 * /api/v1/product/list:
 *   get:
 *     summary: Get all products for the authenticated user
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 */
productRouter.get('/list', authenticateToken, getAllListings);

/**
 * @swagger
 * /api/v1/product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
productRouter.get('/:id', authenticateToken, getListingById);
productRouter.delete('/:id', authenticateToken, deleteListingById);

/**
 * @swagger
 * /api/v1/product/{id}/quantity:
 *   put:
 *     summary: Update product quantity
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product quantity updated
 *       404:
 *         description: Product not found
 */
productRouter.put('/:id/quantity', authenticateToken, updateListingQunantity);

export { productRouter };