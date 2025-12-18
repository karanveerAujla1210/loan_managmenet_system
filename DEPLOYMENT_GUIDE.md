# EC2 Deployment Guide

## Quick Start

### 1. Automated Setup
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh your-domain.com
```

### 2. Terraform Deployment
```bash
cd infrastructure/aws
terraform init
terraform plan -var="key_name=your-key" -var="certificate_arn=arn:..."
terraform apply
```

### 3. Manual Steps
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@instance-ip

# Run deployment
./scripts/deploy.sh your-domain.com

# Secure
./scripts/secure.sh

# Monitor
./scripts/monitor.sh
```

## Configuration

### Environment Variables
Create `.env.production`:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/loan-management
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=https://your-domain.com
```

### Database Backup
```bash
# Manual backup
./scripts/backup.sh

# Automated (cron)
0 2 * * * /path/to/scripts/backup.sh
```

### Health Monitoring
```bash
# Check status
./scripts/monitor.sh

# View logs
pm2 logs loan-api

# Restart services
pm2 restart loan-api
sudo systemctl reload nginx
```

## Security

### Firewall
```bash
sudo ufw status
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### SSL Certificate
```bash
sudo certbot certonly --nginx -d your-domain.com
sudo certbot renew --dry-run
```

### SSH Hardening
```bash
# Disable password auth
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl reload sshd
```

## Troubleshooting

### Backend not running
```bash
pm2 logs loan-api
mongosh --eval "db.adminCommand('ping')"
redis-cli ping
```

### Frontend not loading
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Database issues
```bash
sudo systemctl restart mongod
mongosh --eval "db.adminCommand('ping')"
```

## Monitoring

### Health Check
```bash
./scripts/monitor.sh
```

### Backup Verification
```bash
ls -la /backups/mongodb/
tar -tzf /backups/mongodb/backup_*.tar.gz | head
```

### Restore from Backup
```bash
tar -xzf /backups/mongodb/backup_YYYYMMDD_HHMMSS.tar.gz -C /tmp
mongorestore /tmp/mongodb_backup_YYYYMMDD_HHMMSS
```

## Deployment Checklist

- [ ] AWS account ready
- [ ] SSH key created
- [ ] SSL certificate obtained
- [ ] Domain DNS configured
- [ ] Repository cloned
- [ ] Environment variables set
- [ ] Deployment script run
- [ ] Health checks passing
- [ ] Backups configured
- [ ] Security hardened
- [ ] Monitoring enabled

## Architecture

```
Internet
    ↓
  ALB (443)
    ↓
EC2 Instances (2+)
├── Frontend (3000)
├── Backend (5000)
├── MongoDB (27017)
└── Redis (6379)
```

## Support

- Logs: `/opt/loan-management-system/backend/logs/`
- Backups: `/backups/mongodb/`
- Nginx: `/etc/nginx/sites-available/loan-crm`
- PM2: `pm2 status`
