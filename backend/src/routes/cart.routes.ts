import express from 'express';
import { getCart, addToCart, updateItem, removeItem } from '../controllers/cart.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

router.use(authMiddleware); // Protect all cart routes

router.get('/', getCart);
router.post('/', addToCart);
router.put('/', updateItem);
router.delete('/:id', removeItem);

export default router;
