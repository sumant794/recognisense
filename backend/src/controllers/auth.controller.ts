import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';

// Controller ka kaam:
// 1. Request se data nikalo
// 2. Service ko do
// 3. Response bhejo
// Koi logic nahi yahan

const authController = {
    //POST /api/auth/register
    async register(req: Request, res: Response, next: NextFunction){
        try{
            const { name, email, password, role } = req.body;
            const result = await authService.register({
                name,
                email,
                password,
                role,
            }); 
            
            res.status(201).json({
                status: 'success',
                data: result,
            });
        } catch (error){
            // Error central handler ko bhejo
            next(error);
        }
    },

    //POST /api/auth/login
    async login(req: Request, res: Response, next: NextFunction){
        try{
            const { email, password } = req.body;
            const result = await authService.login({ email, password });

            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch(error){
            next(error);
        }
    },

    //POST /api/auth/refresh
    async refresh(req: Request, res: Response, next: NextFunction){
        try {
            const { refreshToken } = req.body;

            if(!refreshToken){
                return res.status(400).json({
                    status: 'fail',
                    message: 'Refresh toknen is required',
                });
            }

            const result = await authService.refreshToken(refreshToken);
            
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error){
            next(error);
        }
    },

    //POST /api/auth/logout
    async logout(req: Request, res: Response, next: NextFunction){
        try {
            // userId request se aayega 
            // Auth middleware lagayenge baad mein
            const userId = req.body.userId;
            const result = await authService.logout(userId);

            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
};

export default authController;