# AWS Deployment Quick Start (30 Minutes)

## Prerequisites
- AWS Account with billing enabled
- AWS CLI installed and configured
- Docker installed locally
- Git repository pushed to GitHub

---

## 5-Step Deployment

### Step 1: Create AWS Resources (10 min)

```bash
# 1. Create DocumentDB cluster
aws docdb create-db-cluster \
  --db-cluster-identifier loan-crm-prod \
  --engine docdb \
  --master-username admin \
  --master-user-password "YourSecurePassword123!" \
  --backup-retention-period 7 \
  --storage-encrypted \
  --region ap-south-1

# 2. Create ElastiCache Redis
aws elasticache create-cache-cluster \
  --cache-cluster-id loan-crm-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --region ap-south-1

# 3. Create S3 bucket for frontend
aws s3 mb s3://loan-crm-frontend-$(date +%s) --region ap-south-1
```

### Step 2: Prepare Environment Variables (5 min)

Create `.env.production` in backend:

```bash
NODE_ENV=production
PORT=5000

# Get from DocumentDB
MONGODB_URI=mongodb://admin:YourSecurePassword123!@cluster-endpoint:27017/?ssl=true&replicaSet=rs0&retryWrites=false

# Generate new secret
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRY=8h

CRON_ENABLED=true

# Get from ElastiCache
REDIS_URL=redis://loan-crm-redis.abc123.ng.0001.aps1.cache.amazonaws.com:6379

LOG_LEVEL=info
CORS_ORIGIN=https://your-domain.com
```

### Step 3: Build & Push Docker Images (10 min)

```bash
# Login to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.ap-south-1.amazonaws.com

# Build images
docker build -t loan-crm-backend:latest -f backend/Dockerfile.prod backend/
docker build -t loan-crm-frontend:latest -f frontend/Dockerfile.prod frontend/

# Push to ECR
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
docker tag loan-crm-backend:latest $ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/loan-crm-backend:latest
docker tag loan-crm-frontend:latest $ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/loan-crm-frontend:latest

docker push $ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/loan-crm-backend:latest
docker push $ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/loan-crm-frontend:latest
```

### Step 4: Deploy to ECS (5 min)

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name loan-crm-prod --region ap-south-1

# Register task definitions (use AWS Console or CLI)
# Then create services pointing to your images
```

### Step 5: Verify Deployment (5 min)

```bash
# Get ALB endpoint
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --query "LoadBalancers[0].DNSName" \
  --output text \
  --region ap-south-1)

# Test backend
curl http://$ALB_DNS/api/v1/health

# Test frontend
curl http://$ALB_DNS/
```

---

## Minimal AWS Architecture

```
┌─────────────────────────────────────────┐
│         CloudFront (Optional)           │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    Application Load Balancer (ALB)      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    ECS Fargate (Backend + Frontend)     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    DocumentDB (MongoDB Compatible)      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    ElastiCache (Redis)                  │
└─────────────────────────────────────────┘
```

---

## Cost Estimate (Monthly)

| Service | Instance | Cost |
|---------|----------|------|
| DocumentDB | db.t3.small (2 nodes) | $150 |
| ElastiCache | cache.t3.micro | $20 |
| ECS Fargate | 2 vCPU, 4GB RAM | $80 |
| ALB | 1 ALB | $20 |
| Data Transfer | 100GB | $10 |
| **Total** | | **~$280/month** |

---

## Troubleshooting

### Images not pushing to ECR
```bash
# Verify ECR repository exists
aws ecr describe-repositories --region ap-south-1

# Create if missing
aws ecr create-repository --repository-name loan-crm-backend --region ap-south-1
```

### Database connection timeout
```bash
# Check security group
aws ec2 describe-security-groups --region ap-south-1

# Verify DocumentDB is running
aws docdb describe-db-clusters --region ap-south-1
```

### ECS tasks not starting
```bash
# Check task logs
aws ecs describe-tasks \
  --cluster loan-crm-prod \
  --tasks <task-arn> \
  --region ap-south-1

# View CloudWatch logs
aws logs tail /ecs/loan-crm-backend --follow --region ap-south-1
```

---

## Next Steps

1. **Setup CI/CD**: Use GitHub Actions to auto-deploy on push
2. **Add SSL**: Request ACM certificate and attach to ALB
3. **Setup Monitoring**: Create CloudWatch dashboards and alarms
4. **Backup Strategy**: Enable automated backups for DocumentDB
5. **Scale**: Adjust ECS task count and DocumentDB instance size

---

## Support

- AWS Documentation: https://docs.aws.amazon.com/
- ECS Guide: https://docs.aws.amazon.com/ecs/
- DocumentDB: https://docs.aws.amazon.com/documentdb/
- ElastiCache: https://docs.aws.amazon.com/elasticache/
