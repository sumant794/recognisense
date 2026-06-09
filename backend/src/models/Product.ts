import mongoose, { Document, Schema } from 'mongoose';
// TYPESCRIPT INTERFACE
export interface IProduct extends Document {
    name: string;
    description: string;
    category: string;
    sku: string;
    images: string[];    //Cloudinary URLs array
    isActive: boolean;
    createdBy: mongoose.Types.ObjectId; //Admin ka ID
    createdAt: Date;
    updatedAt: Date;    
}

// SCHEMA
const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            minlength:[2, 'Name must be at least 2 characters'],
            maxlength:[100, 'Name cannot exceed 100 characters'],
        },

        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },

        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },

        sku: {
            type: String,
            required: false,
            unique: true,      // Har product ka alag SKU
            uppercase: true,   // Hamesha uppercase save karo   
            trim: true,
        },

        // Array of Cloudinary image URLs
        // AI training ke liye multiple images
        images: {
            type: [String],
            default: [],
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        // Ref: 'User' matlab →
        // Yeh ObjectId User collection ka hai
        // Mongoose ko pata hai kahan dhundna hai
       createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Creator is required'],
        },
    },
    {
        timestamps: true,
    }
);

productSchema.pre('save', async function(){
    if(!this.sku){
        const prefix = this.category
            .substring(0, 3)
            .toUpperCase();
        const random = Math.floor(1000 + Math.random() * 9000);
        this.sku = `${prefix}-${random}`;
    }
});

// =====================
// INDEXES
// =====================
// Index kyun? →
// Jab products search karein →
// MongoDB poora collection scan na kare →
// Index se fast dhundhe

// Name se search fast ho
productSchema.index({ name: 'text', description: 'text'});

// Category se filter fast ho
productSchema.index({ category: 1 });

const Product = mongoose.model<IProduct>('Product', productSchema);


export default Product;