import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import Product Model directly since we bypass app startup
import Product from '../models/product.model';

const migrateProducts = async () => {
    try {
        console.log('Connecting to MongoDB...', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB Connected.');

        console.log('Starting product migration...');

        // Find all products that might be missing the new fields
        const products = await Product.find({});
        console.log(`Found ${products.length} products to check/migrate.`);

        let updatedCount = 0;

        for (const product of products) {
            let needsSave = false;

            // @ts-ignore
            if (product.inStock === undefined) { product.inStock = true; needsSave = true; }
            // @ts-ignore
            if (product.onSale === undefined) { product.onSale = false; needsSave = true; }

            // Initialize arrays if they don't exist
            // @ts-ignore
            if (!product.sizes || product.sizes.length === 0) {
                product.sizes = ['S', 'M', 'L']; // Default some sizes
                needsSave = true;
            }

            // @ts-ignore
            if (!product.additionalImages) { product.additionalImages = []; needsSave = true; }

            // @ts-ignore
            if (!product.vendor) { product.vendor = 'CartifyX'; needsSave = true; }

            // @ts-ignore
            if (!product.productType) {
                product.productType = product.category || 'Standard';
                needsSave = true;
            }
            // @ts-ignore
            if (product.viewCount === undefined) {
                // Give older products a nice fake view count based on their rating/reviews
                product.viewCount = Math.floor(Math.random() * 500) + 150;
                needsSave = true;
            }
            // @ts-ignore
            if (product.soldCount === undefined) {
                // Give older products a fake sold count correlated to their reviews
                product.soldCount = (product.reviews || 0) * 3 + Math.floor(Math.random() * 20);
                needsSave = true;
            }

            if (needsSave) {
                await product.save();
                updatedCount++;
                console.log(`Migrated Product: ${product.name}`);
            }
        }

        console.log('Migration Complete.');
        console.log(`Total Products Updated: ${updatedCount} out of ${products.length}.`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

migrateProducts();
