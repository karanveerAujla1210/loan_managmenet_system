import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Token will be handled via secure cookies
    return config;
  },
  (error) => {
    console.error('Request error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    console.error('API Error:', error.response?.data?.error || error.message);
    return Promise.reject(error);
  }
);

export default api;
