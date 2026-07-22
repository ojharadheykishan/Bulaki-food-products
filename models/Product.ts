import mongoose, { Schema, Document } from 'mongoose';

export interface IVariant {
  weight: string;
  price: number;
  mrp?: number;
  stock: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: string;
  description: string;
  isVeg: boolean;
  images: string[];
  variants: IVariant[];
  ingredients?: string[];
  shelfLife?: string;
  nutritionalInfo?: {
    energy?: string;
    protein?: string;
    fat?: string;
    carbs?: string;
  };
  ratings: number;
  reviewCount: number;
  isBestseller?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IVariant>({
  weight: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    isVeg: { type: Boolean, default: true },
    images: [{ type: String, required: true }],
    variants: [VariantSchema],
    ingredients: [{ type: String }],
    shelfLife: { type: String, default: '6 Months' },
    nutritionalInfo: {
      energy: { type: String },
      protein: { type: String },
      fat: { type: String },
      carbs: { type: String },
    },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isBestseller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
