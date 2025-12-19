# DEPLOYMENT_GUIDE.md

**Step-by-step deployment procedures for MIS Reports System**

---

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All tests pass
- [ ] No console errors
- [ ] No linting errors
- [ ] Code reviewed by team
- [ ] No breaking changes

### Documentation
- [ ] README updated
- [ ] API documentation updated
- [ ] Deployment notes prepared
- [ ] Rollback procedure documented

### Infrastructure
- [ ] Database backups created
- [ ] Monitoring configured
- [ ] Alerts configured
- [ ] Logging configured

### Team
- [ ] Team notified of deployment
- [ ] Deployment window scheduled
- [ ] Rollback team on standby
- [ ] Communication channel open

---

## 🚀 Deployment Steps

### Step 1: Backup Database
```bash
# Create backup
mongodump --uri="mongodb://user:pass@host:port/dbname" --out=/backups/pre-deployment-$(date +%Y%m%d-%H%M%S)

# Verify backup
ls -lh /backups/
```

---

### Step 2: Pull Latest Code
```bash
cd /path/to/loan-management-system
git pull origin main
git log --oneline -5
```

---

### Step 3: Install Dependencies
```bash
cd backend
npm install
npm audit
```

---

### Step 4: Run Tests
```bash
npm test
npm run lint
```

**Expected:** All tests pass, no linting errors

---

### Step 5: Build Application
```bash
npm run build
```

---

### Step 6: Stop Current Service
```bash
# Using PM2
pm2 stop loan-management-backend

# Or using systemd
sudo systemctl stop loan-management-backend

# Or using Docker
docker-compose down
```

---

### Step 7: Deploy New Code
```bash
# Copy new files
cp -r src/ /var/www/loan-management-backend/

# Or using Docker
docker-compose up -d
```

---

### Step 8: Start Service
```bash
# Using PM2
pm2 start ecosystem.config.js

# Or using systemd
sudo systemctl start loan-management-backend

# Or using Docker
docker-compose up -d
```

---

### Step 9: Verify Service Health
```bash
# Check service status
curl http://localhost:3000/health

# Expected response:
# {"success":true,"status":"healthy","timestamp":"2024-01-15T..."}
```

---

### Step 10: Test Endpoints
```bash
# Test portfolio endpoint
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/v1/reports/portfolio

# Test buckets endpoint
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/v1/reports/buckets

# Test all endpoints
./test-endpoints.sh
```

---

### Step 11: Monitor Logs
```bash
# View logs
tail -f /var/log/loan-management-backend.log

# Or using Docker
docker-compose logs -f backend

# Or using PM2
pm2 logs loan-management-backend
```

---

### Step 12: Verify Frontend
1. Open browser
2. Navigate to MISReports page
3. Verify all tabs load
4. Verify data displays
5. Check browser console for errors

---

## 🔄 Rollback Procedure

### If Deployment Fails

**Step 1: Stop Current Service**
```bash
pm2 stop loan-management-backend
```

**Step 2: Restore Previous Code**
```bash
git checkout HEAD~1
npm install
```

**Step 3: Start Service**
```bash
pm2 start ecosystem.config.js
```

**Step 4: Verify**
```bash
curl http://localhost:3000/health
```

---

### If Data Issues Occur

**Step 1: Stop Service**
```bash
pm2 stop loan-management-backend
```

**Step 2: Restore Database**
```bash
mongorestore --uri="mongodb://user:pass@host:port/dbname" /backups/pre-deployment-YYYYMMDD-HHMMSS
```

**Step 3: Start Service**
```bash
pm2 start ecosystem.config.js
```

---

## 📊 Post-Deployment Verification

### Immediate (First 5 minutes)
- [ ] Service is running
- [ ] Health check passes
- [ ] No errors in logs
- [ ] Endpoints respond

### Short-term (First hour)
- [ ] All endpoints working
- [ ] Frontend displays data
- [ ] No 404s
- [ ] No 500s
- [ ] Response times normal

