# Developer Guide - Code Improvements

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm start
```

### Frontend Setup
```bash
cd frontend-unified
npm install
npm run dev
```

### Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health: http://localhost:5000/health

## 📚 API Standards

### Response Format
```javascript
// Success
{
  success: true,
  data: { /* response data */ },
  pagination: { total, limit, skip } // optional
}

// Error
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: 'Human readable message',
    details: { /* optional details */ }
  }
}
```

### Status Codes
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

### Error Codes
```javascript
// Auth
'NO_TOKEN' - No token provided
'INVALID_TOKEN' - Token is invalid
'TOKEN_EXPIRED' - Token has expired
'UNAUTHORIZED' - User not authenticated
'FORBIDDEN' - User lacks permissions

// Validation
'VALIDATION_ERROR' - Input validation failed
'INVALID_AMOUNT' - Invalid payment amount
'INVALID_METHOD' - Invalid payment method

// Resources
'LOAN_NOT_FOUND' - Loan doesn't exist
'PAYMENT_NOT_FOUND' - Payment doesn't exist
'NO_PENDING_INSTALLMENT' - No pending installment

// Server
'INTERNAL_ERROR' - Server error
'CONFIG_ERROR' - Configuration error
'NOT_FOUND' - Route not found
```

## 🔐 Authentication

### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@loanmanagement.com",
  "password": "Admin@123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": { "id", "email", "role" }
  }
}
```

### Protected Requests
```bash
GET /api/v1/auth/me
Authorization: Bearer <token>
```

## 💳 Payment API

### Record Payment
```bash
POST /api/v1/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "loanId": "507f1f77bcf86cd799439011",
  "amount": 5000,
  "method": "online",
  "reference": "REF123",
  "idempotencyKey": "unique-key" // optional
}

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "loanId": "...",
    "amount": 5000,
    "method": "online",
    "status": "confirmed",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Get Payments
```bash
GET /api/v1/payments?loanId=507f1f77bcf86cd799439011&limit=20&skip=0
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [ /* payments */ ],
  "pagination": {
    "total": 50,
    "limit": 20,
    "skip": 0
  }
}
```

## 🎯 Frontend Services

### Using Services
```javascript
import { authService, loanService, paymentService } from '@/services';

// Login
const user = await authService.login(email, password);

// Get loans
const loans = await loanService.getLoans({ limit: 10 });

// Record payment
const payment = await paymentService.recordPayment(loanId, {
  amount: 5000,
  method: 'online'
});
```

### Error Handling
```javascript
try {
  const result = await loanService.getLoans();
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 400) {
    // Handle validation error
    console.log(error.response.data.error.details);
  } else {
    // Handle other errors
  }
}
```

## 🧪 Testing

### Run Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend-unified
npm test
```

### Manual Testing
See TESTING_IMPROVEMENTS.md for detailed test cases

## 📝 Code Style

### Backend
- Use async/await
- Validate all inputs
- Return consistent error format
- Add JSDoc comments
- Use meaningful variable names

### Frontend
- Use functional components
- Use hooks for state
- Handle errors gracefully
- Add loading states
- Use consistent naming

## 🔍 Debugging

### Backend
```bash
# Enable debug logs
DEBUG=* npm start

# Check logs
tail -f logs/combined.log
```

### Frontend
```javascript
// Check API calls
console.log('Request:', config);
console.log('Response:', response);

// Check token
console.log('Token:', localStorage.getItem('authToken'));

// Check user
console.log('User:', localStorage.getItem('user'));
```

## 📦 Dependencies

### Backend
- express - Web framework
- mongoose - MongoDB ODM
- jsonwebtoken - JWT auth
- express-rate-limit - Rate limiting
- helmet - Security headers
- cors - CORS handling
- compression - Response compression

### Frontend
- react - UI library
- axios - HTTP client
- react-router-dom - Routing
- tailwindcss - Styling

## 🚀 Deployment

### Backend
```bash
# Build
npm run build

# Start production
NODE_ENV=production npm start
```

### Frontend
```bash
# Build
npm run build

# Preview
npm run preview
```

## 📞 Support

### Common Issues

**Backend won't start**
- Check .env file
- Check MongoDB connection
- Check port 5000 is free

**Frontend won't connect**
- Check API URL in .env
- Check backend is running
- Check CORS configuration

**Login fails**
- Check credentials
- Check database has users
- Check JWT_SECRET is set

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT Docs](https://jwt.io/)
- [Axios Docs](https://axios-http.com/)

---

**Last Updated:** 2024-01-15
**Version:** 1.0
