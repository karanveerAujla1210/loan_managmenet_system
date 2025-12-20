import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.data?.token) {
      localStorage.setItem('authToken', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data.data;
  },

  logout: async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return { success: true };
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  }
};

export const loanService = {
  getLoanById: async (loanId) => {
    const response = await api.get(`/loans/${loanId}`);
    return response.data.data;
  },

  getInstallments: async (loanId, params = {}) => {
    const response = await api.get(`/loans/${loanId}/installments`, { params });
    return response.data.data;
  },

  getPaymentHistory: async (loanId, params = {}) => {
    const response = await api.get(`/loans/${loanId}/payments`, { params });
    return response.data.data;
  },

  getLoans: async (params = {}) => {
    const response = await api.get('/loans', { params });
    return response.data.data;
  }
};

export const paymentService = {
  recordPayment: async (loanId, paymentData) => {
    const response = await api.post(`/payments`, { 
      loanId, 
      ...paymentData 
    });
    return response.data.data;
  },

  getPayments: async (loanId, params = {}) => {
    const response = await api.get(`/payments`, { 
      params: { loanId, ...params } 
    });
    return response.data.data;
  }
};

export const customerService = {
  getCustomers: async (params = {}) => {
    const response = await api.get('/customers', { params });
    return response.data.data;
  },

  getCustomerById: async (customerId) => {
    const response = await api.get(`/customers/${customerId}`);
    return response.data.data;
  }
};

export const dashboardService = {
  getDashboard: async (params = {}) => {
    const response = await api.get('/dashboard', { params });
    return response.data.data;
  }
};

export const reportsService = {
  getPortfolio: async (params = {}) => {
    const response = await api.get('/reports/portfolio', { params });
    return response.data.data;
  },

  getBuckets: async (params = {}) => {
    const response = await api.get('/reports/buckets', { params });
    return response.data.data;
  },

  getEfficiency: async (params = {}) => {
    const response = await api.get('/reports/efficiency', { params });
    return response.data.data;
  },

  getLegal: async (params = {}) => {
    const response = await api.get('/reports/legal', { params });
    return response.data.data;
  },

  getCollectors: async (params = {}) => {
    const response = await api.get('/reports/collectors', { params });
    return response.data.data;
  },

  getAging: async (params = {}) => {
    const response = await api.get('/reports/aging', { params });
    return response.data.data;
  }
};

export const legalService = {
  getLegalCases: async (params = {}) => {
    const response = await api.get('/legal/cases', { params });
    return response.data.data;
  },

  getLegalStats: async () => {
    const response = await api.get('/legal/stats');
    return response.data.data;
  }
};

export default api;
