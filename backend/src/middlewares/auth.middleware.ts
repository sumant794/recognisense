import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/token';
import AppError from '../utils/AppError';
import authRepository from '../repositories/auth.repository';

// Express ke Request type ko extend karo
// Taaki req.user available ho har jagah
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: 'admin' | 'employee';
      };
    }
  }
}

// =====================
// AUTHENTICATE
// Token verify karo
// =====================
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Step 1: Header se token nikalo
    const authHeader = req.headers.authorization;

    // Authorization header hai?
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access denied. No token provided.', 401);
    }

    // "Bearer eyJ..." → "eyJ..." sirf token chahiye
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Access denied. Invalid token format.', 401);
    }

    // Step 2: Token verify karo
    // Agar expired ya invalid → jwt.verify throw karega
    let payload: TokenPayload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      throw new AppError('Invalid or expired token. Please login again.', 401);
    }

    // Step 3: User database mein exist karta hai?
    // Token valid ho sakta hai but user delete ho gaya ho
    const user = await authRepository.findById(payload.userId);

    if (!user) {
      throw new AppError('User no longer exists.', 401);
    }

    // Step 4: Account active hai?
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated.', 403);
    }

    // Step 5: User info request mein attach karo
    // Ab koi bhi route req.user se user info le sakta hai
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    // Aage jaane do
    next();
  } catch (error) {
    next(error);
  }
};

// =====================
// AUTHORIZE
// Role check karo
// =====================
export const authorize = (...roles: Array<'admin' | 'employee'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // req.user authenticate middleware ne set kiya tha
    if (!req.user) {
      return next(new AppError('Access denied. Please login.', 401));
    }

    // Is user ka role allowed hai?
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Required role: ${roles.join(' or ')}`,
          403
        )
      );
    }

    // Role valid hai — aage jaane do
    next();
  };
};