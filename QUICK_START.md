# Quick Start Guide

## Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

## 1. Install Dependencies (Run these commands)

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies  
cd ../frontend-web
npm install

# Mobile dependencies
cd ../mobile-app
npm install
```

## 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your values
# MONGO_ROOT_PASSWORD=your-secure-password
# REDIS_PASSWORD=your-redis-password
# JWT_SECRET=your-jwt-secret
```

## 3. Start with Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## 4. Development Mode

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend-web
npm run dev

# Terminal 3 - Mobile (if needed)
cd mobile-app
npm start
```

## 5. Run Tests

```bash
cd backend
npm test

# With coverage
npm run test -- --coverage
```

## 6. Access Applications

- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:5173  
- **Health Check**: http://localhost:5000/health
- **Metrics**: http://localhost:5000/metrics
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin123)

## 7. Backup & Restore

```bash
# Create backup
./scripts/backup.sh

# Restore backup
./scripts/restore.sh ./backups/backup_20231201_120000.archive
```

## Checklist ✅

High Priority (Complete these first):
- [ ] Install dependencies (`npm install` in backend, frontend, mobile)
- [ ] Copy `.env.example` to `.env` and configure
- [ ] Run `docker-compose up -d` 
- [ ] Verify health endpoint: http://localhost:5000/health
- [ ] Run tests: `cd backend && npm test`
- [ ] Setup Git hooks: `cd backend && npm run prepare`
- [ ] Verify CI pipeline in GitHub Actions

Medium Priority:
- [ ] Configure Prometheus monitoring
- [ ] Setup Grafana dashboards
- [ ] Test backup/restore scripts
- [ ] Deploy to staging environment
- [ ] Setup Kubernetes manifests

## Troubleshooting

**Port conflicts**: Change ports in docker-compose.yml
**Permission errors**: Run `chmod +x scripts/*.sh`
**MongoDB connection**: Check MONGODB_URI in .env
**Redis connection**: Verify REDIS_HOST and REDIS_PASSWORD