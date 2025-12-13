# Loan Servicing + Collections CRM - Frontend Architecture

## 1. LOGIN PAGE FLOW

### Login Component Structure
```
/login
├── Email/Username input
├── Password input
├── Role selection (optional - auto-detect from user profile)
├── Remember me checkbox
├── Forgot password link
└── Login button
```

### Role-Based Redirect Logic
- **Collector** → `/dashboard` (limited permissions)
- **Manager** → `/dashboard` (branch-level access)
- **Admin** → `/dashboard` (full system access)

### Authentication Flow
1. User enters credentials
2. System validates against user database
3. JWT token generated with role permissions
4. Redirect based on user role
5. Store user session + permissions in localStorage

---

## 2. DASHBOARD PAGE LAYOUT

### Top Metrics Cards (4-column grid)
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Today's         │ Total Overdue   │ Overdue Cases   │ Collection      │
│ Collection      │ Amount          │ Count           │ Target vs       │
│ ₹2,45,000       │ ₹15,67,890      │ 234 cases       │ Achieved        │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### DPD/Bucket Summary Widget
```
┌─────────────────────────────────────────────────────────────────────────┐
│ BUCKET ANALYSIS                                                         │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────────┤
│ Current │ X (1-30)│ Y (31-60│ M1(61-90│ M2(91-  │ M3(181+ │ Legal       │
│ ₹45L    │ ₹23L    │ ₹18L    │ ₹12L    │ 180)₹8L │ )₹5L    │ Cases ₹3L   │
│ 450 acc │ 230 acc │ 180 acc │ 120 acc │ 80 acc  │ 50 acc  │ 25 acc      │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────────┘
```

### Branch-wise Collection Cards
```
┌─────────────────┬─────────────────┬─────────────────┐
│ Delhi Branch    │ Mumbai Branch   │ Bangalore       │
│ Target: ₹5L     │ Target: ₹8L     │ Target: ₹6L     │
│ Achieved: ₹4.2L │ Achieved: ₹7.8L │ Achieved: ₹5.1L │
│ 84% Complete    │ 97% Complete    │ 85% Complete    │
└─────────────────┴─────────────────┴─────────────────┘
```

### Collector Performance Widget
```
┌─────────────────────────────────────────────────────────────────────────┐
│ TOP PERFORMERS TODAY                                                    │
├─────────────────┬─────────────────┬─────────────────┬─────────────────┤
│ Rahul Sharma    │ Priya Singh     │ Amit Kumar      │ Neha Gupta      │
│ ₹85,000         │ ₹78,000         │ ₹65,000         │ ₹58,000         │
│ 12 cases        │ 15 cases        │ 10 cases        │ 14 cases        │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### Quick Actions Panel
```
┌─────────────────────────────────────────────────────────────────────────┐
│ QUICK ACTIONS                                                           │
├─────────────────┬─────────────────┬─────────────────┬─────────────────┤
│ [💰] Update     │ [📋] View       │ [🏦] Bank       │ [📞] Follow Up  │
│ Payment         │ Overdue Loans   │ Match           │ Reminder        │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

---

## 3. SIDEBAR NAVIGATION STRUCTURE

```
📊 Dashboard
├── 💳 Credit Management
│   ├── Customer Credit Analysis
│   ├── Credit Health Summary
│   └── Loan-wise Credit Score
├── 💰 Disbursed Loans
│   ├── Active Loan Portfolio
│   ├── Loan Search & Filters
│   └── Loan Performance Analytics
├── ⚠️ Overdue Management
│   ├── DPD Bucket View
│   ├── Aging Analysis
│   ├── Follow-up Scheduler
│   └── Collection Assignment
├── ⚖️ Legal Cases
│   ├── Notice Management
│   ├── Court Case Tracking
│   ├── Legal Document Upload
│   └── Hearing Calendar
├── 💸 Payment Processing
│   ├── Manual Payment Entry
│   ├── Bulk Payment Upload
│   ├── Payment Allocation
│   └── Receipt Generation
├── 🏦 Bank Reconciliation
│   ├── UTR Matching
│   ├── Statement Upload
│   ├── Mismatch Resolution
│   └── Auto-reconciliation
├── 👤 Customer Management
│   ├── Customer Profile
│   ├── Loan History
│   ├── Call Log Management
│   ├── Document Repository
│   └── Communication History
├── 📊 Reports & Analytics
│   ├── Collection Performance
│   ├── Aging Reports
│   ├── Branch Performance
│   ├── Collector Efficiency
│   ├── Recovery Analytics
│   └── Regulatory Reports
├── 📞 Communication Center
│   ├── SMS Templates
│   ├── Email Campaigns
│   ├── Call Center Integration
│   └── WhatsApp Integration
├── 🔧 Operations
│   ├── Batch Processing
│   ├── Interest Calculation
│   ├── Penalty Management
│   └── EMI Schedule Updates
├── ⚙️ Settings
│   ├── User Management
│   ├── Role & Permissions
│   ├── Branch Configuration
│   ├── Interest Rate Setup
│   ├── Penalty Rules
│   └── System Configuration
└── 📋 Audit & Compliance
    ├── Audit Trail
    ├── Compliance Reports
    ├── Data Export
    └── Backup Management
```

