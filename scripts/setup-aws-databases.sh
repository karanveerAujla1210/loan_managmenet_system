#!/bin/bash

# Setup AWS DocumentDB and ElastiCache

set -e

echo "🚀 Setting up AWS Databases..."

# ==========================================
# CREATE DOCUMENTDB CLUSTER
# ==========================================

echo "Creating DocumentDB cluster..."

aws docdb create-db-cluster \
  --db-cluster-identifier loan-crm-prod \
  --engine docdb \
  --master-username admin \
  --master-user-password "YourSecurePassword123!" \
  --backup-retention-period 7 \
  --storage-encrypted \
  --region ap-south-1 \
  --db-subnet-group-name default \
  --vpc-security-group-ids sg-xxxxxxxx

echo "✓ DocumentDB cluster created"

# ==========================================
# CREATE DOCUMENTDB INSTANCE
# ==========================================

echo "Creating DocumentDB instance..."

aws docdb create-db-instance \
  --db-instance-identifier loan-crm-prod-instance-1 \
  --db-instance-class db.t3.small \
  --engine docdb \
  --db-cluster-identifier loan-crm-prod \
  --region ap-south-1

echo "✓ DocumentDB instance created"

# ==========================================
# CREATE ELASTICACHE REDIS
# ==========================================

echo "Creating ElastiCache Redis cluster..."

aws elasticache create-cache-cluster \
  --cache-cluster-id loan-crm-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --region ap-south-1

echo "✓ ElastiCache Redis cluster created"

# ==========================================
# GET CONNECTION STRINGS
# ==========================================

echo ""
echo "Waiting for resources to be ready..."
sleep 30

echo ""
echo "Getting connection strings..."

# Get DocumentDB endpoint
DOCDB_ENDPOINT=$(aws docdb describe-db-clusters \
  --db-cluster-identifier loan-crm-prod \
  --query 'DBClusters[0].Endpoint' \
  --output text \
  --region ap-south-1)

# Get Redis endpoint
REDIS_ENDPOINT=$(aws elasticache describe-cache-clusters \
  --cache-cluster-id loan-crm-redis \
  --show-cache-node-info \
  --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' \
  --output text \
  --region ap-south-1)

echo ""
echo "✅ AWS Databases Created Successfully!"
echo ""
echo "DocumentDB Connection String:"
echo "mongodb://admin:YourSecurePassword123@$DOCDB_ENDPOINT:27017/loan-management?ssl=true&replicaSet=rs0&retryWrites=false"
echo ""
echo "Redis Connection String:"
echo "redis://$REDIS_ENDPOINT:6379"
echo ""
echo "Update your .env file with these values"
