# 🛣️ ROUTING SUMMARY - Business Loan CRM

## Overview
Complete routing architecture for the Business Loan Management System, including backend API routes and frontend navigation.

---

## 📡 BACKEND API ROUTES

### Base URL: `/api/v1`

#### 1. **Authentication Routes** (`/auth`)
| Method | Endpoint | Purpose | Auth | Role |
|--------|----------|---------|------|------|
| POST | `/register` | User registration | ❌ | Public |
| POST | `/login` | User login | ❌ | Public |
| GET | `/me` | Get current user | ✅ | All |
| PUT | `/updatedetails` | Update user profile | ✅ | All |
| PUT | `/updatepassword` | Change password | ✅ | All |
| POST | `/forgotpassword` | Request password reset | ❌ | Public |
| PUT | `/resetpassword/:resettoken` | Reset password | ❌ | Public |
| GET | `/logout` | Logout user | ✅ | All |

**Security**: CSRF protection, rate limiting, password validation

---

#### 2. **Loan Routes** (`/loans`)
| Method | Endpoint | Purpose | Auth | Role |
|--------|----------|---------|------|------|
| POST | `/` | Create new loan | ✅ | Admin, Manager |
| GET | `/` | Get all loans | ✅ | All |
| GET | `/:id` | Get loan details | ✅ | All |
| GET | `/bucket/:bucket` | Get loans by bucket | ✅ | All |
| POST | `/payment` | Add payment to loan | ✅ | Admin, Manager, Collector |

**Buckets**: CURRENT, 1-7, 8-15, 16-22, 23-29, 30+, 60+, LEGAL

---

#### 3. **Payment Routes** (`/payments`)
| Method | Endpoint | Purpose | Auth | Role |
|--------|----------|---------|------|------|
| GET | `/` | Get all payments | ✅ | All |
| POST | `/` | Record new payment | ✅ | All |

**Validation**: Loan ID, amount, payment method (cash, cheque, online, upi), reference

**Audit**: All payments logged with user details, IP, user agent

---

#### 4. **Customer Routes** (`/customers`)
| Method | Endpoint | Purpose | Auth | Role |
|--------|----------|---------|------|------|
| GET | `/` | Get all customers | ✅ | All |
| POST | `/` | Create customer | ✅ | All |
| GET | `/:id` | Get customer details | ✅ | All |
| PUT | `/:id` | Update customer | ✅ | All |

**Fields**: customerId, name, email, phone, address, KYC status

---

#### 5. **Dashboard Routes** (`/dashboard`)
| Method | Endpoint | Purpose | Auth | Role |
|--------|----------|---------|------|------|
| GET | `/stats` | Dashboard statistics | ✅ | All |
| GET | `/activities` | Recent activities | ✅ | All |
| GET | `/trends` | Collection trends | ✅ | All |
| GET | `/portfolio` | Loan portfolio overview | ✅ | All |
| GET | `/risk-analytics` | Risk analysis | ✅ | All |
| GET | `/agent-performance` | Agent performance metrics | ✅ | Manager, Admin |
| GET | `/compliance` | Compliance status | ✅ | Manager, Admin |
| GET | `/alerts` | System alerts | ✅ | All |
| PATCH | `/alerts/:alertId/read` | Mark alert as read | ✅ | All |
| GET | `/system-health` | System health status | ✅ | Admin |
| GET | `/export` | Export dashboard data | ✅ | Admin, Manager |

---

#### 6. **Admin Routes** (`/admin`)
| Method | Endpoint | Purpose | Auth | Role |
|--------|----------|---------|------|------|
| POST | `/dpd-update` | Trigger manual DPD update | ✅ | Admin |
| GET | `/dpd-status` | Check DPD cron status | ✅ | Admin, Manager |

**Schedule**: DPD cron runs daily at 2:30 AM

---

#### 7. **Audit Routes** (`/audit`)
| Method | Endpoint | Purpose | Auth | Role |
|--------|----------|---------|------|------|
| GET | `/loan/:loanId` | Get loan audit trail | ✅ | All |
| GET | `/range` | Get logs by date range | ✅ | All |
| GET | `/user/:userId` | Get user activity summary | ✅ | All (own) / Admin, Manager (others) |

**Query Params**: startDate, endDate, userId, action, page, limit

---

## 🎨 FRONTEND ROUTES

### Base Path: `/`

#### Protected Routes (Require Authentication)
```
/dashboard                    → Dashboard (All roles)
/customers                    → Customer list (All roles)
/customers/:id               → Customer detail (All roles)
/leads                        → Leads management (All roles)
/credit-analysis             → Credit analysis (All roles)
/operations                  → Operations (All roles)
/disbursement                → Disbursement (All roles)
/collections                 → Collections (All roles)
/reports                     → Reports (All roles)
/case-closure                → Case closure (All roles)
/loans                       → Loans list (All roles)
/audit                       → Audit logs (All roles)
/upload                      → Data upload (Admin)
/profile                     → User profile (All roles)
```

