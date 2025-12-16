# EC2 Deployment Summary - Backend + Frontend on Single Instance

## Overview

Both backend and frontend run on a **single EC2 instance** with:
- Node.js backend (Port 5000)
- React frontend (Port 3000)
- Nginx reverse proxy (Port 80/443)
- MongoDB (Local)
- Redis (Local)

---

## Architecture

```
┌─────────────────────────────────────────┐
│         Your Domain                     │
│    (Route 53 DNS)                       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    Elastic IP (Static IP)               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    EC2 Instance (t3.medium)             │
│  ┌─────────────────────────────────┐   │
│  │  Nginx (Reverse Proxy)          │   │
│  │  Port 80 → 443 (SSL)            │   │
│  └─────────────────────────────────┘   │
│              ↓                          │
│  ┌──────────────────┬──────────────┐   │
│  │  Backend API     │  Frontend    │   │
│  │  (Node.js)       │  (React)     │   │
│  │  Port 5000       │  Port 3000   │   │
│  │  PM2 (2 workers) │  Static HTML │   │
│  └──────────────────┴──────────────┘   │
│              ↓                          │
│  ┌──────────────────┬──────────────┐   │
│  │  MongoDB         │  Redis       │   │
│  │  Port 27017      │  Port 6379   │   │
│  └──────────────────┴──────────────┘   │
└─────────────────────────────────────────┘
```

---

## Files Created

### Documentation
- **`docs/EC2_SIMPLE_DEPLOYMENT.md`** - Complete 12-phase guide
- **`docs/EC2_QUICK_START.md`** - 15-minute quick start

### Scripts
- **`scripts/ec2-deploy.sh`** - Automated deployment script

---

## Quick Start (15 Minutes)

### 1. Launch EC2 Instance
```bash
# AWS Console → EC2 → Launch Instance
# - AMI: Ubuntu 22.04 LTS
# - Type: t3.medium
# - Security: Allow SSH, HTTP, HTTPS
# - Storage: 50 GB
# - Allocate Elastic IP
```

### 2. Connect & Install
```bash
ssh -i loan-crm-key.pem ubuntu@<elastic-ip>
cd /home/ubuntu
wget https://raw.githubusercontent.com/your-org/loan-management-system/main/scripts/ec2-deploy.sh
chmod +x ec2-deploy.sh
./ec2-deploy.sh install
```

### 3. Deploy
```bash
sed -i 's/your-domain.com/your-actual-domain.com/g' ec2-deploy.sh
./ec2-deploy.sh deploy
./ec2-deploy.sh health
```

### 4. Setup Domain (Optional)
```bash
# AWS Console → Route 53
# Create A record pointing to Elastic IP
```

---

## Deployment Commands

```bash
# Install dependencies
./ec2-deploy.sh install

# Deploy backend + frontend
./ec2-deploy.sh deploy

# Update code
./ec2-deploy.sh update

# Restart services
./ec2-deploy.sh restart

# Health check
./ec2-deploy.sh health
```

---

## What Gets Installed

### System
- Ubuntu 22.04 LTS
- Node.js 18
- MongoDB 6.0
- Redis 7.0
- Nginx
- PM2
- Certbot (SSL)
- Fail2Ban (Security)

### Application
- Backend API (Node.js + Express)
- Frontend (React + Vite)
- Cron jobs
- JWT authentication

---

## Cost

| Component | Cost/Month |
|-----------|-----------|
| EC2 t3.medium | $35 |
| Elastic IP | $0 (free if attached) |
| Data Transfer | $5 |
| **TOTAL** | **~$40/month** |

---

## Access Points

After deployment:
- **Frontend**: https://your-domain.com
- **Backend API**: https://your-domain.com/api/v1
- **SSH**: ssh -i loan-crm-key.pem ubuntu@<elastic-ip>

---

## Monitoring

### View Logs
```bash
# Backend
pm2 logs loan-crm-api

# Nginx
sudo tail -f /var/log/nginx/error.log

# MongoDB
sudo tail -f /var/log/mongodb/mongod.log

# Redis
sudo tail -f /var/log/redis/redis-server.log
```

### Check Status
```bash
# All processes
pm2 status

# Services
sudo systemctl status mongod
sudo systemctl status redis-server
sudo systemctl status nginx
```

---

## Backup Strategy

### Automatic Daily Backups
```bash
# Runs at 2 AM daily
# Backs up MongoDB and frontend files
# Keeps last 30 days
```

### Manual Backup
```bash
/home/ubuntu/backup.sh
```

---

## Security Features

✅ SSL/TLS encryption (Let's Encrypt)
✅ Firewall (UFW)
✅ SSH key-based authentication
✅ Fail2Ban (brute force protection)
✅ Nginx reverse proxy
✅ JWT authentication
✅ CORS protection
✅ Rate limiting

---

## Maintenance

### Daily
- Monitor logs
- Check disk space
- Verify services running

### Weekly
- Security updates
- Review backups
- Check SSL certificate

### Monthly
- Update dependencies
- Review costs
- Test disaster recovery

---

## Troubleshooting

### Backend not responding
```bash
pm2 logs loan-crm-api
pm2 restart loan-crm-api
```

### Frontend not loading
```bash
sudo tail -f /var/log/nginx/error.log
sudo systemctl reload nginx
```

### Database connection issues
```bash
sudo systemctl status mongod
mongosh
```

### SSL certificate issues
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

---

## Scaling Options

### Vertical Scaling (Larger Instance)
```bash
# Stop instance
# Change instance type to t3.large or t3.xlarge
# Start instance
```

### Horizontal Scaling (Multiple Instances)
- Use AWS Load Balancer
- Deploy to multiple EC2 instances
- Use RDS for shared database
- Use ElastiCache for shared Redis

---

## Disaster Recovery

### Backup Location
```bash
/home/ubuntu/backups/
```

### Restore from Backup
```bash
# Restore MongoDB
mongorestore /home/ubuntu/backups/YYYY-MM-DD/mongodb

# Restore frontend
tar -xzf /home/ubuntu/backups/YYYY-MM-DD/frontend.tar.gz -C /var/www/
```

---

## Performance Tips

1. **Enable Gzip compression** - Already configured in Nginx
2. **Cache static assets** - 1 year expiry for JS/CSS
3. **Use PM2 clustering** - 2 worker processes
4. **Monitor memory** - Alert if > 80%
5. **Regular backups** - Daily at 2 AM

---

## Support & Resources

- **AWS EC2 Docs**: https://docs.aws.amazon.com/ec2/
- **Nginx Docs**: https://nginx.org/en/docs/
- **MongoDB Docs**: https://docs.mongodb.com/
- **PM2 Docs**: https://pm2.keymetrics.io/
- **Let's Encrypt**: https://letsencrypt.org/

---

## Next Steps

1. **Read**: `docs/EC2_QUICK_START.md` (15 min)
2. **Or read**: `docs/EC2_SIMPLE_DEPLOYMENT.md` (detailed)
3. **Launch**: EC2 instance
4. **Deploy**: Using `ec2-deploy.sh`
5. **Monitor**: Using provided commands

---

## Success Criteria

After deployment:
✅ Frontend accessible at https://your-domain.com
✅ Backend API responding at https://your-domain.com/api/v1
✅ SSL certificate working
✅ Database connected
✅ Cron jobs executing
✅ Backups running daily
✅ Logs accessible
✅ Health checks passing

