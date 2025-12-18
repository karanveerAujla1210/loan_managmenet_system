# EC2 Deployment - Quick Reference Card

## 🚀 Quick Start (5 minutes)

### Automated Setup
```bash
# 1. SSH into EC2
ssh -i your-key.pem ubuntu@instance-ip

# 2. Run setup
wget https://raw.githubusercontent.com/your-org/loan-management-system/main/scripts/ec2-complete-setup.sh
chmod +x ec2-complete-setup.sh
./ec2-complete-setup.sh

# 3. Verify
health-check.sh
```

### Terraform Deployment
```bash
cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars
terraform init && terraform plan && terraform apply
```

---

## 📋 Essential Commands

### Health & Status
```bash
health-check.sh                    # Full health check
pm2 status                         # Process status
pm2 logs loan-crm-api             # View logs
sudo systemctl status mongod       # MongoDB status
sudo systemctl status redis-server # Redis status
sudo systemctl status nginx        # Nginx status
```

### Restart Services
```bash
pm2 restart loan-crm-api          # Restart backend
sudo systemctl reload nginx        # Reload Nginx
sudo systemctl restart mongod      # Restart MongoDB
sudo systemctl restart redis-server # Restart Redis
```

### View Logs
```bash
pm2 logs loan-crm-api             # Backend logs
sudo tail -f /var/log/nginx/error.log  # Nginx errors
sudo tail -f /var/log/mongodb/mongod.log # MongoDB logs
```

### Database
```bash
mongosh                            # Connect to MongoDB
redis-cli                          # Connect to Redis
/usr/local/bin/backup-mongodb.sh  # Manual backup
```

### Update Application
```bash
cd /opt/loan-management-system
git pull origin main
cd backend && npm ci --production && pm2 restart loan-crm-api
cd ../frontend-unified && npm ci && npm run build && sudo systemctl reload nginx
```

---

## 🔧 Common Troubleshooting

### Backend Not Starting
```bash
pm2 logs loan-crm-api
# Check MongoDB: mongosh --eval "db.adminCommand('ping')"
# Check Redis: redis-cli ping
# Check .env file: cat backend/.env
```

### Frontend Not Loading
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
ls -la frontend-unified/dist/
```

### Database Connection Failed
```bash
sudo systemctl status mongod
sudo systemctl restart mongod
mongosh --eval "db.adminCommand('ping')"
```

### High Memory Usage
```bash
ps aux | grep node
pm2 restart loan-crm-api
free -h
```

### SSL Certificate Issues
```bash
sudo certbot certificates
sudo certbot renew --force-renewal
openssl s_client -connect your-domain.com:443
```

---

## 📁 Important Paths

```
/opt/loan-management-system/       # Application root
/opt/loan-management-system/backend # Backend code
/opt/loan-management-system/frontend-unified # Frontend code
/var/log/loan-crm/                 # Application logs
/backups/mongodb/                  # Database backups
/etc/nginx/sites-available/loan-crm # Nginx config
/etc/letsencrypt/live/             # SSL certificates
```

---

## 🔐 Security Checklist

- [ ] SSH key-based auth only
- [ ] Firewall enabled: `sudo ufw status`
- [ ] MongoDB authentication enabled
- [ ] Redis password set
- [ ] SSL certificate valid
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Backups encrypted
- [ ] Logs monitored

---

## 📊 Monitoring

### CloudWatch Alarms
```bash
# CPU > 80%
# Memory > 85%
# Disk > 90%
# Error rate > 1%
```

### Health Endpoints
```
https://your-domain.com/health              # Frontend
https://your-domain.com/api/v1/health       # Backend
```

### Backup Verification
```bash
# Daily at 2 AM
0 2 * * * /usr/local/bin/backup-mongodb.sh
```

---

## 🚨 Emergency Procedures

### Restart Everything
```bash
pm2 restart all
sudo systemctl reload nginx
sudo systemctl restart mongod
sudo systemctl restart redis-server
```

### Clear Logs
```bash
pm2 flush
sudo truncate -s 0 /var/log/nginx/access.log
sudo truncate -s 0 /var/log/nginx/error.log
```

### Restore from Backup
```bash
# List backups
ls -la /backups/mongodb/

