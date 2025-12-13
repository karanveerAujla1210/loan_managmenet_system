# NBFC Loan Management System - Backend v2.0

🏦 **Production-Grade NBFC Loan Management & Collections CRM Backend**

A comprehensive, enterprise-level loan management system backend designed for NBFCs (Non-Banking Financial Companies) with advanced features for loan processing, collections, risk management, and customer lifecycle management.

## 🚀 Features

### Core Modules
- **👥 User Management**: Complete RBAC with role-based permissions
- **🏢 Customer Management**: KYC, onboarding, and profile management
- **💰 Loan Management**: Full loan lifecycle with approval workflows
- **📅 Schedule Management**: EMI calculation and payment scheduling
- **💳 Payment Processing**: Multi-channel payment handling and allocation
- **📞 Collections CRM**: Automated collections with DPD tracking
- **📊 Credit Scoring**: Rule-based credit assessment engine
- **⚠️ Risk Management**: Portfolio risk analysis and monitoring

### Technical Features
- **🔐 Enterprise Security**: JWT + Refresh tokens, RBAC, rate limiting
- **📈 Performance**: Redis caching, database optimization, connection pooling
- **🔄 Automation**: Cron jobs for DPD updates, interest calculation, collections
- **📝 Audit Trail**: Comprehensive logging and security event tracking
- **🧪 Testing**: 70%+ test coverage with unit and integration tests
- **📊 Monitoring**: Health checks, metrics, and performance monitoring
- **🐳 DevOps Ready**: Docker, CI/CD, production deployment scripts

## 🏗️ Architecture

```
src/
├── config/          # Database, Redis, Logger configuration
├── core/            # Base classes (Model, Controller, Service, Repository)
├── middleware/      # Authentication, validation, rate limiting, logging
├── modules/         # Business modules (users, loans, payments, etc.)
│   └── users/
│       ├── user.model.js      # Mongoose model
│       ├── user.repository.js # Data access layer
│       ├── user.service.js    # Business logic
│       ├── user.controller.js # HTTP handlers
│       └── user.routes.js     # Route definitions
├── utils/           # Helper functions and utilities
├── jobs/            # Cron jobs and background tasks
├── validators/      # Input validation schemas
└── routes/          # Main route aggregator
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 7.0+
- Redis 7.0+ (optional, for caching)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd backend-new

# Run the installation script
chmod +x scripts/install.sh
./scripts/install.sh

# Or install manually
npm install
cp .env.example .env
# Configure your .env file
```

### Development Setup

```bash
# Start development server
npm run dev

# Run with Docker
npm run docker:up

# Run database migrations
npm run migrate

# Seed sample data
npm run seed
```

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 API Documentation

### Authentication Endpoints
```
POST   /api/v1/users/register     # User registration
POST   /api/v1/users/login        # User login
POST   /api/v1/users/logout       # User logout
POST   /api/v1/users/forgot-password
POST   /api/v1/users/reset-password
```

### User Management
```
GET    /api/v1/users              # Get all users (paginated)
POST   /api/v1/users              # Create new user
GET    /api/v1/users/:id          # Get user by ID
PUT    /api/v1/users/:id          # Update user
DELETE /api/v1/users/:id          # Soft delete user
GET    /api/v1/users/profile      # Get current user profile
PUT    /api/v1/users/profile      # Update current user profile
```

### Loan Management
```
GET    /api/v1/loans              # Get all loans
POST   /api/v1/loans              # Create new loan
GET    /api/v1/loans/:id          # Get loan details
PUT    /api/v1/loans/:id          # Update loan
POST   /api/v1/loans/:id/approve  # Approve loan
POST   /api/v1/loans/:id/reject   # Reject loan
POST   /api/v1/loans/:id/disburse # Disburse loan
```

### Payment Management
```
GET    /api/v1/payments           # Get all payments
POST   /api/v1/payments           # Record new payment
GET    /api/v1/payments/:id       # Get payment details
POST   /api/v1/payments/:id/reverse # Reverse payment
```

### Collections
```
GET    /api/v1/collections        # Get collection cases
POST   /api/v1/collections        # Create collection case
PUT    /api/v1/collections/:id    # Update collection case
POST   /api/v1/collections/:id/assign # Assign collector
```

## 🔐 Security Features

### Authentication & Authorization
- JWT access tokens (15 min expiry)
- Refresh tokens (7 day expiry)
- Role-based access control (RBAC)
- Permission-based authorization
- Account lockout after failed attempts
- Password strength requirements

