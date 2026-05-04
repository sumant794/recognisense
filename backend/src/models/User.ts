import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

//Typescript Interface
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'admin'| 'employee';
    avatar?: string;
    isActive: boolean;
    refreshToken? : string;
    createdAt: Date;
    updatedAt: Date;

    //Method to check password for each user 
    comparePassword(candidatePassword: string): Promise<boolean>;
}

//User Schema

const userSchema = new Schema<IUser>(
    {
        name:{
            type: String,
            required: [true, 'Name is required'],
            trim: true, // Remove spaces from start/end
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters'],

        },

        email:{
            type: String,
            required: [true, 'Name is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select : false,
        },

        role: {
            type: String,
            enum : ['admin', 'employee'],
            default: 'employee',
        },
        avatar: {
            type: String,
            default: ''
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        refreshToken: {
            type: String,
            default: '',
            select: false,
        }
    },
    {
        timestamps: true,
    }
);

// Middleware Pre-Save
// Yeh function database mein save hone SE PEHLE
// automatically chalta hai

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password as string, 12);
});

//Instance Method 
// compare passowrd when log in

userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    const result  = await bcrypt.compare(candidatePassword, this.password as string);
    return result;
};

const User = mongoose.model<IUser>('User', userSchema);


export default User;
