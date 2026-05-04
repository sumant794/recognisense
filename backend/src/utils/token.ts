import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { IUser } from '../models/User';

export interface TokenPayload {
  userId: string;
  role: 'admin' | 'employee';
}

// Access Token banao — 15 min ka
export const generateAccessToken = (user: IUser): string => {
  const payload: TokenPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const options: SignOptions = {
    expiresIn: 15 * 60, // 15 minutes in seconds
  };

  return jwt.sign(payload, config.jwtSecret, options);
};

// Refresh Token banao — 7 din ka
export const generateRefreshToken = (user: IUser): string => {
  const payload: TokenPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const options: SignOptions = {
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
  };

  return jwt.sign(payload, config.jwtRefreshSecret, options);
};

// Access token verify karo
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
};

// Refresh token verify karo
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
};