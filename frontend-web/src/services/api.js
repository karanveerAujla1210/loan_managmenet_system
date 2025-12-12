import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = 'http://localhost:5000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          })
          const { accessToken } = response.data
          localStorage.setItem('accessToken', accessToken)
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${accessToken}`
          return api.request(error.config)
        } catch (refreshError) {
          localStorage.clear()
          window.location.href = '/login'
        }
      } else {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    
    toast.error(error.response?.data?.message || 'Something went wrong')
    return Promise.reject(error)
  }
)

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
}

// Customer services
export const customerService = {
  getAll: () => api.get('/customers'),
  create: (data) => api.post('/customers', data),
  getById: (id) => api.get(`/customers/${id}`),
  update: (id, data) => api.put(`/customers/${id}`, data),
}

// Loan services
export const loanService = {
  getAll: () => api.get('/loans'),
  create: (data) => api.post('/loans', data),
  getById: (id) => api.get(`/loans/${id}`),
  disburse: (id) => api.post(`/loans/${id}/disburse`),
  importData: (data) => api.post('/loans/import', data),
}

// Payment services
export const paymentService = {
  create: (data) => api.post('/payments', data),
  getByLoan: (loanId) => api.get(`/payments/loan/${loanId}`),
}

// Collection services
export const collectionService = {
  getDueToday: () => api.get('/collections/due-today'),
  getOverdue: (bucket) => api.get(`/collections/overdue/${bucket || ''}`),
  assignAgent: (data) => api.post('/collections/assign-agent', data),
  createPTP: (data) => api.post('/collections/ptp', data),
  addNote: (data) => api.post('/collections/note', data),
  getTimeline: (loanId) => api.get(`/collections/timeline/${loanId}`),
}

// Dashboard services
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getCollectionPerformance: () => api.get('/dashboard/collection-performance'),
}

export default api