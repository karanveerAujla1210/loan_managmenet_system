# Production Deployment Guide

## Prerequisites

1. **Server Requirements**
   - Ubuntu 20.04+ or CentOS 8+
   - 4GB+ RAM
   - 50GB+ storage
   - Docker & Docker Compose installed

2. **Domain & SSL**
   - Domain name configured
   - SSL certificate (Let's Encrypt recommended)

3. **External Services**
   - MongoDB Atlas (optional, for managed database)
   - SMTP service for emails
   - Cloud storage for backups (AWS S3, etc.)

## Quick Start

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd loan-management-system
```

### 2. Environment Configuration
```bash
# Copy and configure production environment
cp .env.production .env
nano .env

# Update the following variables:
# - MONGO_ROOT_PASSWORD
# - JWT_SECRET (minimum 32 characters)
# - SMTP credentials
# - Domain configuration
```

### 3. SSL Certificate Setup
```bash
# Create SSL directory
mkdir -p nginx/ssl

# Option 1: Let's Encrypt (recommended)
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem

# Option 2: Self-signed (development only)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem
```

### 4. Deploy Application
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Deploy using production compose
docker-compose -f docker-compose.prod.yml up -d

# Or use deployment script
./scripts/deploy.sh
```

### 5. Verify Deployment
```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Test endpoints
curl https://yourdomain.com/health
curl https://yourdomain.com/api/health
```

## Security Checklist

- [ ] Strong passwords for all services
- [ ] SSL/TLS certificates configured
- [ ] Firewall configured (ports 80, 443 only)
- [ ] Regular security updates
- [ ] Database authentication enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers enabled

## Monitoring Setup

### Access Monitoring Dashboards
- Prometheus: http://yourdomain.com:9090
- Grafana: http://yourdomain.com:3001 (admin/password from .env)

### Key Metrics to Monitor
- Application response time
- Database connections
- Memory usage
- Disk space
- Error rates
- Active users

## Backup Strategy

### Automated Backups
```bash
# Setup daily backup cron job
crontab -e

# Add this line for daily backup at 2 AM
0 2 * * * /opt/loan-management-system/scripts/backup.sh
```

### Manual Backup
```bash
# Run backup script
./scripts/backup.sh

# Restore from backup
mongorestore --host localhost:27017 \
  --username loanadmin --password your_password \
  --authenticationDatabase admin \
  /path/to/backup
```

## Maintenance

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and deploy
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Scale Services
```bash
# Scale backend instances
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB container status
   - Verify credentials in .env file
   - Check network connectivity

2. **SSL Certificate Issues**
   - Verify certificate files exist
   - Check certificate expiration
   - Ensure proper file permissions

3. **High Memory Usage**
   - Monitor with Grafana
   - Scale services if needed
   - Check for memory leaks

### Health Checks
```bash
# Backend health
curl https://yourdomain.com/api/health

# Database health
docker exec loan-mongodb-prod mongosh --eval "db.adminCommand('ping')"

# Redis health
docker exec loan-redis-prod redis-cli ping
```

## Performance Optimization

1. **Database Indexing**
   - Indexes are created automatically via mongo-init.js
   - Monitor slow queries in MongoDB logs

2. **Caching**
   - Redis caching is enabled for API responses
   - Configure cache TTL based on data patterns

3. **Load Balancing**
   - Use multiple backend instances
   - Configure nginx upstream for load balancing

## Support

For issues and support:
1. Check application logs
2. Review monitoring dashboards
3. Consult troubleshooting section
4. Contact development team