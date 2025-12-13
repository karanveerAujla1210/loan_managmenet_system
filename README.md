# Loan Management System

🏦 **Professional NBFC Loan Management & Collections CRM**

A comprehensive full-stack loan management system designed for NBFCs (Non-Banking Financial Companies) with advanced features for loan processing, collections, and customer management.

## 🚀 Features

- **Loan Management**: Complete loan lifecycle management
- **Customer Portal**: Customer onboarding and management
- **Collections CRM**: Advanced collections and follow-up system
- **Payment Processing**: Automated payment allocation and reconciliation
- **Dashboard & Analytics**: Real-time insights and reporting
- **Document Management**: Secure document upload and storage
- **Role-based Access**: Multi-level user permissions
- **Mobile Responsive**: Works on all devices

## 🏗️ Architecture

- **Frontend**: React.js with Vite, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with optimized indexes
- **Caching**: Redis for performance
- **Authentication**: JWT with secure sessions
- **Deployment**: Docker containers with Nginx
- **Monitoring**: Prometheus & Grafana

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+
- MongoDB 7.0+
- Redis (optional)

### Installation
```bash
# Clone repository
git clone <repository-url>
cd loan-management-system

# Install backend dependencies
cd backend
npm install
cp .env.example .env
# Configure your .env file

# Install frontend dependencies
cd ../frontend-web
npm install
cp .env.example .env
# Configure your .env file

# Start development servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend-web && npm run dev
```

## 🐳 Production Deployment

### Docker Deployment (Recommended)
```bash
# Clone and configure
git clone <repository-url>
cd loan-management-system
cp .env.production .env
# Update .env with your production values

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Or use deployment script
chmod +x scripts/*.sh
./scripts/deploy.sh
```

### Manual Deployment
See [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) for detailed instructions.

## 🔒 Security

This system implements enterprise-grade security:
- JWT authentication with secure sessions
- Rate limiting and DDoS protection
- Input validation and sanitization
- HTTPS/SSL encryption
- Database authentication
- Security headers (Helmet.js)
- CORS protection

See [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) for complete security guidelines.

## 📊 Monitoring

- **Health Checks**: `/health` and `/api/health` endpoints
- **Prometheus Metrics**: Available at `:9090`
- **Grafana Dashboards**: Available at `:3001`
- **Application Logs**: Structured logging with rotation

## 🔧 Available Scripts

```bash
# Development
npm run docker:build    # Build Docker images
npm run docker:up       # Start development containers
npm run docker:down     # Stop development containers

# Production
npm run prod:build      # Build production images
npm run prod:up         # Start production containers
npm run prod:down       # Stop production containers

# Maintenance
npm run backup          # Create database backup
npm run deploy          # Deploy to production
npm run security:audit  # Run security audit
npm run logs            # View application logs
```

## 📁 Project Structure

```
loan-management-system/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── services/       # Business logic
│   └── scripts/            # Utility scripts
├── frontend-web/           # React.js web application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── hooks/         # Custom hooks
├── nginx/                  # Nginx configuration
├── scripts/               # Deployment scripts
├── monitoring/            # Monitoring configuration
└── docs/                  # Documentation
```

## 🔄 CI/CD Pipeline

Automated deployment with GitHub Actions:
- Automated testing on pull requests
- Security scanning
- Docker image building
- Production deployment
- Health checks and rollback

## 📚 API Documentation

### Authentication
```bash
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/logout
```

### Loans
```bash
GET    /api/v1/loans
POST   /api/v1/loans
GET    /api/v1/loans/:id
PUT    /api/v1/loans/:id
DELETE /api/v1/loans/:id
```

### Customers
```bash
GET    /api/v1/customers
POST   /api/v1/customers
GET    /api/v1/customers/:id
PUT    /api/v1/customers/:id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support:
- Check the [troubleshooting guide](./PRODUCTION_DEPLOYMENT.md#troubleshooting)
- Review application logs
- Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial production release
  - Complete loan management system
  - Collections CRM
  - Customer portal
  - Production-ready deployment

---

**Built with ❤️ for NBFC loan management**
