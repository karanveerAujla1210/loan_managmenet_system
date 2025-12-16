#!/bin/bash

# AWS CLI Commands Reference for Business Loan CRM
# Copy and paste commands as needed

REGION="ap-south-1"
ENVIRONMENT="production"

echo "=========================================="
echo "AWS CLI Commands Reference"
echo "=========================================="

# ==========================================
# 1. ACCOUNT & AUTHENTICATION
# ==========================================

echo ""
echo "1. ACCOUNT & AUTHENTICATION"
echo "=========================================="

# Get account ID
echo "# Get AWS Account ID"
echo "aws sts get-caller-identity --query Account --output text"

# Get current user
echo ""
echo "# Get current IAM user"
echo "aws sts get-caller-identity"

# Configure AWS CLI
echo ""
echo "# Configure AWS CLI"
echo "aws configure"

# ==========================================
# 2. DOCUMENTDB (DATABASE)
# ==========================================

echo ""
echo "2. DOCUMENTDB (DATABASE)"
echo "=========================================="

# Create DocumentDB cluster
echo "# Create DocumentDB cluster"
echo "aws docdb create-db-cluster \\"
echo "  --db-cluster-identifier loan-crm-prod \\"
echo "  --engine docdb \\"
echo "  --master-username admin \\"
echo "  --master-user-password 'YourSecurePassword123!' \\"
echo "  --backup-retention-period 7 \\"
echo "  --storage-encrypted \\"
echo "  --region $REGION"

# List DocumentDB clusters
echo ""
echo "# List DocumentDB clusters"
echo "aws docdb describe-db-clusters --region $REGION"

# Get DocumentDB endpoint
echo ""
echo "# Get DocumentDB endpoint"
echo "aws docdb describe-db-clusters \\"
echo "  --query 'DBClusters[0].Endpoint' \\"
echo "  --output text \\"
echo "  --region $REGION"

# Delete DocumentDB cluster
echo ""
echo "# Delete DocumentDB cluster (with final snapshot)"
echo "aws docdb delete-db-cluster \\"
echo "  --db-cluster-identifier loan-crm-prod \\"
echo "  --final-db-snapshot-identifier loan-crm-final-snapshot \\"
echo "  --region $REGION"

# ==========================================
# 3. ELASTICACHE (REDIS)
# ==========================================

echo ""
echo "3. ELASTICACHE (REDIS)"
echo "=========================================="

# Create Redis cluster
echo "# Create ElastiCache Redis cluster"
echo "aws elasticache create-cache-cluster \\"
echo "  --cache-cluster-id loan-crm-redis \\"
echo "  --cache-node-type cache.t3.micro \\"
echo "  --engine redis \\"
echo "  --engine-version 7.0 \\"
echo "  --num-cache-nodes 1 \\"
echo "  --region $REGION"

# List Redis clusters
echo ""
echo "# List ElastiCache clusters"
echo "aws elasticache describe-cache-clusters --region $REGION"

# Get Redis endpoint
echo ""
echo "# Get Redis endpoint"
echo "aws elasticache describe-cache-clusters \\"
echo "  --query 'CacheClusters[0].CacheNodes[0].Endpoint' \\"
echo "  --output text \\"
echo "  --region $REGION"

# Delete Redis cluster
echo ""
echo "# Delete ElastiCache cluster"
echo "aws elasticache delete-cache-cluster \\"
echo "  --cache-cluster-id loan-crm-redis \\"
echo "  --region $REGION"

# ==========================================
# 4. S3 (STORAGE)
# ==========================================

echo ""
echo "4. S3 (STORAGE)"
echo "=========================================="

# Create S3 bucket
echo "# Create S3 bucket"
echo "aws s3 mb s3://loan-crm-frontend-\$(date +%s) --region $REGION"

# List S3 buckets
echo ""
echo "# List S3 buckets"
echo "aws s3 ls"

# Upload files to S3
echo ""
echo "# Upload frontend build to S3"
echo "aws s3 sync dist/ s3://loan-crm-frontend/ --delete"

# Enable versioning
echo ""
echo "# Enable S3 versioning"
echo "aws s3api put-bucket-versioning \\"
echo "  --bucket loan-crm-frontend \\"
echo "  --versioning-configuration Status=Enabled"