# Restore
tar -xzf /backups/mongodb/backup_YYYYMMDD_HHMMSS.tar.gz -C /tmp
mongorestore /tmp/mongodb_backup_YYYYMMDD_HHMMSS
```

### Full System Reboot
```bash
sudo reboot
# Services auto-start via systemctl enable
```

---

## 📞 Support Resources

| Resource | Link |
|----------|------|
| AWS EC2 Docs | https://docs.aws.amazon.com/ec2/ |
| MongoDB Docs | https://docs.mongodb.com/ |
| Nginx Docs | https://nginx.org/en/docs/ |
| PM2 Docs | https://pm2.keymetrics.io/ |
| Terraform Docs | https://www.terraform.io/docs |

---

## 📝 Configuration Files

### Backend Environment
```
/opt/loan-management-system/backend/.env
```

### Frontend Environment
```
/opt/loan-management-system/frontend-unified/.env.production
```

### Nginx Config
```
/etc/nginx/sites-available/loan-crm
```

### PM2 Config
```
/opt/loan-management-system/backend/ecosystem.config.js
```

---

## 🎯 Performance Optimization

### Enable Gzip
```nginx
gzip on;
gzip_types text/plain text/css text/javascript application/json;
gzip_min_length 1000;
```

### Cache Static Assets
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Connection Pooling
```javascript
// MongoDB connection pooling
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 5
});
```

---

## 🔄 Deployment Workflow

1. **Prepare** → Update code, test locally
2. **Commit** → Push to main branch
3. **Deploy** → SSH to instance, git pull, rebuild
4. **Verify** → Run health checks
5. **Monitor** → Watch logs for errors

---

## 📅 Maintenance Schedule

| Task | Frequency | Command |
|------|-----------|---------|
| Backup | Daily | Auto (2 AM) |
| SSL Renewal | Monthly | Auto (Certbot) |
| Security Updates | Weekly | `sudo apt-get update && upgrade` |
| Log Rotation | Daily | Auto (Logrotate) |
| Health Check | Hourly | Auto (Cron) |

---

## 💡 Pro Tips

1. **Use PM2 Plus** for advanced monitoring
2. **Enable CloudWatch** for centralized logging
3. **Set up SNS** for critical alerts
4. **Use RDS** for managed MongoDB (optional)
5. **Enable VPC Flow Logs** for network monitoring
6. **Use AWS Backup** for automated backups
7. **Enable MFA** on AWS account
8. **Use Secrets Manager** for sensitive data

---

## 🆘 When Things Go Wrong

### Check Everything
```bash
health-check.sh
pm2 status
sudo systemctl status nginx
sudo systemctl status mongod
sudo systemctl status redis-server
```

### Review Logs
```bash
pm2 logs loan-crm-api --lines 100
sudo tail -100 /var/log/nginx/error.log
sudo tail -100 /var/log/mongodb/mongod.log
```

### Restart Services
```bash
pm2 restart loan-crm-api
sudo systemctl reload nginx
```

### Still Not Working?
1. Check disk space: `df -h`
2. Check memory: `free -h`
3. Check CPU: `top`
4. Check network: `netstat -an`
5. Check firewall: `sudo ufw status`

---

## 📞 Getting Help

- **Documentation**: See EC2_DEPLOYMENT_GUIDE.md
- **Checklist**: See DEPLOYMENT_CHECKLIST.md
- **Summary**: See DEPLOYMENT_SUMMARY.md
- **GitHub Issues**: Report bugs and feature requests
- **AWS Support**: For AWS-related issues

---

**Last Updated**: 2024  
**Version**: 2.0.0  
**Environment**: Production
