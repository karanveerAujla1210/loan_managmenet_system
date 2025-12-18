#!/bin/bash
set -e

# Minimal EC2 deployment script
DOMAIN="${1:-your-domain.com}"
APP_DIR="/opt/loan-management-system"

echo "Installing dependencies..."
sudo apt-get update
sudo apt-get install -y curl wget git nodejs npm mongodb redis-server nginx certbot python3-certbot-nginx

echo "Cloning repository..."
sudo mkdir -p $APP_DIR
sudo git clone https://github.com/your-org/loan-management-system.git $APP_DIR
sudo chown -R ubuntu:ubuntu $APP_DIR

echo "Setting up backend..."
cd $APP_DIR/backend
npm ci --production
mkdir -p logs

echo "Setting up frontend..."
cd $APP_DIR/frontend-unified
npm ci
npm run build

echo "Starting services..."
sudo systemctl start mongod redis-server nginx
sudo systemctl enable mongod redis-server nginx

echo "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/loan-crm > /dev/null << 'EOF'
upstream backend { server localhost:5000; }
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
    location / {
        root /opt/loan-management-system/frontend-unified/dist;
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://backend;
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

echo "Installing PM2..."
sudo npm install -g pm2
cd $APP_DIR/backend
pm2 start src/server.js --name "loan-api"
pm2 save
pm2 startup

echo "Setting up SSL..."
sudo certbot certonly --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN

echo "Deployment complete!"
