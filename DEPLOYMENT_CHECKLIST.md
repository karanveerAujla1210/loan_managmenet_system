# EC2 Deployment Checklist - Loan Management System

Complete checklist for deploying the Loan Management System on AWS EC2.

## Pre-Deployment

### AWS Account Setup
- [ ] AWS account created and verified
- [ ] IAM user created with EC2, VPC, ALB, S3, Secrets Manager permissions
- [ ] AWS CLI installed and configured locally
- [ ] AWS credentials configured: `aws configure`

### Domain & SSL
- [ ] Domain registered (Route53 or external registrar)
- [ ] Domain DNS configured to point to ALB/EC2
- [ ] SSL certificate obtained (ACM or Let's Encrypt)
- [ ] Certificate ARN noted: `arn:aws:acm:region:account:certificate/xxxxx`

### SSH & Security
- [ ] EC2 key pair created in AWS
- [ ] Private key downloaded and secured locally
- [ ] Key permissions set: `chmod 600 your-key.pem`
- [ ] SSH access tested from local machine

### Repository
- [ ] GitHub repository created and configured
- [ ] Repository cloned locally
- [ ] All code committed and pushed to main branch
- [ ] GitHub SSH keys configured (if using SSH)

---

## Infrastructure Deployment

### Option A: Using Terraform

- [ ] Terraform installed locally (version >= 1.0)
- [ ] AWS provider configured
- [ ] S3 bucket created for Terraform state: `loan-crm-terraform-state`
- [ ] DynamoDB table created for state locking: `terraform-locks`
- [ ] `terraform.tfvars` created with correct values:
  - [ ] `aws_region` set
  - [ ] `key_pair_name` set
  - [ ] `ssl_certificate_arn` set
  - [ ] `domain_name` set
  - [ ] `repository_url` set
  - [ ] `ssh_cidr_blocks` restricted to your IP
- [ ] `terraform init` executed
- [ ] `terraform plan` reviewed
- [ ] `terraform apply` executed successfully
- [ ] Outputs noted:
  - [ ] Load balancer DNS
  - [ ] Instance IPs

### Option B: Manual EC2 Launch

- [ ] EC2 instance launched:
  - [ ] AMI: Ubuntu 22.04 LTS
  - [ ] Instance type: t3.medium or larger
  - [ ] VPC: Default or custom
  - [ ] Subnet: Public subnet
  - [ ] Auto-assign public IP: Enabled
  - [ ] Security group: Allow SSH (22), HTTP (80), HTTPS (443)
  - [ ] Storage: 50GB gp3 encrypted
  - [ ] Key pair: Selected
- [ ] Instance running and accessible
- [ ] Elastic IP assigned (optional but recommended)
- [ ] Instance tagged appropriately

---

## Application Deployment

### Connect to Instance
- [ ] SSH connection successful: `ssh -i your-key.pem ubuntu@instance-ip`
- [ ] Instance updated: `sudo apt-get update && sudo apt-get upgrade -y`

### Install Dependencies
- [ ] Node.js 18.x installed
- [ ] npm verified: `npm -v`
- [ ] MongoDB installed and running
- [ ] Redis installed and running
- [ ] Nginx installed
- [ ] PM2 installed globally
- [ ] Docker installed (optional)
- [ ] Git installed

### Clone Repository
- [ ] Repository cloned to `/opt/loan-management-system`
- [ ] Correct branch checked out
- [ ] Directory permissions correct

### Backend Setup
- [ ] Backend dependencies installed: `npm ci --production`
- [ ] `.env` file created with production values:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI` configured
  - [ ] `JWT_SECRET` generated and set
  - [ ] `REDIS_URL` configured
  - [ ] `CORS_ORIGIN` set to domain
  - [ ] Email credentials configured
- [ ] Logs directory created: `mkdir -p logs`
- [ ] PM2 ecosystem config created
- [ ] Backend started with PM2: `pm2 start ecosystem.config.js`
- [ ] Backend process running: `pm2 status`

### Frontend Setup
- [ ] Frontend dependencies installed: `npm ci`
- [ ] `.env.production` created with correct API URL
- [ ] Frontend built: `npm run build`
- [ ] Build output verified: `ls -la dist/`

### Database Setup
- [ ] MongoDB running: `sudo systemctl status mongod`
- [ ] MongoDB authentication enabled
- [ ] Initial database created
- [ ] Collections initialized
- [ ] Indexes created (if needed)
- [ ] Test data loaded (if applicable)

### Redis Setup
- [ ] Redis running: `sudo systemctl status redis-server`
- [ ] Redis password configured
- [ ] Redis persistence enabled

### Nginx Configuration
- [ ] Nginx config created at `/etc/nginx/sites-available/loan-crm`
- [ ] Config includes:
  - [ ] Frontend static files serving
  - [ ] Backend API proxy
  - [ ] SSL configuration
  - [ ] Gzip compression
  - [ ] Health check endpoint
- [ ] Config tested: `sudo nginx -t`
- [ ] Site enabled: `sudo ln -sf /etc/nginx/sites-available/loan-crm /etc/nginx/sites-enabled/loan-crm`
- [ ] Default site disabled
- [ ] Nginx reloaded: `sudo systemctl reload nginx`

### SSL Certificate
- [ ] Certbot installed
- [ ] SSL certificate obtained: `sudo certbot certonly --nginx -d your-domain.com`
- [ ] Certificate path verified
- [ ] Auto-renewal configured: `sudo systemctl enable certbot.timer`
- [ ] Certificate renewal tested (optional)

---

## Verification & Testing

### Health Checks
- [ ] Backend health endpoint responds: `curl http://localhost:5000/health`
- [ ] Frontend loads: `curl http://localhost/`
- [ ] MongoDB responds: `mongosh --eval "db.adminCommand('ping')"`
- [ ] Redis responds: `redis-cli ping`
- [ ] PM2 processes running: `pm2 status`

### Application Testing
- [ ] Frontend accessible via domain: `https://your-domain.com`
- [ ] API accessible: `https://your-domain.com/api/v1/health`
- [ ] Login page loads
- [ ] Can authenticate with test credentials
- [ ] Dashboard loads and displays data
- [ ] API endpoints responding correctly

### SSL/TLS Testing
- [ ] HTTPS working: `curl -I https://your-domain.com`
- [ ] HTTP redirects to HTTPS
- [ ] SSL certificate valid: `openssl s_client -connect your-domain.com:443`
- [ ] No SSL warnings in browser

### Performance Testing
- [ ] Page load time acceptable
- [ ] API response time acceptable
- [ ] No console errors in browser
- [ ] No backend errors in logs

---

## Security Hardening

### SSH Security
- [ ] SSH key-based authentication only
- [ ] Password authentication disabled
- [ ] Root login disabled
- [ ] SSH port changed (optional)
- [ ] Fail2Ban installed and running

### Firewall
- [ ] UFW enabled: `sudo ufw enable`
- [ ] Only necessary ports open:
  - [ ] 22 (SSH) - restricted to your IP
  - [ ] 80 (HTTP)
  - [ ] 443 (HTTPS)
- [ ] Firewall rules verified: `sudo ufw status`

### Application Security
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation enabled
- [ ] SQL injection protection enabled
- [ ] XSS protection enabled
- [ ] CSRF protection enabled

### Database Security
- [ ] MongoDB authentication enabled
- [ ] Strong passwords set
- [ ] Database backups configured
- [ ] Backup encryption enabled

### AWS Security
- [ ] Security groups properly configured
- [ ] IAM roles with least privilege
- [ ] Secrets stored in AWS Secrets Manager
- [ ] CloudTrail logging enabled
- [ ] VPC Flow Logs enabled (optional)

---

## Monitoring & Logging

### Logging Setup
- [ ] Application logs configured
- [ ] Log rotation configured
- [ ] Nginx logs monitored
- [ ] MongoDB logs monitored
- [ ] System logs monitored

### Monitoring Setup
- [ ] CloudWatch agent installed (optional)
- [ ] CloudWatch alarms configured:
  - [ ] High CPU usage
  - [ ] High memory usage
  - [ ] Disk space low
  - [ ] Application errors
- [ ] Health check script created
- [ ] Cron job for health checks (optional)

### Backup Configuration
- [ ] MongoDB backup script created
- [ ] Backup cron job configured: `0 2 * * * /usr/local/bin/backup-mongodb.sh`
- [ ] Backup location verified
- [ ] Backup retention policy set
- [ ] Test restore performed

---

## Post-Deployment

### Documentation
- [ ] Deployment documented
- [ ] Access credentials secured
- [ ] Runbook created
- [ ] Troubleshooting guide updated
- [ ] Team notified

### Monitoring
- [ ] Logs monitored for errors
- [ ] Performance metrics reviewed
- [ ] User feedback collected
- [ ] Issues tracked and resolved

### Maintenance Schedule
- [ ] Regular backup verification scheduled
- [ ] Security updates scheduled
- [ ] Database maintenance scheduled
- [ ] Log rotation verified
- [ ] Certificate renewal monitored

### Disaster Recovery
- [ ] Backup tested and verified
- [ ] Recovery procedure documented
- [ ] RTO/RPO defined
- [ ] Failover plan created (if applicable)

---

## Troubleshooting Quick Reference

### Backend Issues
```bash
# Check PM2 logs
pm2 logs loan-crm-api

# Restart backend
pm2 restart loan-crm-api

# Check MongoDB
mongosh --eval "db.adminCommand('ping')"
```

### Frontend Issues
```bash
# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check logs
sudo tail -f /var/log/nginx/error.log
```

### Database Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

### SSL Issues
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal
```

---

## Sign-Off

- [ ] Deployment completed successfully
- [ ] All tests passed
- [ ] Security review completed
- [ ] Performance acceptable
- [ ] Team trained on operations
- [ ] Go-live approved

**Deployed by:** ________________  
**Date:** ________________  
**Environment:** Production  
**Version:** 2.0.0  
