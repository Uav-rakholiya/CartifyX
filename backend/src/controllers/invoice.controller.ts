
import { Request, Response } from 'express';
import Order from '../models/order.model';
import { generateInvoicePDF } from '../services/invoice.service';

export const generateInvoice = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.orderId;
        console.log(`Generating invoice for order: ${orderId}`);

        const order = await Order.findById(orderId).populate('user', 'name email');

        if (!order) {
            console.error(`Order not found: ${orderId}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        let filename = `invoice-${order._id}.pdf`;
        filename = encodeURIComponent(filename);

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        await generateInvoicePDF(order, res);

        console.log('PDF Generated successfully, stream finalized by service.');

    } catch (err) {
        console.error('Invoice Generation Error:', err);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error generating invoice', error: err });
        } else {
            console.error('Headers already sent.');
            res.end();
        }
    }
};
