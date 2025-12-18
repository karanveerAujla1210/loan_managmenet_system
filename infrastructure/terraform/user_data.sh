#!/bin/bash
set -e

# EC2 User Data Script - Runs on instance startup
# Installs all dependencies and deploys the application

export DEBIAN_FRONTEND=noninteractive

# Update system
apt-get update
apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt-get update
apt-get install -y mongodb-org

# Install Redis
apt-get install -y redis-server

# Install Nginx
apt-get install -y nginx

# Install PM2
npm install -g pm2

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh
usermod -aG docker ubuntu

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Start services
systemctl start mongod
systemctl enable mongod
systemctl start redis-server
systemctl enable redis-server
systemctl start nginx
systemctl enable nginx

# Create app directory
mkdir -p /opt/loan-management-system
cd /opt/loan-management-system

# Clone repository
git clone -b main https://github.com/your-org/loan-management-system.git .

# Deploy backend
cd /opt/loan-management-system/backend
npm ci --production

# Create PM2 config
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

mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Deploy frontend
cd /opt/loan-management-system/frontend-unified
npm ci
npm run build

# Configure Nginx
cat > /etc/nginx/sites-available/loan-crm << 'EOF'
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

    ssl_certificate /etc/ssl/certs/server.crt;
    ssl_certificate_key /etc/ssl/private/server.key;

    gzip on;
    gzip_types text/plain text/css text/javascript application/json;

    location / {
        root /opt/loan-management-system/frontend-unified/dist;
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

    location /health {
        access_log off;
        return 200 "healthy\n";
    }
}
EOF

ln -sf /etc/nginx/sites-available/loan-crm /etc/nginx/sites-enabled/loan-crm
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "Deployment complete"
