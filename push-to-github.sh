#!/bin/bash

# Push to GitHub Script

set -e

echo "🚀 Pushing to GitHub..."

# Configure git (if not already configured)
git config --global user.name "Loan CRM Deployment" 2>/dev/null || true
git config --global user.email "deployment@loanccrm.com" 2>/dev/null || true

# Add all files
git add -A

# Commit
git commit -m "Add AWS deployment package - EC2 + Docker + Scripts" || echo "Nothing to commit"

# Push to main branch
git push origin main

echo "✅ Pushed to GitHub successfully!"
echo ""
echo "Repository URL: https://github.com/your-org/loan-management-system"
echo ""
echo "Next steps on EC2:"
echo "  ssh -i loanmanagment.pem ec2-user@13.127.211.208"
echo "  cd /home/ec2-user/apps"
echo "  git clone https://github.com/your-org/loan-management-system.git"
echo "  cd loan-management-system"
echo "  wget https://raw.githubusercontent.com/your-org/loan-management-system/main/scripts/ec2-deploy-amazon-linux.sh"
echo "  chmod +x ec2-deploy-amazon-linux.sh"
echo "  ./ec2-deploy-amazon-linux.sh install"
echo "  sed -i 's/your-domain.com/your-actual-domain.com/g' ec2-deploy-amazon-linux.sh"
echo "  ./ec2-deploy-amazon-linux.sh deploy"