# Delete S3 bucket
echo ""
echo "# Delete S3 bucket (must be empty)"
echo "aws s3 rb s3://loan-crm-frontend"

# ==========================================
# 5. ECR (CONTAINER REGISTRY)
# ==========================================

echo ""
echo "5. ECR (CONTAINER REGISTRY)"
echo "=========================================="

# Get ECR login
echo "# Login to ECR"
echo "aws ecr get-login-password --region $REGION | \\"
echo "  docker login --username AWS --password-stdin \$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com"

# Create ECR repository
echo ""
echo "# Create ECR repository"
echo "aws ecr create-repository \\"
echo "  --repository-name loan-crm-backend \\"
echo "  --region $REGION"

# List ECR repositories
echo ""
echo "# List ECR repositories"
echo "aws ecr describe-repositories --region $REGION"

# Push image to ECR
echo ""
echo "# Push Docker image to ECR"
echo "ACCOUNT_ID=\$(aws sts get-caller-identity --query Account --output text)"
echo "docker tag loan-crm-backend:latest \$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/loan-crm-backend:latest"
echo "docker push \$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/loan-crm-backend:latest"

# ==========================================
# 6. ECS (CONTAINER ORCHESTRATION)
# ==========================================

echo ""
echo "6. ECS (CONTAINER ORCHESTRATION)"
echo "=========================================="

# Create ECS cluster
echo "# Create ECS cluster"
echo "aws ecs create-cluster \\"
echo "  --cluster-name loan-crm-$ENVIRONMENT \\"
echo "  --region $REGION"

# List ECS clusters
echo ""
echo "# List ECS clusters"
echo "aws ecs list-clusters --region $REGION"

# List ECS services
echo ""
echo "# List ECS services"
echo "aws ecs list-services \\"
echo "  --cluster loan-crm-$ENVIRONMENT \\"
echo "  --region $REGION"

# Update ECS service
echo ""
echo "# Update ECS service (force new deployment)"
echo "aws ecs update-service \\"
echo "  --cluster loan-crm-$ENVIRONMENT \\"
echo "  --service loan-crm-backend \\"
echo "  --force-new-deployment \\"
echo "  --region $REGION"

# View ECS task logs
echo ""
echo "# View ECS task logs"
echo "aws logs tail /ecs/loan-crm-backend --follow --region $REGION"

# ==========================================
# 7. ALB (LOAD BALANCER)
# ==========================================

echo ""
echo "7. ALB (LOAD BALANCER)"
echo "=========================================="

# List load balancers
echo "# List Application Load Balancers"
echo "aws elbv2 describe-load-balancers --region $REGION"

# Get ALB DNS name
echo ""
echo "# Get ALB DNS name"
echo "aws elbv2 describe-load-balancers \\"
echo "  --query 'LoadBalancers[0].DNSName' \\"
echo "  --output text \\"
echo "  --region $REGION"

# List target groups
echo ""
echo "# List target groups"
echo "aws elbv2 describe-target-groups --region $REGION"

# ==========================================
# 8. CLOUDFRONT (CDN)
# ==========================================

echo ""
echo "8. CLOUDFRONT (CDN)"
echo "=========================================="

# List CloudFront distributions
echo "# List CloudFront distributions"
echo "aws cloudfront list-distributions"

# Create invalidation
echo ""
echo "# Invalidate CloudFront cache"
echo "aws cloudfront create-invalidation \\"
echo "  --distribution-id XXXXX \\"
echo "  --paths '/*'"

# ==========================================
# 9. CLOUDWATCH (MONITORING)
# ==========================================

echo ""
echo "9. CLOUDWATCH (MONITORING)"
echo "=========================================="

# List log groups
echo "# List CloudWatch log groups"
echo "aws logs describe-log-groups --region $REGION"

# View logs
echo ""
echo "# View CloudWatch logs (real-time)"
echo "aws logs tail /ecs/loan-crm-backend --follow --region $REGION"

# Create alarm
echo ""
echo "# Create CloudWatch alarm"
echo "aws cloudwatch put-metric-alarm \\"
echo "  --alarm-name loan-crm-cpu-high \\"
echo "  --alarm-description 'Alert when CPU > 80%' \\"
echo "  --metric-name CPUUtilization \\"
echo "  --namespace AWS/ECS \\"
echo "  --statistic Average \\"
echo "  --period 300 \\"
echo "  --threshold 80 \\"
echo "  --comparison-operator GreaterThanThreshold \\"
echo "  --region $REGION"

