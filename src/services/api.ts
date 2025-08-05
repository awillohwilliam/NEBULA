import axios from 'axios';
import { mockApiService } from '../utils/mockApi';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface AirtimePurchaseRequest {
  phoneNumber: string;
  amount: number;
  network: string;
  tier: string;
}

export interface BundlePurchaseRequest {
  phoneNumber: string;
  bundleId: string;
  network: string;
}

export interface TransactionResponse {
  id: string;
  reference: string;
  status: 'success' | 'pending' | 'failed';
  message: string;
  amount: number;
  recipient: string;
  tier?: string;
}

export interface NetworkBalance {
  network: string;
  balance: number;
  lastUpdated: string;
}

// API Functions
export const apiService = {
  // Airtime Services
  purchaseAirtime: async (data: AirtimePurchaseRequest): Promise<TransactionResponse> => {
    // Use mock API in development
    if (import.meta.env.DEV) {
      return mockApiService.purchaseAirtime(data);
    }
    const response = await api.post('/airtime/purchase', data);
    return response.data;
  },

  // Bundle Services
  purchaseBundle: async (data: BundlePurchaseRequest): Promise<TransactionResponse> => {
    // Use mock API in development
    if (import.meta.env.DEV) {
      return mockApiService.purchaseBundle(data);
    }
    const response = await api.post('/bundles/purchase', data);
    return response.data;
  },

  // Network Services
  getNetworkBalances: async (): Promise<NetworkBalance[]> => {
    // Use mock API in development
    if (import.meta.env.DEV) {
      return mockApiService.getNetworkBalances();
    }
    const response = await api.get('/networks/balances');
    return response.data;
  },

  verifyPhoneNumber: async (phoneNumber: string, network: string): Promise<{ valid: boolean; carrier: string }> => {
    // Use mock API in development
    if (import.meta.env.DEV) {
      return mockApiService.verifyPhoneNumber(phoneNumber, network);
    }
    const response = await api.post('/verify/phone', { phoneNumber, network });
    return response.data;
  },

  // Transaction Services
  getTransactionHistory: async (page = 1, limit = 10) => {
    // Use mock API in development
    if (import.meta.env.DEV) {
      return mockApiService.getTransactionHistory();
    }
    const response = await api.get(`/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },

  getTransactionStatus: async (transactionId: string) => {
    const response = await api.get(`/transactions/${transactionId}/status`);
    return response.data;
  },

  // Pricing Services
  getCurrentPricing: async () => {
    // Use mock API in development
    if (import.meta.env.DEV) {
      return mockApiService.getCurrentPricing();
    }
    const response = await api.get('/pricing/current');
    return response.data;
  },
};