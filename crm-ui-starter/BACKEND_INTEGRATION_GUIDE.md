# LoanHub CRM - Backend Integration Guide

## 📡 Connecting to Your Backend API

This guide explains how to integrate the LoanHub CRM frontend with your backend services.

---

## 🔌 API Integration Architecture

### Current State (Mock)
```
Frontend (React) → Mock Data (localStorage) → Mock API calls
```

### After Integration
```
Frontend (React) → Axios Client → Backend API → Database
```

---

## 📋 Integration Steps

### Step 1: Create API Service Layer

Create `src/services/api.ts`:

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios'

// Configure API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API Endpoints
export const api = {
  // Auth Endpoints
  auth: {
    login: (email: string, password: string) =>
      apiClient.post('/auth/login', { email, password }),
    logout: () =>
      apiClient.post('/auth/logout'),
    refreshToken: () =>
      apiClient.post('/auth/refresh')
  },

  // Customer Endpoints
  customers: {
    list: (filters?: { status?: string; search?: string }) =>
      apiClient.get('/customers', { params: filters }),
    getById: (id: string) =>
      apiClient.get(`/customers/${id}`),
    create: (data: any) =>
      apiClient.post('/customers', data),
    update: (id: string, data: any) =>
      apiClient.put(`/customers/${id}`, data),
    delete: (id: string) =>
      apiClient.delete(`/customers/${id}`)
  },

  // Loan Endpoints
  loans: {
    list: (filters?: { customerId?: string; status?: string }) =>
      apiClient.get('/loans', { params: filters }),
    getById: (id: string) =>
      apiClient.get(`/loans/${id}`),
    create: (data: any) =>
      apiClient.post('/loans', data),
    update: (id: string, data: any) =>
      apiClient.put(`/loans/${id}`, data)
  },

  // Dashboard Endpoints
  dashboard: {
    getKPIs: () =>
      apiClient.get('/dashboard/kpis'),
    getCharts: () =>
      apiClient.get('/dashboard/charts'),
    getRecentLoans: (limit: number = 10) =>
      apiClient.get(`/dashboard/recent-loans?limit=${limit}`)
  },

  // Credit Analysis Endpoints
  credit: {
    analyze: (customerId: string) =>
      apiClient.get(`/credit/${customerId}/analysis`),
    getScore: (customerId: string) =>
      apiClient.get(`/credit/${customerId}/score`),
    calculateEligibility: (customerId: string, amount: number) =>
      apiClient.post(`/credit/${customerId}/eligibility`, { amount })
  },

  // Collections Endpoints
  collections: {
    getDPDBuckets: () =>
      apiClient.get('/collections/dpd-buckets'),
    getLoans: (bucket: string) =>
      apiClient.get(`/collections/loans/${bucket}`),
    recordCall: (loanId: string, data: any) =>
      apiClient.post(`/collections/${loanId}/call-log`, data),
    recordPayment: (loanId: string, amount: number) =>
      apiClient.post(`/collections/${loanId}/payment`, { amount }),
    setPTP: (loanId: string, date: string, amount: number) =>
      apiClient.post(`/collections/${loanId}/promise-to-pay`, { date, amount })
  },

  // Reports Endpoints
  reports: {
    list: () =>
      apiClient.get('/reports'),
    generate: (type: string, params: any) =>
      apiClient.post(`/reports/${type}/generate`, params),
    download: (reportId: string) =>
      apiClient.get(`/reports/${reportId}/download`, { responseType: 'blob' })
  }
}

export default apiClient
```

### Step 2: Update AuthContext

Update `src/context/AuthContext.tsx`:

```typescript
import { api } from '../services/api'

// ... in login function:
const login = async (email: string, password: string) => {
  setLoading(true)
  setError(null)
  try {
    const response = await api.auth.login(email, password)
    const { user, token } = response.data

    // Store token
    localStorage.setItem('auth_token', token)
    
    // Store user
    setUser(user)
    localStorage.setItem('crm_user', JSON.stringify(user))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed'
    setError(message)
    throw err
  } finally {
    setLoading(false)
  }
}
```

### Step 3: Update Dashboard Component

Replace mock data with API calls in `src/pages/Dashboard.tsx`:

```typescript
import { useEffect, useState } from 'react'
import { api } from '../services/api'

