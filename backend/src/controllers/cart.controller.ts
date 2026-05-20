import { Request, Response } from 'express';
import Cart from '../models/cart.model';
import Product from '../models/product.model';

// Helper to calculate cart total or other derived data could go here

export const getCart = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        let cart = await Cart.findOne({ user: userId }).select('-__v').populate('items.product', '-__v');

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
            return res.json({
                status: 'success',
                data: cart
            });
        }

        const { __v, ...cartData } = cart.toObject();

        res.json({
            status: 'success',
            data: cartData
        });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const addToCart = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const qty = quantity || 1;

        let cart = await Cart.findOne({ user: userId }).select('-__v');

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if item already exists in cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Update quantity
            cart.items[itemIndex].quantity += qty;
        } else {
            // Add new item
            cart.items.push({ product: productId, quantity: qty });
        }

        await cart.save();
        // Populate for response
        await cart.populate('items.product', '-__v');

        const { __v, ...cartData } = cart.toObject();

        res.json({
            status: 'success',
            data: cartData
        });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const updateItem = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: userId }).select('-__v');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                // If quantity is 0 or less, remove item
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
            await cart.populate('items.product', '-__v');

            const { __v, ...cartData } = cart.toObject();

            return res.json({ status: 'success', data: cartData });
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};


export const removeItem = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const productId = req.params.id;

        let cart = await Cart.findOne({ user: userId }).select('-__v');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        await cart.save();
        await cart.populate('items.product', '-__v');

        const { __v, ...cartData } = cart.toObject();

        res.json({
            status: 'success',
            data: cartData
        });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};