# ==========================================
# 10. ROUTE 53 (DNS)
# ==========================================

echo ""
echo "10. ROUTE 53 (DNS)"
echo "=========================================="

# List hosted zones
echo "# List Route 53 hosted zones"
echo "aws route53 list-hosted-zones"

# List DNS records
echo ""
echo "# List DNS records in hosted zone"
echo "aws route53 list-resource-record-sets \\"
echo "  --hosted-zone-id XXXXX"

# ==========================================
# 11. CERTIFICATE MANAGER (SSL)
# ==========================================

echo ""
echo "11. CERTIFICATE MANAGER (SSL)"
echo "=========================================="

# List certificates
echo "# List ACM certificates"
echo "aws acm list-certificates --region $REGION"

# Request certificate
echo ""
echo "# Request SSL certificate"
echo "aws acm request-certificate \\"
echo "  --domain-name your-domain.com \\"
echo "  --validation-method DNS \\"
echo "  --region $REGION"

# ==========================================
# 12. SECRETS MANAGER
# ==========================================

echo ""
echo "12. SECRETS MANAGER"
echo "=========================================="

# Create secret
echo "# Create secret"
echo "aws secretsmanager create-secret \\"
echo "  --name loan-crm/prod/jwt-secret \\"
echo "  --secret-string 'your-secret-value' \\"
echo "  --region $REGION"

# Get secret
echo ""
echo "# Get secret value"
echo "aws secretsmanager get-secret-value \\"
echo "  --secret-id loan-crm/prod/jwt-secret \\"
echo "  --region $REGION"

# ==========================================
# 13. COST MANAGEMENT
# ==========================================

echo ""
echo "13. COST MANAGEMENT"
echo "=========================================="

# Get cost and usage
echo "# Get AWS costs (last 7 days)"
echo "aws ce get-cost-and-usage \\"
echo "  --time-period Start=\$(date -d '7 days ago' +%Y-%m-%d),End=\$(date +%Y-%m-%d) \\"
echo "  --granularity DAILY \\"
echo "  --metrics BlendedCost \\"
echo "  --group-by Type=DIMENSION,Key=SERVICE"

# ==========================================
# 14. SECURITY GROUPS
# ==========================================

echo ""
echo "14. SECURITY GROUPS"
echo "=========================================="

# List security groups
echo "# List security groups"
echo "aws ec2 describe-security-groups --region $REGION"

# Create security group
echo ""
echo "# Create security group"
echo "aws ec2 create-security-group \\"
echo "  --group-name loan-crm-backend-sg \\"
echo "  --description 'Security group for loan CRM backend' \\"
echo "  --region $REGION"

# Add inbound rule
echo ""
echo "# Add inbound rule (allow port 5000)"
echo "aws ec2 authorize-security-group-ingress \\"
echo "  --group-id sg-XXXXX \\"
echo "  --protocol tcp \\"
echo "  --port 5000 \\"
echo "  --cidr 0.0.0.0/0 \\"
echo "  --region $REGION"

# ==========================================
# 15. BACKUP & RESTORE
# ==========================================

echo ""
echo "15. BACKUP & RESTORE"
echo "=========================================="

# Create DocumentDB snapshot
echo "# Create DocumentDB snapshot"
echo "aws docdb create-db-cluster-snapshot \\"
echo "  --db-cluster-snapshot-identifier loan-crm-backup-\$(date +%Y-%m-%d) \\"
echo "  --db-cluster-identifier loan-crm-prod \\"
echo "  --region $REGION"

# List snapshots
echo ""
echo "# List DocumentDB snapshots"
echo "aws docdb describe-db-cluster-snapshots --region $REGION"

# Restore from snapshot
echo ""
echo "# Restore DocumentDB from snapshot"
echo "aws docdb restore-db-cluster-from-snapshot \\"
echo "  --db-cluster-identifier loan-crm-restored \\"
echo "  --snapshot-identifier loan-crm-backup-2024-01-01 \\"
echo "  --engine docdb \\"
echo "  --region $REGION"

echo ""
echo "=========================================="
echo "End of Reference"
echo "=========================================="
