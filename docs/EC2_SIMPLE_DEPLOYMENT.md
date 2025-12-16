# EC2 Simple Deployment - Backend + Frontend on Single Instance

## Architecture

```
┌─────────────────────────────────────────┐
│         Your Domain (Route 53)          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    Elastic IP (Static IP Address)       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         EC2 Instance (t3.medium)        │
│  ┌─────────────────────────────────┐   │
│  │  Nginx (Reverse Proxy)          │   │
│  │  - Port 80 (HTTP)               │   │
│  │  - Port 443 (HTTPS/SSL)         │   │
│  └─────────────────────────────────┘   │
│              ↓                          │
│  ┌──────────────────┬──────────────┐   │
│  │  Backend API     │  Frontend    │   │
│  │  (Node.js)       │  (React)     │   │
│  │  Port 5000       │  Port 3000   │   │
│  └──────────────────┴──────────────┘   │
│              ↓                          │
│  ┌──────────────────┬──────────────┐   │
│  │  MongoDB         │  Redis       │   │
│  │  (Local)         │  (Local)     │   │
│  └──────────────────┴──────────────┘   │
└─────────────────────────────────────────┘
```

---

## Phase 1: Launch EC2 Instance

### 1.1 Create EC2 Instance

```bash
# AWS Console → EC2 → Instances → Launch Instance

Configuration:
- Name: loan-crm-prod
- AMI: Ubuntu 22.04 LTS (ami-0c55b159cbfafe1f0)
- Instance Type: t3.medium (2 vCPU, 4GB RAM)
- Key Pair: Create new (loan-crm-key.pem)
- Security Group: Create new
  - Inbound Rules:
    * SSH (22): Your IP only
    * HTTP (80): 0.0.0.0/0
    * HTTPS (443): 0.0.0.0/0
- Storage: 50 GB gp3
- Elastic IP: Allocate and associate
```

### 1.2 Connect to Instance

```bash
# SSH into instance
ssh -i loan-crm-key.pem ubuntu@<elastic-ip>

# Update system
sudo apt-get update
sudo apt-get upgrade -y
```

---

## Phase 2: Install Dependencies

### 2.1 Install Node.js & npm

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version  # v18.x.x
npm --version   # 8.x.x
```

### 2.2 Install MongoDB

```bash
# Add MongoDB repository
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh --version
```

### 2.3 Install Redis

```bash
# Install Redis
sudo apt-get install -y redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify
redis-cli ping  # Should return PONG
```

### 2.4 Install Nginx

```bash
# Install Nginx
sudo apt-get install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify
sudo systemctl status nginx
```

### 2.5 Install PM2 & Git

```bash
# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt-get install -y git

# Verify
pm2 --version
git --version
```

---

## Phase 3: Deploy Backend

### 3.1 Clone Repository

```bash
# Create app directory
mkdir -p /home/ubuntu/apps
cd /home/ubuntu/apps

# Clone repository
git clone https://github.com/your-org/loan-management-system.git
cd loan-management-system/backend
```

### 3.2 Setup Environment

```bash
# Create .env file
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000

MONGODB_URI=mongodb://localhost:27017/loan-management
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRY=8h

CRON_ENABLED=true

REDIS_URL=redis://localhost:6379

LOG_LEVEL=info

CORS_ORIGIN=https://your-domain.com
EOF

# Install dependencies
npm ci --production
```

### 3.3 Setup PM2

```bash
# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'loan-crm-api',
    script: './src/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Verify
pm2 status
pm2 logs loan-crm-api
```

---

## Phase 4: Deploy Frontend

### 4.1 Build Frontend

```bash
# Go to frontend directory
cd /home/ubuntu/apps/loan-management-system/frontend

# Install dependencies
npm ci

# Build
npm run build

# Output: dist/
```

### 4.2 Setup Frontend Serving

```bash
# Create directory for frontend
sudo mkdir -p /var/www/loan-crm-frontend
sudo chown -R ubuntu:ubuntu /var/www/loan-crm-frontend