### Security Middleware
- Rate limiting (global + endpoint-specific)
- Input validation and sanitization
- XSS protection
- SQL injection prevention
- CORS configuration
- Security headers (Helmet.js)
- Request logging and audit trails

### Data Protection
- Password hashing (bcrypt)
- Sensitive data encryption
- Secure session management
- API key validation
- IP-based access control

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run tests in watch mode
npm run test:watch
```

### Test Coverage Requirements
- Minimum 70% overall coverage
- Unit tests for all services
- Integration tests for API endpoints
- Mock external dependencies

## 📊 Monitoring & Logging

### Health Checks
```
GET /health                    # Basic health check
GET /api/v1/health            # Detailed health check
GET /api/v1/users/health/check # User service health
```

### Logging Levels
- **Error**: System errors and exceptions
- **Warn**: Warning conditions
- **Info**: General information and business events
- **Debug**: Detailed debugging information

### Metrics
- Request/response times
- Error rates
- Database query performance
- Cache hit/miss ratios
- Business metrics (loans, payments, collections)

## 🔄 Cron Jobs

### Automated Tasks
- **DPD Update**: Daily at 1:00 AM - Updates Days Past Due for all loans
- **Interest Calculation**: Daily at 2:00 AM - Calculates daily interest
- **Collection Reminders**: Daily at 9:00 AM - Sends collection notifications
- **Report Generation**: Weekly on Monday at 6:00 AM
- **Data Cleanup**: Weekly on Sunday at 3:00 AM
- **Database Backup**: Daily at 4:00 AM

### Manual Execution
```bash
# Run specific cron job
npm run cron:dpd-update
npm run cron:interest-calculation
npm run cron:collection-reminder
```

## 🏢 Business Logic

### Loan Calculation Engine
```javascript
// EMI Calculation (Reducing Balance)
EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)

// Where:
// P = Principal amount
// r = Monthly interest rate
// n = Number of installments
```

### DPD (Days Past Due) Calculation
```javascript
// DPD = Current Date - Due Date (for overdue installments)
// Bucket assignment based on DPD:
// Current: 0 DPD
// Bucket 1: 1-30 DPD
// Bucket 2: 31-60 DPD
// Bucket 3: 61-90 DPD
// NPA: 90+ DPD
```

### Payment Allocation Priority
1. Penalty charges
2. Interest due
3. Principal due
4. Advance payments (future installments)

## 🔧 Configuration

### Environment Variables
```bash
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/nbfc_loan_management
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
BCRYPT_SALT_ROUNDS=12

# Business Rules
DEFAULT_INTEREST_RATE=24
DEFAULT_PROCESSING_FEE_RATE=2
DEFAULT_PENALTY_RATE=36
MIN_LOAN_AMOUNT=10000
MAX_LOAN_AMOUNT=1000000

# External Services
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@company.com
TWILIO_ACCOUNT_SID=your-twilio-sid
```

## 📈 Performance Optimization

### Database Optimization
- Proper indexing on frequently queried fields
- Connection pooling
- Query optimization
- Aggregation pipelines for complex reports

### Caching Strategy
- Redis for session storage
- API response caching
- Database query result caching
- Rate limiting data storage

### Code Optimization
- Lazy loading of modules
- Efficient error handling
- Memory leak prevention
- Asynchronous processing

## 🚀 Deployment

### Production Deployment
```bash
# Build production image
docker build -t nbfc-backend .

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Or deploy manually
npm run build
npm start
```

### Environment Setup
1. Configure production environment variables
2. Set up SSL certificates
3. Configure reverse proxy (Nginx)
4. Set up monitoring and logging
5. Configure backup procedures

## 📚 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "statusCode": 200,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ],
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Records retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Follow conventional commit messages
- Ensure all tests pass

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

### Troubleshooting
- Check application logs in `logs/` directory
- Verify environment configuration
- Ensure database connectivity
- Check Redis connection (if using caching)

### Getting Help
- Review API documentation
- Check test files for usage examples
- Contact development team

## 🔄 Version History

### v2.0.0 (Current)
- Complete rewrite with modern architecture
- Enhanced security features
- Comprehensive testing suite
- Production-ready deployment
- Advanced monitoring and logging

### v1.0.0
- Initial release
- Basic loan management features
- Simple authentication

---

**Built with ❤️ for NBFC loan management excellence**