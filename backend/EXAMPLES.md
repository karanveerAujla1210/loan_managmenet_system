# API Request Examples

## Customer Management

### Create Customer
```json
POST /api/v1/customers
{
  "firstName": "Rajesh",
  "lastName": "Kumar", 
  "email": "rajesh.kumar@email.com",
  "phone": "9876543210",
  "address": {
    "street": "123 MG Road",
    "city": "Mumbai", 
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "dateOfBirth": "1985-05-15",
  "aadharNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "employmentInfo": {
    "employer": "Tech Solutions Pvt Ltd",
    "position": "Software Engineer", 
    "monthlyIncome": 75000,
    "employmentLength": 36
  },
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "HDFC0001234", 
    "bankName": "HDFC Bank",
    "accountHolderName": "Rajesh Kumar"
  },
  "references": [
    {
      "name": "Amit Sharma",
      "phone": "9876543211",
      "relationship": "Friend",
      "address": "456 Park Street, Mumbai"
    }
  ]
}
```

### Update KYC Status
```json
PATCH /api/v1/customers/:customerId/kyc
{
  "status": "verified"
}
```

### Add Document
```json
POST /api/v1/customers/:customerId/documents
{
  "type": "aadhar",
  "fileName": "aadhar_front.jpg",
  "filePath": "/uploads/documents/aadhar_front.jpg"
}
```

## Loan Management

### Create Loan
```json
POST /api/v1/loans
{
  "customerId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "principalAmount": 100000,
  "interestRate": 24,
  "numberOfInstallments": 14,
  "startDate": "2024-01-15",
  "frequency": "weekly"
}
```

### Update Loan Status
```json
PUT /api/v1/loans/:loanId/status
{
  "status": "overdue"
}
```

## Payment Management

### Add Payment
```json
POST /api/v1/payments/:loanId
{
  "amount": 15000,
  "paymentMethod": "cash",
  "reference": "CASH001",
  "notes": "Payment received in office"
}
```

### Add Payment - Bank Transfer
```json
POST /api/v1/payments/:loanId
{
  "amount": 25000,
  "paymentMethod": "bank_transfer",
  "reference": "TXN123456789",
  "notes": "NEFT transfer from customer account"
}
```

### Add Payment - UPI
```json
POST /api/v1/payments/:loanId
{
  "amount": 8000,
  "paymentMethod": "upi",
  "reference": "UPI123456789",
  "notes": "UPI payment via PhonePe"
}
```

## Collections Management

### Add Promise to Pay (PTP)
```json
POST /api/v1/collections/:loanId/ptp
{
  "amount": 10000,
  "promiseDate": "2024-02-15"
}
```

### Add Collection Note
```json
POST /api/v1/collections/:loanId/notes
{
  "note": "Customer contacted via phone. Promised to pay by end of week. Financial difficulty due to medical emergency."
}
```

### Update Loan Status (Collections)
```json
PATCH /api/v1/collections/:loanId/status
{
  "status": "critical"
}
```

## Query Parameters Examples

### Get Customers with Filters
```
GET /api/v1/customers?status=active&search=rajesh
```

### Get Loans with Filters
```
GET /api/v1/loans?status=overdue&customerId=60f7b3b3b3b3b3b3b3b3b3b3
```

### Get Payments with Date Range
```
GET /api/v1/payments?startDate=2024-01-01&endDate=2024-01-31&method=cash
```

### Get Events with Filters
```
GET /api/v1/events?type=payment&startDate=2024-01-01&endDate=2024-01-31
```

## Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Loan created successfully",
  "data": {
    "loanId": "LN123456ABCD",
    "customerId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "principalAmount": 100000,
    "interestRate": 24,
    "totalAmount": 124000,
    "installmentAmount": 8857,
    "numberOfInstallments": 14,
    "frequency": "weekly",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-04-08T00:00:00.000Z",
    "status": "active",
    "outstandingAmount": 124000,
    "paidAmount": 0,
    "dpd": 0,
    "nextDueDate": "2024-01-15T00:00:00.000Z",
    "schedule": [
      {
        "installmentNumber": 1,
        "dueDate": "2024-01-15T00:00:00.000Z",
        "principalAmount": 7143,
        "interestAmount": 1714,
        "totalAmount": 8857,
        "remainingAmount": 8857,
        "status": "pending"
      }
    ],
    "events": [
      {
        "type": "created",
        "description": "Loan created for amount ₹100000",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "payload": {
          "amount": 100000
        }
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Customer KYC not verified",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "message": "\"principalAmount\" is required",
      "path": ["principalAmount"],
      "type": "any.required"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Loan Status Values
- `active` - Loan is active and payments are on time
- `overdue` - Loan has overdue installments
- `completed` - Loan is fully paid
- `defaulted` - Loan is in default (DPD > 90)
- `closed` - Loan is closed
- `critical` - Loan requires immediate attention
- `broken_promise` - Customer broke promise to pay

## Payment Methods
- `cash` - Cash payment
- `bank_transfer` - Bank transfer/NEFT/RTGS
- `cheque` - Cheque payment
- `online` - Online payment
- `upi` - UPI payment

## KYC Status Values
- `pending` - KYC verification pending
- `verified` - KYC verified
- `rejected` - KYC rejected

## Document Types
- `aadhar` - Aadhar card
- `pan` - PAN card
- `salary_slip` - Salary slip
- `bank_statement` - Bank statement
- `photo` - Customer photo

## Event Types
- `payment` - Payment received
- `ptp` - Promise to pay added
- `status` - Status changed
- `note` - Collection note added
- `overdue` - Overdue event
- `created` - Loan created