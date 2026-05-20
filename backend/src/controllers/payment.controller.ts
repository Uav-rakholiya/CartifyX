
import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/order.model';

// Initialize Razorpay Lazily to ensure env vars are loaded
let razorpayInstance: Razorpay;

const getRazorpay = () => {
    if (!razorpayInstance) {
        // Check if keys are present
        if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder') {
            console.warn('⚠️  WARNING: USING PLACEHOLDER RAZORPAY KEYS. PAYMENTS WILL FAIL.');
        }

        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
        });
    }
    return razorpayInstance;
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        const options = {
            amount: Math.round(amount * 100), // Ensure integer amount (paise)
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`
        };

        const razorpay = getRazorpay();
        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ message: 'Create order error' });
        }

        res.json({
            order,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        console.error('Razorpay Create Order Error:', err);
        res.status(500).json({ message: 'Server Error', error: err });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;


        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            // Payment verified successfully

            // Update order status in database if order_id is provided
            if (order_id) {
                const order = await Order.findById(order_id);
                if (order) {
                    order.isPaid = true;
                    order.paidAt = new Date();
                    order.paymentResult = {
                        id: razorpay_payment_id,
                        status: 'COMPLETED',
                        update_time: new Date().toISOString(),
                        email_address: '' // Can be populated from logged in user
                    };
                    await order.save();
                }
            }

            return res.json({ message: 'Payment verified successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid signature sent!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err });
    }
};
