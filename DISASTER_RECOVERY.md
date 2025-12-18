# Disaster Recovery Plan

## Backup Strategy

### Database Backups
```bash
# Automated daily at 2 AM
0 2 * * * /path/to/scripts/backup.sh

# Manual backup
./scripts/backup.sh

# Backup location
/backups/mongodb/

# Retention
Keep last 7 days
```

### Backup Verification
```bash
# List backups
ls -la /backups/mongodb/

# Verify backup integrity
tar -tzf /backups/mongodb/backup_YYYYMMDD_HHMMSS.tar.gz | head

# Test restore (monthly)
tar -xzf /backups/mongodb/backup_YYYYMMDD_HHMMSS.tar.gz -C /tmp
mongorestore /tmp/mongodb_backup_YYYYMMDD_HHMMSS
```

## Recovery Procedures

### Database Recovery
```bash
# Stop application
pm2 stop loan-api

# Restore from backup
tar -xzf /backups/mongodb/backup_YYYYMMDD_HHMMSS.tar.gz -C /tmp
mongorestore /tmp/mongodb_backup_YYYYMMDD_HHMMSS

# Restart application
pm2 start loan-api
```

### Application Recovery
```bash
# Redeploy from repository
cd /opt/loan-management-system
git pull origin main
cd backend && npm ci --production
cd ../frontend-unified && npm run build
pm2 restart loan-api
sudo systemctl reload nginx
```

### Full System Recovery
```bash
# 1. Launch new EC2 instance
# 2. Run deployment script
./scripts/deploy.sh your-domain.com

# 3. Restore database
./scripts/backup.sh  # Restore from backup

# 4. Verify
./scripts/monitor.sh
```

## RTO/RPO

| Component | RTO | RPO |
|-----------|-----|-----|
| Application | 15 min | 0 min |
| Database | 30 min | 24 hours |
| Full System | 1 hour | 24 hours |

## Testing Schedule

- **Weekly**: Backup verification
- **Monthly**: Test restore procedure
- **Quarterly**: Full disaster recovery drill

## Monitoring

### Backup Monitoring
```bash
# Check backup size
du -sh /backups/mongodb/

# Check backup age
find /backups/mongodb -name "backup_*.tar.gz" -mtime +1 -ls

# Alert if backup fails
# (Configure in monitoring system)
```

### Health Checks
```bash
# Run health check
./scripts/monitor.sh

# Check logs
pm2 logs loan-api
tail -f /var/log/nginx/error.log
```

## Incident Response

### Database Corruption
1. Stop application: `pm2 stop loan-api`
2. Restore from backup: See Database Recovery
3. Verify data: `mongosh --eval "db.stats()"`
4. Restart application: `pm2 start loan-api`

### Application Crash
1. Check logs: `pm2 logs loan-api`
2. Restart: `pm2 restart loan-api`
3. If persists, redeploy: See Application Recovery

### Server Failure
1. Launch new instance
2. Run deployment script
3. Restore database
4. Update DNS/ALB
5. Verify health

## Backup Storage

### Local Backups
- Location: `/backups/mongodb/`
- Retention: 7 days
- Size: ~100MB per backup

### Remote Backups (Optional)
```bash
# Upload to S3
aws s3 cp /backups/mongodb/backup_*.tar.gz s3://loan-crm-backups/

# Download from S3
aws s3 cp s3://loan-crm-backups/backup_*.tar.gz /tmp/
```

## Documentation

- Backup location: `/backups/mongodb/`
- Restore procedure: See above
- Contact: DevOps team
- Escalation: Engineering lead
