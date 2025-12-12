# Deployment Guide

## Prerequisites
- Node.js 18+ 
- MongoDB 7.0+
- Docker & Docker Compose (for containerized deployment)

## Local Development Setup

### 1. Install Dependencies
```bash
# Install all dependencies
npm run install-all

# Or install individually
cd backend && npm install
cd ../frontend-web && npm install  
cd ../mobile-app && npm install
cd ../desktop-app && npm install
```

### 2. Database Setup
```bash
# Start MongoDB (if not using Docker)
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

### 3. Environment Configuration
Copy `.env.example` to `.env` in backend directory and update values:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nbfc_loan_db
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### 4. Seed Database
```bash
cd backend
npm run seed
```

### 5. Start Development Servers
```bash
# Start all services
npm run dev-all

# Or start individually
npm run dev-backend    # Port 5000
npm run dev-frontend   # Port 3000
npm run dev-mobile     # Expo CLI
npm run dev-desktop    # Electron
```

## Production Deployment

### Docker Compose (Recommended)
```bash
# Build and start all services
cd infrastructure
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

#### Backend
```bash
cd backend
npm ci --production
npm start
```

#### Frontend
```bash
cd frontend-web
npm ci
npm run build
# Serve build folder with nginx/apache
```

#### Mobile App
```bash
cd mobile-app
expo build:android  # For Android
expo build:ios      # For iOS
```

#### Desktop App
```bash
cd desktop-app
npm run build
npm run electron-pack
```

## Environment Variables

### Backend
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - Refresh token secret

### Frontend
- `REACT_APP_API_URL` - Backend API URL

## Health Checks
- Backend: `GET /api/health`
- Frontend: `GET /health`

## Monitoring
- Application logs in `/var/log/nbfc/`
- MongoDB logs in container logs
- Nginx access/error logs

## Backup Strategy
```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/nbfc_loan_db" --out=/backup/

# Restore
mongorestore --uri="mongodb://localhost:27017/nbfc_loan_db" /backup/nbfc_loan_db/
```

## Security Considerations
- Use strong JWT secrets in production
- Enable HTTPS with SSL certificates
- Configure firewall rules
- Regular security updates
- Database access controls
- API rate limiting

## Scaling
- Use MongoDB replica sets for high availability
- Load balance backend with nginx
- CDN for frontend static assets
- Redis for session management
- Horizontal scaling with Docker Swarm/Kubernetes