#!/bin/bash

# EC2 Deployment Script - Backend + Frontend on Single Instance
# Usage: ./ec2-deploy.sh [install|deploy|update|restart]

set -e

DOMAIN="your-domain.com"
APP_DIR="/home/ubuntu/apps/loan-management-system"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
FRONTEND_SERVE_DIR="/var/www/loan-crm-frontend"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# ==========================================
# INSTALL PHASE
# ==========================================

install_dependencies() {
  log_info "Installing system dependencies..."

  # Update system
  sudo apt-get update
  sudo apt-get upgrade -y

  # Install Node.js
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs

  # Install MongoDB
  curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
  echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
  sudo apt-get update
  sudo apt-get install -y mongodb-org

  # Install Redis
  sudo apt-get install -y redis-server

  # Install Nginx
  sudo apt-get install -y nginx

  # Install PM2
  sudo npm install -g pm2

  # Install Certbot
  sudo apt-get install -y certbot python3-certbot-nginx

  # Install Git
  sudo apt-get install -y git

  # Install Fail2Ban
  sudo apt-get install -y fail2ban

  log_info "Dependencies installed successfully"
}

start_services() {
  log_info "Starting services..."

  # Start MongoDB
  sudo systemctl start mongod
  sudo systemctl enable mongod

  # Start Redis
  sudo systemctl start redis-server
  sudo systemctl enable redis-server

  # Start Nginx
  sudo systemctl start nginx
  sudo systemctl enable nginx

  # Start Fail2Ban
  sudo systemctl start fail2ban
  sudo systemctl enable fail2ban

  log_info "Services started successfully"
}

# ==========================================
# DEPLOYMENT PHASE
# ==========================================

deploy_backend() {
  log_info "Deploying backend..."

  # Create app directory
  mkdir -p $APP_DIR
  cd $APP_DIR

  # Clone or pull repository
  if [ ! -d ".git" ]; then
    git clone https://github.com/your-org/loan-management-system.git .
  else
    git pull origin main
  fi

  # Setup backend
  cd $BACKEND_DIR

  # Create .env file
  if [ ! -f ".env" ]; then
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
    log_info "Created .env file"
  fi

  # Install dependencies
  npm ci --production

  # Create logs directory
  mkdir -p logs

  # Create PM2 config
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

  # Start with PM2
  pm2 start ecosystem.config.js
  pm2 save
  pm2 startup

  log_info "Backend deployed successfully"
}

deploy_frontend() {
  log_info "Deploying frontend..."

  cd $FRONTEND_DIR

  # Install dependencies
  npm ci

  # Build
  npm run build

  # Create serving directory
  sudo mkdir -p $FRONTEND_SERVE_DIR
  sudo chown -R ubuntu:ubuntu $FRONTEND_SERVE_DIR

  # Copy built files
  cp -r dist/* $FRONTEND_SERVE_DIR/

  log_info "Frontend deployed successfully"
}

configure_nginx() {
  log_info "Configuring Nginx..."

  # Create Nginx config
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
    ssl_prefer_server_ciphers on;

    gzip on;
    gzip_types text/plain text/css text/javascript application/json;

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
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

  # Enable site
  sudo ln -sf /etc/nginx/sites-available/loan-crm /etc/nginx/sites-enabled/loan-crm
  sudo rm -f /etc/nginx/sites-enabled/default

  # Test config
  sudo nginx -t

  # Reload Nginx
  sudo systemctl reload nginx

  log_info "Nginx configured successfully"
}

setup_ssl() {
  log_info "Setting up SSL certificate..."

  # Get certificate
  sudo certbot certonly --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN

  # Enable auto-renewal
  sudo systemctl enable certbot.timer
  sudo systemctl start certbot.timer

  log_info "SSL certificate setup successfully"
}

# ==========================================
# UPDATE PHASE
# ==========================================

update_backend() {
  log_info "Updating backend..."

  cd $BACKEND_DIR

  # Pull latest code
  git pull origin main

  # Install dependencies
  npm ci --production

  # Restart backend
  pm2 restart loan-crm-api

  log_info "Backend updated successfully"
}

update_frontend() {
  log_info "Updating frontend..."

  cd $FRONTEND_DIR

  # Pull latest code
  git pull origin main

  # Install dependencies
  npm ci

  # Build
  npm run build

  # Copy to serving directory
  cp -r dist/* $FRONTEND_SERVE_DIR/

  log_info "Frontend updated successfully"
}

# ==========================================
# RESTART PHASE
# ==========================================

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

  # Check backend
  if curl -f http://localhost:5000/api/v1/health > /dev/null 2>&1; then
    log_info "✓ Backend is running"
  else
    log_error "✗ Backend is not responding"
  fi

  # Check frontend
  if curl -f http://localhost/ > /dev/null 2>&1; then
    log_info "✓ Frontend is running"
  else
    log_error "✗ Frontend is not responding"
  fi

  # Check MongoDB
  if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    log_info "✓ MongoDB is running"
  else
    log_error "✗ MongoDB is not responding"
  fi

  # Check Redis
  if redis-cli ping > /dev/null 2>&1; then
    log_info "✓ Redis is running"
  else
    log_error "✗ Redis is not responding"
  fi

  # Check PM2
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
    start_services
    ;;
  deploy)
    deploy_backend
    deploy_frontend
    configure_nginx
    setup_ssl
    health_check
    ;;
  update)
    update_backend
    update_frontend
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
    echo ""
    echo "Commands:"
    echo "  install  - Install all dependencies"
    echo "  deploy   - Deploy backend and frontend"
    echo "  update   - Update and redeploy"
    echo "  restart  - Restart services"
    echo "  health   - Run health checks"
    exit 1
    ;;
esac