# Copy built files
cp -r dist/* /var/www/loan-crm-frontend/
```

---

## Phase 5: Configure Nginx

### 5.1 Create Nginx Config

```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/loan-crm << 'EOF'
upstream backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;

    # Frontend
    location / {
        root /var/www/loan-crm-frontend;
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }

    # API
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/loan-crm /etc/nginx/sites-enabled/loan-crm

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Phase 6: Setup SSL Certificate (Let's Encrypt)

### 6.1 Install Certbot

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts and provide email
```

### 6.2 Auto-Renewal

```bash
# Enable auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

---

## Phase 7: Setup Domain & DNS

### 7.1 Route 53 Configuration

```bash
# AWS Console → Route 53 → Hosted Zones → your-domain.com

# Create A record:
# Name: your-domain.com
# Type: A
# Value: <Elastic IP>
# TTL: 300

# Create CNAME for www:
# Name: www.your-domain.com
# Type: CNAME
# Value: your-domain.com
# TTL: 300
```

---

## Phase 8: Monitoring & Logs

### 8.1 View Logs

```bash
# Backend logs
pm2 logs loan-crm-api

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Redis logs
sudo tail -f /var/log/redis/redis-server.log
```

### 8.2 Monitor System

```bash
# CPU & Memory
top

# Disk usage
df -h

# Process status
pm2 status

# MongoDB status
sudo systemctl status mongod

# Redis status
sudo systemctl status redis-server

# Nginx status
sudo systemctl status nginx
```

---

## Phase 9: Backup Strategy

### 9.1 MongoDB Backup Script

```bash
# Create backup script
cat > /home/ubuntu/backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/home/ubuntu/backups/$(date +%Y-%m-%d)"
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --out=$BACKUP_DIR/mongodb

# Backup frontend
tar -czf $BACKUP_DIR/frontend.tar.gz /var/www/loan-crm-frontend

# Keep only last 30 days
find /home/ubuntu/backups -type d -mtime +30 -exec rm -rf {} \;

echo "Backup completed: $BACKUP_DIR"
EOF

chmod +x /home/ubuntu/backup.sh
```

### 9.2 Schedule Backup Cron

```bash
# Add to crontab
crontab -e

# Add this line (daily backup at 2 AM)
0 2 * * * /home/ubuntu/backup.sh >> /var/log/backup.log 2>&1
```

---

## Phase 10: Deployment Updates

### 10.1 Update Backend

```bash
# SSH into instance
ssh -i loan-crm-key.pem ubuntu@<elastic-ip>

# Go to backend directory
cd /home/ubuntu/apps/loan-management-system/backend

# Pull latest code
git pull origin main

# Install dependencies
npm ci --production

# Restart backend
pm2 restart loan-crm-api

# Verify
pm2 logs loan-crm-api
```

### 10.2 Update Frontend

```bash
# Go to frontend directory
cd /home/ubuntu/apps/loan-management-system/frontend

# Pull latest code
git pull origin main

# Install dependencies
npm ci

# Build
npm run build

# Copy to Nginx
cp -r dist/* /var/www/loan-crm-frontend/

# Clear browser cache (optional)
# Users will see new version on refresh
```

---

## Phase 11: Security Hardening

### 11.1 Firewall Setup

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Verify
sudo ufw status
```

### 11.2 SSH Security

```bash
# Disable password authentication
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# Disable root login
sudo sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config

# Restart SSH
sudo systemctl restart sshd
```

### 11.3 Fail2Ban (Brute Force Protection)

```bash
# Install Fail2Ban
sudo apt-get install -y fail2ban

# Start Fail2Ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Verify
sudo fail2ban-client status
```

---

## Phase 12: Monitoring & Alerts

### 12.1 CloudWatch Agent (Optional)

```bash
# Download CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

# Install
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Configure and start
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -s
```

### 12.2 Health Check Script

```bash
# Create health check
cat > /home/ubuntu/health-check.sh << 'EOF'
#!/bin/bash

# Check backend
curl -f http://localhost:5000/api/v1/health || echo "Backend down"

# Check frontend
curl -f http://localhost/health || echo "Frontend down"

# Check MongoDB
mongosh --eval "db.adminCommand('ping')" || echo "MongoDB down"

# Check Redis
redis-cli ping || echo "Redis down"
EOF

chmod +x /home/ubuntu/health-check.sh

# Run periodically
crontab -e
# Add: */5 * * * * /home/ubuntu/health-check.sh >> /var/log/health-check.log 2>&1
```

---

## Troubleshooting

### Backend not starting
```bash
# Check PM2 logs
pm2 logs loan-crm-api

# Check if port 5000 is in use
sudo lsof -i :5000

# Restart backend
pm2 restart loan-crm-api
```

### Frontend not loading
```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check if files exist
ls -la /var/www/loan-crm-frontend/

# Reload Nginx
sudo systemctl reload nginx
```

### MongoDB connection issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

### SSL certificate issues
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check Nginx SSL config
sudo nginx -t
```

---

## Cost Estimate

| Component | Cost/Month |
|-----------|-----------|
| EC2 t3.medium | $35 |
| Elastic IP | $0 (free if attached) |
| Data Transfer | $5 |
| **TOTAL** | **~$40/month** |

---

## Maintenance Schedule

| Task | Frequency |
|------|-----------|
| Backups | Daily (2 AM) |
| Security updates | Weekly |
| SSL renewal | Automatic |
| Log rotation | Daily |
| Monitoring | Continuous |

---

## Quick Commands Reference

```bash
# Backend
pm2 status                    # Check status
pm2 logs loan-crm-api        # View logs
pm2 restart loan-crm-api     # Restart
pm2 stop loan-crm-api        # Stop
pm2 start loan-crm-api       # Start

# Frontend
sudo systemctl reload nginx   # Reload Nginx
sudo tail -f /var/log/nginx/access.log  # View logs

# Database
mongosh                       # Connect to MongoDB
redis-cli                     # Connect to Redis

# System
sudo systemctl status mongod  # MongoDB status
sudo systemctl status redis-server  # Redis status
sudo systemctl status nginx   # Nginx status
```

---

## Success Criteria

After deployment:
✅ Backend API running at https://your-domain.com/api/v1
✅ Frontend accessible at https://your-domain.com
✅ SSL certificate working
✅ Database connected
✅ Cron jobs executing
✅ Backups running
✅ Logs accessible

