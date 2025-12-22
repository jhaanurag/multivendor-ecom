/**
 * API Configuration
 * Centralized axios instance for all API calls
 */

import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
};

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (productData) => api.post('/products', productData),
    update: (id, productData) => api.put(`/products/${id}`, productData),
    delete: (id) => api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
    get: () => api.get('/cart'),
    addItem: (productId, quantity) => api.post('/cart/add', { productId, quantity }),
    updateItem: (productId, quantity) => api.put('/cart/update', { productId, quantity }),
    removeItem: (productId) => api.delete(`/cart/remove/${productId}`),
    clear: () => api.delete('/cart/clear'),
};

// Orders API
export const ordersAPI = {
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
    create: (orderData) => api.post('/orders', orderData),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Shops (Vendor) API
export const shopsAPI = {
    getAll: () => api.get('/shops'),
    getById: (id) => api.get(`/shops/${id}`),
    create: (shopData) => api.post('/shops', shopData),
    update: (id, shopData) => api.put(`/shops/${id}`, shopData),
};

export default api;
