# 🚀 Run Locally - Quick Start

## Prerequisites

- Node.js 18+
- MongoDB running locally
- npm or yarn

## Setup

### 1. Start MongoDB
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
# or
mongod
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB Connected: localhost
```

### 3. Frontend Setup (New Terminal)
```bash
cd frontend-unified
npm install
npm run dev
```

Expected output:
```
VITE v... ready in ... ms

➜  Local:   http://localhost:3000/
```

## Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/auth/logout` - Logout

### Other Routes
- `GET /api/v1/loans` - Get loans
- `GET /api/v1/customers` - Get customers
- `GET /api/v1/payments` - Get payments
- `GET /api/v1/dashboard` - Get dashboard data

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` or kill process using port 5000

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Run `npm install` in the directory

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Check CORS_ORIGIN in backend `.env` matches frontend URL

## Development Commands

### Backend
```bash
npm run dev      # Start development server
npm test         # Run tests
npm run lint     # Run linter
npm run build    # Build for production
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
npm run test     # Run tests
```

## Environment Files

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/loan-management
JWT_SECRET=dev-secret-key
JWT_EXPIRY=8h
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Business Loan CRM
VITE_LOG_LEVEL=info
```

## Database

### Connect to MongoDB
```bash
mongosh
use loan-management
db.users.find()
```

### Reset Database
```bash
mongosh
use loan-management
db.dropDatabase()
```

## Logs

### Backend Logs
```bash
# View PM2 logs
pm2 logs loan-api

# View application logs
tail -f backend/logs/combined.log
```

### Frontend Logs
Check browser console (F12)

## Stop Services

### Backend
```bash
# Press Ctrl+C in terminal
# or
pm2 stop loan-api
```

### Frontend
```bash
# Press Ctrl+C in terminal
```

### MongoDB
```bash
# Windows
# Press Ctrl+C in MongoDB terminal

# macOS/Linux
brew services stop mongodb-community
```

## Next Steps

1. ✅ Backend running on port 5000
2. ✅ Frontend running on port 3000
3. ✅ MongoDB connected
4. 📝 Create test user via `/api/v1/auth/register`
5. 🔐 Login via `/api/v1/auth/login`
6. 📊 Access dashboard

## Support

- Backend issues: Check `backend/logs/`
- Frontend issues: Check browser console
- Database issues: Check MongoDB logs
- API issues: Check `/api/v1/health` endpoint
