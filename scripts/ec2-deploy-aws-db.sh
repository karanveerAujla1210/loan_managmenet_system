#!/bin/bash

# EC2 Deployment with AWS DocumentDB + ElastiCache

set -e

DOMAIN="your-domain.com"
APP_DIR="/home/ec2-user/apps/loan-management-system"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
FRONTEND_SERVE_DIR="/var/www/loan-crm-frontend"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ==========================================
# INSTALL PHASE (No MongoDB/Redis)
# ==========================================

install_dependencies() {
  log_info "Installing dependencies..."

  sudo yum update -y
  sudo yum upgrade -y

  # Install Node.js 18
  curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
  sudo yum install -y nodejs

  # Install Nginx
  sudo amazon-linux-extras install -y nginx1
  sudo systemctl start nginx
  sudo systemctl enable nginx

  # Install PM2
  sudo npm install -g pm2

  # Install Certbot
  sudo yum install -y certbot python3-certbot-nginx

  # Install Git
  sudo yum install -y git

  log_info "Dependencies installed successfully"
}

# ==========================================
# DEPLOYMENT PHASE
# ==========================================

deploy_backend() {
  log_info "Deploying backend..."

  mkdir -p $APP_DIR
  cd $APP_DIR

  if [ ! -d ".git" ]; then
    git clone https://github.com/your-org/loan-management-system.git .
  else
    git pull origin main
  fi

  cd $BACKEND_DIR

  # Copy production .env
  if [ ! -f ".env" ]; then
    cp .env.production .env
    log_info "Created .env from .env.production"
  fi

  npm ci --production
  mkdir -p logs

  cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'loan-crm-api',
    script: './src/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production' },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
EOF

  pm2 start ecosystem.config.js
  pm2 save
  pm2 startup

  log_info "Backend deployed successfully"
}

deploy_frontend() {
  log_info "Deploying frontend..."

  cd $FRONTEND_DIR

  npm ci
  npm run build

  sudo mkdir -p $FRONTEND_SERVE_DIR
  sudo chown -R ec2-user:ec2-user $FRONTEND_SERVE_DIR

  cp -r dist/* $FRONTEND_SERVE_DIR/

  log_info "Frontend deployed successfully"
}

configure_nginx() {
  log_info "Configuring Nginx..."

  sudo tee /etc/nginx/conf.d/loan-crm.conf > /dev/null << 'EOF'
upstream backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name _;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;

    location / {
        root /var/www/loan-crm-frontend;
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
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
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /var/www/loan-crm-frontend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~ /\. {
        deny all;
    }
}
EOF

  sudo nginx -t
  sudo systemctl reload nginx

  log_info "Nginx configured successfully"
}

setup_ssl() {
  log_info "Setting up SSL certificate..."

  sudo certbot certonly --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN

  sudo systemctl enable certbot.timer
  sudo systemctl start certbot.timer

  log_info "SSL certificate setup successfully"
}

# ==========================================
# UPDATE & RESTART
# ==========================================

update_code() {
  log_info "Updating code..."

  cd $BACKEND_DIR
  git pull origin main
  npm ci --production
  pm2 restart loan-crm-api

  cd $FRONTEND_DIR
  git pull origin main
  npm ci
  npm run build
  cp -r dist/* $FRONTEND_SERVE_DIR/

  log_info "Code updated successfully"
}

restart_services() {
  log_info "Restarting services..."

  pm2 restart loan-crm-api
  sudo systemctl reload nginx

  log_info "Services restarted successfully"
}

# ==========================================
# HEALTH CHECK
# ==========================================

health_check() {
  log_info "Running health checks..."

  if curl -f http://localhost:5000/api/v1/health > /dev/null 2>&1; then
    log_info "✓ Backend is running"
  else
    log_error "✗ Backend is not responding"
  fi

  if curl -f http://localhost/ > /dev/null 2>&1; then
    log_info "✓ Frontend is running"
  else
    log_error "✗ Frontend is not responding"
  fi

  if pm2 status | grep -q "online"; then
    log_info "✓ PM2 processes are running"
  else
    log_error "✗ PM2 processes are not running"
  fi
}

# ==========================================
# MAIN
# ==========================================

case $1 in
  install)
    install_dependencies
    ;;
  deploy)
    deploy_backend
    deploy_frontend
    configure_nginx
    setup_ssl
    health_check
    ;;
  update)
    update_code
    restart_services
    health_check
    ;;
  restart)
    restart_services
    health_check
    ;;
  health)
    health_check
    ;;
  *)
    echo "Usage: $0 {install|deploy|update|restart|health}"
    exit 1
    ;;
esac