---

## 4. LOAN SUMMARY PAGE DETAILED FLOW

### Page Layout Structure
```
┌─────────────────────────────────────────────────────────────────────────┐
│ LOAN DETAILS HEADER                                                     │
├─────────────────┬─────────────────┬─────────────────┬─────────────────┤
│ Loan ID: L12345 │ Customer: Rahul │ Branch: Delhi   │ Collector: Amit │
│ Amount: ₹5,00,000│ Phone: 98765   │ DPD: 45 days    │ Status: Overdue │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ FINANCIAL SUMMARY                                                       │
├─────────────────┬─────────────────┬─────────────────┬─────────────────┤
│ Principal       │ Interest        │ Penalty         │ Total           │
│ Outstanding     │ Outstanding     │ Outstanding     │ Outstanding     │
│ ₹3,45,000       │ ₹45,000         │ ₹12,000         │ ₹4,02,000       │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ EMI SCHEDULE TABLE                                                      │
├─────────┬─────────────┬─────────────┬─────────────┬─────────────┬───────┤
│ EMI No  │ Due Date    │ EMI Amount  │ Paid Amount │ Balance     │Status │
├─────────┼─────────────┼─────────────┼─────────────┼─────────────┼───────┤
│ 1       │ 15-Jan-2024 │ ₹25,000     │ ₹25,000     │ ₹0          │ Paid  │
│ 2       │ 15-Feb-2024 │ ₹25,000     │ ₹15,000     │ ₹10,000     │Partial│
│ 3       │ 15-Mar-2024 │ ₹25,000     │ ₹0          │ ₹25,000     │Overdue│
└─────────┴─────────────┴─────────────┴─────────────┴─────────────┴───────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ PAYMENT HISTORY TIMELINE                                                │
├─────────────────────────────────────────────────────────────────────────┤
│ 🟢 15-Jan-2024: ₹25,000 paid via UPI (Ref: UPI123456789)              │
│ 🟡 20-Feb-2024: ₹15,000 paid via Cash (Ref: CASH001)                   │
│ 🔴 15-Mar-2024: EMI Due - No payment received                          │
│ 📞 20-Mar-2024: Follow-up call - Customer promised payment by 25th     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ NOTES & FOLLOW-UPS                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│ [Add New Note] [Schedule Follow-up] [Update Payment] [Legal Action]     │
│                                                                         │
│ 📝 25-Mar-2024: Customer facing temporary financial difficulty          │
│ 📞 22-Mar-2024: Spoke to customer - will pay ₹20,000 by month end      │
│ ⚠️ 20-Mar-2024: First overdue notice sent via SMS                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Action Buttons Panel
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ [💰] Update     │ [📞] Add        │ [📋] Schedule   │ [⚖️] Legal      │
│ Payment         │ Follow-up       │ Visit           │ Action          │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

---

## 5. UPDATE PAYMENT MODULE FLOW

### Payment Entry Form
```
┌─────────────────────────────────────────────────────────────────────────┐
│ UPDATE PAYMENT - Loan ID: L12345                                        │
├─────────────────────────────────────────────────────────────────────────┤
│ Customer: Rahul Kumar                    Outstanding: ₹4,02,000          │
│ Phone: 9876543210                        DPD: 45 days                   │
├─────────────────────────────────────────────────────────────────────────┤
│ Payment Amount: [₹_______] (Required)                                   │
│ Payment Mode: [UPI ▼] [Cash] [Bank Transfer] [Cheque] [DD]             │
│ Reference Number: [____________] (Required for digital payments)        │
│ Payment Date: [25-Mar-2024] (Default: Today)                           │
│ Remarks: [_________________________________________________]            │
├─────────────────────────────────────────────────────────────────────────┤
│ AUTO-ALLOCATION PREVIEW                                                 │
│ Principal: ₹15,000 | Interest: ₹8,000 | Penalty: ₹2,000               │
│ [Manual Allocation] [Use Auto-allocation]                               │
├─────────────────────────────────────────────────────────────────────────┤
│ [Cancel] [Save Payment] [Save & Print Receipt]                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Post-Payment Updates
1. **Instant Updates:**
   - Outstanding amount recalculated
   - DPD updated if payment covers overdue EMIs
   - Bucket status updated
   - Dashboard metrics refreshed

