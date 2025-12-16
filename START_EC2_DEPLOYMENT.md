# 🚀 EC2 Deployment - Start Here

## What You Have

Complete setup for deploying **Backend + Frontend on a single EC2 instance**.

---

## 📋 Files Created

### Documentation
1. **`EC2_DEPLOYMENT_SUMMARY.md`** - Overview & reference
2. **`docs/EC2_QUICK_START.md`** - 15-minute deployment
3. **`docs/EC2_SIMPLE_DEPLOYMENT.md`** - Complete 12-phase guide

### Scripts
4. **`scripts/ec2-deploy.sh`** - Automated deployment

---

## ⚡ Quick Start (15 Minutes)

### Step 1: Launch EC2 Instance
```bash
# AWS Console → EC2 → Launch Instance
# - AMI: Ubuntu 22.04 LTS
# - Type: t3.medium
# - Security: SSH, HTTP, HTTPS
# - Storage: 50 GB
# - Allocate Elastic IP
```

### Step 2: Connect
```bash
chmod 400 loan-crm-key.pem
ssh -i loan-crm-key.pem ubuntu@<elastic-ip>
```

### Step 3: Install & Deploy
```bash
cd /home/ubuntu
wget https://raw.githubusercontent.com/your-org/loan-management-system/main/scripts/ec2-deploy.sh
chmod +x ec2-deploy.sh

# Install dependencies
./ec2-deploy.sh install

# Deploy
sed -i 's/your-domain.com/your-actual-domain.com/g' ec2-deploy.sh
./ec2-deploy.sh deploy

# Verify
./ec2-deploy.sh health
```

### Step 4: Setup Domain (Optional)
```bash
# AWS Console → Route 53
# Create A record → Elastic IP
```

---

## 🏗️ Architecture

```
Domain (Route 53)
    ↓
Elastic IP
    ↓
EC2 Instance (t3.medium)
    ├─ Nginx (Port 80/443)
    ├─ Backend API (Port 5000)
    ├─ Frontend (Port 3000)
    ├─ MongoDB (Port 27017)
    └─ Redis (Port 6379)
```

---

## 💰 Cost

**~$40/month** for t3.medium instance

---

## 📚 Documentation

### For Quick Deployment (15 min)
→ Read: `docs/EC2_QUICK_START.md`

### For Complete Setup (1-2 hours)
→ Read: `docs/EC2_SIMPLE_DEPLOYMENT.md`

### For Reference
→ Read: `EC2_DEPLOYMENT_SUMMARY.md`

---

## 🎯 What Gets Deployed

### Backend
- Node.js API server
- Express.js framework
- MongoDB connection
- Redis caching
- Cron jobs
- JWT authentication

### Frontend
- React + Vite
- TailwindCSS styling
- Responsive design
- API integration

### Infrastructure
- Nginx reverse proxy
- SSL/TLS (Let's Encrypt)
- PM2 process manager
- MongoDB database
- Redis cache
- Firewall (UFW)
- Fail2Ban protection

---

## 🚀 Deployment Commands

```bash
# Install all dependencies
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

## 📊 Access Points

After deployment:
- **Frontend**: https://your-domain.com
- **Backend API**: https://your-domain.com/api/v1
- **SSH**: ssh -i loan-crm-key.pem ubuntu@<elastic-ip>

---

## 🔍 Monitoring

### View Logs
```bash
pm2 logs loan-crm-api              # Backend
sudo tail -f /var/log/nginx/error.log  # Nginx
```

### Check Status
```bash
pm2 status                         # All processes
./ec2-deploy.sh health             # Full health check
```

---

## 🔐 Security

✅ SSL/TLS encryption
✅ SSH key-based auth
✅ Firewall (UFW)
✅ Fail2Ban protection
✅ JWT authentication
✅ CORS protection
✅ Rate limiting

---

## 📋 Checklist

Before deployment:
- [ ] AWS account created
- [ ] Domain name (optional)
- [ ] SSH key pair ready

During deployment:
- [ ] EC2 instance launched
- [ ] Elastic IP allocated
- [ ] Security group configured
- [ ] Dependencies installed
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Nginx configured
- [ ] SSL certificate obtained

After deployment:
- [ ] Frontend accessible
- [ ] Backend API responding
- [ ] Database connected
- [ ] Cron jobs running
- [ ] Backups configured
- [ ] Logs accessible

---

## 🆘 Troubleshooting

### Can't connect to instance?
```bash
# Check security group allows SSH from your IP
# AWS Console → EC2 → Security Groups
```

### Backend not responding?
```bash
pm2 logs loan-crm-api
pm2 restart loan-crm-api
```

### Frontend not loading?
```bash
sudo tail -f /var/log/nginx/error.log
sudo systemctl reload nginx
```

### SSL issues?
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

---

## 📞 Support

- **AWS EC2**: https://docs.aws.amazon.com/ec2/
- **Nginx**: https://nginx.org/en/docs/
- **MongoDB**: https://docs.mongodb.com/
- **PM2**: https://pm2.keymetrics.io/

---

## 🎉 Next Steps

1. **Read**: `docs/EC2_QUICK_START.md` (15 min)
2. **Launch**: EC2 instance
3. **Deploy**: Using `ec2-deploy.sh`
4. **Monitor**: Using provided commands
5. **Scale**: When needed

---

## ✨ Success Criteria

After deployment:
✅ Frontend running at https://your-domain.com
✅ Backend API at https://your-domain.com/api/v1
✅ SSL certificate working
✅ Database connected
✅ Cron jobs executing
✅ Backups running
✅ Health checks passing

---

**Ready? Start with `docs/EC2_QUICK_START.md`** 🚀
