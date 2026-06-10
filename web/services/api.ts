import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const AI_URL = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:8000/api';

// Main API instance
export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// AI Service instance
export const aiApi = axios.create({
  baseURL: AI_URL,
});

// Har request mein token automatically add karo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
};

// Products APIs
export const productsAPI = {
  getAll: () => api.get('/products'),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.patch(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Employees APIs
export const employeesAPI = {
  getAll: () => api.get('/employees'),
  create: (data: any) => api.post('/employees', data),
  resetPassword: (id: string) => api.patch(`/employees/${id}/reset-password`),
  deactivate: (id: string) => api.delete(`/employees/${id}`),
};

// Recognition APIs
export const recognitionAPI = {
  getAll: () => api.get('/recognitions'),
  getStats: () => api.get('/recognitions/stats'),
};

// AI APIs
export const aiAPI = {
  registerFace: (formData: FormData) =>
    aiApi.post('/face/register', formData),
  registerProduct: (formData: FormData) =>
    aiApi.post('/product/register', formData),
};