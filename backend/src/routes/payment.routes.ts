
import express from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller';
// import authMiddleware from '../middleware/auth.middleware'; // Optional: protect payment

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);

export default router;
