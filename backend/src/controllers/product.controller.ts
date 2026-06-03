import { Request, Response } from 'express';
import Product from '../models/product.model';
import { db } from '../config/firebase.config';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('products').get();

        const products = snapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                _id: doc.id, // backward compatibility
                name: data.name || data.title || '',
                ...data
            };
        });

        res.json({
            status: 'success',
            results: products.length,
            data: products
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: (err as Error).message
        });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const doc = await db.collection('products').doc(req.params.id).get();

        if (!doc.exists) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        const data = doc.data();

        res.json({
            status: 'success',
            data: {
                id: doc.id,
                _id: doc.id,
                name: data?.name || data?.title || '',
                ...data
            }
        });
    } catch (err) {
        res.status(500).json({
            message: (err as Error).message
        });
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
