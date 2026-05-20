import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import authMiddleware from '../middleware/auth.middleware';
import adminMiddleware from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import { productValidator } from '../validators/product.validator';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin Routes
router.post('/', authMiddleware, adminMiddleware, validate(productValidator), createProduct);
router.put('/:id', authMiddleware, adminMiddleware, validate(productValidator), updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
