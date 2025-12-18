#!/bin/bash

# Complete EC2 Setup Script for Loan Management System
# Deploys: Backend + Frontend + MongoDB + Redis + Nginx on single EC2 instance
# Usage: chmod +x ec2-complete-setup.sh && ./ec2-complete-setup.sh

set -e

# ==========================================
# CONFIGURATION
# ==========================================

DOMAIN="${DOMAIN:-your-domain.com}"
APP_DIR="/opt/loan-management-system"
BACKUP_DIR="/backups/mongodb"
LOG_DIR="/var/log/loan-crm"
REPO_URL="${REPO_URL:-https://github.com/your-org/loan-management-system.git}"
BRANCH="${BRANCH:-main}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ==========================================
# LOGGING FUNCTIONS
# ==========================================

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_section() { echo -e "\n${BLUE}=== $1 ===${NC}\n"; }

# ==========================================
# SYSTEM SETUP
# ==========================================

setup_system() {
  log_section "System Setup"
  
  log_info "Updating system packages..."
  sudo apt-get update
  sudo apt-get upgrade -y
  
  log_info "Installing essential tools..."
  sudo apt-get install -y \
    curl wget git vim htop net-tools \
    build-essential python3-dev \
    apt-transport-https ca-certificates gnupg lsb-release \
    fail2ban ufw
  
  log_info "Creating application directories..."
  sudo mkdir -p $APP_DIR $BACKUP_DIR $LOG_DIR
  sudo chown -R ubuntu:ubuntu $APP_DIR $BACKUP_DIR $LOG_DIR
}

# ==========================================
# NODE.JS INSTALLATION
# ==========================================

install_nodejs() {
  log_section "Installing Node.js"
  
  if command -v node &> /dev/null; then
    log_warn "Node.js already installed: $(node -v)"
    return
  fi
  
  log_info "Installing Node.js 18.x..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  
  log_info "Installing global npm packages..."
  sudo npm install -g pm2 npm@latest
  
  log_info "Node.js version: $(node -v)"
  log_info "npm version: $(npm -v)"
}

# ==========================================
# MONGODB INSTALLATION
# ==========================================

install_mongodb() {
  log_section "Installing MongoDB"
  
  if command -v mongod &> /dev/null; then
    log_warn "MongoDB already installed"
    return
  fi
  
  log_info "Adding MongoDB repository..."
  curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
  echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
    sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
  
  log_info "Installing MongoDB..."
  sudo apt-get update
  sudo apt-get install -y mongodb-org
  
  log_info "Starting MongoDB..."
  sudo systemctl start mongod
  sudo systemctl enable mongod
  
  log_info "MongoDB version: $(mongod --version | head -1)"
}

# ==========================================
# REDIS INSTALLATION
# ==========================================

install_redis() {
  log_section "Installing Redis"
  
  if command -v redis-server &> /dev/null; then
    log_warn "Redis already installed"
    return
  fi
  
  log_info "Installing Redis..."
  sudo apt-get install -y redis-server
  
  log_info "Configuring Redis..."
  sudo sed -i 's/^# requirepass.*/requirepass '"$(openssl rand -base64 32)"'/' /etc/redis/redis.conf
  sudo sed -i 's/^bind 127.0.0.1/bind 127.0.0.1 ::1/' /etc/redis/redis.conf
  
  log_info "Starting Redis..."
  sudo systemctl start redis-server
  sudo systemctl enable redis-server
  
  log_info "Redis version: $(redis-server --version)"
}

# ==========================================
# DOCKER INSTALLATION
# ==========================================

install_docker() {
  log_section "Installing Docker"
  
  if command -v docker &> /dev/null; then
    log_warn "Docker already installed: $(docker --version)"
    return
  fi
  
  log_info "Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  rm get-docker.sh
  
  log_info "Adding user to docker group..."
  sudo usermod -aG docker ubuntu
  
  log_info "Installing Docker Compose..."
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  
  log_info "Docker version: $(docker --version)"
  log_info "Docker Compose version: $(docker-compose --version)"
}

# ==========================================
# NGINX INSTALLATION
# ==========================================

