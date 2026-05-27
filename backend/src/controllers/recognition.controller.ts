import { Request, Response, NextFunction } from 'express';
import recognitionService from '../services/recognition.service';

const recognitionController = {
    // POST /api/recognitions
    async createRecord(req: Request, res: Response, next: NextFunction) {
        try {
            const record = await recognitionService.createRecord({
                ...req.body,
                scannedBy: req.user!.userId,
            });

            res.status(201).json({
                status:'success',
                data: { record },
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/recognitions — Admin saare dekhe
    async getAllRecords(req: Request, res: Response, next: NextFunction){
        try{
            const limit = req.query.limit
                ? parseInt(req.query.limit as string) : 50;

            const records = await recognitionService.getAllRecords(limit);

            res.status(200).json({
                status: 'success',
                results: records.length,
                data: { records },
            });
        }catch (error){
            next(error);
        }
    },

    // GET /api/recognitions/my-history — Employee apna dekhe
    async getMyHistory(req: Request, res: Response, next: NextFunction ){
        try{
            const limit = req.query.limit
                ? parseInt(req.query.limit as string)
                : 50;

            const records = await recognitionService.getMyHistory(
                req.user!.userId,
                limit
            );

            res.status(200).json({
                status: 'success',
                results: records.length,
                data: { records },
            });
        } catch(error){
            next(error);
        }
    },

    // GET /api/recognitions/stats
    async getStats(req: Request, res: Response, next: NextFunction) {
        try{
            // Admin → overall stats
            // Employee → apni stats
            const employeeId = req.user!.role === 'employee'? req.user!.userId : undefined;

            const stats = await recognitionService.getDashboardStats(
                employeeId
            );

            res.status(200).json({
                status: 'success',
                data: { stats },
            });
        } catch (error){
            next(error);
        }
    },
};

export default recognitionController;