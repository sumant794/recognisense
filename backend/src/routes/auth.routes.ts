import { Router } from 'express';
import authController from '../controllers/auth.controller';
import validate from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../utils/validation';

const router = Router();

// POST /api/auth/register
// validate middleware pehle chalega → phir controller
router.post(
  '/register',
  validate(registerSchema),
  authController.register
);

// POST /api/auth/login
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

// POST /api/auth/refresh
router.post(
  '/refresh',
  validate(refreshTokenSchema),
  authController.refresh
);

// POST /api/auth/logout
// authenticate → pehle login check karo
router.post(
  '/logout',
  authenticate,
  authController.logout
);

export default router;