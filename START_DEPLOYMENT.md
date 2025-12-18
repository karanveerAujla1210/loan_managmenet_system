# 🚀 START HERE - EC2 Deployment Guide

Welcome! This guide will help you deploy the Loan Management System on AWS EC2.

---

## ⚡ 30-Second Overview

Your project has **Backend + Frontend + MongoDB + Redis** that needs to run on **AWS EC2**.

We've created:
- ✅ Automated setup script (1 command deployment)
- ✅ Terraform infrastructure as code (production-grade)
- ✅ Complete documentation (guides + checklists)
- ✅ Security hardening (firewall + SSL + backups)
- ✅ Monitoring & health checks

---

## 🎯 Choose Your Path

### 🟢 Path 1: Quick Start (5 minutes)
**Best for**: Testing, development, quick deployment

```bash
# 1. Launch EC2 instance (Ubuntu 22.04 LTS, t3.medium)
# 2. SSH into instance
ssh -i your-key.pem ubuntu@instance-ip

# 3. Run one command
wget https://raw.githubusercontent.com/your-org/loan-management-system/main/scripts/ec2-complete-setup.sh
chmod +x ec2-complete-setup.sh
./ec2-complete-setup.sh

# 4. Done! Your app is running
```

**Next**: Go to [Quick Reference](QUICK_REFERENCE.md)

---

### 🟡 Path 2: Production Deployment (15 minutes)
**Best for**: Production, multi-instance, load balancing

```bash
# 1. Configure Terraform
cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# 2. Deploy infrastructure
terraform init
terraform plan
terraform apply

# 3. Done! Your infrastructure is ready
```

**Next**: Go to [EC2 Deployment Guide](EC2_DEPLOYMENT_GUIDE.md)

---

### 🔵 Path 3: Manual Setup (30 minutes)
**Best for**: Learning, customization, full control

Follow step-by-step instructions in [EC2 Deployment Guide](EC2_DEPLOYMENT_GUIDE.md)

Use [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) to track progress

---

## 📋 Pre-Deployment Checklist

Before you start, make sure you have:

- [ ] **AWS Account** - with EC2, VPC, IAM permissions
- [ ] **SSH Key Pair** - created in AWS EC2
- [ ] **SSL Certificate** - from ACM or Let's Encrypt
- [ ] **Domain Name** - registered and DNS configured
- [ ] **Repository** - code pushed to GitHub main branch
- [ ] **Local Setup** - Git, Terraform (if using IaC), AWS CLI

---

## 📚 Documentation Map

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) | Overview of what's new | 5 min |
| [EC2_DEPLOYMENT_GUIDE.md](EC2_DEPLOYMENT_GUIDE.md) | Complete deployment guide | 15 min |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Step-by-step checklist | 20 min |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Commands & troubleshooting | 5 min |
| [DEPLOYMENT_FILES_CREATED.md](DEPLOYMENT_FILES_CREATED.md) | List of all files | 5 min |

---

## 🚀 Quick Start Steps

### Step 1: Prepare AWS (5 minutes)

```bash
# Create SSH key pair
aws ec2 create-key-pair --key-name loan-crm-key --query 'KeyMaterial' --output text > loan-crm-key.pem
chmod 600 loan-crm-key.pem

# Create security group
aws ec2 create-security-group --group-name loan-crm-sg --description "Loan CRM Security Group"

# Add rules
aws ec2 authorize-security-group-ingress --group-name loan-crm-sg --protocol tcp --port 22 --cidr YOUR_IP/32
aws ec2 authorize-security-group-ingress --group-name loan-crm-sg --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-name loan-crm-sg --protocol tcp --port 443 --cidr 0.0.0.0/0
```

### Step 2: Launch EC2 Instance (2 minutes)

```bash
# Via AWS Console:
# 1. Go to EC2 Dashboard
# 2. Click "Launch Instance"
# 3. Select: Ubuntu 22.04 LTS
# 4. Instance type: t3.medium (or larger)
# 5. Storage: 50GB gp3
# 6. Security group: loan-crm-sg
# 7. Key pair: loan-crm-key
# 8. Launch!
```

### Step 3: Deploy Application (5 minutes)

```bash
# SSH into instance
ssh -i loan-crm-key.pem ubuntu@your-instance-ip

# Run setup script
wget https://raw.githubusercontent.com/your-org/loan-management-system/main/scripts/ec2-complete-setup.sh
chmod +x ec2-complete-setup.sh
./ec2-complete-setup.sh

# Verify
health-check.sh
```

### Step 4: Configure Domain (2 minutes)

```bash
# Update DNS records to point to your instance IP
# Or ALB DNS if using Terraform
```

### Step 5: Access Application

```
https://your-domain.com
```

---

## 🔍 Verify Deployment

After deployment, verify everything is working:

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@instance-ip

# Run health check
health-check.sh

# Check processes
pm2 status

# Check services
sudo systemctl status nginx
sudo systemctl status mongod
sudo systemctl status redis-server
```

Expected output:
```
✓ Backend API: Running
✓ Frontend: Running
✓ MongoDB: Running
✓ Redis: Running
✓ PM2 Processes: Running
```

---

## 🆘 Troubleshooting

### Application not loading?
```bash
# Check backend
pm2 logs loan-crm-api

# Check Nginx
sudo tail -f /var/log/nginx/error.log