#### Public Routes (No Authentication)
```
/login                       → Login page
/register                    → Registration page
/forgot-password             → Forgot password
/reset-password              → Reset password
```

#### Default Behavior
- `/` → Redirects to `/dashboard`
- `/*` (unknown) → Redirects to `/dashboard`

---

## 🔐 ROLE-BASED ACCESS CONTROL

### Roles & Permissions

| Feature | Collector | Manager | Legal | Admin |
|---------|-----------|---------|-------|-------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Active Loans | ✅ | ✅ | ❌ | ✅ |
| Overdue Buckets | ✅ | ✅ | ❌ | ✅ |
| Manual Payment | ✅ | ✅ | ❌ | ✅ |
| Customer Profile | ✅ | ✅ | ✅ (RO) | ✅ |
| Credit Analytics | ❌ | ✅ | ❌ | ✅ |
| Legal Cases | ❌ | ✅ | ✅ | ✅ |
| Bulk Upload | ❌ | ❌ | ❌ | ✅ |
| Bank Reconciliation | ❌ | ❌ | ❌ | ✅ |
| System Settings | ❌ | ❌ | ❌ | ✅ |
| DPD Manual Trigger | ❌ | ❌ | ❌ | ✅ |

---

## 🔄 MIDDLEWARE STACK

### Applied to All Routes
1. **Request Logger** - Logs all incoming requests
2. **Body Parser** - Parses JSON payloads
3. **Cookie Parser** - Parses cookies
4. **Session Middleware** - CSRF protection
5. **Data Sanitization** - MongoDB injection prevention
6. **Security Headers** (Helmet) - XSS, clickjacking protection
7. **XSS Protection** - Cleans malicious scripts
8. **Rate Limiting** - `/api/*` endpoints limited
9. **HPP Protection** - HTTP Parameter Pollution prevention
10. **CORS** - Cross-origin requests allowed from `CLIENT_URL`

### Route-Specific Middleware
- **Auth Routes**: CSRF protection, rate limiting
- **Payment Routes**: Audit logging
- **Protected Routes**: JWT authentication required

---

## 📊 CRON JOBS

| Job | Schedule | Purpose | Trigger |
|-----|----------|---------|---------|
| DPD Update | Daily 2:30 AM | Calculate DPD & update buckets | Automatic + Manual (`/admin/dpd-update`) |
| Promise Reminder | Daily 8:00 AM | Send promise reminders | Automatic |

---

## 🔗 API RESPONSE FORMAT

### Standard Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "role": "admin"
  }
}
```

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "error details"
}
```

---

## 🚀 DEPLOYMENT CONFIGURATION

### Environment Variables
```
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb://user:pass@host/db
JWT_SECRET=super-secure-secret
JWT_EXPIRY=8h
CLIENT_URL=http://localhost:3000
SESSION_SECRET=session-secret
CRON_ENABLED=true
```

### CORS Settings
- **Origin**: `CLIENT_URL` environment variable
- **Credentials**: Enabled
- **Methods**: GET, POST, PUT, DELETE
- **Headers**: Content-Type, Authorization

---

## 📋 AUDIT TRAIL

### Logged Actions
- User registration & login
- Payment recording
- Loan creation & updates
- DPD calculations
- Customer modifications
- Admin actions

### Audit Fields
- `action` - Type of action
- `userId` - User performing action
- `userEmail` - User email
- `userName` - User name
- `userRole` - User role
- `loanId` - Affected loan
- `oldValue` - Previous state
- `newValue` - New state
- `changedFields` - Modified fields
- `remarks` - Additional notes
- `amount` - Transaction amount
- `ipAddress` - Request IP
- `userAgent` - Browser info
- `timestamp` - When action occurred

---

## ⚠️ CRITICAL RULES

1. **Backend is Source of Truth**
   - All calculations (EMI, DPD, penalties) happen on backend
   - Frontend cannot override backend decisions

2. **No Silent Edits**
   - Every financial action is audited
   - Reconciled payments are immutable

3. **DPD & Buckets**
   - Calculated by cron job only
   - Manual override requires admin audit

4. **Legal Escalation**
   - Automatic at DPD ≥ 90
   - Collector access removed
   - Legal team takes ownership

5. **Payment Allocation**
   - Backend-controlled only
   - Penalties applied automatically
   - Installments updated deterministically

---

## 🔍 TROUBLESHOOTING

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 403 Forbidden | Insufficient role | Check user role & endpoint permissions |
| 401 Unauthorized | Missing/invalid JWT | Login again, check token expiry |
| 429 Too Many Requests | Rate limit exceeded | Wait before retrying |
| 404 Not Found | Invalid resource ID | Verify loan/customer ID exists |
| CSRF Token Error | Missing/invalid token | Ensure `x-csrf-token` header sent |

---

## 📞 Support

For routing issues or clarifications, refer to:
- Backend: `backend/routes/` directory
- Frontend: `frontend/src/App.jsx`
- README: `README.md` (pinned context)
