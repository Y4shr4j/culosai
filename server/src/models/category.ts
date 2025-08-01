import mongoose, { Document, Schema } from 'mongoose';

export interface ICategoryItem {
  _id?: string;
  name: string;
  value: string;
  description?: string;
  isActive: boolean;
}

export interface ICategory extends Document {
  name: string;
  type: 'video' | 'image' | 'character';
  description?: string;
  items: ICategoryItem[];
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategoryItemSchema = new Schema<ICategoryItem>({
  name: { type: String, required: true },
  value: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { _id: true });

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['video', 'image', 'character'] 
  },
  description: { type: String },
  items: [CategoryItemSchema],
  isActive: { type: Boolean, default: true },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true
});

// Index for efficient queries
CategorySchema.index({ type: 1, isActive: 1 });
CategorySchema.index({ name: 1 });

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema); 