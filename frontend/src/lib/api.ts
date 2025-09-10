import axios from 'axios';

// Base API URL - will be configurable
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookie-based auth
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/v1/auth/login', credentials),
  
  signup: (userData: { email: string; password: string; name: string }) =>
    api.post('/api/v1/auth/signup', userData),
  
  logout: () => api.post('/api/v1/auth/logout'),

  getProfile: () => api.get('/api/v1/auth/profile'),
};

// Product API calls
export const productApi = {
  getAll: () => api.get('/api/v1/product/list'),
  
  getById: (id: string) => api.get(`/api/v1/product/${id}`),
  
  create: (productData: {
    name: string;
    sku: string;
    quantity: number;
    price: number;
    category?: string;
  }) => api.post('/api/v1/product/add', productData),
  
  updateQuantity: (id: string, quantity: number) =>
    api.put(`/api/v1/product/${id}/quantity`, { quantity }),
  
  delete: (id: string) => api.delete(`/api/v1/product/${id}`),
};

// Party API calls
export const partyApi = {
  getAll: () => api.get('/api/v1/party/'),
  
  getById: (id: string) => api.get(`/api/v1/party/${id}`),
  
  create: (partyData: {
    name: string;
    type: 'customer' | 'supplier';
    email?: string;
    phone?: string;
    address?: string;
    balance?: number;
  }) => api.post('/api/v1/party/add', partyData),
  
  update: (id: string, partyData: Partial<{
    name: string;
    type: 'customer' | 'supplier';
    email: string;
    phone: string;
    address: string;
    balance: number;
  }>) => api.put(`/api/v1/party/update/${id}`, partyData),
  
  delete: (id: string) => api.delete(`/api/v1/party/delete/${id}`),
};

// Transaction API calls
export const transactionApi = {
  getAll: () => api.get('/api/v1/transaction/'),
  
  create: (transactionData: {
    party: string;
    items: Array<{
      listing: string;
      quantity: number;
      amount: number;
    }>;
    paymentStatus: string;
    totalAmount: number;
    type: 'sell' | 'buy';
    invoice: string;
    date: Date;
    remarks?: string;
  }) => api.post('/api/v1/transaction/add', transactionData),
  
  update: (id: string, transactionData: any) =>
    api.put(`/api/v1/transaction/update/${id}`, transactionData),
  
  delete: (id: string) => api.put(`/api/v1/transaction/delete/${id}`),
};

export default api;