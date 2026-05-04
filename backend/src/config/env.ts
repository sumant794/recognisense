import dotenv from 'dotenv';

dotenv.config();

const getEnvVariable = (key: string): string => {
    const value = process.env[key];

    if(!value){
        throw new Error(`Missing Environment Variables: ${key}`);
    }

    return value;
};

export const config = {
    //Server config
    port: parseInt(process.env.PORT || '5000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

    //MongoDB
    mongoUri: getEnvVariable('MONGODB_URI'),

    //JWT
    jwtSecret: getEnvVariable('JWT_SECRET'),
    jwtRefreshSecret: getEnvVariable('JWT_REFRESH_SECRET'),
    jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',

    //Redis
    redisUrl: process.env.REDIS_URL || 'redis://localhost: 6379',

    //Cloudinary
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },
    //AI SERVICE
    aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost: 8000',
};