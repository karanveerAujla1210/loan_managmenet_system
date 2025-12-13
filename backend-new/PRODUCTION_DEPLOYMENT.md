# Production Deployment Guide

🚀 **Complete guide for deploying NBFC Loan Management System to production**

## 📋 Pre-Deployment Checklist

### Infrastructure Requirements
- [ ] Server with minimum 4GB RAM, 2 CPU cores
- [ ] Ubuntu 20.04+ or CentOS 8+ (recommended)
- [ ] Node.js 18+ installed
- [ ] MongoDB 7.0+ (local or cloud)
- [ ] Redis 7.0+ (optional but recommended)
- [ ] Nginx for reverse proxy
- [ ] SSL certificate
- [ ] Domain name configured

### Security Requirements
- [ ] Firewall configured (ports 80, 443, 22 only)
- [ ] SSH key-based authentication
- [ ] Non-root user for application
- [ ] Database authentication enabled
- [ ] Environment variables secured
- [ ] Log rotation configured
- [ ] Backup strategy implemented

## 🔧 Server Setup

### 1. Initial Server Configuration

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

# Create application user
sudo adduser --system --group --home /opt/nbfc nbfc
sudo usermod -aG sudo nbfc

# Switch to application user
sudo su - nbfc
```

### 2. Install Node.js

```bash
# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install MongoDB

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Secure MongoDB
sudo mongo --eval "
db = db.getSiblingDB('admin');
db.createUser({
  user: 'admin',
  pwd: 'your-secure-password',
  roles: ['root']
});
"

# Enable authentication
sudo sed -i 's/#security:/security:\n  authorization: enabled/' /etc/mongod.conf
sudo systemctl restart mongod
```

### 4. Install Redis (Optional)

```bash
# Install Redis
sudo apt install -y redis-server

# Configure Redis
sudo sed -i 's/# requirepass foobared/requirepass your-redis-password/' /etc/redis/redis.conf
sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

## 🚀 Application Deployment

### 1. Clone and Setup Application

```bash
# Clone repository
cd /opt/nbfc
git clone <repository-url> loan-management-backend
cd loan-management-backend

# Install dependencies
npm ci --only=production

# Create production environment file
cp .env.example .env.production
```

### 2. Configure Environment Variables

```bash
# Edit production environment
nano .env.production
```

```env
# Production Environment Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://admin:your-secure-password@localhost:27017/nbfc_loan_management?authSource=admin
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Security
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-min-32-chars
BCRYPT_SALT_ROUNDS=12
SESSION_SECRET=your-session-secret-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@company.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@company.com

# SMS Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Business Configuration
DEFAULT_INTEREST_RATE=24
DEFAULT_PROCESSING_FEE_RATE=2
DEFAULT_PENALTY_RATE=36
MIN_LOAN_AMOUNT=10000
MAX_LOAN_AMOUNT=1000000

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=/opt/nbfc/loan-management-backend/logs

# Security Headers
HELMET_ENABLED=true
COMPRESSION_ENABLED=true
CORS_ORIGIN=https://yourdomain.com
TRUST_PROXY=true

# Monitoring
HEALTH_CHECK_ENABLED=true
METRICS_ENABLED=true

# Backup
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
```

### 3. Run Database Migrations

```bash
# Set environment
export NODE_ENV=production

# Run migrations
npm run migrate

# Seed initial data (optional)
npm run seed
```

### 4. Test Application

```bash
# Test application startup
npm start

# Test health endpoint
curl http://localhost:5000/health

# Stop test server
Ctrl+C
```

## 🔄 Process Management with PM2

### 1. Install PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create PM2 ecosystem file
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'nbfc-backend',
    script: 'src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### 2. Start Application with PM2

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u nbfc --hp /opt/nbfc

# Enable PM2 service
sudo systemctl enable pm2-nbfc
```

## 🌐 Nginx Configuration

### 1. Create Nginx Configuration

```bash
# Create Nginx site configuration
sudo nano /etc/nginx/sites-available/nbfc-backend
```

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;

# Upstream backend
upstream nbfc_backend {
    least_conn;
    server 127.0.0.1:5000 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Client settings
    client_max_body_size 10M;
    client_body_timeout 60s;
    client_header_timeout 60s;

    # Proxy settings
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    proxy_buffering on;
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;

    # API routes
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://nbfc_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Auth routes with stricter rate limiting
    location /api/v1/users/login {
        limit_req zone=auth burst=5 nodelay;
        
        proxy_pass http://nbfc_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        access_log off;
        proxy_pass http://nbfc_backend;
        proxy_set_header Host $host;
    }

    # Static files (if any)
    location /static/ {
        alias /opt/nbfc/loan-management-backend/public/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Logs
    access_log /var/log/nginx/nbfc-access.log;
    error_log /var/log/nginx/nbfc-error.log;
}
```

