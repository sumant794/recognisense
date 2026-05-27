import mongoose, { Document, Schema } from 'mongoose';

// TYPESCRIPT INTERFACE
export interface IRecognition extends Document {
    scannedBy: mongoose.Types.ObjectId;  //Employee ka ID
    product: mongoose.Types.ObjectId; //Recognized product
    confidence: number;               //AI ka confidence score
    status: 'success' | 'failed';
    imageUrl: string;                   // Scan ki gai image
    notes?: string;                 //Extra notes
    createdAt: Date;
    updatedAt: Date;
}

// SCHEMA
const recognitionSchema = new Schema<IRecognition>(
    {
        scannedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Scanner is required'],
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            // Failed recognition mein product null ho sakta hai
            required: false,
        },

        confidence: {
            type: Number,
            min: 0,
            max: 1,
            deafault: 0,
        },

        status: {
            type: String,
            enum: ['success', 'failed'],
            required: [true, 'Status is required'],
        },

        // Scan ki gai image ka Cloudinary URL
        imageUrl: {
            type: String,
            default: '',
        },

        notes: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// INDEXES
// Employee ke scans fast dhundne ke liye
recognitionSchema.index({ scannedBy: 1 });

// Date range queries ke liye
// "Aaj ke saare scans" → fast
recognitionSchema.index({ createdAt: -1 });

// Employee + date combine query
recognitionSchema.index({ scannedBy: 1, createdAt: -1 });

const Recognition = mongoose.model<IRecognition>(
    'Recognition',
    recognitionSchema
);

export default Recognition;