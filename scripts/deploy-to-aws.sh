#!/bin/bash

# AWS Deployment Script for Business Loan CRM
# Usage: ./deploy-to-aws.sh [environment] [action]
# Example: ./deploy-to-aws.sh production deploy

set -e

ENVIRONMENT=${1:-staging}
ACTION=${2:-deploy}
REGION=${AWS_REGION:-ap-south-1}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
  log_error "Invalid environment: $ENVIRONMENT. Must be 'staging' or 'production'"
  exit 1
fi

log_info "Deploying to AWS ($ENVIRONMENT)"

# Step 1: Build Docker images
build_images() {
  log_info "Building Docker images..."

  # Backend
  docker build -t loan-crm-backend:${ENVIRONMENT} \
    -f backend/Dockerfile.prod \
    backend/

  # Frontend
  docker build -t loan-crm-frontend:${ENVIRONMENT} \
    -f frontend/Dockerfile.prod \
    frontend/

  log_info "Docker images built successfully"
}

# Step 2: Push to ECR
push_to_ecr() {
  log_info "Pushing images to ECR..."

  # Login to ECR
  aws ecr get-login-password --region ${REGION} | \
    docker login --username AWS --password-stdin ${ECR_REGISTRY}

  # Create repositories if they don't exist
  aws ecr describe-repositories --repository-names loan-crm-backend \
    --region ${REGION} 2>/dev/null || \
    aws ecr create-repository --repository-name loan-crm-backend --region ${REGION}

  aws ecr describe-repositories --repository-names loan-crm-frontend \
    --region ${REGION} 2>/dev/null || \
    aws ecr create-repository --repository-name loan-crm-frontend --region ${REGION}

  # Tag and push backend
  docker tag loan-crm-backend:${ENVIRONMENT} \
    ${ECR_REGISTRY}/loan-crm-backend:${ENVIRONMENT}
  docker tag loan-crm-backend:${ENVIRONMENT} \
    ${ECR_REGISTRY}/loan-crm-backend:latest
  docker push ${ECR_REGISTRY}/loan-crm-backend:${ENVIRONMENT}
  docker push ${ECR_REGISTRY}/loan-crm-backend:latest

  # Tag and push frontend
  docker tag loan-crm-frontend:${ENVIRONMENT} \
    ${ECR_REGISTRY}/loan-crm-frontend:${ENVIRONMENT}
  docker tag loan-crm-frontend:${ENVIRONMENT} \
    ${ECR_REGISTRY}/loan-crm-frontend:latest
  docker push ${ECR_REGISTRY}/loan-crm-frontend:${ENVIRONMENT}
  docker push ${ECR_REGISTRY}/loan-crm-frontend:latest

  log_info "Images pushed to ECR successfully"
}

# Step 3: Update ECS services
update_ecs_services() {
  log_info "Updating ECS services..."

  CLUSTER_NAME="loan-crm-${ENVIRONMENT}"
  BACKEND_SERVICE="loan-crm-backend-${ENVIRONMENT}"
  FRONTEND_SERVICE="loan-crm-frontend-${ENVIRONMENT}"

  # Update backend service
  aws ecs update-service \
    --cluster ${CLUSTER_NAME} \
    --service ${BACKEND_SERVICE} \
    --force-new-deployment \
    --region ${REGION}

  # Update frontend service
  aws ecs update-service \
    --cluster ${CLUSTER_NAME} \
    --service ${FRONTEND_SERVICE} \
    --force-new-deployment \
    --region ${REGION}

  log_info "ECS services updated"
}

# Step 4: Wait for deployment
wait_for_deployment() {
  log_info "Waiting for deployment to complete..."

  CLUSTER_NAME="loan-crm-${ENVIRONMENT}"
  BACKEND_SERVICE="loan-crm-backend-${ENVIRONMENT}"

  aws ecs wait services-stable \
    --cluster ${CLUSTER_NAME} \
    --services ${BACKEND_SERVICE} \
    --region ${REGION}

  log_info "Deployment completed successfully"
}

# Step 5: Run smoke tests
run_smoke_tests() {
  log_info "Running smoke tests..."

  # Get ALB endpoint
  ALB_DNS=$(aws elbv2 describe-load-balancers \
    --query "LoadBalancers[?contains(LoadBalancerName, 'loan-crm-${ENVIRONMENT}')].DNSName" \
    --output text \
    --region ${REGION})

  if [ -z "$ALB_DNS" ]; then
    log_warn "Could not find ALB endpoint"
    return
  fi

  # Test backend health
  log_info "Testing backend health at http://${ALB_DNS}/api/v1/health"
  if curl -f http://${ALB_DNS}/api/v1/health > /dev/null 2>&1; then
    log_info "Backend health check passed"
  else
    log_error "Backend health check failed"
    exit 1
  fi

  # Test frontend
  log_info "Testing frontend at http://${ALB_DNS}/"
  if curl -f http://${ALB_DNS}/ > /dev/null 2>&1; then
    log_info "Frontend health check passed"
  else
    log_error "Frontend health check failed"
    exit 1
  fi
}

# Step 6: Invalidate CloudFront cache
invalidate_cloudfront() {
  log_info "Invalidating CloudFront cache..."

  DISTRIBUTION_ID=$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?contains(Comment, 'loan-crm-${ENVIRONMENT}')].Id" \
    --output text)

  if [ -z "$DISTRIBUTION_ID" ]; then
    log_warn "Could not find CloudFront distribution"
    return
  fi

  aws cloudfront create-invalidation \
    --distribution-id ${DISTRIBUTION_ID} \
    --paths "/*"

  log_info "CloudFront cache invalidated"
}

# Main execution
case $ACTION in
  build)
    build_images
    ;;
  push)
    build_images
    push_to_ecr
    ;;
  deploy)
    build_images
    push_to_ecr
    update_ecs_services
    wait_for_deployment
    run_smoke_tests
    invalidate_cloudfront
    log_info "Deployment completed successfully!"
    ;;
  *)
    log_error "Invalid action: $ACTION. Must be 'build', 'push', or 'deploy'"
    exit 1
    ;;
esac
