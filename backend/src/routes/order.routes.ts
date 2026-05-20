import express from 'express';
import { createOrder, getOrderById, getMyOrders, getAllOrders, updateOrderStatus, getSalesData, getOrdersByProduct } from '../controllers/order.controller';
import authMiddleware, { optionalAuth } from '../middleware/auth.middleware';
import adminMiddleware from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import { checkoutValidator } from '../validators/order.validator';

const router = express.Router();

router.post('/', optionalAuth, validate(checkoutValidator), createOrder);

router.use(authMiddleware);
// Product Orders Route (kept at top for precedence)
router.get('/product/:productId', adminMiddleware, getOrdersByProduct);
router.get('/myorders', getMyOrders);
// Restore adminMiddleware for security
router.get('/', adminMiddleware, getAllOrders);
router.get('/analytics', adminMiddleware, getSalesData);
router.get('/:id', getOrderById);
router.patch('/:id/status', adminMiddleware, updateOrderStatus);

export default router;