### 2. Enable Nginx Site

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/nbfc-backend /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## 🔒 SSL Certificate Setup

### 1. Obtain SSL Certificate with Let's Encrypt

```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Start Nginx
sudo systemctl start nginx

# Setup automatic renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring Setup

### 1. Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/nbfc-backend
```

```
/opt/nbfc/loan-management-backend/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nbfc nbfc
    postrotate
        pm2 reload nbfc-backend
    endscript
}
```

### 2. System Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Setup disk space monitoring
echo '#!/bin/bash
THRESHOLD=80
USAGE=$(df / | grep -vE "^Filesystem" | awk "{print \$5}" | sed "s/%//g")
if [ "$USAGE" -gt "$THRESHOLD" ]; then
    echo "Disk usage is above $THRESHOLD%: $USAGE%" | mail -s "Disk Space Alert" admin@company.com
fi' | sudo tee /opt/nbfc/scripts/disk-monitor.sh

sudo chmod +x /opt/nbfc/scripts/disk-monitor.sh

# Add to crontab
echo "0 */6 * * * /opt/nbfc/scripts/disk-monitor.sh" | sudo crontab -
```

## 💾 Backup Strategy

### 1. Database Backup Script

```bash
# Create backup directory
sudo mkdir -p /opt/nbfc/backups
sudo chown nbfc:nbfc /opt/nbfc/backups

# Create backup script
nano /opt/nbfc/scripts/backup.sh
```

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/opt/nbfc/backups"
DB_NAME="nbfc_loan_management"
DB_USER="admin"
DB_PASS="your-secure-password"
RETENTION_DAYS=30

# Create backup
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/mongodb_backup_$DATE.gz"

echo "Starting backup at $(date)"

# MongoDB backup
mongodump --host localhost --port 27017 --username $DB_USER --password $DB_PASS --authenticationDatabase admin --db $DB_NAME --gzip --archive=$BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP_FILE"
    
    # Remove old backups
    find $BACKUP_DIR -name "mongodb_backup_*.gz" -mtime +$RETENTION_DAYS -delete
    echo "Old backups cleaned up"
else
    echo "Backup failed!"
    exit 1
fi

# Application files backup
tar -czf "$BACKUP_DIR/app_backup_$DATE.tar.gz" -C /opt/nbfc loan-management-backend --exclude=node_modules --exclude=logs

echo "Backup process completed at $(date)"
```

```bash
# Make script executable
chmod +x /opt/nbfc/scripts/backup.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /opt/nbfc/scripts/backup.sh >> /opt/nbfc/logs/backup.log 2>&1" | crontab -
```

## 🔥 Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

## 📈 Performance Tuning

### 1. Node.js Optimization

```bash
# Add to ~/.bashrc
echo 'export NODE_OPTIONS="--max-old-space-size=2048"' >> ~/.bashrc
source ~/.bashrc
```

### 2. MongoDB Optimization

```bash
# Edit MongoDB configuration
sudo nano /etc/mongod.conf
```

```yaml
# MongoDB Production Configuration
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
      cacheSizeGB: 1
      journalCompressor: snappy
      directoryForIndexes: false
    collectionConfig:
      blockCompressor: snappy
    indexConfig:
      prefixCompression: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
  logRotate: reopen

net:
  port: 27017
  bindIp: 127.0.0.1

security:
  authorization: enabled

operationProfiling:
  slowOpThresholdMs: 100
  mode: slowOp
```

### 3. System Limits

```bash
# Increase file descriptor limits
echo 'nbfc soft nofile 65536' | sudo tee -a /etc/security/limits.conf
echo 'nbfc hard nofile 65536' | sudo tee -a /etc/security/limits.conf

# Increase process limits
echo 'nbfc soft nproc 32768' | sudo tee -a /etc/security/limits.conf
echo 'nbfc hard nproc 32768' | sudo tee -a /etc/security/limits.conf
```

## 🚨 Health Monitoring

### 1. Application Health Check Script

```bash
# Create health check script
nano /opt/nbfc/scripts/health-check.sh
```

