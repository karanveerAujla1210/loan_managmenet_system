# Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] All tests pass
- [ ] No console errors
- [ ] No console warnings
- [ ] ESLint passes
- [ ] Code review completed
- [ ] No hardcoded credentials
- [ ] No TODO comments left

### Security
- [ ] JWT_SECRET is strong
- [ ] CORS_ORIGIN is configured
- [ ] Rate limiting is enabled
- [ ] Helmet headers are set
- [ ] Input validation is in place
- [ ] SQL injection prevention checked
- [ ] XSS protection enabled
- [ ] HTTPS enforced

### Database
- [ ] MongoDB connection tested
- [ ] Indexes created
- [ ] Backups configured
- [ ] Migration scripts tested
- [ ] Data validation rules set

### Environment
- [ ] .env file configured
- [ ] All required variables set
- [ ] No sensitive data in code
- [ ] Logging configured
- [ ] Error tracking configured

## Backend Deployment

### Build
```bash
cd backend
npm install --production
npm run build
```

### Configuration
- [ ] NODE_ENV=production
- [ ] PORT configured
- [ ] MONGODB_URI set
- [ ] JWT_SECRET set
- [ ] CORS_ORIGIN set
- [ ] LOG_LEVEL set

### Testing
```bash
npm test
npm run lint
```

### Deployment
```bash
# Using PM2
pm2 start ecosystem.config.js --env production

# Using Docker
docker build -f Dockerfile.prod -t loan-app:latest .
docker run -d -p 5000:5000 --env-file .env loan-app:latest
```

### Verification
- [ ] Health check passes: `curl http://localhost:5000/health`
- [ ] API responds: `curl http://localhost:5000/api/v1/auth/login`
- [ ] Logs are clean
- [ ] No errors in logs
- [ ] Database connection works

## Frontend Deployment

### Build
```bash
cd frontend-unified
npm install --production
npm run build
```

### Configuration
- [ ] VITE_API_URL set correctly
- [ ] Environment variables configured
- [ ] Build output verified

### Testing
```bash
npm test
npm run lint
npm run build
```

### Deployment
```bash
# Using Vercel
vercel deploy --prod

# Using Docker
docker build -f Dockerfile -t loan-app-frontend:latest .
docker run -d -p 3000:3000 loan-app-frontend:latest

# Using Nginx
cp dist/* /var/www/html/
```

### Verification
- [ ] Frontend loads: `http://your-domain.com`
- [ ] API calls work
- [ ] Login works
- [ ] No 404 errors
- [ ] No CORS errors

## Post-Deployment

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Set up performance monitoring (New Relic)
- [ ] Set up uptime monitoring (Pingdom)
- [ ] Set up log aggregation (ELK)

### Testing
- [ ] Smoke tests pass
- [ ] User acceptance testing
- [ ] Performance testing
- [ ] Security testing
- [ ] Load testing

### Documentation
- [ ] Update API documentation
- [ ] Update deployment guide
- [ ] Update runbook
- [ ] Update incident response plan

### Rollback Plan
- [ ] Previous version tagged
- [ ] Rollback procedure documented
- [ ] Database backup available
- [ ] Rollback tested

## Production Checklist

### Security
- [ ] HTTPS enabled
- [ ] SSL certificate valid
- [ ] Security headers present
- [ ] Rate limiting working
- [ ] Authentication working
- [ ] Authorization working

### Performance
- [ ] Response times acceptable
- [ ] Database queries optimized
- [ ] Caching working
- [ ] CDN configured
- [ ] Compression enabled

### Reliability
- [ ] Error handling working
- [ ] Logging working
- [ ] Monitoring working
- [ ] Alerts configured
- [ ] Backup working

### Compliance
- [ ] Data privacy compliant
- [ ] Audit logging enabled
- [ ] Compliance checks passed
- [ ] Security audit passed

## Rollback Procedure

If issues occur:

1. **Immediate Actions**
   - [ ] Alert team
   - [ ] Check logs
   - [ ] Assess impact
   - [ ] Notify users if needed

2. **Rollback Steps**
   ```bash
   # Backend
   git checkout previous-tag
   npm install
   npm start
   
   # Frontend
   git checkout previous-tag
   npm install
   npm run build
   # Deploy build
   ```

3. **Verification**
   - [ ] Health checks pass
   - [ ] Users can login
   - [ ] Data is intact
   - [ ] No errors in logs

4. **Post-Rollback**
   - [ ] Root cause analysis
   - [ ] Fix issues
   - [ ] Test thoroughly
   - [ ] Deploy again

## Monitoring Commands

### Backend
```bash
# Check process
pm2 status

# View logs
pm2 logs

# Monitor
pm2 monit

# Check health
curl http://localhost:5000/health
```

### Frontend
```bash
# Check if running
curl http://localhost:3000

# Check logs
docker logs <container-id>

# Monitor
docker stats
```

### Database
```bash
# Connect
mongosh

# Check status
db.adminCommand('ping')

# Check collections
show collections

# Check indexes
db.loans.getIndexes()
```

## Incident Response

### High CPU Usage
```bash
# Check processes
top

# Check logs
tail -f logs/error.log

# Restart if needed
pm2 restart all
```

### High Memory Usage
```bash
# Check memory
free -h

# Check process memory
ps aux | grep node

# Restart
pm2 restart all
```

### Database Connection Issues
```bash
# Check connection
mongosh

# Check logs
tail -f logs/error.log

# Restart MongoDB
sudo systemctl restart mongod
```

### API Errors
```bash
# Check logs
tail -f logs/error.log

# Check database
mongosh

# Check API
curl http://localhost:5000/health
```

## Maintenance

### Daily
- [ ] Check logs for errors
- [ ] Monitor uptime
- [ ] Check performance metrics

### Weekly
- [ ] Review error logs
- [ ] Check database size
- [ ] Verify backups

### Monthly
- [ ] Security audit
- [ ] Performance review
- [ ] Dependency updates
- [ ] Capacity planning

### Quarterly
- [ ] Full security audit
- [ ] Disaster recovery test
- [ ] Load testing
- [ ] Compliance review

---

**Last Updated:** 2024-01-15
**Version:** 1.0
**Status:** Ready for Deployment
