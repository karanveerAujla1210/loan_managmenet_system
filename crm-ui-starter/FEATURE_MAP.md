# LoanHub CRM - Complete Feature Map

## 🗺️ Application Navigation Map

```
┌─────────────────────────────────────────────────────────────────┐
│                     LoanHub CRM Dashboard                        │
├────────────────────────┬────────────────────────────────────────┤
│                        │                                         │
│    SIDEBAR             │        MAIN CONTENT AREA                │
│  (Left Navigation)     │     (Header + Page Content)             │
│                        │                                         │
│  📊 Dashboard    ──────┼──────> Dashboard Page                   │
│  👥 Customers    ──────┼──────> Customer List                    │
│  🧠 Credit Anal. ──────┼──────> Credit Analysis                  │
│  💰 Collections  ──────┼──────> Collections Mgmt                 │
│  ✅ Case Closure ──────┼──────> Case Closure                     │
│  📈 Reports      ──────┼──────> Reports                          │
│  ⚙️ Settings     ──────┼──────> Settings                         │
│                        │                                         │
│  [Sign Out]            │                                         │
└────────────────────────┴────────────────────────────────────────┘
```

---

## 📄 Complete Page Inventory

### 1. LOGIN PAGE
**Route**: `/login`  
**Auth Required**: No  
**Purpose**: User authentication

#### Components
- Login card with email/password fields
- Password visibility toggle
- "Remember me" checkbox
- "Forgot password?" link
- Error message display
- Demo credentials section
- Bank-grade security messaging
- Responsive split layout (branding left, form right)

#### Features
- Email validation
- Password strength indicator
- Loading state on submit
- Error handling
- Demo credentials pre-filled
- Trust badges (ISO, RBI, SOC 2)

---

### 2. DASHBOARD
**Route**: `/dashboard`  
**Auth Required**: Yes  
**Purpose**: Portfolio overview and analytics

#### Sections

**A. KPI Cards (6 total)**
- Total Portfolio (₹ amount, trend)
- Active Loans (count, overdue indicator)
- Total Collected (₹ amount, trend)
- Total Customers (count, new this month)
- Collection Rate (%, target comparison)
- Overdue Cases (count, % of portfolio)

**B. Charts**
- **Disbursement vs Collection**: 6-month bar chart
- **DPD Distribution**: Donut chart showing portfolio health
- Color-coded for easy interpretation

**C. Recent Loans Table**
- Loan ID, Customer, Amount, Collected, DPD, Status
- Sortable columns
- Color-coded status badges
- Clickable rows (future enhancement)

#### Responsive Layout
- Desktop: 3 KPI per row, 2-column charts, full table
- Tablet: 2 KPI per row, stacked charts, horizontal table scroll
- Mobile: 1 KPI per row, stacked charts, card-style table

---

### 3. CUSTOMERS
**Route**: `/customers`  
**Auth Required**: Yes  
**Purpose**: Customer management and search

#### Features

**A. Search & Filter**
- Real-time search by name, email, phone
- Status filter buttons (All, Active, Closed, Default)
- Debounced search (300ms delay)

**B. Customer Grid**
- Card-based responsive layout
- 3 columns (desktop), 2 (tablet), 1 (mobile)
- Each card shows:
  - Customer name, status badge
  - Email, phone, PAN
  - Total loan count
  - Total portfolio amount

**C. Interactions**
- Click card to open detailed profile
- Add Customer button (top right)
- Hover effects on cards
- Search clears results instantly

#### Data Fields
```
- Name, Email, Phone, PAN
- Status, Profile Image
- Loan Count, Total Loan Amount
- Created Date
```

---

### 4. CUSTOMER DETAIL
**Route**: `/customers/:id`  
**Auth Required**: Yes  
**Purpose**: Detailed customer profile

#### Page Sections

**A. Header**
- Back button to customer list
- Large profile image
- Customer name
- Status badge
- Edit profile button

**B. Contact Information**
- Email (with icon)
- Phone (with icon)
- PAN Number
- Member Since date

**C. Tabs**

**Tab 1: Overview**
- Financial Summary:
  - Total Portfolio
  - Active Loans count
  - Average LTV
- Credit Profile:
  - CIBIL Score
  - Risk Category
  - Default History

