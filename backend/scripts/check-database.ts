import mongoose from 'mongoose';
import Product from '../src/models/product.model';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function checkDatabase() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mix-ecommerce';
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected\n');

        const productId = '69a3da1851e838f24d580c44';
        console.log(`📦 Fetching product: ${productId}\n`);
        
        const product = await Product.findById(productId);
        
        if (!product) {
            console.log('❌ Product not found');
            return;
        }
        
        console.log('📊 FIELDS IN DATABASE:\n');
        
        const fieldChecks = {
            'Basic Fields': ['name', 'description', 'price', 'stock'],
            'Extended Fields': ['fullDescription', 'features', 'specifications', 'material', 'dimensions', 'warranty', 'returnPolicy', 'additionalAttributes']
        };
        
        for (const [category, fields] of Object.entries(fieldChecks)) {
            console.log(`\n${category}:`);
            fields.forEach((field: string) => {
                const value = (product as any)[field];
                if (value !== undefined && value !== null) {
                    if (typeof value=== 'object') {
                        console.log(`✅ ${field}: ${JSON.stringify(value).substring(0, 80)}...`);
                    } else if (typeof value === 'string' && value.length > 80) {
                        console.log(`✅ ${field}: ${value.substring(0, 80)}...`);
                    } else {
                        console.log(`✅ ${field}: ${value}`);
                    }
                } else {
                    console.log(`❌ ${field}: NOT FOUND`);
                }
            });
        }
        
        console.log('\n\n📝 FULL PRODUCT OBJECT:\n');
        console.log(JSON.stringify(product.toObject(), null, 2));
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Disconnected');
    }
}

checkDatabase();
