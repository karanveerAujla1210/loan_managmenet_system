# Troubleshooting Guide

## Backend Issues

### Cron Job Not Running
**Problem**: DPD updates not happening at 2:30 AM

**Solution**:
1. Check `CRON_ENABLED` in `.env` is not set to `false`
2. Verify MongoDB connection is active
3. Check server logs for errors
4. Restart backend: `npm run dev`

### Routes Not Found (404)
**Problem**: API endpoints returning 404

**Solution**:
1. Verify routes are imported in `backend/src/app.js`
2. Check route file exists in `backend/src/routes/`
3. Verify route path matches request URL
4. Restart backend server

### Database Connection Failed
**Problem**: MongoDB connection error

**Solution**:
1. Verify MongoDB is running: `mongosh`
2. Check `MONGODB_URI` in `.env`
3. Verify credentials are correct
4. Check MongoDB service status

### JWT Token Expired
**Problem**: 401 Unauthorized errors

**Solution**:
1. Get new token from `/api/v1/auth/login`
2. Include token in Authorization header: `Bearer TOKEN`
3. Check `JWT_EXPIRY` in `.env`

## Frontend Issues

### Routes Not Loading
**Problem**: Pages showing blank or 404

**Solution**:
1. Verify `frontend/src/routes.jsx` exists
2. Check `App.jsx` uses `useRoutes(routes)`
3. Verify page components exist
4. Check browser console for errors

### API Calls Failing
**Problem**: CORS errors or 404 from API

**Solution**:
1. Verify backend is running on correct port
2. Check `REACT_APP_API_URL` in `.env`
3. Verify CORS is enabled in `backend/src/app.js`
4. Check network tab in browser DevTools

### Authentication Not Working
**Problem**: Login failing or token not persisting

**Solution**:
1. Verify `AuthContext` is properly initialized
2. Check localStorage for token
3. Verify JWT secret matches between frontend and backend
4. Check browser console for errors

## Database Issues

### Indexes Not Created
**Problem**: Slow queries or duplicate key errors

**Solution**:
```bash
mongosh < docs/mongodb-indexes.js
```

### Data Inconsistency
**Problem**: DPD or bucket values incorrect

**Solution**:
1. Run DPD update manually:
   ```bash
   cd backend && npm run cron:dpd
   ```
2. Check `DPDUpdateService.js` logic
3. Verify installment data is correct

## Common Errors

### "Cannot find module"
**Solution**: 
```bash
cd backend && npm install
cd ../frontend && npm install
```

### "Port already in use"
**Solution**:
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 PID
```

### "ENOENT: no such file or directory"
**Solution**:
1. Verify file path is correct
2. Check file exists: `ls -la path/to/file`
3. Verify directory structure matches documentation

## Performance Issues

### Slow API Responses
**Solution**:
1. Check MongoDB indexes are created
2. Verify database connection is fast
3. Check for N+1 queries in services
4. Enable Redis caching

### High Memory Usage
**Solution**:
1. Check for memory leaks in cron jobs
2. Verify large queries are paginated
3. Check for circular references in models

## Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Linter
```bash
cd backend
npm run lint
```

### Manual API Testing
```bash
# Health check
curl http://localhost:5000/health

# Get token
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Use token
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/v1/overdue/buckets
```

## Getting Help

1. Check logs: `backend/logs/combined.log`
2. Review error messages in console
3. Check `.env` configuration
4. Verify database connection
5. Review API documentation in `docs/openapi.yaml`

## Emergency Procedures

### Reset Database
```bash
# WARNING: This deletes all data
mongosh
use loan-management
db.dropDatabase()
```

### Restart Services
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Docker
docker-compose restart
```

### Check System Health
```bash
# Backend health
curl http://localhost:5000/health

# Frontend running
curl http://localhost:3000

# MongoDB
mongosh --eval "db.adminCommand('ping')"
```