### Medium-term (First day)
- [ ] Monitor error logs
- [ ] Monitor response times
- [ ] Monitor database performance
- [ ] Gather user feedback

### Long-term (First week)
- [ ] No issues reported
- [ ] Data accuracy verified
- [ ] Performance stable
- [ ] All metrics normal

---

## 🔍 Monitoring

### Key Metrics to Monitor

**Response Times**
```bash
# Check average response time
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/v1/reports/portfolio
```

**Error Rates**
```bash
# Check error logs
grep "ERROR" /var/log/loan-management-backend.log | wc -l
```

**Database Performance**
```bash
# Check MongoDB performance
mongostat --uri="mongodb://user:pass@host:port/dbname"
```

---

### Alerts to Configure

1. **Service Down**
   - Alert if service stops responding
   - Action: Restart service

2. **High Error Rate**
   - Alert if error rate > 1%
   - Action: Check logs, investigate

3. **Slow Response Time**
   - Alert if response time > 5s
   - Action: Check database, optimize queries

4. **Database Connection Error**
   - Alert if cannot connect to database
   - Action: Check database status

---

## 📝 Deployment Log Template

```
DEPLOYMENT LOG
==============

Date: YYYY-MM-DD
Time: HH:MM:SS
Deployed By: <name>
Environment: <dev/staging/prod>

PRE-DEPLOYMENT:
[ ] Code reviewed
[ ] Tests passed
[ ] Database backed up
[ ] Team notified

DEPLOYMENT:
[ ] Code pulled
[ ] Dependencies installed
[ ] Service stopped
[ ] Code deployed
[ ] Service started
[ ] Health check passed

VERIFICATION:
[ ] Portfolio endpoint: OK
[ ] Buckets endpoint: OK
[ ] Efficiency endpoint: OK
[ ] Legal endpoint: OK
[ ] Collectors endpoint: OK
[ ] Aging endpoint: OK
[ ] Frontend loads: OK
[ ] No errors in logs: OK

ISSUES:
<list any issues>

RESOLUTION:
<how issues were resolved>

ROLLBACK NEEDED: [ ] Yes [ ] No

NOTES:
<any additional notes>

APPROVED: [ ] Yes [ ] No
Approved By: <name>
```

---

## 🚨 Emergency Procedures

### Service Crash
```bash
# 1. Check status
pm2 status

# 2. Check logs
pm2 logs loan-management-backend

# 3. Restart service
pm2 restart loan-management-backend

# 4. Verify
curl http://localhost:3000/health
```

---

### Database Connection Lost
```bash
# 1. Check database status
mongo --eval "db.adminCommand('ping')"

# 2. Check connection string
echo $MONGODB_URI

# 3. Restart database
sudo systemctl restart mongod

# 4. Restart service
pm2 restart loan-management-backend
```

---

### High Memory Usage
```bash
# 1. Check memory
pm2 monit

# 2. Check for memory leaks
node --inspect=0.0.0.0:9229 src/server.js

# 3. Restart service
pm2 restart loan-management-backend
```

---

## 📞 Support Contacts

**On-Call Engineer:** <phone>  
**Database Admin:** <phone>  
**DevOps:** <phone>  
**Team Lead:** <phone>  

---

## 📚 Related Documents

- PROJECT_TODOS.md - What was implemented
- RULES_OF_ENGAGEMENT.md - What was allowed
- TESTING_GUIDE.md - How to test
- EXECUTION_COMPLETE.md - What changed

---

## ✅ Deployment Approval

**Code Review:** [ ] Approved [ ] Rejected  
**QA Testing:** [ ] Approved [ ] Rejected  
**Security Review:** [ ] Approved [ ] Rejected  
**DevOps:** [ ] Approved [ ] Rejected  

**Final Approval:** [ ] Approved [ ] Rejected  
**Approved By:** <name>  
**Date:** YYYY-MM-DD  

