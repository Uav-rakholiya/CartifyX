import mongoose from 'mongoose';
import Product from '../src/models/product.model';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

async function createTestProductWithExtendedFields() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mix-ecommerce';
        
        console.log('🔗 Connecting to MongoDB:', mongoUri);
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Create a test product with ALL extended fields
        const testProduct = {
            name: 'Premium Cotton T-Shirt with Extended Details',
            description: 'High-quality cotton t-shirt perfect for everyday wear',
            fullDescription: `This is a premium quality cotton t-shirt that offers exceptional comfort and durability.

Key highlights:
- Made from 100% organic cotton
- Soft, breathable fabric perfect for all seasons
- Available in multiple colors and sizes
- Machine washable and fade-resistant

Our premium t-shirt is crafted with attention to detail, ensuring that every seam and stitch is perfect. The fabric is sourced from the finest suppliers to guarantee comfort and longevity. Whether you're dressing down for a casual day or looking for a reliable everyday essential, this t-shirt is the perfect choice.

Care Instructions:
Wash in cold water, tumble dry on low heat, and iron on medium setting if needed.`,
            
            price: 499,
            originalPrice: 799,
            imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
            category: 'Apparel',
            stock: 150,
            inStock: true,
            onSale: true,
            
            // EXTENDED FIELDS
            features: [
                '100% Organic Cotton',
                'Breathable & Comfortable',
                'Pre-shrunk Fabric',
                'Multiple Color Options',
                'Durable Stitching',
                'Fade Resistant'
            ],
            
            specifications: {
                'Material': '100% Cotton',
                'Weight': '150-160 gsm',
                'Fit': 'Regular',
                'Care': 'Machine wash cold',
                'Neck Type': 'Crew Neck',
                'Sleeve Type': 'Short Sleeve'
            },
            
            material: '100% Organic Cotton (150-160 gsm weight)',
            
            dimensions: {
                length: 72,
                width: 50,
                height: 2,
                weight: 0.15
            },
            
            warranty: {
                period: '1 Year',
                coverage: 'Manufacturing defects - Seams, stitching, material quality',
                description: 'Covers defects in material and workmanship. Does not cover normal wear or damage from improper care.'
            },
            
            returnPolicy: {
                daysAllowed: 30,
                conditions: 'Product must be unused, unwashed, with original tags and packaging intact',
                process: '1. Initiate return within 30 days of purchase\n2. Pack item in original packaging\n3. Ship to our return center\n4. Receive refund within 5-7 business days after we receive and inspect the item'
            },
            
            additionalAttributes: {
                eco_friendly: true,
                sustainable: true,
                vegan: true,
                cruelty_free: true,
                season: 'All-Season',
                suitable_for: 'Both Men and Women'
            },
            
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            additionalImages: [
                'https://images.unsplash.com/photo-1572178684613-e51833489b39?w=500&h=500&fit=crop',
                'https://images.unsplash.com/photo-1578587018755-b92ffe6c69ef?w=500&h=500&fit=crop'
            ],
            vendor: 'CartifyX Premium',
            productType: 'Apparel',
            viewCount: 1250,
            soldCount: 340
        };

        console.log('\n📝 Creating test product with extended fields...');
        const createdProduct = await Product.create(testProduct);
        
        console.log('\n✅ Test product created successfully!');
        console.log('📦 Product ID:', createdProduct._id);
        console.log('\n📊 Product Data:');
        console.log(JSON.stringify(createdProduct.toObject(), null, 2));

        console.log('\n🔗 Product URL: http://localhost:4200/products/' + createdProduct._id);
        
    } catch (error) {
        console.error('❌ Error creating test product:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

createTestProductWithExtendedFields();
