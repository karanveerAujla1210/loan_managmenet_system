# AWS Deployment Guide - Business Loan CRM

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Account                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              CloudFront (CDN)                        │  │
│  │         (Static assets + caching)                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Application Load Balancer (ALB)              │  │
│  │         (HTTPS + SSL/TLS termination)                │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │    EC2 Auto Scaling Group (Node.js Backend)          │  │
│  │  ┌────────────────┐  ┌────────────────┐              │  │
│  │  │  EC2 Instance  │  │  EC2 Instance  │              │  │
│  │  │  (Backend API) │  │  (Backend API) │              │  │
│  │  └────────────────┘  └────────────────┘              │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         RDS MongoDB (DocumentDB)                     │  │
│  │    (Multi-AZ for high availability)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      ElastiCache (Redis)                             │  │
│  │   (Cron coordination + caching)                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         CloudWatch (Monitoring & Logs)               │  │
│  │         SNS (Alerts & Notifications)                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Pre-Deployment Setup

### 1.1 AWS Account & IAM Setup

```bash
# Create IAM user for deployment
# AWS Console → IAM → Users → Create User

# Attach policies:
# - AmazonEC2FullAccess
# - AmazonRDSFullAccess
# - AmazonElastiCacheFullAccess
# - CloudFrontFullAccess
# - CloudWatchFullAccess
# - SNSFullAccess
# - S3FullAccess (for backups)

# Generate Access Keys
# AWS Console → IAM → Users → [Your User] → Security Credentials → Create Access Key
```

### 1.2 Install AWS CLI & Configure

```bash
# Install AWS CLI
# Windows: https://awscli.amazonaws.com/AWSCLIV2.msi
# macOS: brew install awscli
# Linux: sudo apt-get install awscli

# Configure credentials
aws configure
# Enter Access Key ID
# Enter Secret Access Key
# Default region: ap-south-1 (or your region)
# Default output format: json
```

### 1.3 Create S3 Bucket for Backups

```bash
aws s3 mb s3://loan-crm-backups-$(date +%s) --region ap-south-1
aws s3api put-bucket-versioning \
  --bucket loan-crm-backups-$(date +%s) \
  --versioning-configuration Status=Enabled
```

---

## Phase 2: Database Setup (AWS DocumentDB)

### 2.1 Create DocumentDB Cluster

```bash
# AWS Console → DocumentDB → Create Cluster

# Configuration:
# - Cluster identifier: loan-crm-prod
# - Engine version: 4.0 (MongoDB compatible)
# - Instance class: db.t3.medium (start small, scale later)
# - Number of instances: 2 (Multi-AZ)
# - Storage: 100 GB (auto-scaling enabled)
# - Backup retention: 7 days
# - Encryption: Enable (KMS)
# - VPC: Default or custom
# - Security group: Create new (allow port 27017)
```

### 2.2 Configure Security Group

```bash
# AWS Console → EC2 → Security Groups → Create

# Inbound Rules:
# - Type: MongoDB
#   Protocol: TCP
#   Port: 27017
#   Source: Your EC2 security group

# Outbound Rules:
# - All traffic allowed
```

### 2.3 Get Connection String

```bash
# AWS Console → DocumentDB → Clusters → loan-crm-prod
# Copy the connection string (looks like):
# mongodb://username:password@cluster-endpoint:27017/?ssl=true&replicaSet=rs0&retryWrites=false
```

---

## Phase 3: Cache Setup (ElastiCache Redis)

### 3.1 Create Redis Cluster

```bash
# AWS Console → ElastiCache → Create Redis Cluster

# Configuration:
# - Cluster name: loan-crm-redis
# - Engine version: 7.0
# - Node type: cache.t3.micro (start small)
# - Number of replicas: 1 (Multi-AZ)
# - Automatic failover: Enabled
# - Encryption: Enable (in-transit + at-rest)
# - VPC: Same as DocumentDB
# - Security group: Create new (allow port 6379)
```

### 3.2 Get Redis Endpoint

```bash
# AWS Console → ElastiCache → Clusters → loan-crm-redis
# Copy Primary Endpoint (looks like):
# loan-crm-redis.abc123.ng.0001.aps1.cache.amazonaws.com:6379
```

---

## Phase 4: Compute Setup (EC2 + Auto Scaling)

### 4.1 Create EC2 Key Pair

