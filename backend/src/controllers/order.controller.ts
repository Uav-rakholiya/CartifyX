import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/order.model';
import Cart from '../models/cart.model';
import User from '../models/user.model';
import { db } from '../config/firebase.config';

export const createOrder = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            guestEmail
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            const orderDataToSave: any = {
                items: orderItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                isPaid: true, // Mock payment successful
                paidAt: Date.now(),
                paymentResult: {
                    id: 'mock_payment_id',
                    status: 'completed',
                    update_time: String(Date.now()),
                    email_address: userId ? 'user@example.com' : guestEmail
                }
            };

            if (userId) {
                orderDataToSave.user = userId;
            } else if (guestEmail) {
                orderDataToSave.guestEmail = guestEmail;
            } else {
                return res.status(400).json({ message: 'User reference or Guest email required' });
            }

            const order = new Order(orderDataToSave);

            const createdOrder = await order.save();

            // Clear User Cart after successful order if user exists
            if (userId) {
                await Cart.findOneAndDelete({ user: userId });
            }

            const { __v, ...orderData } = createdOrder.toObject();

            try {
                // Ensure dates are parsed properly and Mongoose ObjectIds are stripped for Firestore
                const pureOrderData = JSON.parse(JSON.stringify(orderData));
                await db.collection('orders').doc(createdOrder.id).set(pureOrderData);
            } catch (firebaseErr: any) {
                console.error('Firebase order creation sync error:', firebaseErr.message);
            }

            res.status(201).json({
                status: 'success',
                data: orderData
            });
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id).select('-__v').populate('user', 'name email');

        if (order) {
            res.json({
                status: 'success',
                data: order
            });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const orders = await Order.find({ user: req.user.id }).select('-__v').sort({ createdAt: -1 });
        res.json({
            status: 'success',
            data: orders
        });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({}).select('-__v').populate('user', 'id name').sort({ createdAt: -1 });
        res.json({
            status: 'success',
            data: orders
        });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            if (req.body.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = new Date();
            } else if (req.body.status === 'Shipped') {
                order.shippedAt = new Date();
                if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
                if (req.body.carrier) order.carrier = req.body.carrier;
                if (req.body.estimatedDelivery) order.estimatedDelivery = req.body.estimatedDelivery;
            }

            // Allow updating tracking info even without status change
            if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
            if (req.body.carrier) order.carrier = req.body.carrier;
            if (req.body.estimatedDelivery) order.estimatedDelivery = req.body.estimatedDelivery;

            const updatedOrder = await order.save();
            const { __v, ...orderData } = updatedOrder.toObject();

            try {
                const pureOrderData = JSON.parse(JSON.stringify(orderData));
                await db.collection('orders').doc(updatedOrder.id).set(pureOrderData, { merge: true });
            } catch (firebaseErr: any) {
                console.error('Firebase order update sync error:', firebaseErr.message);
            }

            res.json({
                status: 'success',
                data: orderData
            });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const getSalesData = async (req: Request, res: Response) => {
    try {
        const period = req.query.period as string || 'daily';
        console.log(`GET /analytics called with period: ${period}`);

        let dateGroupFormat;
        let limitCount = 30; // Default days

        const now = new Date();
        let matchStage = {};

        switch (period) {
            case 'weekly':
                dateGroupFormat = "%Y-W%U"; // Year-Week
                limitCount = 12; // Last 12 weeks
                const twelveWeeksAgo = new Date();
                twelveWeeksAgo.setDate(now.getDate() - (7 * 12));
                matchStage = { createdAt: { $gte: twelveWeeksAgo } };
                break;
            case 'monthly':
                dateGroupFormat = "%Y-%m"; // Year-Month
                limitCount = 12; // Last 12 months
                const twelveMonthsAgo = new Date();
                twelveMonthsAgo.setMonth(now.getMonth() - 12);
                matchStage = { createdAt: { $gte: twelveMonthsAgo } };
                break;
            case 'yearly':
                dateGroupFormat = "%Y"; // Year
                limitCount = 5; // Last 5 years
                const fiveYearsAgo = new Date();
                fiveYearsAgo.setFullYear(now.getFullYear() - 5);
                matchStage = { createdAt: { $gte: fiveYearsAgo } };
                break;
            case 'daily':
            default:
                dateGroupFormat = "%Y-%m-%d";
                limitCount = 30;
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(now.getDate() - 30);
                matchStage = { createdAt: { $gte: thirtyDaysAgo } };
                break;
        }

        console.log('Aggregating sales data...');
        const salesData = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: dateGroupFormat, date: "$createdAt" } },
                    totalOrders: { $sum: 1 },
                    totalSales: { $sum: "$totalPrice" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        console.log(`Sales data aggregated (${period}):`, salesData.length);

        console.log('Aggregating total revenue (all time)...');
        const totalRevenue = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        console.log('Aggregating top products (all time)...');
        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    name: { $first: "$items.name" },
                    totalSold: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            status: 'success',
            data: {
                period,
                dailySales: salesData, // Keeping key 'dailySales' for frontend compatibility, but it contains period data
                totalRevenue: totalRevenue[0]?.totalSales || 0,
                totalOrders: totalRevenue[0]?.totalOrders || 0,
                topProducts
            }
        });
    } catch (err) {
        console.error('Error in getSalesData:', err);
        res.status(500).json({ message: (err as Error).message, stack: (err as Error).stack });
    }
};


export const getOrdersByProduct = async (req: Request, res: Response) => {
    const productId = req.params.productId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid Product ID' });
    }

    try {
        const { startDate, endDate, status, customerName } = req.query;

        console.error(`Getting orders for product ${productId} with filters:`, req.query);

        let matchStage: any = {
            "items.product": new mongoose.Types.ObjectId(productId)
        };

        // Filter by Date
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate as string);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate as string);
        }

        // Filter by Order Status
        if (status) {
            matchStage.status = status;
        }

        // Filter by Customer Name (Requires lookup first or separate query)
        // Optimization: Find user IDs first
        if (customerName) {
            const users = await User.find({ name: { $regex: customerName as string, $options: 'i' } }).select('_id');
            const userIds = users.map(u => u._id);
            matchStage.user = { $in: userIds };
        }

        // Aggregation for Stats
        const stats = await Order.aggregate([
            { $match: matchStage },
            { $unwind: "$items" },
            { $match: { "items.product": new mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                }
            }
        ]);

        // Fetch paginated list
        const orders = await Order.find(matchStage)
            .select('-__v')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        console.error('Orders Found:', orders.length);

        res.json({
            status: 'success',
            stats: stats.length > 0 ? stats[0] : { totalOrders: 0, totalQuantity: 0, totalRevenue: 0 },
            count: orders.length,
            data: orders
        });
    } catch (err) {
        console.error('Error in getOrdersByProduct:', err);
        res.status(500).json({ message: (err as Error).message });
    }
};
