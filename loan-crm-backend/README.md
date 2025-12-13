# Loan CRM Backend

A production-grade loan management system backend built with Node.js, Express, and MongoDB.

## Features

- **Loan Management**: Complete loan lifecycle management
- **Customer Management**: Customer onboarding and KYC
- **Payment Processing**: Payment collection and allocation
- **Collection Management**: Automated collection workflows
- **Legal Case Management**: Legal proceedings tracking
- **Role-based Access Control**: Multi-level user permissions
- **Automated Jobs**: DPD calculation, legal escalation, payment reconciliation
- **Comprehensive Logging**: Winston-based logging system
- **API Documentation**: Swagger/OpenAPI documentation

## Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **Validation**: Joi
- **Logging**: Winston
- **Cron Jobs**: node-cron
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - User login

### Loans
- `GET /api/v1/loans` - Get all loans
- `POST /api/v1/loans` - Create new loan
- `GET /api/v1/loans/:id` - Get loan by ID
- `PATCH /api/v1/loans/:id` - Update loan
- `PATCH /api/v1/loans/:id/assign-collector` - Assign collector

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PATCH /api/v1/users/profile` - Update profile
- `GET /api/v1/users` - Get all users (Admin)

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/loan_crm
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
ENABLE_CRON_JOBS=true
```

## Database Models

- **Customer**: Customer information and KYC details
- **Loan**: Loan details and status tracking
- **Schedule**: EMI schedule and payment tracking
- **Payment**: Payment records and allocation
- **Collection**: Collection activities and follow-ups
- **Transaction**: Audit trail for all transactions
- **LegalCase**: Legal proceedings management
- **User**: User accounts and permissions

## Cron Jobs

- **DPD Updater**: Daily calculation of Days Past Due
- **Legal Escalation**: Auto-escalation of high DPD loans
- **Payment Reconciliation**: Bank statement reconciliation
- **Auto Collector Assignment**: Automatic collector assignment

## Security Features

- JWT-based authentication
- Role-based access control
- Request validation with Joi
- Rate limiting
- Helmet security headers
- Password hashing with bcrypt

## Logging

- Structured logging with Winston
- Separate log files for errors and info
- Log rotation and archival
- Request/response logging in development

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secret
4. Enable HTTPS
5. Configure reverse proxy (nginx)
6. Set up log monitoring
7. Configure backup strategy

## API Documentation

Access Swagger documentation at `/api-docs` when running in development mode.

## License

Private - All rights reserved