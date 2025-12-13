import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with refresh token handling
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) return Promise.reject(error);

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // If refresh endpoint itself returns 401, logout
    if (originalRequest.url && originalRequest.url.includes('/auth/refresh')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Avoid retrying same request multiple times
    if (originalRequest._retry) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    isRefreshing = true;

    try {
      // Use a bare axios call to avoid interceptor loop
      const resp = await axios.post(`${axiosInstance.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
      const newToken = resp.data?.token;
      if (newToken) {
        localStorage.setItem('token', newToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        onRefreshed(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }

      // Refresh failed
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      onRefreshed(null);
      window.location.href = '/login';
      return Promise.reject(error);
    } catch (refreshError) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      onRefreshed(null);
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
