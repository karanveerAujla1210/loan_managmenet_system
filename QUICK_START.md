# Quick Start Guide

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Database Setup

```bash
# Start MongoDB (if using Docker)
docker-compose up -d mongodb

# Create indexes
mongosh < docs/mongodb-indexes.js
```

## API Endpoints

### Health Check
```bash
curl http://localhost:5000/health
```

### Overdue Buckets
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/v1/overdue/buckets
```

### Legal Cases
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/v1/legal/cases
```

### Manual Payment
```bash
curl -X POST http://localhost:5000/api/v1/payments/manual \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "loanId": "loan123",
    "amount": 5000,
    "paymentDate": "2024-01-01",
    "mode": "BANK_TRANSFER",
    "utr": "UTR123456"
  }'
```

### MIS Reports
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/v1/reports/mis
```

## Key Files

- Backend: `backend/src/server.js`
- Frontend: `frontend/src/App.jsx`
- Routes: `frontend/src/routes.jsx`
- API Spec: `docs/openapi.yaml`
- Deployment: `docs/DEPLOYMENT.md`

## Testing

```bash
# Backend tests
cd backend
npm test

# Lint
npm run lint
```

## Production Deployment

```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

See `docs/DEPLOYMENT.md` for detailed instructions.
