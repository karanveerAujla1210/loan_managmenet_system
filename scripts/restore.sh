#!/bin/bash

# Enhanced MongoDB Restore Script
set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file>"
    echo "Example: $0 ./backups/backup_20231201_120000.archive"
    exit 1
fi

BACKUP_FILE="$1"
DB_NAME="${MONGO_DB:-nbfc_loan_db}"
MONGO_USER="${MONGO_ROOT_USERNAME:-admin}"
MONGO_PASS="${MONGO_ROOT_PASSWORD:-password123}"
CONTAINER_NAME="${MONGO_CONTAINER:-mongo}"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file '$BACKUP_FILE' not found"
    exit 1
fi

echo "[$(date)] Starting MongoDB restore from: $BACKUP_FILE"

# Confirm restore operation
read -p "This will replace the existing database '$DB_NAME'. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore cancelled"
    exit 0
fi

# Check if running in Docker
if docker ps | grep -q $CONTAINER_NAME; then
    echo "[$(date)] Restoring using Docker container: $CONTAINER_NAME"
    docker cp "$BACKUP_FILE" $CONTAINER_NAME:/tmp/restore.archive
    docker exec $CONTAINER_NAME mongorestore \
        --username=$MONGO_USER \
        --password=$MONGO_PASS \
        --authenticationDatabase=admin \
        --db=$DB_NAME \
        --drop \
        --archive=/tmp/restore.archive \
        --gzip
    docker exec $CONTAINER_NAME rm /tmp/restore.archive
else
    echo "[$(date)] Restoring using local MongoDB"
    mongorestore \
        --username=$MONGO_USER \
        --password=$MONGO_PASS \
        --authenticationDatabase=admin \
        --db=$DB_NAME \
        --drop \
        --archive="$BACKUP_FILE" \
        --gzip
fi

echo "[$(date)] Restore completed successfully"