```bash
#!/bin/bash

# Configuration
API_URL="https://yourdomain.com/health"
ALERT_EMAIL="admin@company.com"
LOG_FILE="/opt/nbfc/logs/health-check.log"

# Check API health
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ "$HTTP_STATUS" != "200" ]; then
    echo "$(date): API health check failed - HTTP $HTTP_STATUS" >> $LOG_FILE
    echo "API is down! HTTP Status: $HTTP_STATUS" | mail -s "NBFC API Alert" $ALERT_EMAIL
    
    # Restart application if needed
    pm2 restart nbfc-backend
else
    echo "$(date): API health check passed" >> $LOG_FILE
fi

# Check disk space
DISK_USAGE=$(df / | grep -vE '^Filesystem' | awk '{print $5}' | sed 's/%//g')
if [ "$DISK_USAGE" -gt 85 ]; then
    echo "$(date): High disk usage - $DISK_USAGE%" >> $LOG_FILE
    echo "High disk usage: $DISK_USAGE%" | mail -s "Disk Space Alert" $ALERT_EMAIL
fi

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.2f", $3/$2 * 100.0)}')
if (( $(echo "$MEMORY_USAGE > 90" | bc -l) )); then
    echo "$(date): High memory usage - $MEMORY_USAGE%" >> $LOG_FILE
    echo "High memory usage: $MEMORY_USAGE%" | mail -s "Memory Alert" $ALERT_EMAIL
fi
```

```bash
# Make executable and schedule
chmod +x /opt/nbfc/scripts/health-check.sh
echo "*/5 * * * * /opt/nbfc/scripts/health-check.sh" | crontab -
```

## 🔄 Deployment Automation

### 1. Deployment Script

```bash
# Create deployment script
nano /opt/nbfc/scripts/deploy.sh
```

```bash
#!/bin/bash

set -e

echo "🚀 Starting NBFC Backend Deployment"

# Configuration
APP_DIR="/opt/nbfc/loan-management-backend"
BACKUP_DIR="/opt/nbfc/backups"
BRANCH="main"

# Create backup before deployment
echo "📦 Creating backup..."
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "$BACKUP_DIR/pre_deploy_backup_$DATE.tar.gz" -C /opt/nbfc loan-management-backend

# Pull latest code
echo "📥 Pulling latest code..."
cd $APP_DIR
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run migrations
echo "🗄️ Running database migrations..."
npm run migrate

# Run tests
echo "🧪 Running tests..."
npm test

# Restart application
echo "🔄 Restarting application..."
pm2 reload nbfc-backend

# Health check
echo "🏥 Performing health check..."
sleep 10
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Deployment successful!"
else
    echo "❌ Deployment failed - rolling back..."
    # Rollback logic here
    exit 1
fi

echo "🎉 Deployment completed successfully!"
```

## 📋 Post-Deployment Checklist

### Verify Deployment
- [ ] Application starts without errors
- [ ] Health check endpoint returns 200
- [ ] Database connection successful
- [ ] Redis connection working (if configured)
- [ ] SSL certificate valid
- [ ] All API endpoints responding
- [ ] Authentication working
- [ ] Cron jobs scheduled
- [ ] Logs being written
- [ ] Monitoring alerts configured

### Security Verification
- [ ] Firewall rules active
- [ ] SSH key authentication only
- [ ] Database authentication enabled
- [ ] Environment variables secured
- [ ] File permissions correct
- [ ] SSL/TLS configuration secure
- [ ] Rate limiting working
- [ ] Security headers present

### Performance Verification
- [ ] Response times acceptable
- [ ] Memory usage normal
- [ ] CPU usage normal
- [ ] Database queries optimized
- [ ] Caching working (if enabled)
- [ ] Log rotation configured
- [ ] Backup process working

## 🆘 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check PM2 logs
pm2 logs nbfc-backend

# Check system logs
sudo journalctl -u pm2-nbfc -f

# Check environment variables
pm2 env 0
```

#### Database Connection Issues
```bash
# Test MongoDB connection
mongo mongodb://admin:password@localhost:27017/nbfc_loan_management?authSource=admin

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Check MongoDB status
sudo systemctl status mongod
```

#### High Memory Usage
```bash
# Check memory usage
free -h
htop

# Restart application
pm2 restart nbfc-backend

# Check for memory leaks
pm2 monit
```

#### SSL Certificate Issues
```bash
# Check certificate expiry
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL configuration
openssl s_client -connect yourdomain.com:443
```

### Emergency Procedures

#### Rollback Deployment
```bash
# Stop current application
pm2 stop nbfc-backend

# Restore from backup
cd /opt/nbfc
tar -xzf backups/pre_deploy_backup_YYYYMMDD_HHMMSS.tar.gz

# Start application
pm2 start nbfc-backend
```

#### Database Recovery
```bash
# Restore from backup
mongorestore --host localhost --port 27017 --username admin --password password --authenticationDatabase admin --gzip --archive=backups/mongodb_backup_YYYYMMDD_HHMMSS.gz
```

---

**🎉 Your NBFC Loan Management System is now production-ready!**

For support, contact the development team or refer to the troubleshooting section above.