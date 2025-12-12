# Collections Engine

A comprehensive collections management system for loan recovery with advanced DPD calculation, bucketing, and escalation workflows.

## Features

### 1. DPD (Days Past Due) Calculation
- Automatic calculation based on earliest overdue installment
- Real-time updates on loan fetch and payment processing
- Accurate tracking of overdue periods

### 2. Bucketing System
- **Current**: DPD = 0
- **X**: 1-7 days
- **Y**: 8-14 days  
- **M1**: 15-30 days
- **M2**: 31-60 days
- **M3**: 61-90 days
- **NPA**: >90 days

### 3. Collection APIs

#### Fetch APIs
```
GET /api/v1/collections/due-today     - Loans due today
GET /api/v1/collections/overdue       - All overdue loans
GET /api/v1/collections/bucket/:bucket - Loans by bucket
GET /api/v1/collections/agents/:agentId - Loans by agent
GET /api/v1/collections/summary       - Collection summary
GET /api/v1/collections/dashboard     - Dashboard data
```

#### Action APIs
```
POST /api/v1/collections/:loanId/payment  - Add payment
POST /api/v1/collections/:loanId/ptp      - Promise to Pay
POST /api/v1/collections/:loanId/note     - Add collection note
POST /api/v1/collections/:loanId/escalate - Manual escalation
POST /api/v1/collections/assign           - Assign to agent
```

### 4. Payment Processing
- Auto-allocation to earliest unpaid installments
- Transaction tracking with allocation details
- Real-time loan metric updates
- Event logging for audit trail

### 5. Promise to Pay (PTP)
- Date validation (future dates only)
- Automatic broken PTP detection
- Historical PTP tracking
- Status management (active/broken/kept)

### 6. Escalation Workflow
- **Level 0**: None
- **Level 1**: Field Officer (DPD > 14)
- **Level 2**: Supervisor (DPD > 30)  
- **Level 3**: Legal (DPD > 60)
- Manual escalation with reason tracking

### 7. Agent Assignment
- Loan-to-agent mapping
- Assignment history tracking
- Agent-specific loan queries

## Usage Examples

### Add Payment
```javascript
POST /api/v1/collections/LN123456/payment
{
  "amount": 5000,
  "mode": "cash",
  "notes": "Partial payment received"
}
```

### Create Promise to Pay
```javascript
POST /api/v1/collections/LN123456/ptp
{
  "ptpDate": "2024-01-15",
  "amount": 10000,
  "note": "Customer promised to pay by salary date"
}
```

### Assign Loan to Agent
```javascript
POST /api/v1/collections/assign
{
  "loanId": "LN123456",
  "agentId": "agent123"
}
```

## Background Workers

### Collections Worker
- Runs hourly to update loan metrics
- Daily comprehensive update at 6 AM
- Automatic broken PTP detection
- Escalation level updates

## Data Models

### Enhanced Loan Fields
```javascript
{
  dpd: Number,                    // Days past due
  collectionBucket: String,       // Current/X/Y/M1/M2/M3/NPA
  agentId: ObjectId,             // Assigned collection agent
  escalationLevel: Number,        // 0-3 escalation level
  ptp: {                         // Active promise to pay
    active: Boolean,
    promiseDate: Date,
    amount: Number,
    createdBy: ObjectId,
    createdAt: Date
  }
}
```

### Events Tracking
- Payment events with allocation details
- PTP creation and broken PTP events
- Escalation events with level changes
- Assignment events with agent changes
- Collection notes and status updates

## Security & Permissions

- Authentication required for all endpoints
- Role-based access for escalation and assignment
- Agent-specific data filtering
- Audit trail for all collection activities

## Performance Optimizations

- Indexed fields for fast queries
- Efficient aggregation pipelines
- Batch processing for metric updates
- Optimized payment allocation algorithm

## Monitoring & Reporting

- Collection efficiency metrics
- Bucket-wise statistics
- Agent performance tracking
- Escalation summaries
- Real-time dashboard data