install_nginx() {
  log_section "Installing Nginx"
  
  if command -v nginx &> /dev/null; then
    log_warn "Nginx already installed"
    return
  fi
  
  log_info "Installing Nginx..."
  sudo apt-get install -y nginx
  
  log_info "Starting Nginx..."
  sudo systemctl start nginx
  sudo systemctl enable nginx
  
  log_info "Nginx version: $(nginx -v 2>&1)"
}

# ==========================================
# SSL CERTIFICATE SETUP
# ==========================================

setup_ssl() {
  log_section "Setting up SSL Certificate"
  
  log_info "Installing Certbot..."
  sudo apt-get install -y certbot python3-certbot-nginx
  
  log_info "Obtaining SSL certificate for $DOMAIN..."
  sudo certbot certonly --nginx \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --non-interactive \
    --agree-tos \
    -m admin@$DOMAIN \
    --redirect || log_warn "SSL setup skipped or already exists"
  
  log_info "Setting up auto-renewal..."
  sudo systemctl enable certbot.timer
  sudo systemctl start certbot.timer
}

# ==========================================
# APPLICATION DEPLOYMENT
# ==========================================

deploy_application() {
  log_section "Deploying Application"
  
  log_info "Cloning repository..."
  if [ -d "$APP_DIR/.git" ]; then
    cd $APP_DIR
    git pull origin $BRANCH
  else
    sudo git clone -b $BRANCH $REPO_URL $APP_DIR
    sudo chown -R ubuntu:ubuntu $APP_DIR
  fi
  
  log_info "Setting up backend..."
  cd $APP_DIR/backend
  
  # Create .env file
  if [ ! -f ".env" ]; then
    log_info "Creating backend .env file..."
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

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EOF
    log_warn "Please update .env file with actual values"
  fi
  
  log_info "Installing backend dependencies..."
  npm ci --production
  
  log_info "Setting up frontend..."
  cd $APP_DIR/frontend-unified
  
  if [ ! -f ".env.production" ]; then
    log_info "Creating frontend .env.production file..."
    cat > .env.production << 'EOF'
VITE_API_URL=https://your-domain.com/api
VITE_APP_NAME=Business Loan CRM
EOF
  fi
  
  log_info "Installing frontend dependencies..."
  npm ci
  
  log_info "Building frontend..."
  npm run build
  
  log_info "Application deployed successfully"
}

# ==========================================
# NGINX CONFIGURATION
# ==========================================

configure_nginx() {
  log_section "Configuring Nginx"
  
  log_info "Creating Nginx configuration..."
  sudo tee /etc/nginx/sites-available/loan-crm > /dev/null << 'EOF'
upstream backend {
    server localhost:5000;
    keepalive 32;
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
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    gzip_min_length 1000;

    client_max_body_size 50M;

    # Frontend
    location / {
        root /opt/loan-management-system/frontend-unified/dist;
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
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

  log_info "Enabling Nginx site..."
  sudo ln -sf /etc/nginx/sites-available/loan-crm /etc/nginx/sites-enabled/loan-crm
  sudo rm -f /etc/nginx/sites-enabled/default
  
  log_info "Testing Nginx configuration..."
  sudo nginx -t
  
  log_info "Reloading Nginx..."
  sudo systemctl reload nginx
}

# ==========================================
# PM2 PROCESS MANAGEMENT
# ==========================================

setup_pm2() {
  log_section "Setting up PM2"
  
  log_info "Creating PM2 ecosystem config..."
  cat > $APP_DIR/backend/ecosystem.config.js << 'EOF'
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
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    merge_logs: true
  }]
};
EOF

  log_info "Starting application with PM2..."
  cd $APP_DIR/backend
  pm2 start ecosystem.config.js
  pm2 save
  pm2 startup
  
  log_info "PM2 processes:"
  pm2 list
}

# ==========================================
# BACKUP CONFIGURATION
# ==========================================