2. **Automated Actions:**
   - SMS confirmation sent to customer
   - Receipt generated
   - Payment history updated
   - Next EMI reminder scheduled

---

## 6. OVERDUE LOANS MODULE

### Bucket View Interface
```
┌─────────────────────────────────────────────────────────────────────────┐
│ OVERDUE LOANS MANAGEMENT                                                │
├─────────────────────────────────────────────────────────────────────────┤
│ Filters: [Branch ▼] [Collector ▼] [DPD Range ▼] [Amount Range ▼]      │
│ [Search by Loan ID/Customer] [Export] [Bulk Actions ▼]                 │
├─────────────────────────────────────────────────────────────────────────┤
│ BUCKET TABS                                                             │
│ [X (1-30)] [Y (31-60)] [M1 (61-90)] [M2 (91-180)] [M3 (181+)] [Legal] │
├─────────────────────────────────────────────────────────────────────────┤
│ ☐ Loan ID    Customer      Phone       DPD  Outstanding  Last Payment  │
│ ☐ L12345     Rahul Kumar   9876543210   45   ₹4,02,000   20-Feb-2024   │
│ ☐ L12346     Priya Singh   9876543211   52   ₹2,15,000   10-Feb-2024   │
│ ☐ L12347     Amit Sharma   9876543212   38   ₹3,45,000   05-Mar-2024   │
├─────────────────────────────────────────────────────────────────────────┤
│ Selected: 3 loans | Total Outstanding: ₹9,62,000                       │
│ [Send SMS] [Schedule Calls] [Assign Collector] [Generate Notices]       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Bulk Actions Available
- Send reminder SMS to selected customers
- Schedule follow-up calls
- Assign to different collector
- Generate legal notices
- Export selected loans to Excel
- Mark for field visit

---

## 7. LEGAL CASES MODULE

### Case Management Interface
```
┌─────────────────────────────────────────────────────────────────────────┐
│ LEGAL CASES MANAGEMENT                                                  │
├─────────────────────────────────────────────────────────────────────────┤
│ [Add New Case] [Upload Documents] [Schedule Hearing] [Generate Report]  │
├─────────────────────────────────────────────────────────────────────────┤
│ Case ID     Loan ID    Customer      Type        Status      Next Date  │
│ LC001       L12345     Rahul Kumar   Notice      Sent        -          │
│ LC002       L12346     Priya Singh   Arbitration In Progress 15-Apr-24  │
│ LC003       L12347     Amit Sharma   Court Case  Filed       22-Apr-24  │
├─────────────────────────────────────────────────────────────────────────┤
│ CASE DETAILS - LC002                                                    │
│ Customer: Priya Singh | Outstanding: ₹2,15,000 | DPD: 120 days         │
│ Case Type: Arbitration | Status: In Progress                           │
│ Filed Date: 15-Mar-2024 | Next Hearing: 15-Apr-2024                    │
│                                                                         │
│ DOCUMENTS:                                                              │
│ 📄 Loan Agreement (15-Mar-2024)                                        │
│ 📄 Notice Copy (20-Mar-2024)                                           │
│ 📄 Arbitration Filing (25-Mar-2024)                                    │
│                                                                         │
│ ACTION LOG:                                                             │
│ 25-Mar-2024: Arbitration case filed                                    │
│ 20-Mar-2024: Legal notice sent to customer                             │
│ 15-Mar-2024: Case initiated due to non-response                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 8. BANK RECONCILIATION FLOW

