import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import connectDB from './config/database';

const app = express();

//MIDDLEWARES

//Helmet
app.use(helmet());

//CORS
app.use(cors({
    origin: config.clientUrl,
    credentials: true,
}));

// Incoming requests ka JSON body parse karo
app.use(express.json());

// URL encoded data parse karo
app.use(express.urlencoded({ extended: true }));

//ROUTES
//HealthCheck

app.get('/health', (req, res) => {
    res.json({
        status: 'oK',
        message: "Recognisense API is running",
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
    });
});

//SERVER START

const startServer = async () => {
    //Connect to database first
    await connectDB();

    app.listen(config.port, () => {
        console.log(`✅ Server running on port ${config.port}`);
        console.log(`🌍 Environment: ${config.nodeEnv}`);
    });
};

// Lets start the server
startServer();

export default app;