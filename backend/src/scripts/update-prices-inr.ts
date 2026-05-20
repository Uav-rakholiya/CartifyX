import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.model';

dotenv.config();

const updatePrices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cartifyx');
        console.log('MongoDB Connected for Price Update');

        const products = await Product.find({});
        console.log(`Found ${products.length} products to update.`);

        let updatedCount = 0;
        for (const product of products) {
            // Check if price seems low (indicating USD)
            if (product.price < 5000) { // Arbitrary threshold, assuming most electronics/fashion > ₹500
                const oldPrice = product.price;
                const newPrice = Math.round(oldPrice * 85);

                // Update price
                product.price = newPrice;
                await product.save();

                console.log(`Updated ${product.name}: ${oldPrice} -> ${newPrice}`);
                updatedCount++;
            } else {
                console.log(`Skipping ${product.name}, price ${product.price} seems already updated.`);
            }
        }

        console.log(`Successfully updated prices for ${updatedCount} products.`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

updatePrices();
