# Deployment Checklist

## Pre-Deployment
- [ ] AWS account created
- [ ] SSH key pair created
- [ ] SSL certificate obtained (ACM or Let's Encrypt)
- [ ] Domain registered and DNS configured
- [ ] Repository code pushed to main branch
- [ ] Read DEPLOYMENT_GUIDE.md

## Infrastructure
- [ ] VPC created
- [ ] Subnets created (2+ AZs)
- [ ] Internet Gateway attached
- [ ] Route tables configured
- [ ] Security groups created
- [ ] ALB created
- [ ] Target groups created

## EC2 Instances
- [ ] 2+ instances launched
- [ ] Ubuntu 22.04 LTS selected
- [ ] t3.medium or larger
- [ ] 50GB storage
- [ ] Key pair assigned
- [ ] Security group assigned
- [ ] User data script executed

## Application Setup
- [ ] Repository cloned
- [ ] Backend dependencies installed
- [ ] Frontend built
- [ ] Environment variables set
- [ ] PM2 configured
- [ ] Services started

## Database & Cache
- [ ] MongoDB installed and running
- [ ] Redis installed and running
- [ ] Database initialized
- [ ] Collections created
- [ ] Indexes created

## Web Server
- [ ] Nginx installed
- [ ] Configuration applied
- [ ] SSL certificate installed
- [ ] HTTP redirects to HTTPS
- [ ] Proxy rules configured

## SSL/TLS
- [ ] Certificate obtained
- [ ] Certificate installed
- [ ] Auto-renewal configured
- [ ] Certificate valid
- [ ] No SSL warnings

## Monitoring & Logging
- [ ] Health check script working
- [ ] PM2 monitoring enabled
- [ ] Logs configured
- [ ] Log rotation enabled
- [ ] CloudWatch alarms set (optional)

## Backup & Recovery
- [ ] Backup script created
- [ ] Cron job configured
- [ ] Backup location verified
- [ ] Retention policy set
- [ ] Test restore performed

## Security
- [ ] Firewall enabled (UFW)
- [ ] SSH hardened
- [ ] Password auth disabled
- [ ] Fail2Ban installed
- [ ] Security groups configured
- [ ] IAM roles configured

## Verification
- [ ] Frontend loads: https://your-domain.com
- [ ] API responds: https://your-domain.com/api
- [ ] Health check passes: ./scripts/monitor.sh
- [ ] PM2 processes running: pm2 status
- [ ] MongoDB responding: mongosh --eval "db.adminCommand('ping')"
- [ ] Redis responding: redis-cli ping
- [ ] Nginx running: sudo systemctl status nginx
- [ ] SSL certificate valid
- [ ] Backups working
- [ ] Monitoring enabled

## Post-Deployment
- [ ] Documentation updated
- [ ] Team trained
- [ ] Runbook created
- [ ] Disaster recovery tested
- [ ] Performance baseline established
- [ ] Monitoring alerts configured
- [ ] Backup verification scheduled
- [ ] Security audit completed

## Sign-Off
- [ ] Deployment approved
- [ ] All tests passed
- [ ] Ready for production
- [ ] Monitoring active
- [ ] Backups verified

**Deployed by:** ________________  
**Date:** ________________  
**Environment:** Production
