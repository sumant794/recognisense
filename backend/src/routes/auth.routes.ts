import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

//POST /api/auth/register
router.post('/register', authController.register);

//POST /api/auth/login
router.post('/login', authController.login);

//POST /api/auth/refresh
router.post('/refresh', authController.refresh);

//POST /api/auth/logout
router.post('/logout', authController.logout);

export default router;  