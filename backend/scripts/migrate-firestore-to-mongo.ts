/**
 * Migration Script: Firestore → MongoDB Atlas
 * 
 * This script reads all products (and optionally users) from your Firebase Firestore
 * and inserts them into MongoDB Atlas so that the backend API can serve them.
 * 
 * Usage:
 *   npx ts-node scripts/migrate-firestore-to-mongo.ts
 * 
 * Prerequisites:
 *   - MONGO_URI must be set in .env (pointing to MongoDB Atlas)
 *   - Firebase env vars must be set in .env
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

// --- MongoDB Models (inline to avoid import issues) ---
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

// --- Migration Functions ---

async function migrateProducts() {
  console.log('\n📦 Migrating Products from Firestore → MongoDB...');
  
  const snapshot = await firestoreDb.collection('products').get();
  
  if (snapshot.empty) {
    console.log('⚠️  No products found in Firestore. Nothing to migrate.');
    return 0;
  }

  console.log(`   Found ${snapshot.size} products in Firestore`);
  
  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    try {
      // Check if product already exists by name (to avoid duplicates)
      const existing = await Product.findOne({ name: data.name });
      if (existing) {
        console.log(`   ⏭️  Skipped (already exists): ${data.name}`);
        skipped++;
        continue;
      }

      // Clean the data: remove Firestore-specific fields
      const cleanData: any = { ...data };
      delete cleanData._id;       // Remove Firestore doc ID field if present
      delete cleanData.__v;       // Remove version key if present
      delete cleanData.mongoId;   // Remove any mongo reference

      // Handle Firestore Timestamps → JS Dates
      if (cleanData.createdAt && cleanData.createdAt._seconds) {
        cleanData.createdAt = new Date(cleanData.createdAt._seconds * 1000);
      }
      if (cleanData.updatedAt && cleanData.updatedAt._seconds) {
        cleanData.updatedAt = new Date(cleanData.updatedAt._seconds * 1000);
      }

      // Ensure required fields have defaults
      if (!cleanData.description) cleanData.description = cleanData.name;
      if (!cleanData.imageUrl) cleanData.imageUrl = 'https://via.placeholder.com/300';
      if (!cleanData.category) cleanData.category = 'Uncategorized';
      if (cleanData.stock === undefined) cleanData.stock = 10;

      const product = new Product(cleanData);
      await product.save();
      console.log(`   ✅ Migrated: ${data.name} (₹${data.price})`);
      migrated++;
    } catch (err: any) {
      console.error(`   ❌ Error migrating "${data.name}": ${err.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Products Migration Summary:`);
  console.log(`   ✅ Migrated: ${migrated}`);
  console.log(`   ⏭️  Skipped:  ${skipped}`);
  console.log(`   ❌ Errors:   ${errors}`);
  
  return migrated;
}

async function migrateUsers() {
  console.log('\n👤 Migrating Users from Firestore → MongoDB...');
  
  const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    addresses: [{
      street: String, city: String, state: String,
      postalCode: String, country: String,
      isDefault: { type: Boolean, default: false }
    }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }]
  }, { timestamps: true });

  // Use existing model or create new one
  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  const snapshot = await firestoreDb.collection('users').get();
  
  if (snapshot.empty) {
    console.log('⚠️  No users found in Firestore. Nothing to migrate.');
    return 0;
  }

  console.log(`   Found ${snapshot.size} users in Firestore`);
  
  let migrated = 0;
  let skipped = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    try {
      const existing = await User.findOne({ email: data.email });
      if (existing) {
        console.log(`   ⏭️  Skipped (already exists): ${data.email}`);
        skipped++;
        continue;
      }

      const cleanData: any = {
        name: data.name || data.email?.split('@')[0] || 'User',
        email: data.email,
        passwordHash: data.passwordHash || 'FIREBASE_AUTH_USER',
        phone: data.phone || '',
        role: data.role || 'user'
      };

      if (cleanData.createdAt && cleanData.createdAt._seconds) {
        cleanData.createdAt = new Date(cleanData.createdAt._seconds * 1000);
      }

      const user = new User(cleanData);
      await user.save();
      console.log(`   ✅ Migrated: ${data.email}`);
      migrated++;
    } catch (err: any) {
      console.error(`   ❌ Error migrating "${data.email}": ${err.message}`);
    }
  }

  console.log(`\n📊 Users Migration Summary:`);
  console.log(`   ✅ Migrated: ${migrated}`);
  console.log(`   ⏭️  Skipped:  ${skipped}`);
  
  return migrated;
}

// --- Main ---
async function main() {
  console.log('🚀 CartifyX Firestore → MongoDB Migration');
  console.log('==========================================\n');

  // Validate env
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ MONGO_URI is not set in .env! Cannot connect to MongoDB Atlas.');
    console.error('   Please add your MongoDB Atlas connection string to backend/.env');
    process.exit(1);
  }

  // Connect to MongoDB Atlas
  console.log('🔌 Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Atlas connected!\n');
  } catch (err: any) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }

  // Run migrations
  const productCount = await migrateProducts();
  const userCount = await migrateUsers();

  console.log('\n==========================================');
  console.log('🏁 Migration Complete!');
  console.log(`   Products migrated: ${productCount}`);
  console.log(`   Users migrated: ${userCount}`);
  console.log('==========================================\n');

  // Verify
  const totalProducts = await Product.countDocuments();
  console.log(`📈 Total products now in MongoDB: ${totalProducts}`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