### Upload & Match Interface
```
┌─────────────────────────────────────────────────────────────────────────┐
│ BANK RECONCILIATION                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│ Step 1: Upload Bank Statement                                           │
│ [Choose CSV File] [Upload] [Download Template]                          │
│ Last Upload: 24-Mar-2024 | Records: 156 | Matched: 142 | Pending: 14  │
├─────────────────────────────────────────────────────────────────────────┤
│ Step 2: Auto-Match Results                                              │
│ ✅ MATCHED TRANSACTIONS (142)                                           │
│ Date        Amount     UTR           Customer      Loan ID    Status    │
│ 25-Mar-24   ₹25,000   UTR123456789  Rahul Kumar   L12345     Matched   │
│ 25-Mar-24   ₹15,000   UTR123456790  Priya Singh   L12346     Matched   │
│                                                                         │
│ ❌ UNMATCHED TRANSACTIONS (14)                                          │
│ Date        Amount     UTR           Reason                             │
│ 25-Mar-24   ₹30,000   UTR123456791  No matching loan found             │
│ 25-Mar-24   ₹20,000   UTR123456792  Amount mismatch                    │
│                                                                         │
│ [Resolve Mismatches] [Approve Matched] [Export Report]                  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mismatch Resolution
```
┌─────────────────────────────────────────────────────────────────────────┐
│ RESOLVE MISMATCH - UTR123456791                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ Bank Transaction: ₹30,000 | Date: 25-Mar-2024                          │
│ Search Customer: [Rahul Kumar_______] [Search]                          │
│ Search Loan ID: [L12345____________] [Search]                           │
│                                                                         │
│ SUGGESTED MATCHES:                                                      │
│ ○ L12345 - Rahul Kumar - Outstanding: ₹4,02,000                        │
│ ○ L12348 - Rahul Kumar - Outstanding: ₹1,50,000                        │
│                                                                         │
│ [Manual Entry] [Mark as Unidentified] [Assign Match]                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 9. REPORTS MODULE

### Report Categories
```
┌─────────────────────────────────────────────────────────────────────────┐
│ REPORTS & ANALYTICS                                                     │
├─────────────────┬─────────────────┬─────────────────┬─────────────────┤
│ 📊 COLLECTION   │ 📈 PERFORMANCE  │ 📋 OPERATIONAL  │ 📊 REGULATORY   │
│ REPORTS         │ ANALYTICS       │ REPORTS         │ REPORTS         │
│                 │                 │                 │                 │
│ • Daily         │ • Branch        │ • Aging         │ • NPA Report    │
│   Collection    │   Performance   │   Analysis      │ • Provision     │
│ • Monthly       │ • Collector     │ • Legal Case    │   Report        │
│   Summary       │   Efficiency    │   Summary       │ • Audit Trail   │
│ • Recovery      │ • Trend         │ • Customer      │ • Compliance    │
│   Analysis      │   Analysis      │   Profile       │   Report        │
│ • Target vs     │ • Forecast      │ • Payment       │                 │
│   Achievement   │   Report        │   History       │                 │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### Sample Report Interface
```
┌─────────────────────────────────────────────────────────────────────────┐
│ DAILY COLLECTION REPORT - 25-Mar-2024                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ Filters: [Date Range] [Branch] [Collector] [Payment Mode]               │
│ [Generate] [Export PDF] [Export Excel] [Schedule Email]                 │
├─────────────────────────────────────────────────────────────────────────┤
│ SUMMARY                                                                 │
│ Total Collection: ₹15,67,890 | Target: ₹18,00,000 | Achievement: 87%   │
│ Number of Payments: 156 | Average Payment: ₹10,051                      │
├─────────────────────────────────────────────────────────────────────────┤
│ BRANCH-WISE BREAKDOWN                                                   │
│ Branch      Target      Collected   Achievement   Payments   Avg Amount │
│ Delhi       ₹6,00,000   ₹5,25,000   87.5%        45        ₹11,667     │
│ Mumbai      ₹8,00,000   ₹7,12,890   89.1%        67        ₹10,640     │
│ Bangalore   ₹4,00,000   ₹3,30,000   82.5%        44        ₹7,500      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 10. FRONTEND ROUTING STRUCTURE

