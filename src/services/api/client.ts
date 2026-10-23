import axios, { AxiosError, AxiosInstance } from 'axios';

export const delay = (ms: number = 250): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export const createResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  data,
  success: true,
  message,
});

// Base API URL: uses Vite environment variable or defaults to relative '/api'
const resolveApiBaseUrl = (): string => {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_BASE_URL : '';
  if (!envUrl) return '/api';
  const clean = envUrl.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const API_BASE_URL = resolveApiBaseUrl();

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const storedToken = localStorage.getItem('reversely_auth_token');
      if (storedToken && config.headers) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }
    } catch {
      // Storage access issue fallback
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; success?: boolean }>) => {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(errorMsg));
  }
);
