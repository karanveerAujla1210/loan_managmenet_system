#!/bin/bash

# Production Database Backup Script
# Run this script daily via cron job

set -e

# Configuration
BACKUP_DIR="/opt/backups/loan-management"
DATE=$(date +%Y%m%d_%H%M%S)
MONGO_HOST="localhost"
MONGO_PORT="27017"
MONGO_DB="loan_management_prod"
MONGO_USER="loanadmin"
MONGO_PASS="${MONGO_ROOT_PASSWORD}"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Create database backup
echo "Starting database backup..."
mongodump \
  --host ${MONGO_HOST}:${MONGO_PORT} \
  --db ${MONGO_DB} \
  --username ${MONGO_USER} \
  --password ${MONGO_PASS} \
  --authenticationDatabase admin \
  --out ${BACKUP_DIR}/db_backup_${DATE}

# Compress backup
echo "Compressing backup..."
tar -czf ${BACKUP_DIR}/db_backup_${DATE}.tar.gz -C ${BACKUP_DIR} db_backup_${DATE}
rm -rf ${BACKUP_DIR}/db_backup_${DATE}

# Remove backups older than 30 days
echo "Cleaning old backups..."
find ${BACKUP_DIR} -name "db_backup_*.tar.gz" -mtime +30 -delete

# Backup application files
echo "Backing up application files..."
tar -czf ${BACKUP_DIR}/app_backup_${DATE}.tar.gz \
  --exclude='node_modules' \
  --exclude='logs' \
  --exclude='.git' \
  /opt/loan-management-system

echo "Backup completed successfully: ${BACKUP_DIR}/db_backup_${DATE}.tar.gz"

# Optional: Upload to cloud storage (uncomment and configure)
# aws s3 cp ${BACKUP_DIR}/db_backup_${DATE}.tar.gz s3://your-backup-bucket/
# aws s3 cp ${BACKUP_DIR}/app_backup_${DATE}.tar.gz s3://your-backup-bucket/