export const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState(null)
  const [recentLoans, setRecentLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [kpisResponse, loansResponse] = await Promise.all([
          api.dashboard.getKPIs(),
          api.dashboard.getRecentLoans(5)
        ])
        setKpis(kpisResponse.data)
        setRecentLoans(loansResponse.data)
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    // ... render with real data from kpis and recentLoans
  )
}
```

### Step 4: Update Customer Components

Update `src/pages/Customers.tsx`:

```typescript
export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.customers.list({
          status: statusFilter === 'all' ? undefined : statusFilter,
          search: searchTerm
        })
        setCustomers(response.data)
      } catch (err) {
        console.error('Failed to load customers', err)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchCustomers, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, statusFilter])

  // ... render with real customer data
}
```

---

## 🔄 API Response Structures

### Expected Response Format

All API endpoints should return consistent structure:

```typescript
// Success Response
{
  success: true,
  data: { /* actual data */ },
  message?: "Operation successful"
}

// Error Response
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input",
    details: { /* field-specific errors */ }
  }
}
```

### Authentication Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "officer@company.com",
      "name": "John Officer",
      "role": "loan_officer"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Dashboard KPIs Response
```json
{
  "success": true,
  "data": {
    "totalCustomers": 45,
    "activeLoans": 32,
    "totalDisbursed": 1500000,
    "totalCollected": 850000,
    "overdueCases": 5,
    "portfolio": 1200000
  }
}
```

### Customers List Response
```json
{
  "success": true,
  "data": [
    {
      "id": "cust-001",
      "name": "Rajesh Kumar",
      "email": "rajesh@company.com",
      "phone": "+91-9876543210",
      "status": "active",
      "loanCount": 2,
      "totalLoanAmount": 500000
    }
  ]
}
```

---

## 📝 Required Backend Endpoints

### Authentication Endpoints
```
POST   /api/auth/login           - User login
POST   /api/auth/logout          - User logout
POST   /api/auth/refresh         - Refresh auth token
```

### Customer Endpoints
```
GET    /api/customers            - List all customers
GET    /api/customers/:id        - Get customer detail
POST   /api/customers            - Create customer
PUT    /api/customers/:id        - Update customer
DELETE /api/customers/:id        - Delete customer
```

### Loan Endpoints
```
GET    /api/loans                - List loans (with filters)
GET    /api/loans/:id            - Get loan detail
POST   /api/loans                - Create loan
PUT    /api/loans/:id            - Update loan
```

### Dashboard Endpoints
```
GET    /api/dashboard/kpis       - Get KPI metrics
GET    /api/dashboard/charts     - Get chart data
GET    /api/dashboard/recent-loans - Get recent loans
```

### Credit Analysis Endpoints
```
GET    /api/credit/:customerId/analysis     - Full credit analysis
GET    /api/credit/:customerId/score        - Get credit score
POST   /api/credit/:customerId/eligibility  - Calculate eligibility
```

### Collections Endpoints
```
GET    /api/collections/dpd-buckets        - Get DPD summary
GET    /api/collections/loans/:bucket      - Get loans in bucket
POST   /api/collections/:loanId/call-log   - Record call
POST   /api/collections/:loanId/payment    - Record payment
POST   /api/collections/:loanId/promise-to-pay - Set PTP
```

### Reports Endpoints
```
GET    /api/reports              - List available reports
POST   /api/reports/:type/generate - Generate report
GET    /api/reports/:id/download - Download report
```

---

## 🔐 Authentication & Authorization

### Token Management
```typescript
// Token stored in localStorage
localStorage.setItem('auth_token', token)

// Automatically added to all requests
// via axios interceptor
Authorization: `Bearer ${token}`
```

### Role-Based Access
```typescript
// Check user role in components
const { user } = useAuth()

