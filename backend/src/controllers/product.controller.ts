import { Request, Response } from 'express';
import Product from '../models/product.model';
import { db } from '../config/firebase.config';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log('getAllProducts Query:', req.query); // Debug log
        const keywordParam = req.query.keyword;
        let queryFilter: any = {};

        // Feature: Support fetching multiple explicit IDs
        if (req.query.ids && typeof req.query.ids === 'string') {
            const idsList = req.query.ids.split(',');
            queryFilter._id = { $in: idsList };
        }

        // Feature: Target specific category directly
        if (req.query.category && typeof req.query.category === 'string') {
            queryFilter.category = req.query.category;
        }
        // Original Feature: Keyword filtering
        else if (typeof keywordParam === 'string') {
            queryFilter = {
                $or: [
                    { name: { $regex: keywordParam, $options: 'i' } },
                    { description: { $regex: keywordParam, $options: 'i' } },
                    { category: { $regex: keywordParam, $options: 'i' } }
                ]
            };
        }

        // Special case: If searching for "phone", exclude "headphones" if it's not explicitly asked for
        if (typeof keywordParam === 'string' && keywordParam.toLowerCase() === 'phone') {
            queryFilter.name = { $not: /headphones/i, ...queryFilter.name };
        }

        // Feature: Support limits
        const limitParam = req.query.limit ? parseInt(req.query.limit as string) : 0; // 0 means no limit

        const products = await Product.find(queryFilter).limit(limitParam).select('-__v');
        res.json({
            status: 'success',
            results: products.length,
            data: products
        });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id).select('-__v');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({
            status: 'success',
            data: product
        });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const newProduct = await Product.create(req.body);
        const { __v, ...productData } = newProduct.toObject();

        try {
            const pureProductData = JSON.parse(JSON.stringify(productData));
            await db.collection('products').doc(newProduct.id).set(pureProductData);
        } catch (firebaseErr: any) {
            console.error('Firebase product creation sync error:', firebaseErr.message);
        }

        res.status(201).json({
            status: 'success',
            data: productData
        });
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const { __v, ...productData } = updatedProduct.toObject();

        try {
            const pureProductData = JSON.parse(JSON.stringify(productData));
            await db.collection('products').doc(updatedProduct.id).set(pureProductData, { merge: true });
        } catch (firebaseErr: any) {
            console.error('Firebase product update sync error:', firebaseErr.message);
        }

        res.json({
            status: 'success',
            data: productData
        });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();

        try {
            await db.collection('products').doc(product.id).delete();
        } catch (firebaseErr: any) {
            console.error('Firebase product deletion sync error:', firebaseErr.message);
        }
        res.json({ message: 'Product removed' });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};