# Check MongoDB
mongosh --eval "db.adminCommand('ping')"
```

### SSL certificate issues?
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal
```

### Database connection failed?
```bash
# Restart MongoDB
sudo systemctl restart mongod

# Check connection
mongosh --eval "db.adminCommand('ping')"
```

**More help**: See [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

## 📊 Architecture

### Single Instance (Quick Start)
```
┌─────────────────────────────────┐
│         EC2 Instance            │
│  ┌──────────────────────────┐   │
│  │ Frontend (port 3000)     │   │
│  │ Backend (port 5000)      │   │
│  │ MongoDB (port 27017)     │   │
│  │ Redis (port 6379)        │   │
│  │ Nginx (port 80/443)      │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

### Multi-Instance (Production)
```
┌──────────────────────────────────────────────┐
│              Internet                        │
└────────────────┬─────────────────────────────┘
                 │
            ┌────▼────┐
            │   ALB    │
            └────┬────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼───┐   ┌───▼───┐   ┌───▼───┐
│ EC2-1 │   │ EC2-2 │   │ EC2-N │
│ ┌───┐ │   │ ┌───┐ │   │ ┌───┐ │
│ │App│ │   │ │App│ │   │ │App│ │
│ └───┘ │   │ └───┘ │   │ └───┘ │
└───────┘   └───────┘   └───────┘
```

---

## 📁 What's Included

### Scripts
- `scripts/ec2-complete-setup.sh` - Automated setup (800 lines)

### Infrastructure as Code
- `infrastructure/terraform/main.tf` - AWS infrastructure
- `infrastructure/terraform/variables.tf` - Configuration variables
- `infrastructure/terraform/terraform.tfvars.example` - Example config
- `infrastructure/terraform/user_data.sh` - EC2 initialization

### Configuration
- `backend/.env.production` - Backend environment
- `frontend-unified/.env.production` - Frontend environment

### Documentation
- `EC2_DEPLOYMENT_GUIDE.md` - Complete guide (600 lines)
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist (400 lines)
- `DEPLOYMENT_SUMMARY.md` - Overview of changes (300 lines)
- `QUICK_REFERENCE.md` - Quick lookup (200 lines)
- `DEPLOYMENT_FILES_CREATED.md` - File list (200 lines)
- `START_DEPLOYMENT.md` - This file

---

## 🎓 Learning Resources

### AWS
- [EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [VPC Documentation](https://docs.aws.amazon.com/vpc/)
- [ALB Documentation](https://docs.aws.amazon.com/elasticloadbalancing/)

### Infrastructure as Code
- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

### Application Stack
- [Node.js](https://nodejs.org/en/docs/)
- [MongoDB](https://docs.mongodb.com/)
- [Redis](https://redis.io/documentation)
- [Nginx](https://nginx.org/en/docs/)
- [PM2](https://pm2.keymetrics.io/docs/)

---

## ✅ Deployment Checklist

- [ ] AWS account ready
- [ ] SSH key created
- [ ] SSL certificate obtained
- [ ] Domain configured
- [ ] Repository pushed to main
- [ ] Chosen deployment method
- [ ] Read relevant documentation
- [ ] Deployed application
- [ ] Verified with health checks
- [ ] Configured monitoring
- [ ] Set up backups
- [ ] Documented procedures

---

## 🎯 Next Steps

### Immediate (Now)
1. Read [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)
2. Choose deployment path (Quick, Production, or Manual)
3. Prepare AWS account

### Short Term (Today)
1. Deploy application
2. Verify with health checks
3. Configure domain DNS

### Medium Term (This Week)
1. Set up monitoring
2. Configure backups
3. Test disaster recovery
4. Document procedures

### Long Term (Ongoing)
1. Monitor performance
2. Plan capacity
3. Schedule maintenance
4. Review security

---

## 💡 Pro Tips

1. **Start with Quick Start** if you're new to AWS
2. **Use Terraform** for production deployments
3. **Enable CloudWatch** for monitoring
4. **Set up SNS** for alerts
5. **Test backups** regularly
6. **Keep documentation** updated
7. **Use version control** for infrastructure
8. **Enable MFA** on AWS account

---

## 🆘 Need Help?

### Quick Questions
→ Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

### Deployment Issues
→ See [EC2_DEPLOYMENT_GUIDE.md](EC2_DEPLOYMENT_GUIDE.md) Troubleshooting section

### Step-by-Step Help
→ Follow [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

### Understanding Changes
→ Read [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)

### AWS Issues
→ Check [AWS Documentation](https://docs.aws.amazon.com/)

---

## 🎉 Ready to Deploy?

Choose your path and get started:

### 🟢 Quick Start
```bash
./scripts/ec2-complete-setup.sh
```

### 🟡 Production
```bash
cd infrastructure/terraform
terraform apply
```

### 🔵 Manual
Follow [EC2_DEPLOYMENT_GUIDE.md](EC2_DEPLOYMENT_GUIDE.md)

---

## 📞 Support

- **Documentation**: See files in this directory
- **GitHub Issues**: Report bugs and feature requests
- **AWS Support**: For AWS-related issues
- **Community**: Stack Overflow, AWS Forums

---

**Version**: 2.0.0  
**Last Updated**: 2024  
**Status**: Production Ready  

**Let's deploy! 🚀**
