import mongoose from 'mongoose';
import { config } from './env';

const connectDB = async (): Promise<void> => {
    try{
        //connect to mongodb
        const conn = await mongoose.connect(config.mongoUri);

        console.log(`MongoDB Connected :${conn.connection.host}`);
    }catch(error){
        console.error('MongoDB connection failed', error);
        process.exit(1);
    }
};

export default connectDB;

