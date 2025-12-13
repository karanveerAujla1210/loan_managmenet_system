#!/bin/bash

# Production Deployment Script

set -e

echo "Starting deployment..."

# Configuration
PROJECT_DIR="/opt/loan-management-system"
BACKUP_DIR="/opt/backups/loan-management"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup before deployment
echo "Creating pre-deployment backup..."
mkdir -p ${BACKUP_DIR}
docker-compose exec mongodb mongodump --out /tmp/backup_${DATE}
docker cp $(docker-compose ps -q mongodb):/tmp/backup_${DATE} ${BACKUP_DIR}/

# Pull latest images
echo "Pulling latest Docker images..."
docker-compose pull

# Stop services
echo "Stopping services..."
docker-compose down

# Start services with new images
echo "Starting services with new images..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 30

# Health check
echo "Performing health checks..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Frontend health check passed"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

if curl -f http://localhost/api/health > /dev/null 2>&1; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
    exit 1
fi

# Clean up old images and containers
echo "Cleaning up..."
docker system prune -f

echo "✅ Deployment completed successfully!"

# Send notification (optional)
# curl -X POST -H 'Content-type: application/json' \
#   --data '{"text":"Loan Management System deployed successfully"}' \
#   YOUR_SLACK_WEBHOOK_URL