#!/bin/bash
set -e

apt-get update
apt-get install -y curl wget git nodejs npm mongodb redis-server nginx certbot python3-certbot-nginx

cd /opt
git clone https://github.com/your-org/loan-management-system.git
cd loan-management-system

cd backend
npm ci --production
mkdir -p logs

cd ../frontend-unified
npm ci
npm run build

systemctl start mongod redis-server nginx
systemctl enable mongod redis-server nginx

npm install -g pm2
cd /opt/loan-management-system/backend
pm2 start src/server.js --name "loan-api"
pm2 save
pm2 startup
