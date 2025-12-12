# Loan Management System Backend

A complete NBFC Loan Management System backend built with Node.js, Express.js, and MongoDB.

## Features

### Customer Management
- Create and manage customers
- KYC verification system
- Document management
- Customer search and filtering

### Loan Management
- Create loans with auto-generated schedules
- 14-installment weekly repayment system
- Loan status tracking
- Interest calculation

### Payment Engine
- Add payments to loans
- Auto-allocation to installments
- Partial and advance payments
- Transaction history

### Collections Engine
- Due today loans
- Overdue loans tracking
- Promise to Pay (PTP) management
- Collection notes and agent actions

### Event & Timeline System
- Complete audit trail
- Payment events
- Status changes
- Collection activities

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Validation**: Joi
- **Date Handling**: Moment.js
- **Password Hashing**: bcryptjs

## Installation

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/loan_management
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

5. **Seed Database**
   ```bash
   npm run seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Customers
- `POST /api/v1/customers` - Create customer
- `GET /api/v1/customers` - Get all customers
- `GET /api/v1/customers/:id` - Get customer by ID
- `PUT /api/v1/customers/:id` - Update customer
- `PATCH /api/v1/customers/:id/kyc` - Update KYC status
- `POST /api/v1/customers/:id/documents` - Add document

### Loans
- `POST /api/v1/loans` - Create loan
- `GET /api/v1/loans` - Get all loans
- `GET /api/v1/loans/:loanId` - Get loan by ID
- `PUT /api/v1/loans/:loanId/status` - Update loan status
- `GET /api/v1/loans/:loanId/events` - Get loan timeline

### Payments
- `POST /api/v1/payments/:loanId` - Add payment
- `GET /api/v1/payments/:loanId` - Get loan payments
- `GET /api/v1/payments` - Get all payments

### Collections
- `GET /api/v1/collections/due-today` - Get due today loans
- `GET /api/v1/collections/overdue` - Get overdue loans
- `GET /api/v1/collections/outstanding` - Get outstanding loans
- `POST /api/v1/collections/:loanId/ptp` - Add Promise to Pay
- `POST /api/v1/collections/:loanId/notes` - Add collection note
- `PATCH /api/v1/collections/:loanId/status` - Update loan status

### Events
- `GET /api/v1/events/:loanId` - Get loan events
- `GET /api/v1/events` - Get all events

## Example Request Bodies

### Create Customer
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phone": "9876543210",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "dateOfBirth": "1990-01-15",
  "aadharNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "employmentInfo": {
    "employer": "Tech Company",
    "position": "Developer",
    "monthlyIncome": 75000,
    "employmentLength": 24
  }
}
```

### Create Loan
```json
{
  "customerId": "customer_object_id",
  "principalAmount": 100000,
  "interestRate": 24,
  "numberOfInstallments": 14,
  "startDate": "2024-01-15",
  "frequency": "weekly"
}
```

### Add Payment
```json
{
  "amount": 15000,
  "paymentMethod": "cash",
  "reference": "CASH001",
  "notes": "Payment received in office"
}
```

### Add Promise to Pay
```json
{
  "amount": 10000,
  "promiseDate": "2024-02-15"
}
```

### Update KYC Status
```json
{
  "status": "verified"
}
```

## Default Admin User

After running the seed script:
- **Email**: admin@loanms.com
- **Password**: admin123

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run migrate` - Run database migrations

## Project Structure

```
src/
├── config/
│   ├── db.js              # Database connection
│   ├── env.js             # Environment configuration
│   └── logger.js          # Logging configuration
├── middlewares/
│   ├── auth.middleware.js # JWT authentication
│   ├── role.middleware.js # Role-based access
│   └── validate.middleware.js # Request validation
├── modules/
│   ├── auth/              # Authentication module
│   ├── customers/         # Customer management
│   ├── loans/             # Loan management
│   ├── collections/       # Collections engine
│   ├── payments/          # Payment engine
│   └── events/            # Event system
├── utils/
│   ├── responses.js       # Response helpers
│   └── loanHelpers.js     # Loan utility functions
├── scripts/
│   └── seed.js            # Database seeding
├── app.js                 # Express app setup
└── server.js              # Server entry point
```

## Key Features Implementation

### Loan-ID Centric Architecture
- Every loan has a unique `loanId` for easy reference
- All operations are performed using `loanId`

### Auto-Generated Repayment Schedule
- 14 weekly installments by default
- Customizable frequency (weekly/monthly)
- Principal + interest distribution

### Payment Allocation Engine
- Payments auto-allocated to earliest unpaid installments
- Supports partial and advance payments
- Real-time outstanding balance updates

### Collections Management
- DPD (Days Past Due) calculation
- Automated overdue detection
- PTP tracking and follow-up

### Event Timeline
- Complete audit trail for every loan
- Payment, status change, and collection events
- Actor tracking for accountability

## Health Check

Visit `http://localhost:5000/api/v1/health` to verify the server is running.

## Error Handling

The API uses consistent error response format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error array if applicable"],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```