```bash
# AWS Console → EC2 → Key Pairs → Create Key Pair
# Name: loan-crm-prod-key
# Type: RSA
# Format: .pem (for Linux/Mac) or .ppk (for PuTTY)

# Save securely:
chmod 400 loan-crm-prod-key.pem
```

### 4.2 Create AMI (Amazon Machine Image)

```bash
# Launch EC2 instance (t3.small)
# - AMI: Ubuntu 22.04 LTS
# - Key pair: loan-crm-prod-key
# - Security group: Create new (allow 22, 80, 443, 5000)
# - Storage: 30 GB gp3

# SSH into instance
ssh -i loan-crm-prod-key.pem ubuntu@<instance-ip>

# Install dependencies
sudo apt-get update
sudo apt-get install -y nodejs npm git docker.io

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version  # v18.x.x
npm --version   # 8.x.x
```

### 4.3 Deploy Backend on EC2

```bash
# Clone repository
git clone https://github.com/your-org/loan-management-system.git
cd loan-management-system/backend

# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=5000

MONGODB_URI=mongodb://username:password@cluster-endpoint:27017/?ssl=true&replicaSet=rs0&retryWrites=false
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRY=8h

CRON_ENABLED=true

REDIS_URL=redis://loan-crm-redis.abc123.ng.0001.aps1.cache.amazonaws.com:6379

LOG_LEVEL=info

CORS_ORIGIN=https://your-domain.com
EOF

# Install dependencies
npm ci --production

# Start backend
npm start

# Verify
curl http://localhost:5000/api/v1/health
```

### 4.4 Setup PM2 for Process Management

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create ecosystem.config.js
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
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Verify
pm2 status
```

### 4.5 Create AMI from Instance

```bash
# AWS Console → EC2 → Instances → [Your Instance]
# Right-click → Image and templates → Create image
# Name: loan-crm-backend-v1
# Wait for completion
```

### 4.6 Create Launch Template

```bash
# AWS Console → EC2 → Launch Templates → Create Launch Template

# Configuration:
# - Name: loan-crm-backend-template
# - AMI: loan-crm-backend-v1
# - Instance type: t3.small
# - Key pair: loan-crm-prod-key
# - Security group: Your backend security group
# - IAM instance profile: Create role with CloudWatch + S3 access
# - User data script:
```

**User Data Script:**
```bash
#!/bin/bash
cd /home/ubuntu/loan-management-system/backend
pm2 start ecosystem.config.js
pm2 save
```

### 4.7 Create Auto Scaling Group

```bash
# AWS Console → EC2 → Auto Scaling Groups → Create Auto Scaling Group

# Configuration:
# - Name: loan-crm-asg
# - Launch template: loan-crm-backend-template
# - VPC: Default
# - Subnets: Select 2+ (Multi-AZ)
# - Load balancer: Create new (see next section)
# - Min capacity: 2
# - Desired capacity: 2
# - Max capacity: 4
# - Health check type: ELB
# - Health check grace period: 300 seconds
```

---

## Phase 5: Load Balancing & SSL

### 5.1 Create Application Load Balancer

```bash
# AWS Console → EC2 → Load Balancers → Create Load Balancer

# Configuration:
# - Type: Application Load Balancer
# - Name: loan-crm-alb
# - Scheme: Internet-facing
# - IP address type: IPv4
# - VPC: Default
# - Subnets: Select 2+ (Multi-AZ)
# - Security group: Create new (allow 80, 443)
```

### 5.2 Create Target Group

```bash
# AWS Console → EC2 → Target Groups → Create Target Group

# Configuration:
# - Name: loan-crm-backend-tg
# - Protocol: HTTP
# - Port: 5000
# - VPC: Default
# - Health check path: /api/v1/health
# - Health check interval: 30 seconds
# - Healthy threshold: 2
# - Unhealthy threshold: 3
```

### 5.3 Add SSL Certificate

```bash
# AWS Console → Certificate Manager → Request Certificate

# Configuration:
# - Domain name: your-domain.com
# - Validation method: DNS
# - Add to Route 53 (if using Route 53)
# - Wait for validation

# Attach to ALB:
# - ALB → Listeners → Add listener
# - Protocol: HTTPS
# - Port: 443
# - Certificate: Your certificate
# - Default action: Forward to target group
```

### 5.4 Redirect HTTP to HTTPS

```bash
# ALB → Listeners → HTTP (80)
# Edit → Default action → Redirect
# Protocol: HTTPS
# Port: 443
# Status code: 301
```

---

## Phase 6: Frontend Deployment (CloudFront + S3)

### 6.1 Build Frontend

```bash
cd frontend
npm run build
# Output: dist/
```

### 6.2 Create S3 Bucket for Frontend

```bash
aws s3 mb s3://loan-crm-frontend-$(date +%s) --region ap-south-1

