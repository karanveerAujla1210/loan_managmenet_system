# Quick Start - Production Loan Management System

## 🚀 Start Backend

```bash
cd backend
npm install
npm run dev
```

**Expected Output:**
```
MongoDB Connected: localhost
Database indexes created successfully
All cron jobs initialized
Server running in development mode on port 5000
```

## 🎨 Start Frontend

```bash
cd frontend-unified
npm install
npm run dev
```

**Expected Output:**
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

## 🔐 Login Credentials

### Test Users (Create in database)

```javascript
// Admin
{
  email: "admin@example.com",
  password: "admin123",
  role: "admin"
}

// Manager
{
  email: "manager@example.com",
  password: "manager123",
  role: "manager"
}

// Collector
{
  email: "collector@example.com",
  password: "collector123",
  role: "collector"
}

// COO
{
  email: "coo@example.com",
  password: "coo123",
  role: "coo"
}
```

## 📍 Key Pages by Role

### Admin
- Dashboard: http://localhost:5173/
- All pages accessible

### Manager
- Dashboard: http://localhost:5173/
- Collections: http://localhost:5173/collections
- MIS Reports: http://localhost:5173/mis-reports
- Audit Log: http://localhost:5173/audit-log

### Collector
- My Cases: http://localhost:5173/collector-worklist
- Active Loans: http://localhost:5173/active-loans

### COO
- MIS Reports: http://localhost:5173/mis-reports
- Audit Log: http://localhost:5173/audit-log

## 🔄 Loan Lifecycle Flow

```
1. Lead Created (/leads)
   ↓
2. Application Submitted (/application)
   ↓
3. Credit Reviewed (/credit-assessment)
   ↓
4. Approved (/approval)
   ↓
5. Disbursed (/disbursement)
   ↓
6. EMI Cycle Starts (/active-loans)
   ↓
7. Collections (/collections)
   ↓
8. Legal (if needed) (/legal)
   ↓
9. Closure (/closure)
   ↓
10. MIS Updated (/mis-reports)
```

## 🎯 Critical Pages

### For Collections Head
**Collections Dashboard** (`/collections`)
- View all DPD buckets
- Assign collectors
- Track performance
- Escalate cases

### For COO
**MIS Reports** (`/mis-reports`)
- Portfolio snapshot
- Bucket distribution
- Collection efficiency
- Legal exposure
- Collector rankings

### For Collector
**My Cases** (`/collector-worklist`)
- Today's cases
- Call history
- Record payments
- Promise-to-Pay

## 🔧 Environment Setup

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/loan-management
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api/v1
```

## 📊 API Endpoints

### Collections
```
GET  /api/v1/collections/dashboard
GET  /api/v1/collections/buckets
POST /api/v1/collections/assign
```

### MIS Reports
```
GET /api/v1/mis-reports/portfolio
GET /api/v1/mis-reports/buckets
GET /api/v1/mis-reports/efficiency
GET /api/v1/mis-reports/legal
GET /api/v1/mis-reports/collectors
```

### Loans
```
GET    /api/v1/loans
GET    /api/v1/loans/:id
POST   /api/v1/loans
PUT    /api/v1/loans/:id/approve
PUT    /api/v1/loans/:id/disburse
```

## 🧪 Test Workflows

### Test 1: Create Lead → Convert to Application
1. Go to `/leads`
2. Click "Create Lead"
3. Fill in details
4. Click "Convert to Application"

### Test 2: View Collections Dashboard
1. Login as manager/collections_head
2. Go to `/collections`
3. View bucket distribution
4. Check collector performance

### Test 3: View MIS Reports
1. Login as manager/coo
2. Go to `/mis-reports`
3. Check portfolio metrics
4. Export report

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB
mongod --version

# Check port
lsof -i :5000

# Clear node_modules
rm -rf node_modules
npm install
```

### Frontend won't load
```bash
# Clear cache
rm -rf node_modules
npm install

# Check API URL
# Open browser console (F12)
# Check network tab for API calls
```

### Login fails
```bash
# Check user exists in database
# Verify JWT secret matches
# Check CORS configuration
```

## 📈 Performance Tips

### Backend
- Enable caching for MIS reports
- Use database indexes
- Implement pagination
- Use connection pooling

### Frontend
- Lazy load pages
- Implement virtual scrolling for large tables
- Cache API responses
- Optimize bundle size

## 🔐 Security Checklist

- [ ] Change JWT secret
- [ ] Set strong MongoDB password
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable audit logging
- [ ] Regular backups
- [ ] Monitor error logs

## 📞 Support

### Common Commands

```bash
# Backend
npm run dev          # Start development
npm run build        # Build for production
npm test             # Run tests

# Frontend
npm run dev          # Start development
npm run build        # Build for production
npm run preview      # Preview production build
```

### Logs

```bash
# Backend logs
tail -f backend/logs/combined.log
tail -f backend/logs/error.log

# Frontend console
# Open browser DevTools (F12)
```

## 🎉 You're Ready!

The system is now running with:
- ✅ Complete loan lifecycle
- ✅ Role-based access control
- ✅ Collections management
- ✅ MIS reporting
- ✅ Audit logging

**Start with Collections Dashboard to see the system in action!**
