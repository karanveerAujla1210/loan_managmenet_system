# Testing Guide for Code Improvements

## 🧪 BACKEND TESTING

### 1. Security Tests

#### CORS Test
```bash
curl -X OPTIONS http://localhost:5000/api/v1/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST"
```
Expected: 200 OK with CORS headers

#### Rate Limiting Test
```bash
# Run 101 requests in quick succession
for i in {1..101}; do
  curl http://localhost:5000/api/v1/auth/login
done
```
Expected: 101st request returns 429 Too Many Requests

#### Helmet Headers Test
```bash
curl -I http://localhost:5000/health
```
Expected: See Strict-Transport-Security, X-Content-Type-Options headers

### 2. Authentication Tests

#### Valid Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@loanmanagement.com","password":"Admin@123"}'
```
Expected: 200 OK with token

#### Invalid Token
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer invalid_token"
```
Expected: 401 Unauthorized with INVALID_TOKEN error

#### Expired Token
```bash
# Use an old token
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```
Expected: 401 Unauthorized with TOKEN_EXPIRED error

#### Missing Token
```bash
curl -X GET http://localhost:5000/api/v1/auth/me
```
Expected: 401 Unauthorized with NO_TOKEN error

### 3. Payment Tests

#### Valid Payment
```bash
curl -X POST http://localhost:5000/api/v1/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "loanId":"<loan_id>",
    "amount":5000,
    "method":"online",
    "reference":"REF123"
  }'
```
Expected: 201 Created with payment data

#### Invalid Amount
```bash
curl -X POST http://localhost:5000/api/v1/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "loanId":"<loan_id>",
    "amount":-100,
    "method":"online"
  }'
```
Expected: 400 Bad Request with INVALID_AMOUNT error

#### Invalid Method
```bash
curl -X POST http://localhost:5000/api/v1/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "loanId":"<loan_id>",
    "amount":5000,
    "method":"invalid"
  }'
```
Expected: 400 Bad Request with INVALID_METHOD error

#### Pagination Test
```bash
curl "http://localhost:5000/api/v1/payments?loanId=<loan_id>&limit=10&skip=0" \
  -H "Authorization: Bearer <token>"
```
Expected: 200 OK with pagination info

### 4. Error Handling Tests

#### 404 Not Found
```bash
curl http://localhost:5000/api/v1/nonexistent
```
Expected: 404 with NOT_FOUND error

#### Health Check
```bash
curl http://localhost:5000/health
```
Expected: 200 OK with status and uptime

## 🧪 FRONTEND TESTING

### 1. Service Tests

#### Login Service
```javascript
import { authService } from '@/services';

// Test successful login
const result = await authService.login('admin@loanmanagement.com', 'Admin@123');
console.log('Token:', localStorage.getItem('authToken'));
console.log('User:', localStorage.getItem('user'));
```

#### Loan Service
```javascript
import { loanService } from '@/services';

// Test get loans
const loans = await loanService.getLoans({ limit: 10 });
console.log('Loans:', loans);

// Test get loan by ID
const loan = await loanService.getLoanById('<loan_id>');
console.log('Loan:', loan);
```

#### Payment Service
```javascript
import { paymentService } from '@/services';

// Test record payment
const payment = await paymentService.recordPayment('<loan_id>', {
  amount: 5000,
  method: 'online',
  reference: 'REF123'
});
console.log('Payment:', payment);

// Test get payments
const payments = await paymentService.getPayments('<loan_id>');
console.log('Payments:', payments);
```

### 2. Interceptor Tests

#### 401 Handling
```javascript
// Clear token
localStorage.removeItem('authToken');

// Try to make authenticated request
import { loanService } from '@/services';
try {
  await loanService.getLoans();
} catch (error) {
  // Should redirect to /login
  console.log('Redirected to login');
}
```

#### Token Persistence
```javascript
// After login
const token = localStorage.getItem('authToken');
console.log('Token stored:', !!token);

// Refresh page
// Token should still be there
const token2 = localStorage.getItem('authToken');
console.log('Token persisted:', token === token2);
```

### 3. Error Handling Tests

#### Network Error
```javascript
// Simulate network error
import api from '@/services';
api.defaults.baseURL = 'http://invalid-url';

try {
  await api.get('/test');
} catch (error) {
  console.log('Error caught:', error.message);
}
```

#### Timeout Test
```javascript
// Make slow request
import { loanService } from '@/services';
try {
  await loanService.getLoans();
} catch (error) {
  if (error.code === 'ECONNABORTED') {
    console.log('Request timed out');
  }
}
```

## 📊 INTEGRATION TESTS

### 1. Full Login Flow
```bash
# 1. Start backend
cd backend && npm start

# 2. Start frontend
cd frontend-unified && npm run dev

# 3. Open browser to http://localhost:5173
# 4. Enter credentials
# 5. Verify login success
# 6. Check token in localStorage
# 7. Navigate to dashboard
# 8. Verify data loads
```

### 2. Payment Flow
```bash
# 1. Login as admin
# 2. Navigate to Loans
# 3. Select a loan
# 4. Click "Record Payment"
# 5. Enter amount and method
# 6. Submit
# 7. Verify payment recorded
# 8. Check payment history updated
```

### 3. Error Flow
```bash
# 1. Clear token from localStorage
# 2. Try to access protected page
# 3. Should redirect to login
# 4. Login again
# 5. Should work normally
```

## 🔍 MONITORING

### Backend Logs
```bash
# Watch logs
tail -f backend/logs/combined.log

# Check for errors
grep ERROR backend/logs/error.log
```

### Frontend Console
```javascript
// Check for errors
console.error() calls

// Check network tab
// All requests should have proper headers
// All responses should have success: true
```

## ✅ CHECKLIST

- [ ] All CORS tests pass
- [ ] Rate limiting works
- [ ] Security headers present
- [ ] Login works
- [ ] Token validation works
- [ ] Payments can be recorded
- [ ] Pagination works
- [ ] Error messages are clear
- [ ] 401 redirects to login
- [ ] Token persists
- [ ] Frontend connects to backend
- [ ] All services work
- [ ] No console errors
- [ ] No network errors

## 🐛 TROUBLESHOOTING

### Backend won't start
```bash
# Check port 5000 is free
lsof -i :5000

# Check .env file
cat backend/.env

# Check MongoDB connection
mongosh
```

### Frontend won't connect
```bash
# Check API URL
console.log(import.meta.env.VITE_API_URL)

# Check CORS headers
# Open DevTools Network tab
# Check request headers

# Check backend is running
curl http://localhost:5000/health
```

### Login fails
```bash
# Check credentials
# Check database has users
# Check JWT_SECRET is set
# Check token is being stored
```

---

**Last Updated:** 2024-01-15
**Status:** Ready for Testing