### Route Hierarchy
```
/
├── /login
├── /dashboard
├── /credit
│   ├── /analysis
│   ├── /health-summary
│   └── /loan-wise-credit
├── /loans
│   ├── /disbursed
│   ├── /search
│   ├── /portfolio
│   └── /loan/:loanId
├── /overdue
│   ├── /buckets
│   ├── /aging
│   ├── /follow-up
│   └── /assignment
├── /legal
│   ├── /cases
│   ├── /notices
│   ├── /documents
│   └── /calendar
├── /payments
│   ├── /update
│   ├── /bulk-upload
│   ├── /allocation
│   └── /receipts
├── /reconciliation
│   ├── /upload
│   ├── /matching
│   ├── /mismatches
│   └── /approval
├── /customers
│   ├── /profile/:customerId
│   ├── /search
│   ├── /documents
│   └── /communication
├── /reports
│   ├── /collection
│   ├── /performance
│   ├── /operational
│   └── /regulatory
├── /communication
│   ├── /sms
│   ├── /email
│   ├── /calls
│   └── /whatsapp
├── /operations
│   ├── /batch-processing
│   ├── /interest-calculation
│   ├── /penalty-management
│   └── /emi-updates
├── /settings
│   ├── /users
│   ├── /roles
│   ├── /branches
│   ├── /rates
│   └── /configuration
└── /audit
    ├── /trail
    ├── /compliance
    ├── /export
    └── /backup
```

---

## 11. DAILY WORKFLOW FOR USERS

### Collector Daily Workflow
```
1. LOGIN → Dashboard View
   ↓
2. Check Today's Collection Target & Achievement
   ↓
3. Review Assigned Overdue Cases (DPD buckets)
   ↓
4. Priority Actions:
   • Call customers with 1-30 DPD
   • Follow up on promised payments
   • Update payments received
   • Schedule field visits for high-value cases
   ↓
5. Update Payment Module:
   • Enter cash collections
   • Record UPI/bank transfers
   • Generate receipts
   ↓
6. Add Follow-up Notes:
   • Customer conversation summary
   • Next action planned
   • Payment commitments
   ↓
7. End-of-Day Activities:
   • Submit collection report
   • Plan next day's calls
   • Update case status
```

### Manager Daily Workflow
```
1. LOGIN → Dashboard Overview
   ↓
2. Review Branch Performance:
   • Collection vs target
   • Team performance
   • Overdue trends
   ↓
3. Team Management:
   • Assign high-priority cases
   • Review collector performance
   • Approve legal case escalations
   ↓
4. Operational Tasks:
   • Bank reconciliation approval
   • Payment verification
   • Report generation
   ↓
5. Strategic Planning:
   • Identify problem accounts
   • Plan collection strategies
   • Resource allocation
   ↓
6. Reporting:
   • Daily collection report
   • Branch performance analysis
   • Escalation to senior management
```

### Admin Daily Workflow
```
1. LOGIN → System Overview
   ↓
2. System Health Check:
   • Overall collection performance
   • System alerts and issues
   • Data integrity checks
   ↓
3. Strategic Oversight:
   • Multi-branch performance
   • Portfolio health analysis
   • Risk assessment
   ↓
4. Administrative Tasks:
   • User management
   • System configuration
   • Compliance monitoring
   ↓
5. Decision Making:
   • Policy updates
   • Interest rate changes
   • Legal action approvals
   ↓
6. Reporting & Analytics:
   • Executive dashboards
   • Regulatory reports
   • Performance analytics
```

---

## 12. KEY FRONTEND FEATURES

### Real-time Updates
- Live dashboard metrics
- Instant payment reflection
- Real-time DPD calculations
- Live collection targets

### Mobile Responsiveness
- Collector mobile app interface
- Touch-friendly payment entry
- Offline capability for field work
- GPS tracking for field visits

### Integration Points
- SMS gateway integration
- Email service integration
- Bank API connections
- WhatsApp Business API
- Call center software integration

### Security Features
- Role-based access control
- Audit trail for all actions
- Data encryption
- Session management
- IP whitelisting

This comprehensive frontend architecture provides a complete workflow for loan servicing and collections operations, ensuring efficient daily operations for collectors, managers, and administrators.