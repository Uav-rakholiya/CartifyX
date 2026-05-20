import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import Product from '../models/product.model';

// @ts-ignore
export const getWishlist = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist', '-__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Filter out nulls in case some products were deleted
        const filteredWishlist = (user.wishlist as any[]).filter(item => item !== null);
        res.json({ status: 'success', data: filteredWishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist', error });
    }
};

// @ts-ignore
export const toggleWishlist = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const trimmedId = productId.trim();
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize wishlist if undefined
        if (!user.wishlist) {
            user.wishlist = [];
        }

        const index = user.wishlist.findIndex(id => id && id.toString() === trimmedId);
        if (index > -1) {
            user.wishlist.splice(index, 1);
        } else {
            // @ts-ignore
            user.wishlist.push(new mongoose.Types.ObjectId(trimmedId));
        }

        user.markModified('wishlist');
        await user.save();

        const updatedUser = await User.findById(req.user.id).populate('wishlist', '-__v');
        const filteredWishlist = (updatedUser?.wishlist as any[] || []).filter(item => item !== null);
        res.json({ status: 'success', data: filteredWishlist });
    } catch (error) {
        console.error('Wishlist toggle error:', error);
        res.status(500).json({
            message: 'Error toggling wishlist',
            error: error instanceof Error ? error.message : 'Unknown server error'
        });
    }
};

// @ts-ignore
export const syncWishlist = async (req: Request, res: Response) => {
    try {
        const { productIds } = req.body;
        if (!productIds || !Array.isArray(productIds)) {
            return res.status(400).json({ message: 'Product IDs array is required' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.wishlist) {
            user.wishlist = [];
        }

        // Add only unique IDs
        productIds.forEach((id: any) => {
            const sid = id.toString().trim();
            if (!user.wishlist.some(existingId => existingId && existingId.toString() === sid)) {
                // @ts-ignore
                user.wishlist.push(new mongoose.Types.ObjectId(sid));
            }
        });

        user.markModified('wishlist');
        await user.save();

        const updatedUser = await User.findById(req.user.id).populate('wishlist', '-__v');
        const filteredWishlist = (updatedUser?.wishlist as any[] || []).filter(item => item !== null);
        res.json({ status: 'success', data: filteredWishlist });
    } catch (error) {
        console.error('Wishlist sync error:', error);
        res.status(500).json({
            message: 'Error syncing wishlist',
            error: error instanceof Error ? error.message : 'Unknown server error'
        });
    }
};