**Tab 2: Loans**
- Table of all customer loans:
  - Loan ID, Amount, Interest Rate
  - Tenure, Collected, DPD
  - Status badges with colors

**Tab 3: Activity**
- Timeline of events:
  - Disbursements
  - Payments
  - Approvals
  - Linked documents

---

### 5. CREDIT ANALYSIS
**Route**: `/credit-analysis`  
**Auth Required**: Yes  
**Purpose**: Credit scoring and eligibility analysis

#### Components

**A. Customer Selector**
- Dropdown to select customer
- Auto-fetch analysis on change

**B. Key Metrics**
- Credit Score (745/900)
- Eligibility (₹50L)
- Risk Rating (Low/Medium/High)

**C. Credit Profile Radar**
- 5-factor radar chart:
  - Income Stability
  - Repayment History
  - Debt-to-Income
  - Asset Quality
  - Business Health

**D. Income vs EMI Analysis**
- Monthly Income (verified)
- Proposed EMI
- EMI to Income Ratio
- Warning if ratio high

**E. Debt Obligations**
- Existing EMIs
- Credit card dues
- Proposed EMI
- Total monthly obligations
- Leverage warning

**F. Credit Score Distribution**
- Bar chart of score ranges
- Portfolio distribution

**G. Risk Assessment**
- Risk flags (if any)
- Recommendations
- Color-coded warnings

---

### 6. COLLECTIONS
**Route**: `/collections`  
**Auth Required**: Yes  
**Purpose**: Collections management and DPD tracking

#### Sections

**A. DPD Buckets (4 Cards)**
- Current (0 DPD) - Green
- Bucket 1 (1-30 DPD) - Yellow
- Bucket 2 (31-60 DPD) - Orange
- Bucket 3 (60+ DPD) - Red

Each shows:
- Case count, Outstanding amount
- Clickable to view loans

**B. Loan List (for selected bucket)**
- Loan ID, Principal, DPD
- Clickable rows
- Max height with scroll

**C. Selected Loan Details**
- Loan ID, Principal, Days Overdue
- Outstanding amount
- Next EMI due

**D. Quick Actions**
- Make Call button
- Send SMS button
- Record Payment button

**E. Promise to Pay Tracking**
- Promised date and amount
- Follow-up remaining days
- Last contact date/time

**F. Call Logs Timeline**
- Chronological list of calls
- Customer name, Loan ID, Time
- Call status (Collected/Promise/Not Connected)
- Outcome description
- Colored indicators

---

### 7. CASE CLOSURE
**Route**: `/case-closure`  
**Auth Required**: Yes  
**Purpose**: Loan completion workflow

#### Success Flow (Loan Closed)

**A. Visual Confirmation**
- Large success checkmark icon
- "Loan Closed Successfully" heading
- Case number (LA-00001)

**B. Closure Summary**
- Customer name
- Loan amount (₹3,00,000)
- Total collected (₹3,45,000)
- Tenure, Interest rate, Closed date
- Settlement status

**C. Closure Checklist**
- 6 completed steps with dates:
  1. Full Payment Received
  2. Final Interest Calculated
  3. Settlement Confirmed
  4. Documents Prepared
  5. Customer Notified
  6. Closure Certificate Issued

**D. Documents Section**
- Loan Closure Certificate (download)
- Settlement Statement (download)
- Payment History Report (download)

**E. Actions**
- Download All Documents button
- Share with Customer button

**F. Footer Note**
- Thank you message
- Confirmation that documents are available

#### Pending Flow (No active closures)
- Message: "No pending closures"
- Sample closure button (for demo)

---

### 8. REPORTS
**Route**: `/reports`  
**Auth Required**: Yes  
**Purpose**: Business reporting and analytics

#### Features

**A. Report Generator**
- Report type selector (dropdown)
- Date range picker (month/year)
- Generate Report button

**B. Available Reports**
- Portfolio Summary
- Collection Report
- DPD Analysis
- Customer KYC Report

**C. Recent Reports List**
- Report name
- Generated date
- Number of pages
- File size
- Download button

---

### 9. SETTINGS
**Route**: `/settings`  
**Auth Required**: Yes  
**Purpose**: User account and preferences

#### Tabs

**Tab 1: Profile**
- Full name (editable)
- Email (read-only)
- Role (read-only)
- Member Since (read-only)
- Profile picture upload
- Save Changes button

