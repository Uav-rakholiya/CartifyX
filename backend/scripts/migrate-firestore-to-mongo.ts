/**
 * Migration Script: Firestore → MongoDB Atlas (FIXED)
 * 
 * Handles field name differences:
 *   Firestore `title` → MongoDB `name`
 *   Firestore `ratingCount` → MongoDB `reviews`
 *   Firestore `images` → MongoDB `additionalImages`
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import * as admin from 'firebase-admin';

// --- Firebase Init ---
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: "",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "",
  universe_domain: "googleapis.com"
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

const firestoreDb = admin.firestore();

// --- MongoDB Product Model ---
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true, index: true },
  stock: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  originalPrice: { type: Number },
  inStock: { type: Boolean, default: true },
  onSale: { type: Boolean, default: false },
  sizes: { type: [String], default: [] },
  additionalImages: { type: [String], default: [] },
  vendor: { type: String, default: 'CartifyX' },
  productType: { type: String, default: 'Standard' },
  viewCount: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
  features: { type: [String], default: [] },
  material: { type: String },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    weight: { type: Number }
  },
  warranty: {
    period: { type: String },
    coverage: { type: String },
    description: { type: String }
  },
  returnPolicy: {
    daysAllowed: { type: Number },
    conditions: { type: String },
    process: { type: String }
  },
  additionalAttributes: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', ProductSchema);

// --- Migration ---
async function migrateProducts() {
  console.log('\n📦 Migrating Products from Firestore → MongoDB...');
  
  const snapshot = await firestoreDb.collection('products').get();
  
  if (snapshot.empty) {
    console.log('⚠️  No products found in Firestore.');
    return 0;
  }

  console.log(`   Found ${snapshot.size} products in Firestore`);
  
  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    // Map Firestore field names → MongoDB field names
    const productName = data.name || data.title;  // Firestore uses "title"
    
    if (!productName) {
      console.log(`   ❌ Skipped doc ${doc.id}: no name or title field`);
      errors++;
      continue;
    }

    try {
      // Check if product already exists
      const existing = await Product.findOne({ name: productName });
      if (existing) {
        console.log(`   ⏭️  Skipped (already exists): ${productName}`);
        skipped++;
        continue;
      }

      // Handle Firestore Timestamps
      let createdAt = new Date();
      if (data.createdAt && data.createdAt._seconds) {
        createdAt = new Date(data.createdAt._seconds * 1000);
      }

      // Build the MongoDB document with correct field mapping
      const mongoProduct = {
        name: productName,
        description: data.description || productName,
        price: data.price || 0,
        imageUrl: data.imageUrl || 'https://via.placeholder.com/300',
        category: data.category || 'Uncategorized',
        stock: data.stock ?? 10,
        rating: data.rating || 0,
        reviews: data.ratingCount || data.reviews || 0,   // Firestore uses "ratingCount"
        featured: data.featured || false,
        originalPrice: data.originalPrice,
        inStock: data.stock > 0,
        onSale: data.onSale || false,
        sizes: data.sizes || [],
        additionalImages: data.images || data.additionalImages || [],  // Firestore uses "images"
        vendor: data.vendor || 'CartifyX',
        productType: data.productType || 'Standard',
        viewCount: data.viewCount || 0,
        soldCount: data.soldCount || 0,
        fullDescription: data.fullDescription,
        specifications: data.specifications || {},
        features: data.features || [],
        material: data.material,
        createdAt: createdAt
      };

      const product = new Product(mongoProduct);
      await product.save();
      console.log(`   ✅ Migrated: ${productName} (₹${data.price})`);
      migrated++;
    } catch (err: any) {
      console.error(`   ❌ Error migrating "${productName}": ${err.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Products Migration Summary:`);
  console.log(`   ✅ Migrated: ${migrated}`);
  console.log(`   ⏭️  Skipped:  ${skipped}`);
  console.log(`   ❌ Errors:   ${errors}`);
  
  return migrated;
}

// --- Main ---
async function main() {
  console.log('🚀 CartifyX Firestore → MongoDB Migration (Fixed)');
  console.log('==================================================\n');

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ MONGO_URI is not set in .env!');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB Atlas...');
  await mongoose.connect(mongoUri);
  console.log('✅ MongoDB Atlas connected!\n');

  await migrateProducts();

  const totalProducts = await Product.countDocuments();
  console.log(`\n📈 Total products now in MongoDB: ${totalProducts}`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
