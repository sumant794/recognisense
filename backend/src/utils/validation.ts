import { z } from 'zod';

// =====================
// AUTH SCHEMAS
// =====================

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .trim(),

    email: z
      .string()
      .email('Please provide a valid email')
      .toLowerCase(),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),

    role: z
      .enum(['admin', 'employee'])
      .optional()
      .default('employee'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Please provide a valid email')
      .toLowerCase(),

    password: z
      .string()
      .min(1, 'Password is required'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z
      .string()
      .min(1, 'Refresh token is required'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;