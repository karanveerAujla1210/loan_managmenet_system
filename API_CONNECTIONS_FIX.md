# API Connections Fix & Setup Guide

## Issues Identified and Fixed

### 1. **Backend API Port Inconsistency**
- **Issue**: Backend runs on port 5000, but some services expect port 3000
- **Fix**: Standardized all API calls to use port 5000

### 2. **Frontend API Service Inconsistencies**
- **Issue**: Multiple API service files with different implementations
- **Fix**: Unified API service with proper error handling and token management

### 3. **Mobile App API Configuration**
- **Issue**: Inconsistent base URLs and missing authentication flow
- **Fix**: Standardized mobile API configuration with proper token handling

### 4. **Missing Authentication Routes**
- **Issue**: Auth routes missing refresh token endpoint
- **Fix**: Added complete authentication flow

## Fixed Files

### Backend Fixes

#### 1. Auth Routes Enhancement
```javascript
// backend/src/modules/auth/auth.routes.js
router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
```

#### 2. Standardized Response Format
All API responses now follow this format:
```javascript
{
  success: boolean,
  message: string,
  data?: any,
  error?: string,
  timestamp: string
}
```

### Frontend Fixes

#### 1. Unified API Service
- Standardized base URL to `http://localhost:5000/api/v1`
- Added proper token refresh mechanism
- Unified error handling across all services

#### 2. Service Integration
- Fixed loan service API calls
- Standardized payment service endpoints
- Unified collection service methods

### Mobile App Fixes

#### 1. API Configuration
- Fixed base URL inconsistency
- Added proper token storage with SecureStore
- Implemented offline-first architecture

#### 2. Service Alignment
- Aligned mobile API calls with backend endpoints
- Added proper error handling for offline scenarios

## Environment Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/loan_management
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=NBFC Loan Management
```

### Mobile App (app.json)
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:5000/api/v1"
    }
  }
}
```

## API Endpoints Summary

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

### Customers
- `GET /api/v1/customers` - Get all customers
- `POST /api/v1/customers` - Create customer
- `GET /api/v1/customers/:id` - Get customer by ID
- `PUT /api/v1/customers/:id` - Update customer

### Loans
- `GET /api/v1/loans` - Get all loans
- `POST /api/v1/loans` - Create loan
- `GET /api/v1/loans/:id` - Get loan by ID
- `POST /api/v1/loans/:id/payments` - Add payment
- `POST /api/v1/loans/:id/ptp` - Add PTP
- `POST /api/v1/loans/:id/notes` - Add note
- `POST /api/v1/loans/import` - Import loan data

### Collections
- `GET /api/v1/collections/due-today` - Get due today
- `GET /api/v1/collections/overdue` - Get overdue loans
- `GET /api/v1/collections/bucket/:bucket` - Get by bucket
- `POST /api/v1/collections/:loanId/payment` - Add payment
- `POST /api/v1/collections/:loanId/ptp` - Add PTP
- `POST /api/v1/collections/:loanId/note` - Add note

### Analytics & Dashboard
- `GET /api/v1/dashboard/stats` - Dashboard statistics
- `GET /api/v1/analytics/performance` - Performance metrics
- `GET /api/v1/analytics/collections` - Collection analytics

## Testing the Connections

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
cd frontend-web
npm run dev
```

### 3. Start Mobile App
```bash
cd mobile-app
npm start
```

### 4. Test API Endpoints
Use the provided test scripts or Postman collection to verify all endpoints work correctly.

## Common Issues & Solutions

### 1. CORS Issues
- Ensure backend CORS is configured for frontend URL
- Check that credentials are properly set

### 2. Authentication Issues
- Verify JWT secrets are set in environment
- Check token expiration settings
- Ensure refresh token flow works

### 3. Database Connection
- Verify MongoDB is running
- Check connection string in .env
- Ensure database permissions

### 4. Port Conflicts
- Backend: 5000
- Frontend: 5173
- Mobile: 19000 (Expo default)

## Next Steps

1. **Database Setup**: Run the seed scripts to populate initial data
2. **Environment Setup**: Configure all .env files with proper values
3. **Testing**: Run the test suite to verify all connections
4. **Deployment**: Use the provided Docker configurations for deployment

## Support

For issues or questions:
1. Check the logs in `backend/logs/`
2. Verify environment configurations
3. Test individual API endpoints
4. Check network connectivity between services