setup_backups() {
  log_section "Setting up Backups"
  
  log_info "Creating backup script..."
  sudo tee /usr/local/bin/backup-mongodb.sh > /dev/null << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.tar.gz"

mkdir -p $BACKUP_DIR

mongodump --out /tmp/mongodb_backup_$DATE
tar -czf $BACKUP_FILE -C /tmp mongodb_backup_$DATE
rm -rf /tmp/mongodb_backup_$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
EOF

  sudo chmod +x /usr/local/bin/backup-mongodb.sh
  
  log_info "Setting up daily backup cron job..."
  echo "0 2 * * * /usr/local/bin/backup-mongodb.sh >> /var/log/mongodb-backup.log 2>&1" | \
    sudo tee /etc/cron.d/mongodb-backup > /dev/null
}

# ==========================================
# FIREWALL CONFIGURATION
# ==========================================

setup_firewall() {
  log_section "Setting up Firewall"
  
  log_info "Enabling UFW..."
  sudo ufw --force enable
  
  log_info "Configuring firewall rules..."
  sudo ufw default deny incoming
  sudo ufw default allow outgoing
  sudo ufw allow 22/tcp
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  
  log_info "Firewall rules:"
  sudo ufw status
}

# ==========================================
# MONITORING & LOGGING
# ==========================================

setup_monitoring() {
  log_section "Setting up Monitoring"
  
  log_info "Creating log rotation config..."
  sudo tee /etc/logrotate.d/loan-crm > /dev/null << 'EOF'
/var/log/loan-crm/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 ubuntu ubuntu
    sharedscripts
}
EOF

  log_info "Creating health check script..."
  cat > /usr/local/bin/health-check.sh << 'EOF'
#!/bin/bash

echo "=== Loan CRM Health Check ==="
echo ""

# Check Backend
echo -n "Backend API: "
if curl -sf http://localhost:5000/health > /dev/null 2>&1; then
  echo "✓ Running"
else
  echo "✗ Down"
fi

# Check Frontend
echo -n "Frontend: "
if curl -sf http://localhost/health > /dev/null 2>&1; then
  echo "✓ Running"
else
  echo "✗ Down"
fi

# Check MongoDB
echo -n "MongoDB: "
if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
  echo "✓ Running"
else
  echo "✗ Down"
fi

# Check Redis
echo -n "Redis: "
if redis-cli ping > /dev/null 2>&1; then
  echo "✓ Running"
else
  echo "✗ Down"
fi

# Check PM2
echo -n "PM2 Processes: "
if pm2 status | grep -q "online"; then
  echo "✓ Running"
else
  echo "✗ Down"
fi

echo ""
echo "=== System Resources ==="
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')"
echo "Memory Usage: $(free | grep Mem | awk '{printf("%.2f%%", $3/$2 * 100.0)}')"
echo "Disk Usage: $(df -h / | tail -1 | awk '{print $5}')"
EOF

  chmod +x /usr/local/bin/health-check.sh
}

# ==========================================
# SECURITY HARDENING
# ==========================================

harden_security() {
  log_section "Security Hardening"
  
  log_info "Configuring SSH..."
  sudo sed -i 's/^#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
  sudo sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
  sudo systemctl reload sshd
  
  log_info "Setting up Fail2Ban..."
  sudo systemctl start fail2ban
  sudo systemctl enable fail2ban
  
  log_info "Configuring automatic security updates..."
  sudo apt-get install -y unattended-upgrades
  sudo dpkg-reconfigure -plow unattended-upgrades
}

# ==========================================
# HEALTH CHECK
# ==========================================

health_check() {
  log_section "Health Check"
  
  /usr/local/bin/health-check.sh
}

# ==========================================
# MAIN EXECUTION
# ==========================================

main() {
  log_section "Loan Management System - EC2 Complete Setup"
  
  setup_system
  install_nodejs
  install_mongodb
  install_redis
  install_docker
  install_nginx
  setup_ssl
  deploy_application
  configure_nginx
  setup_pm2
  setup_backups
  setup_firewall
  setup_monitoring
  harden_security
  health_check
  
  log_section "Setup Complete!"
  log_info "Application is running at https://$DOMAIN"
  log_info "Run 'health-check.sh' to verify all services"
  log_info "View logs: tail -f $LOG_DIR/*.log"
}

main "$@"
