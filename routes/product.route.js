import Router from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createListing, deleteListingById, getAllListings, getListingById, updateListingQunantity } from '../controllers/listing.controller.js';

const productRouter = Router();

productRouter.post('/add', authenticateToken, createListing);

productRouter.get('/list', authenticateToken, getAllListings);

productRouter.get('/:id', authenticateToken, getListingById);

productRouter.put('/:id/quantity', authenticateToken, updateListingQunantity);

productRouter.delete('/:id', authenticateToken, deleteListingById);

export { productRouter };