if (user?.role !== 'admin') {
  return <AccessDenied />
}
```

---

## ⚙️ Environment Configuration

Create `.env.local`:

```
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
VITE_LOG_LEVEL=debug
```

Access in code:
```typescript
const API_URL = import.meta.env.VITE_API_URL
```

---

## 🧪 Testing Integration

### 1. Mock API Server (for testing)
```bash
# Use json-server to mock API during development
npm install -g json-server
json-server --watch db.json --port 3000
```

### 2. Test Authentication
```typescript
// Test login flow
await api.auth.login('officer@crm.com', 'password123')
console.log(localStorage.getItem('auth_token')) // Should have token
```

### 3. Test API Calls
```typescript
// Test customer fetch
const response = await api.customers.list()
console.log(response.data) // Should have customers array
```

---

## 🐛 Error Handling

### Common Error Scenarios

```typescript
// Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout() // Redirect to login
    }
    return Promise.reject(error)
  }
)

// Handle validation errors
catch (error: any) {
  if (error.response?.data?.errors) {
    // Handle field-level validation errors
    Object.entries(error.response.data.errors).forEach(([field, message]) => {
      console.error(`${field}: ${message}`)
    })
  }
}
```

---

## 🚀 Deployment

### Environment Variables by Environment

**Development**
```
VITE_API_URL=http://localhost:3000/api
```

**Staging**
```
VITE_API_URL=https://staging-api.example.com/api
```

**Production**
```
VITE_API_URL=https://api.example.com/api
```

---

## 📊 Performance Optimization

### Caching
```typescript
// Cache customer list for 5 minutes
const cache = new Map()

export const getCachedCustomers = async () => {
  const cacheKey = 'customers'
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)
    if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.data
    }
  }

  const response = await api.customers.list()
  cache.set(cacheKey, { data: response.data, timestamp: Date.now() })
  return response.data
}
```

### Pagination
```typescript
// Use limit/offset for large datasets
const response = await api.customers.list({
  limit: 20,
  offset: 0,
  sort: 'name'
})
```

### Real-time Updates (WebSocket)
```typescript
// Listen for real-time updates
const socket = io(API_BASE_URL)
socket.on('loan:updated', (loanData) => {
  setLoan(loanData)
})
```

---

## 🔗 Example: Complete Integration Flow

### Full Login to Dashboard Flow

1. **User clicks Sign In**
   - Component calls `login(email, password)`

2. **AuthContext calls API**
   - `api.auth.login(email, password)`

3. **Backend validates credentials**
   - Returns user data + JWT token

4. **Frontend stores token**
   - `localStorage.setItem('auth_token', token)`

5. **Axios interceptor adds token**
   - All subsequent requests include `Authorization: Bearer {token}`

6. **User routed to Dashboard**
   - Protected route validates authentication

7. **Dashboard fetches data**
   - `api.dashboard.getKPIs()`
   - `api.dashboard.getRecentLoans()`

8. **Data renders in UI**
   - KPI cards, charts, tables display real data

---

## 📞 Backend Integration Checklist

- [ ] Create API service layer (`src/services/api.ts`)
- [ ] Update AuthContext with real API calls
- [ ] Update Dashboard with API data
- [ ] Update Customers page with API data
- [ ] Update CustomerDetail with API calls
- [ ] Update CreditAnalysis with API data
- [ ] Update Collections with API data
- [ ] Add environment variables
- [ ] Test all API endpoints
- [ ] Handle error scenarios
- [ ] Add loading states
- [ ] Test on staging environment
- [ ] Deploy to production

---

## 🎯 Next Steps

1. Implement backend endpoints matching the required API spec
2. Test endpoints with Postman/Insomnia
3. Integrate API service layer into frontend
4. Test end-to-end flows
5. Deploy to staging environment
6. Perform UAT with business team
7. Deploy to production

---

**Ready to integrate? Start with Step 1 and work through systematically!** 🚀
