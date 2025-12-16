import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Custom hook for GET requests
export const useFetch = (key, url, options = {}) => {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const { data } = await api.get(url);
      return data.data;
    },
    ...options,
  });
};

// Custom hook for POST requests
export const usePost = (key, url, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post(url, data);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
      if (options.invalidateQueries) {
        queryClient.invalidateQueries(options.invalidateQueries);
      }
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
    },
    onError: (error, variables, context) => {
      const errorMessage = error.response?.data?.error || 'An error occurred';
      toast.error(errorMessage);
      
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

// Custom hook for PUT requests
export const usePut = (key, url, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.put(url, data);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
      if (options.invalidateQueries) {
        queryClient.invalidateQueries(options.invalidateQueries);
      }
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
    },
    onError: (error, variables, context) => {
      const errorMessage = error.response?.data?.error || 'An error occurred';
      toast.error(errorMessage);
      
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

// Custom hook for DELETE requests
export const useDelete = (key, url, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`${url}/${id}`);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
      if (options.invalidateQueries) {
        queryClient.invalidateQueries(options.invalidateQueries);
      }
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
    },
    onError: (error, variables, context) => {
      const errorMessage = error.response?.data?.error || 'An error occurred';
      toast.error(errorMessage);
      
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

// Custom hook for direct API calls
export const useApi = () => {
  return {
    get: async (url) => {
      try {
        const response = await api.get(url);
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching data');
        throw error;
      }
    },
    post: async (url, data) => {
      try {
        const response = await api.post(url, data);
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error posting data');
        throw error;
      }
    },
    put: async (url, data) => {
      try {
        const response = await api.put(url, data);
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error updating data');
        throw error;
      }
    },
    delete: async (url) => {
      try {
        const response = await api.delete(url);
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting data');
        throw error;
      }
    }
  };
};

export default api;
