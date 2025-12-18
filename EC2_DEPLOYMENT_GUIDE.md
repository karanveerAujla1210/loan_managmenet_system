# EC2 Deployment Guide - Loan Management System

Complete guide for deploying Backend + Frontend + MongoDB + Redis on a single Amazon EC2 instance.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Quick Start](#quick-start)
4. [Manual Deployment](#manual-deployment)
5. [Infrastructure as Code (Terraform)](#infrastructure-as-code)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### AWS Account Setup
- AWS account with appropriate permissions
- EC2, VPC, ALB, IAM, S3, Secrets Manager access
- SSL certificate in AWS Certificate Manager (ACM)

### Local Requirements
- Git
- Terraform >= 1.0 (for IaC deployment)
- AWS CLI configured with credentials
- SSH key pair created in AWS

### Domain Setup
- Domain registered and DNS configured
- SSL certificate obtained (Let's Encrypt or AWS ACM)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Internet                              │
└────────────────────────┬────────────────────────────────┘
                         │
                    ┌────▼────┐
                    │   ALB    │ (Application Load Balancer)
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───▼───┐        ┌───▼───┐       ┌───▼───┐
    │ EC2-1 │        │ EC2-2 │       │ EC2-N │
    │       │        │       │       │       │
    │ ┌───┐ │        │ ┌───┐ │       │ ┌───┐ │
    │ │App│ │        │ │App│ │       │ │App│ │
    │ └───┘ │        │ └───┘ │       │ └───┘ │
    │       │        │       │       │       │
    │ ┌───┐ │        │ ┌───┐ │       │ ┌───┐ │
    │ │DB │ │        │ │DB │ │       │ │DB │ │
    │ └───┘ │        │ └───┘ │       │ └───┘ │
    └───────┘        └───────┘       └───────┘
```

### Components
- **Frontend**: React/Vite (port 3000)
- **Backend**: Node.js/Express (port 5000)
- **Database**: MongoDB (port 27017)
- **Cache**: Redis (port 6379)
- **Web Server**: Nginx (port 80/443)
- **Process Manager**: PM2

---

## Quick Start

### Option 1: Automated Setup Script

1. **Launch EC2 Instance**
   ```bash
   # Ubuntu 22.04 LTS, t3.medium or larger
   # Security group: Allow SSH (22), HTTP (80), HTTPS (443)
   ```

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Run Setup Script**
   ```bash
   cd /tmp
   wget https://raw.githubusercontent.com/your-org/loan-management-system/main/scripts/ec2-complete-setup.sh
   chmod +x ec2-complete-setup.sh
   ./ec2-complete-setup.sh
   ```

4. **Verify Deployment**
   ```bash
   health-check.sh
   ```

### Option 2: Docker Compose

1. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/your-org/loan-management-system.git
   cd loan-management-system
   ```

3. **Create Environment File**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

---

## Manual Deployment

### Step 1: System Setup

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install essential tools
sudo apt-get install -y curl wget git vim htop net-tools build-essential
```

### Step 2: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2 npm@latest
```

### Step 3: Install MongoDB

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 4: Install Redis

```bash
sudo apt-get install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### Step 5: Install Nginx

```bash
sudo apt-get install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 6: Deploy Application

```bash
# Clone repository
git clone https://github.com/your-org/loan-management-system.git
cd loan-management-system

# Backend setup
cd backend
npm ci --production
mkdir -p logs

# Create .env file
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/loan-management
JWT_SECRET=$(openssl rand -base64 32)
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=https://your-domain.com
EOF

# Frontend setup
cd ../frontend-unified
npm ci
npm run build
```

### Step 7: Configure PM2

```bash
cd /path/to/backend

cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'loan-crm-api',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    autorestart: true,
    max_memory_restart: '500M'
  }]
};
EOF

pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 8: Configure Nginx

```bash
sudo tee /etc/nginx/sites-available/loan-crm > /dev/null << 'EOF'
upstream backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    gzip on;
    gzip_types text/plain text/css text/javascript application/json;

    location / {
        root /path/to/frontend-unified/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/loan-crm /etc/nginx/sites-enabled/loan-crm
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### Step 9: Setup SSL Certificate

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## Infrastructure as Code

### Using Terraform

1. **Initialize Terraform**
   ```bash
   cd infrastructure/terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   ```

2. **Plan Deployment**
   ```bash
   terraform init
   terraform plan
   ```

3. **Apply Configuration**
   ```bash
   terraform apply
   ```

4. **Get Outputs**
   ```bash
   terraform output load_balancer_dns
   terraform output instance_ips
   ```

### Terraform Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `aws_region` | AWS region | us-east-1 |
| `instance_type` | EC2 instance type | t3.medium |
| `instance_count` | Number of instances | 2 |
| `key_pair_name` | SSH key pair name | - |
| `ssl_certificate_arn` | ACM certificate ARN | - |
| `domain_name` | Domain name | - |

---

## Monitoring & Maintenance

### Health Checks

```bash
# Run health check script
health-check.sh

# Check PM2 processes
pm2 status
pm2 logs

# Check MongoDB
mongosh --eval "db.adminCommand('ping')"

# Check Redis
redis-cli ping

# Check Nginx
sudo systemctl status nginx
```

### Backup MongoDB

```bash
# Manual backup
mongodump --out /backups/mongodb_backup_$(date +%Y%m%d)

# Automated daily backup (cron)
0 2 * * * /usr/local/bin/backup-mongodb.sh
```

### View Logs

```bash
# Backend logs
pm2 logs loan-crm-api

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# System logs
sudo journalctl -u loan-crm-api -f
```

### Update Application

```bash
cd /opt/loan-management-system

# Pull latest code
git pull origin main

# Update backend
cd backend
npm ci --production
pm2 restart loan-crm-api

# Update frontend
cd ../frontend-unified
npm ci
npm run build
sudo systemctl reload nginx
```

---

## Troubleshooting

### Backend Not Starting

```bash
# Check PM2 logs
pm2 logs loan-crm-api

# Check MongoDB connection
mongosh --eval "db.adminCommand('ping')"

# Check Redis connection
redis-cli ping

# Verify environment variables
cat backend/.env
```

### Frontend Not Loading

```bash
# Check Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Verify frontend build
ls -la frontend-unified/dist/
```

### Database Connection Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

### High Memory Usage

```bash
# Check process memory
ps aux | grep node

# Restart PM2 cluster
pm2 restart loan-crm-api

# Check available memory
free -h
```

### SSL Certificate Issues

```bash
# Check certificate expiry
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --force-renewal

# Check Nginx SSL configuration
sudo openssl s_client -connect localhost:443
```

---

## Security Best Practices

1. **SSH Access**
   - Use key-based authentication only
   - Restrict SSH to specific IPs
   - Disable root login

2. **Firewall**
   - Enable UFW firewall
   - Allow only necessary ports
   - Use security groups in AWS

3. **Database**
   - Enable MongoDB authentication
   - Use strong passwords
   - Regular backups

4. **Application**
   - Keep dependencies updated
   - Use environment variables for secrets
   - Enable HTTPS only
   - Implement rate limiting

5. **Monitoring**
   - Set up CloudWatch alarms
   - Monitor disk space
   - Track error rates
   - Monitor database performance

---

## Support & Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

---

## Deployment Checklist

- [ ] AWS account and permissions configured
- [ ] EC2 key pair created
- [ ] SSL certificate obtained
- [ ] Domain DNS configured
- [ ] Security groups configured
- [ ] EC2 instance launched
- [ ] Application deployed
- [ ] MongoDB initialized
- [ ] Redis configured
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Health checks passing
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Firewall configured