# Enable static website hosting
aws s3 website s3://loan-crm-frontend-$(date +%s) \
  --index-document index.html \
  --error-document index.html
```

### 6.3 Upload Frontend to S3

```bash
aws s3 sync dist/ s3://loan-crm-frontend-$(date +%s)/ \
  --delete \
  --cache-control "max-age=31536000,public" \
  --exclude "index.html"

aws s3 cp dist/index.html s3://loan-crm-frontend-$(date +%s)/index.html \
  --cache-control "max-age=0,no-cache,no-store,must-revalidate" \
  --content-type "text/html"
```

### 6.4 Create CloudFront Distribution

```bash
# AWS Console → CloudFront → Create Distribution

# Configuration:
# - Origin domain: Your S3 bucket
# - Origin access: Create OAC (Origin Access Control)
# - Viewer protocol policy: Redirect HTTP to HTTPS
# - Allowed HTTP methods: GET, HEAD, OPTIONS
# - Cache policy: Managed-CachingOptimized
# - Origin request policy: CORS-S3Origin
# - Compress objects automatically: Yes
# - Default root object: index.html
# - Custom error responses:
#   - 404 → /index.html (200)
#   - 403 → /index.html (200)
# - Alternate domain names: your-domain.com, www.your-domain.com
# - SSL certificate: Your ACM certificate
```

### 6.5 Update Route 53 DNS

```bash
# AWS Console → Route 53 → Hosted Zones → your-domain.com

# Create records:
# - Type: A (Alias)
#   Name: your-domain.com
#   Alias target: CloudFront distribution
#   Routing policy: Simple

# - Type: A (Alias)
#   Name: www.your-domain.com
#   Alias target: CloudFront distribution
#   Routing policy: Simple
```

---

## Phase 7: Monitoring & Logging

### 7.1 CloudWatch Logs

```bash
# AWS Console → CloudWatch → Log Groups → Create Log Group

# Create log groups:
# - /aws/ec2/loan-crm-backend
# - /aws/rds/loan-crm-db
# - /aws/elasticache/loan-crm-redis
```

### 7.2 CloudWatch Alarms

```bash
# AWS Console → CloudWatch → Alarms → Create Alarm

# CPU Utilization
# - Metric: EC2 CPU Utilization
# - Threshold: > 80%
# - Action: SNS notification

# Database Connections
# - Metric: DocumentDB Connections
# - Threshold: > 100
# - Action: SNS notification

# Redis Memory
# - Metric: ElastiCache Memory Usage
# - Threshold: > 80%
# - Action: SNS notification
```

### 7.3 SNS Notifications

```bash
# AWS Console → SNS → Topics → Create Topic

# Name: loan-crm-alerts
# Create subscription:
# - Protocol: Email
# - Endpoint: your-email@company.com
# - Confirm subscription
```

---

## Phase 8: Backup & Disaster Recovery

### 8.1 DocumentDB Automated Backups

```bash
# AWS Console → DocumentDB → Clusters → loan-crm-prod
# Backup retention period: 7 days
# Backup window: 03:00 UTC
# Copy backups to another region: Enabled
```

### 8.2 Manual Backup Script

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/$(date +%Y-%m-%d)"
mkdir -p $BACKUP_DIR

# Backup DocumentDB
mongodump \
  --uri="mongodb://username:password@cluster-endpoint:27017/?ssl=true&replicaSet=rs0&retryWrites=false" \
  --out=$BACKUP_DIR/mongodb

# Upload to S3
aws s3 sync $BACKUP_DIR s3://loan-crm-backups/$(date +%Y-%m-%d)/

# Cleanup old backups (keep 30 days)
find /backups -type d -mtime +30 -exec rm -rf {} \;
```

### 8.3 Schedule Backup Cron

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /home/ubuntu/backup.sh >> /var/log/backup.log 2>&1
```

---

## Phase 9: Security Hardening

### 9.1 Security Group Rules

```bash
# Backend Security Group
# Inbound:
#   - HTTP (80): From ALB security group
#   - HTTPS (443): From ALB security group
#   - SSH (22): From your IP only
# Outbound:
#   - All traffic

# Database Security Group
# Inbound:
#   - MongoDB (27017): From Backend security group
# Outbound:
#   - All traffic

