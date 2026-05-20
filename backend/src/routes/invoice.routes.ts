
import express from 'express';
import { generateInvoice } from '../controllers/invoice.controller';

const router = express.Router();

router.get('/download/:orderId', generateInvoice);

export default router;
