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

// Product schemas
export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .trim(),

    description: z
      .string()
      .min(5, 'Description must be at least 5 characters')
      .max(500, 'Description cannot exceed 500 characters')
      .trim(),

    category: z
      .string()
      .min(2, 'Category must be at least 2 characters')
      .trim(),

    sku: z
      .string()
      .min(2, 'SKU must be at least 2 characters')
      .max(50, 'SKU cannot exceed 50 characters')
      .trim(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .trim()
      .optional(),

    description: z
      .string()
      .min(5, 'Description must be at least 5 characters')
      .max(500, 'Description cannot exceed 500 characters')
      .trim()
      .optional(),

    category: z
      .string()
      .min(2, 'Category must be at least 2 characters')
      .trim()
      .optional(),

    sku: z
      .string()
      .min(2, 'SKU must be at least 2 characters')
      .max(50, 'SKU cannot exceed 50 characters')
      .trim()
      .optional(),
  }),
});

// Employee schemas
export const createEmployeeSchema = z.object({
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

export const updateEmployeeSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .trim()
      .optional(),

    role: z
      .enum(['admin', 'employee'])
      .optional(),
  }),
});