**Tab 2: Password**
- Current password field
- New password field
- Confirm password field
- Update Password button

**Tab 3: Notifications**
- Payment Reminders (toggle)
- System Updates (toggle)
- Daily Reports (toggle)
- Overdue Alerts (toggle)

**Tab 4: Security**
- Two-Factor Authentication (enable/disable)
- Active Sessions list
- Logout option per session

---

## 🧩 Shared Components

### Layout Components
```
MainLayout
├── Sidebar (fixed left navigation)
├── Header (sticky top bar with search, notifications, profile)
└── Outlet (page content area - scrollable)
```

### UI Components
```
Card                 - Reusable container
Input                - Form field with label/error
Button               - CTA with variants
Badge                - Status/category indicator
Kpi                  - Metric display
Modal                - Dialog overlay
ProgressRing         - Circular progress
StatusDot            - Status indicator
Timeline             - Activity feed
```

### Chart Components
```
BarChart             - For trends/comparisons
PieChart             - For distributions
RadarChart           - For multi-factor analysis
LineChart            - For time series (future)
```

---

## 🔀 Navigation Flow

```
LOGIN
  ↓
DASHBOARD (default landing after login)
  ├─→ CUSTOMERS
  │    └─→ CUSTOMER DETAIL
  │         ├─→ Overview Tab
  │         ├─→ Loans Tab
  │         └─→ Activity Tab
  ├─→ CREDIT ANALYSIS
  ├─→ COLLECTIONS
  ├─→ CASE CLOSURE
  ├─→ REPORTS
  └─→ SETTINGS
        ├─→ Profile Tab
        ├─→ Password Tab
        ├─→ Notifications Tab
        └─→ Security Tab
```

---

## 📊 Data Models

### User
```typescript
{
  id: string
  email: string
  name: string
  role: 'admin' | 'loan_officer' | 'collector' | 'analyst' | 'manager'
  avatar?: string
}
```

### Customer
```typescript
{
  id: string
  name: string
  email: string
  phone: string
  panNumber: string
  status: 'active' | 'inactive' | 'closed' | 'default'
  createdAt: string
  loanCount: number
  totalLoanAmount: number
  profileImage?: string
}
```

### Loan
```typescript
{
  id: string
  loanId: string
  customerId: string
  amount: number
  principalAmount: number
  interestRate: number
  tenure: number
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  disbursedAmount: number
  collectedAmount: number
  dpd: number
  status: 'active' | 'closed' | 'default'
  createdAt: string
  nextPaymentDue: string
  bucket: 'current' | 'bucket1' | 'bucket2' | 'bucket3' | 'bucket4'
}
```

---

## 🎯 Role-Based Features

### Loan Officer
- ✅ Dashboard (full access)
- ✅ Customers (create, view, edit)
- ✅ Credit Analysis (analyze, recommend)
- ✅ Reports (view only)
- ✅ Settings

### Collector
- ✅ Dashboard (limited)
- ✅ Collections (primary)
- ✅ Customers (view only)
- ✅ Settings

### Analyst
- ✅ Dashboard (full access)
- ✅ Credit Analysis (advanced)
- ✅ Reports (generate all)
- ✅ Settings

### Manager
- ✅ All features
- ✅ Team reports
- ✅ Performance analytics
- ✅ System settings

### Admin
- ✅ Full system access
- ✅ User management
- ✅ All reports
- ✅ All settings

---

## 💾 State Management

### Global State
- **AuthContext**: User authentication, role, session

### Local State
- **Page Components**: Form inputs, filters, selections
- **UI State**: Modal open/close, tabs, dropdowns

### Data Persistence
- **localStorage**: User session, preferences
- **sessionStorage**: Temporary data

---

## 🔄 Update Frequency

| Page | Auto-Refresh |
|------|--------------|
| Dashboard | 5 minutes (configurable) |
| Customers | Manual + search |
| Collections | Real-time (WebSocket) |
| Credit Analysis | On customer select |
| Reports | Manual |
| Settings | On save |

---

**Total Pages**: 9  
**Total Components**: 30+  
**Total Features**: 50+  
**Responsive Breakpoints**: 3 (mobile, tablet, desktop)  

✅ **All pages are production-ready and fully functional with mock data!**
