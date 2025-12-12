# Loan Management System - Setup Guide

## Installation Commands

### Backend Setup
```bash
cd backend
npm install
npm run seed
npm run dev
```

### Frontend Setup
```bash
cd frontend-web
npm install
npm run dev
```

## API Examples

### Authentication
```bash
# Login
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Customer APIs
```bash
# Create Customer
POST http://localhost:5000/api/v1/customers
Content-Type: application/json
Authorization: Bearer <token>

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "employmentInfo": {
    "monthlyIncome": 50000
  }
}

# Get All Customers
GET http://localhost:5000/api/v1/customers
Authorization: Bearer <token>

# Get Customer by ID
GET http://localhost:5000/api/v1/customers/{customerId}
Authorization: Bearer <token>
```

### Loan APIs
```bash
# Create Loan
POST http://localhost:5000/api/v1/loans
Content-Type: application/json
Authorization: Bearer <token>

{
  "customerId": "customer_id_here",
  "principalAmount": 100000,
  "interestRate": 12,
  "startDate": "2024-01-01"
}

# Get All Loans
GET http://localhost:5000/api/v1/loans
Authorization: Bearer <token>

# Get Loan by ID
GET http://localhost:5000/api/v1/loans/{loanId}
Authorization: Bearer <token>

# Get Due Loans
GET http://localhost:5000/api/v1/loans/due?type=today
GET http://localhost:5000/api/v1/loans/due?type=overdue
GET http://localhost:5000/api/v1/loans/due?type=outstanding
Authorization: Bearer <token>

# Add Payment
POST http://localhost:5000/api/v1/loans/{loanId}/payments
Content-Type: application/json
Authorization: Bearer <token>

{
  "amount": 8000,
  "paymentMethod": "cash",
  "reference": "Payment reference"
}

# Add Promise to Pay
POST http://localhost:5000/api/v1/loans/{loanId}/ptp
Content-Type: application/json
Authorization: Bearer <token>

{
  "amount": 5000,
  "promiseDate": "2024-01-15"
}

# Add Collection Note
POST http://localhost:5000/api/v1/loans/{loanId}/notes
Content-Type: application/json
Authorization: Bearer <token>

{
  "note": "Customer contacted, promised to pay by Friday"
}
```

## Loan Flow Explanation

### 1. Customer Creation
- Customer data is validated and stored
- Unique email and phone validation
- Employment and address information captured

### 2. Loan Creation
- Loan ID auto-generated (LN + timestamp + random)
- 14-installment weekly schedule auto-generated
- Principal + interest split calculated
- Loan events timeline initiated

### 3. Payment Processing
- Payments auto-allocated to earliest unpaid installments
- Installment status updated (pending → partial → paid)
- Outstanding amount recalculated
- Payment history maintained

### 4. Collections Management
- Due today/overdue loans identified
- Promise to Pay (PTP) tracking
- Collection notes and agent activities
- Loan timeline with all events

### 5. Schedule Generation Logic
- 14 weekly installments
- Equal installment amounts
- Principal and interest portions calculated
- Due dates set weekly from start date
- Status tracking per installment

## Key Features Implemented

✅ Complete Customer CRUD operations
✅ Loan creation with auto-schedule generation
✅ Payment allocation to installments
✅ Collections dashboard with due/overdue tracking
✅ Promise to Pay (PTP) functionality
✅ Collection notes and timeline
✅ Responsive UI with Tailwind CSS
✅ JWT authentication
✅ Input validation with Joi
✅ Clean architecture (Controller → Service → Model)

## Demo Credentials
- Email: admin@example.com
- Password: password123

## Database Schema
- Users (authentication)
- Customers (borrower information)
- Loans (loan details, schedule, payments, events)
- Embedded schemas for installments, payments, events

## Frontend Pages
- Login (authentication)
- Dashboard (overview and stats)
- Customers (CRUD operations)
- Loans (create, view, payment processing)
- Collections (due/overdue management, PTP, notes)

All APIs return structured JSON with success/error status and proper HTTP codes.