# NBFC Loan Management System API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh access token

### Customers
- `GET /customers` - Get all customers
- `POST /customers` - Create new customer
- `GET /customers/:id` - Get customer by ID
- `PUT /customers/:id` - Update customer

### Loans
- `GET /loans` - Get all loans
- `POST /loans` - Create new loan
- `GET /loans/:id` - Get loan by ID
- `POST /loans/:id/disburse` - Disburse loan
- `POST /loans/update-dpd` - Update DPD for all loans

### Payments
- `POST /payments` - Record payment
- `GET /payments/loan/:loanId` - Get payments for loan

### Collections
- `GET /collections/due-today` - Get loans due today
- `GET /collections/overdue/:bucket?` - Get overdue loans by bucket
- `POST /collections/assign-agent` - Assign agent to loan
- `POST /collections/ptp` - Create Promise to Pay
- `POST /collections/note` - Add collection note
- `GET /collections/timeline/:loanId` - Get loan timeline

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/collection-performance` - Get collection performance data

## Data Models

### User
```json
{
  "name": "string",
  "email": "string",
  "role": "admin|manager|counsellor|advisor|field_agent|customer",
  "phone": "string",
  "isActive": "boolean"
}
```

### Customer
```json
{
  "customerId": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "pincode": "string"
  },
  "kyc": {
    "aadhar": "string",
    "pan": "string",
    "status": "pending|verified|rejected"
  }
}
```

### Loan
```json
{
  "loanId": "string",
  "customerId": "ObjectId",
  "principalAmount": "number",
  "interestRate": "number",
  "tenure": "number",
  "totalAmount": "number",
  "emiAmount": "number",
  "status": "pending|approved|disbursed|active|closed|npa",
  "dpd": "number",
  "bucket": "current|X|Y|M1|M2|M3|NPA",
  "installments": [
    {
      "installmentNumber": "number",
      "dueDate": "date",
      "principalAmount": "number",
      "interestAmount": "number",
      "totalAmount": "number",
      "paidAmount": "number",
      "status": "due|partial|paid|overdue"
    }
  ]
}
```

### Payment
```json
{
  "paymentId": "string",
  "loanId": "ObjectId",
  "amount": "number",
  "paymentMethod": "cash|cheque|online|upi",
  "reference": "string",
  "status": "pending|confirmed|failed",
  "allocations": [
    {
      "installmentNumber": "number",
      "principalPaid": "number",
      "interestPaid": "number",
      "totalPaid": "number"
    }
  ]
}
```

## Error Responses
```json
{
  "message": "Error description"
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error