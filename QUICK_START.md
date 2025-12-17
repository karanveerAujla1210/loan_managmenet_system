# Quick Start - Server Deployment

## SSH into Server
```bash
ssh ec2-user@<your-ec2-ip>
cd ~/apps/loan_managmenet_system/backend
```

## Pull Latest Code
```bash
git pull origin main
npm install --production
```

## Restart Server

### Option 1: Using PM2 (Recommended)
```bash
# Kill old process
pm2 delete loan-crm-api

# Start new process
pm2 start src/server.js --name loan-crm-api

# Make it auto-start on reboot
pm2 startup
pm2 save

# Check status
pm2 status
```

### Option 2: Using Bash Script
```bash
chmod +x restart-server.sh
./restart-server.sh
```

## Verify Server is Running

### Check PM2 Status
```bash
pm2 status
```

Expected output:
```
┌────┬─────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name            │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼─────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ loan-crm-api    │ default     │ 1.0.0   │ fork    │ XXXXX    │ Xs     │ 0    │ online    │ 0%       │ XXmb     │ ec2-user │ disabled │
└────┴─────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

### Check Logs
```bash
pm2 logs loan-crm-api --lines 50
```

Expected output (no errors):
```
Server running in development mode on port 4000
All cron jobs initialized
```

### Test Health Endpoint
```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-16T12:30:00.000Z"
}
```

## Troubleshooting

### If Server Won't Start
1. Check logs: `pm2 logs loan-crm-api --lines 100`
2. Check MongoDB connection: `echo $MONGODB_URI`
3. Check port availability: `lsof -i :4000`
4. Check Node version: `node --version` (should be ≥18)

### If Models Error Occurs
Verify model re-exports exist:
```bash
ls -la backend/models/
```

Should show:
```
Customer.js
Loan.js
Payment.js
index.js
```

### If Port Already in Use
```bash
# Kill process on port 4000
lsof -i :4000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Then restart
pm2 restart loan-crm-api
```

## Environment Variables
Verify `.env` file has:
```
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/loan-management-system
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CRON_ENABLED=true
```

## Monitoring

### Real-time Logs
```bash
pm2 logs loan-crm-api
```

### Memory Usage
```bash
pm2 monit
```

### Restart on Crash
```bash
pm2 restart loan-crm-api --watch
```

## Rollback (if needed)
```bash
git revert HEAD
npm install --production
pm2 restart loan-crm-api
```

---

**Status:** ✅ Ready for deployment
