# API Contract Examples

## Authentication

### POST /auth/login
**Request:**
```json
{
  "email": "agent@company.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "AGT001",
    "name": "John Agent",
    "email": "agent@company.com",
    "role": "field_agent"
  }
}
```

### POST /auth/refresh
**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "accessToken": "new_access_token_here"
}
```

## Collections

### GET /collections/assigned?agentId=AGT001
**Response:**
```json
{
  "loans": [
    {
      "loanId": "LN001",
      "id": "backend_id_123",
      "customerName": "John Doe",
      "customerPhone": "+919876543210",
      "principal": 50000,
      "status": "active",
      "agentId": "AGT001",
      "dpd": 15,
      "bucket": "B1",
      "outstandingAmount": 25000,
      "nextDueDate": "2024-01-15",
      "schedule": [
        {
          "installmentNo": 1,
          "dueDate": "2024-01-15",
          "amount": 5000,
          "status": "pending",
          "paidAmount": 0
        }
      ]
    }
  ]
}
```

### POST /collections/:loanId/payment
**Request:**
```json
{
  "clientRef": "uuid-client-ref-123",
  "amount": 5000,
  "date": "2024-01-15T10:30:00Z",
  "mode": "cash",
  "agentId": "AGT001",
  "notes": "Partial payment received",
  "attachment": "base64_image_or_presigned_url"
}
```

**Response:**
```json
{
  "transactionId": "TXN123456",
  "clientRef": "uuid-client-ref-123",
  "loan": {
    "loanId": "LN001",
    "outstandingAmount": 20000
  },
  "allocation": [
    {
      "installmentNo": 1,
      "amount": 5000,
      "allocationType": "principal"
    }
  ]
}
```

### POST /collections/:loanId/ptp
**Request:**
```json
{
  "clientRef": "uuid-ptp-ref-456",
  "promiseDate": "2024-01-20T00:00:00Z",
  "amount": 10000,
  "note": "Customer promised to pay after salary",
  "agentId": "AGT001"
}
```

**Response:**
```json
{
  "id": "PTP789",
  "clientRef": "uuid-ptp-ref-456",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### POST /collections/:loanId/note
**Request:**
```json
{
  "clientRef": "uuid-note-ref-789",
  "text": "Customer not available at home. Neighbor informed he will be back tomorrow.",
  "agentId": "AGT001"
}
```

**Response:**
```json
{
  "id": "NOTE456",
  "clientRef": "uuid-note-ref-789",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### GET /loans/:loanId
**Response:**
```json
{
  "loanId": "LN001",
  "customerName": "John Doe",
  "customerPhone": "+919876543210",
  "principal": 50000,
  "status": "active",
  "agentId": "AGT001",
  "dpd": 15,
  "bucket": "B1",
  "outstandingAmount": 20000,
  "nextDueDate": "2024-01-20",
  "schedule": [
    {
      "installmentNo": 1,
      "dueDate": "2024-01-15",
      "amount": 5000,
      "status": "paid",
      "paidAmount": 5000
    },
    {
      "installmentNo": 2,
      "dueDate": "2024-01-20",
      "amount": 5000,
      "status": "pending",
      "paidAmount": 0
    }
  ]
}
```

## File Upload (Presigned URL approach)

### POST /uploads/presigned-url
**Request:**
```json
{
  "fileName": "receipt.jpg",
  "fileType": "image/jpeg",
  "purpose": "payment_receipt"
}
```

**Response:**
```json
{
  "uploadUrl": "https://s3.amazonaws.com/bucket/signed-url",
  "fileKey": "payments/uuid/receipt.jpg",
  "expiresIn": 3600
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid payment amount",
  "details": {
    "field": "amount",
    "code": "INVALID_VALUE"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token"
}
```

### 409 Conflict (Duplicate)
```json
{
  "error": "DUPLICATE_TRANSACTION",
  "message": "Payment with this clientRef already exists",
  "existingTransactionId": "TXN123456"
}
```