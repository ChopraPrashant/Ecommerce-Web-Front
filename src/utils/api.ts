import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import store from '../store/store';
import { logout } from '../store/slices/authSlice';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance with base URL and headers
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token to requests
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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
          withCredentials: true,
        });
        
        const { token } = data;
        localStorage.setItem('token', token);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log the user out
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorData = error.response.data as any;
      return Promise.reject({
        message: errorData?.message || 'An error occurred',
        status: error.response.status,
        data: errorData,
      });
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({
        message: 'No response from server. Please check your internet connection.',
        status: 0,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject({
        message: error.message || 'An error occurred',
        status: 0,
      });
    }
  }
);

// Helper functions for common HTTP methods
const http = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => 
    api.get<T>(url, config).then(response => response as unknown as T),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
    api.post<T>(url, data, config).then(response => response as unknown as T),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
    api.put<T>(url, data, config).then(response => response as unknown as T),
  
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
    api.patch<T>(url, data, config).then(response => response as unknown as T),
  
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => 
    api.delete<T>(url, config).then(response => response as unknown as T),
  
  // File upload helper
  upload: <T>(url: string, file: File, fieldName = 'file', config?: AxiosRequestConfig): Promise<T> => {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    return api.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response as unknown as T);
  },
};

export default http;
