# 🔐 Login Credentials - MIS Reports Testing

## Test User Accounts

### 1. Admin User
```
Email:    admin@loanmanagement.com
Password: Admin@123
Role:     admin
```
**Access**: All features including MIS Reports

### 2. Manager User
```
Email:    manager@loanmanagement.com
Password: Manager@123
Role:     manager
```
**Access**: All features including MIS Reports

### 3. COO User (if available)
```
Email:    coo@loanmanagement.com
Password: COO@123
Role:     coo
```
**Access**: MIS Reports and dashboard

---

## How to Login

### Step 1: Start Backend
```bash
cd backend
npm start
```

### Step 2: Start Frontend
```bash
cd frontend-unified
npm run dev
```

### Step 3: Open Browser
Navigate to: `http://localhost:3000` (or your frontend URL)

### Step 4: Enter Credentials
- **Email**: `admin@loanmanagement.com` (or manager/coo)
- **Password**: `Admin@123` (or Manager@123/COO@123)

### Step 5: Navigate to MIS Reports
- Click "MIS Reports" in the navigation menu
- All 6 reports should load with real data

---

## Create Test Data

To create test users and data, run:

```bash
cd backend
npm run seed
```

This will create:
- Admin user
- Manager user
- 2 sample customers
- 2 sample loans

---

## Troubleshooting Login

### Issue: "Invalid credentials"
**Solution**: 
- Verify email is correct: `admin@loanmanagement.com`
- Verify password is correct: `Admin@123`
- Check database has users (run `npm run seed`)

### Issue: "User not found"
**Solution**:
- Run seed script: `npm run seed`
- Check MongoDB is running
- Check database connection

### Issue: "Cannot connect to backend"
**Solution**:
- Verify backend is running: `npm start`
- Check backend port (default: 5000)
- Check CORS configuration

---

## User Roles & Access

| Role | MIS Reports | Dashboard | Loans | Payments |
|------|-------------|-----------|-------|----------|
| admin | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| manager | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| coo | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| collector | ❌ No | ❌ No | ✅ Yes | ✅ Yes |

---

## MIS Reports Access

MIS Reports are accessible to:
- ✅ Admin users
- ✅ Manager users
- ✅ COO users

Other roles will see "Access Denied" message.

---

## Test Workflow

1. **Login as Admin**
   ```
   Email: admin@loanmanagement.com
   Password: Admin@123
   ```

2. **Navigate to MIS Reports**
   - Click "MIS Reports" in navigation
   - Wait for data to load

3. **Verify All 6 Reports**
   - Portfolio Snapshot ✅
   - Bucket-wise Exposure ✅
   - Collection Efficiency ✅
   - Legal Exposure ✅
   - Collector Performance ✅
   - Aging Analysis ✅

4. **Test Date Range Filter**
   - Select "Today"
   - Select "This Week"
   - Select "This Month"
   - Select "This Quarter"

5. **Test Export Button**
   - Click "Export" button
   - Verify CSV downloads (if implemented)

---

## Database Connection

### Local MongoDB
```
Connection String: mongodb://localhost:27017/nbfc_loan_management
```

### MongoDB Atlas (Cloud)
```
Connection String: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/nbfc_loan_management
```

Set in `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/nbfc_loan_management
```

---

## Environment Variables

Create `.env` file in backend folder:

```
# Database
MONGODB_URI=mongodb://localhost:27017/nbfc_loan_management

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## Quick Start Commands

```bash
# Install dependencies
cd backend && npm install
cd ../frontend-unified && npm install

# Seed test data
cd backend && npm run seed

# Start backend
cd backend && npm start

# Start frontend (in new terminal)
cd frontend-unified && npm run dev

# Login with
Email: admin@loanmanagement.com
Password: Admin@123
```

---

## API Testing with Postman

### Get Auth Token
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@loanmanagement.com",
  "password": "Admin@123"
}
```

### Use Token in Headers
```
Authorization: Bearer <token_from_response>
```

### Test MIS Reports Endpoints
```
GET http://localhost:5000/api/v1/reports/portfolio
GET http://localhost:5000/api/v1/reports/buckets
GET http://localhost:5000/api/v1/reports/efficiency
GET http://localhost:5000/api/v1/reports/legal
GET http://localhost:5000/api/v1/reports/collectors
GET http://localhost:5000/api/v1/reports/aging
```

---

## Common Issues

### Issue: Login page not loading
**Solution**: 
- Check frontend is running: `npm run dev`
- Check frontend URL: `http://localhost:3000`
- Check browser console for errors

### Issue: MIS Reports page shows "Access Denied"
**Solution**:
- Verify user role is admin/manager/coo
- Check token is valid
- Try logging out and logging back in

### Issue: MIS Reports shows empty data
**Solution**:
- Run seed script: `npm run seed`
- Check MongoDB has data
- Check backend logs for errors

### Issue: "Cannot GET /api/v1/reports/..."
**Solution**:
- Verify backend is running
- Check routes are registered in app.js
- Restart backend server

---

## Support

For issues:
1. Check browser console (F12)
2. Check backend logs
3. Check MongoDB connection
4. Verify credentials are correct
5. Run seed script to create test data

---

**Ready to login!** 🎉

Use the credentials above to access the MIS Reports system.

---

**Generated**: 2024-01-15
**System**: Loan Management System (NBFC)
**Component**: MIS Reports System
