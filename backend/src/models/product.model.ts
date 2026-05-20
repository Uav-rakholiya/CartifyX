import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  featured: boolean;
  originalPrice?: number;
  inStock: boolean;
  onSale: boolean;
  sizes: string[];
  additionalImages: string[];
  vendor: string;
  productType: string;
  viewCount: number;
  soldCount: number;
  specifications?: Record<string, string> | { label: string; value: string }[];
  features?: string[];
  material?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
  };
  warranty?: {
    period?: string;
    coverage?: string;
    description?: string;
  };
  returnPolicy?: {
    daysAllowed?: number;
    conditions?: string;
    process?: string;
  };
  additionalAttributes?: Record<string, any>;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
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
  
  // Extended product details
  specifications: { type: Schema.Types.Mixed, default: {} },
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
  additionalAttributes: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);