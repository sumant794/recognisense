import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { config } from '../config/env';
import { Http2ServerResponse } from 'node:http2';

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(config.nodeEnv === 'development'){
        sendDevError(err, res);
    }else {
        sendProdError(err, res);
    }
};

//Development error
const sendDevError = (err: any, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};

const sendProdError = (err: any, res: Response) => {
    //Operational Errror
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }else {
        //Unexpected Error
        console.error('💥 UNEXPECTED ERROR:', err);
        res.status(500).json({
            status: 'error',
            message:'Something went wrong. Please try again.',
        });
    }
};

export default errorHandler;