# 🚀 Run Locally - Quick Start

## Prerequisites
- MongoDB running
- Node.js 18+
- npm

## Step 1: Start MongoDB
```bash
mongod
```

## Step 2: Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
```

Expected:
```
Server running on port 5000
MongoDB Connected: localhost
```

## Step 3: Frontend (Terminal 2)
```bash
cd frontend-unified
npm install
npm run dev
```

Expected:
```
VITE v... ready in ... ms
➜  Local:   http://localhost:3000/
```

## Step 4: Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health: http://localhost:5000/health

## Test Login
1. Go to http://localhost:3000/login
2. Enter any email and password (6+ chars)
3. Click Sign In
4. Should redirect to dashboard

## Troubleshooting

### MongoDB not running
```bash
# Windows
mongod

# macOS
brew services start mongodb-community
```

### Port already in use
Change PORT in `backend/.env` or kill process

### Module not found
```bash
cd backend && npm install
cd ../frontend-unified && npm install
```

## Done! 🎉
