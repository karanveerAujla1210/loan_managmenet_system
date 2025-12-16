# EC2 Quick Start - 15 Minutes

## Prerequisites

- AWS account
- Domain name (optional but recommended)

---

## Step 1: Launch EC2 Instance (5 min)

### 1.1 Create Instance

```bash
# AWS Console → EC2 → Instances → Launch Instance

Configuration:
- Name: loan-crm-prod
- AMI: Ubuntu 22.04 LTS
- Instance Type: t3.medium
- Key Pair: Create new (loan-crm-key.pem)
- Security Group: Create new
  Inbound Rules:
  - SSH (22): Your IP
  - HTTP (80): 0.0.0.0/0
  - HTTPS (443): 0.0.0.0/0
- Storage: 50 GB gp3
```

### 1.2 Allocate Elastic IP

```bash
# AWS Console → EC2 → Elastic IPs → Allocate
# Associate with your instance
```

### 1.3 Connect

```bash
chmod 400 loan-crm-key.pem
ssh -i loan-crm-key.pem ubuntu@<elastic-ip>
```

---

## Step 2: Install Everything (5 min)

```bash
# Download and run installation script
cd /home/ubuntu
wget https://raw.githubusercontent.com/your-org/loan-management-system/main/scripts/ec2-deploy.sh
chmod +x ec2-deploy.sh

# Install dependencies
./ec2-deploy.sh install
```

---

## Step 3: Deploy Application (5 min)

```bash
# Edit script to set your domain
sed -i 's/your-domain.com/your-actual-domain.com/g' ec2-deploy.sh

# Deploy
./ec2-deploy.sh deploy

# Verify
./ec2-deploy.sh health
```

---

## Step 4: Setup Domain (Optional)

```bash
# AWS Console → Route 53 → Hosted Zones → your-domain.com

# Create A record:
# Name: your-domain.com
# Type: A
# Value: <Elastic IP>
# TTL: 300
```

---

## Done! 🎉

Your app is now running at:
- **Frontend**: https://your-domain.com
- **Backend API**: https://your-domain.com/api/v1

---

## Useful Commands

```bash
# View backend logs
pm2 logs loan-crm-api

# View Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart services
./ec2-deploy.sh restart

# Update code
./ec2-deploy.sh update

# Health check
./ec2-deploy.sh health
```

---

## Cost

**~$40/month** for t3.medium instance

---

## Troubleshooting

### Can't connect to instance?
```bash
# Check security group allows SSH from your IP
# AWS Console → EC2 → Security Groups
```

### Backend not responding?
```bash
pm2 logs loan-crm-api
```

### Frontend not loading?
```bash
sudo tail -f /var/log/nginx/error.log
```

### SSL certificate issues?
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```
