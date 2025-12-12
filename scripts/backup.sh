#!/bin/bash

# Enhanced MongoDB Backup Script with Docker support
set -e

DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
DB_NAME="${MONGO_DB:-nbfc_loan_db}"
MONGO_USER="${MONGO_ROOT_USERNAME:-admin}"
MONGO_PASS="${MONGO_ROOT_PASSWORD:-password123}"
CONTAINER_NAME="${MONGO_CONTAINER:-mongo}"
RETENTION_DAYS=7

# Create backup directory
mkdir -p $BACKUP_DIR

echo "[$(date)] Starting MongoDB backup..."

# Check if running in Docker
if docker ps | grep -q $CONTAINER_NAME; then
    echo "[$(date)] Creating backup using Docker container: $CONTAINER_NAME"
    docker exec $CONTAINER_NAME mongodump \
        --username=$MONGO_USER \
        --password=$MONGO_PASS \
        --authenticationDatabase=admin \
        --db=$DB_NAME \
        --archive=/tmp/backup_$DATE.archive \
        --gzip
    
    docker cp $CONTAINER_NAME:/tmp/backup_$DATE.archive $BACKUP_DIR/
    docker exec $CONTAINER_NAME rm /tmp/backup_$DATE.archive
else
    echo "[$(date)] Creating backup using local MongoDB"
    mongodump \
        --username=$MONGO_USER \
        --password=$MONGO_PASS \
        --authenticationDatabase=admin \
        --db=$DB_NAME \
        --archive=$BACKUP_DIR/backup_$DATE.archive \
        --gzip
fi

# Cleanup old backups
echo "[$(date)] Cleaning up backups older than $RETENTION_DAYS days"
find $BACKUP_DIR -name "backup_*.archive" -mtime +$RETENTION_DAYS -delete

echo "[$(date)] Backup completed: $BACKUP_DIR/backup_$DATE.archive"
echo "[$(date)] Backup size: $(du -h $BACKUP_DIR/backup_$DATE.archive | cut -f1)"