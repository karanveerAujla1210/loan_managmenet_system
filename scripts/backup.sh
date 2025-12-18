#!/bin/bash

BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.tar.gz"

mkdir -p $BACKUP_DIR

mongodump --out /tmp/mongodb_backup_$DATE
tar -czf $BACKUP_FILE -C /tmp mongodb_backup_$DATE
rm -rf /tmp/mongodb_backup_$DATE

find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