# Redis Security Group
# Inbound:
#   - Redis (6379): From Backend security group
# Outbound:
#   - All traffic
```

### 9.2 IAM Roles & Policies

```bash
# Create role for EC2 instances
aws iam create-role --role-name loan-crm-ec2-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ec2.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

# Attach policies
aws iam attach-role-policy --role-name loan-crm-ec2-role \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy

aws iam attach-role-policy --role-name loan-crm-ec2-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
```

### 9.3 Secrets Manager

```bash
# Store sensitive data
aws secretsmanager create-secret \
  --name loan-crm/prod/jwt-secret \
  --secret-string "$(openssl rand -base64 32)"

aws secretsmanager create-secret \
  --name loan-crm/prod/db-password \
  --secret-string "your-secure-password"

# Retrieve in application
aws secretsmanager get-secret-value \
  --secret-id loan-crm/prod/jwt-secret
```

---

## Phase 10: Deployment Automation (CI/CD)

### 10.1 GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1

      - name: Build and push backend
        run: |
          aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin ${{ secrets.AWS_ECR_REGISTRY }}
          docker build -t loan-crm-backend:latest backend/
          docker tag loan-crm-backend:latest ${{ secrets.AWS_ECR_REGISTRY }}/loan-crm-backend:latest
          docker push ${{ secrets.AWS_ECR_REGISTRY }}/loan-crm-backend:latest

      - name: Build and deploy frontend
        run: |
          cd frontend
          npm ci
          npm run build
          aws s3 sync dist/ s3://${{ secrets.AWS_S3_BUCKET }}/ --delete

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.AWS_CLOUDFRONT_ID }} \
            --paths "/*"
```

---

## Phase 11: Post-Deployment Verification

### 11.1 Health Checks

```bash
# Backend API
curl https://your-domain.com/api/v1/health

# Frontend
curl https://your-domain.com/

# Database connectivity
# Check CloudWatch logs for connection errors

# Redis connectivity
# Check ElastiCache metrics
```

### 11.2 Load Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test backend
ab -n 1000 -c 10 https://your-domain.com/api/v1/health

# Monitor in CloudWatch
# - CPU utilization
# - Network throughput
# - Database connections
```

### 11.3 Smoke Tests

```bash
# Test critical flows
# 1. Login
# 2. View dashboard
# 3. Create loan
# 4. Record payment
# 5. View reports
```

---

## Phase 12: Cost Optimization

### 12.1 Reserved Instances

```bash
# AWS Console → EC2 → Reserved Instances → Purchase Reserved Instances
# - Instance type: t3.small
# - Term: 1 year (33% savings)
# - Payment option: All upfront
```

### 12.2 Auto Scaling Policies

```bash
# AWS Console → Auto Scaling Groups → Scaling policies

# Target tracking scaling:
# - Metric: CPU Utilization
# - Target value: 70%
# - Scale-out cooldown: 300 seconds
# - Scale-in cooldown: 300 seconds
```

### 12.3 Cost Monitoring

```bash
# AWS Console → Cost Explorer
# - Set up budget alerts
# - Monitor daily costs
# - Review unused resources monthly
```

---

## Troubleshooting

### Backend not starting
```bash
# SSH into EC2
ssh -i loan-crm-prod-key.pem ubuntu@<instance-ip>

# Check PM2 logs
pm2 logs loan-crm-api

# Check system logs
sudo journalctl -u pm2-ubuntu -n 50
```

### Database connection issues
```bash
# Test connection
mongosh "mongodb://username:password@cluster-endpoint:27017/?ssl=true&replicaSet=rs0&retryWrites=false"

# Check security groups
# Verify DocumentDB security group allows EC2 security group
```

### Frontend not loading
```bash
# Check CloudFront distribution
aws cloudfront get-distribution --id <distribution-id>

# Check S3 bucket permissions
aws s3api get-bucket-policy --bucket <bucket-name>

# Invalidate cache
aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"
```

---

## Maintenance Schedule

| Task | Frequency | Owner |
|------|-----------|-------|
| Database backups | Daily | Automated |
| Security patches | Weekly | DevOps |
| Cost review | Monthly | Finance |
| Disaster recovery test | Quarterly | DevOps |
| SSL certificate renewal | Annually | DevOps |

---

## Support & Escalation

- **AWS Support**: https://console.aws.amazon.com/support/
- **Documentation**: https://docs.aws.amazon.com/
- **Community**: https://forums.aws.amazon.com/

