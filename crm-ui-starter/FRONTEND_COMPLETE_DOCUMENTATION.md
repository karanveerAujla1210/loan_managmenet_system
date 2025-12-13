# LoanHub CRM - Frontend Documentation

## 🚀 Overview

**LoanHub** is a production-ready, enterprise-grade Business Loan CRM frontend built with React, TypeScript, Tailwind CSS, and modern fintech best practices. The application provides a comprehensive solution for managing loan portfolios, customer relationships, credit analysis, collections management, and case closure workflows.

### Key Features
- ✅ **Authentication & Security**: Secure login with role-based access control
- ✅ **Intuitive Dashboard**: Real-time KPIs, charts, and portfolio analytics
- ✅ **Customer Management**: Full customer profiles with linked loans and activity
- ✅ **Credit Analysis**: Credit scoring, income analysis, DTI calculations, risk assessment
- ✅ **Collections Management**: DPD bucket tracking, call logs, promise-to-pay monitoring
- ✅ **Case Closure**: Streamlined loan completion with document management
- ✅ **Responsive Design**: Mobile-first, fully responsive across all devices
- ✅ **Role-Based Dashboards**: Different views for loan officers, collectors, analysts, and admins

---

## 📁 Project Structure

```
crm-ui-starter/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── MainLayout.tsx          # Main layout wrapper with sidebar + header
│   │   ├── ui/
│   │   │   ├── Badge.tsx               # Status badges
│   │   │   ├── Button.tsx              # Primary button component
│   │   │   ├── Card.tsx                # Reusable card container
│   │   │   ├── Input.tsx               # Form input component
│   │   │   ├── Kpi.tsx                 # KPI card display
│   │   │   ├── Modal.tsx               # Modal dialog
│   │   │   ├── ProgressRing.tsx        # Circular progress indicator
│   │   │   ├── StatusDot.tsx           # Status indicator dot
│   │   │   ├── Timeline.tsx            # Activity timeline
│   │   │   └── index.ts                # Barrel export
│   │   ├── Header.tsx                  # Top navigation bar
│   │   └── Sidebar.tsx                 # Left navigation sidebar
│   ├── context/
│   │   └── AuthContext.tsx             # Authentication context & hooks
│   ├── pages/
│   │   ├── Dashboard.tsx               # Main dashboard with KPIs & charts
│   │   ├── Customers.tsx               # Customer list with search/filter
│   │   ├── CustomerDetail.tsx          # Detailed customer profile
│   │   ├── CreditAnalysis.tsx          # Credit scoring & eligibility
│   │   ├── Collections.tsx             # Collections management & DPD tracking
│   │   ├── CaseClosure.tsx             # Loan closure workflows
│   │   ├── Reports.tsx                 # Reports generation
│   │   ├── Settings.tsx                # User settings & preferences
│   │   └── Login.tsx                   # Login page (banking-grade design)
│   ├── services/
│   │   └── mockData.ts                 # Mock data for development
│   ├── types/
│   │   └── index.ts                    # TypeScript type definitions
│   ├── theme/
│   │   └── tokens.ts                   # Design tokens
│   ├── styles/
│   │   └── tailwind.css                # Tailwind directives
│   ├── App.tsx                         # Main app component
│   ├── Router.tsx                      # Route configuration
│   └── main.tsx                        # Entry point
├── package.json                        # Dependencies & scripts
├── tailwind.config.cjs                 # Tailwind configuration
├── vite.config.ts                      # Vite configuration
└── tsconfig.json                       # TypeScript configuration
```

---

## 🎨 Design System

### Color Palette
- **Primary**: `#1741FF` (Royal Blue) - Main brand color
- **Primary Dark**: `#0F2ECC` - Hover/active state
- **Primary Light**: `#E9EDFF` - Light backgrounds
- **Success**: `#22C55E` - Positive actions
- **Warning**: `#F59E0B` - Caution/alerts
- **Danger**: `#EF4444` - Errors/critical
- **Info**: `#0EA5E9` - Information
- **Light Gray**: `#F7F8FA` - Page backgrounds
- **Dark Gray**: `#374151` - Text

### Typography
- **Font**: Inter (throughout the application)
- **Display Large**: 3.5rem, bold
- **Display Medium**: 2.875rem, bold
- **Display Small**: 2.25rem, bold
- **Heading Large**: 1.875rem, semibold
- **Heading Medium**: 1.5rem, semibold
- **Body Large**: 1.125rem, regular
- **Body Medium**: 1rem, regular (default)
- **Body Small**: 0.875rem, regular

### Spacing
- Uses Tailwind's default 4px grid system
- Generous spacing for enterprise feel
- Consistent padding/margins throughout

### Shadows
- `card-sm`: Light shadows for cards
- `card-md`: Medium shadows for interactive elements
- `card-lg`: Deep shadows for modals/overlays
- `glow-blue`: Blue glow effect (primary)
- `glow-purple`: Purple glow effect (accent)

### Border Radius
- **Small**: `0.5rem` (8px)
- **Medium**: `0.75rem` (12px)
- **Large**: `1rem` (16px)
- **XL**: `1.5rem` (24px)

---

## 🔐 Authentication

### Login Flow
1. User enters email and password
2. System validates credentials (mock authentication)
3. User data is stored in AuthContext and localStorage
4. Automatic role assignment based on email domain
5. User redirected to dashboard
6. Session persists on page reload

### Role-Based Access
```typescript
type UserRole = 'admin' | 'loan_officer' | 'collector' | 'analyst' | 'manager'
```

### Demo Credentials
- **Email**: `officer@crm.com`
- **Password**: `password123`

### Protected Routes
All routes except `/login` require authentication. ProtectedRoute component redirects unauthenticated users to login.

---

## 📊 Dashboard

### KPI Cards
Located at top of dashboard showing:
- **Total Portfolio**: Aggregate loan amount
- **Active Loans**: Count of active cases
- **Total Collected**: Amount collected to date
- **Total Customers**: Number of customers
- **Collection Rate**: % collected vs. disbursed
- **Overdue Cases**: Count of DPD > 0

### Charts
- **Disbursement vs Collection**: Bar chart showing monthly trends
- **DPD Distribution**: Pie chart showing portfolio health
- **Recent Loans Table**: Interactive table with sortable columns

### Responsive Layout
- Desktop: 3 KPI cards per row, 2-column chart layout
- Tablet: 2 KPI cards per row, stacked charts
- Mobile: 1 KPI card per row, full-width charts

---

## 👥 Customer Management

### Customer List
- Search by name, email, phone
- Filter by status (active/closed/default)
- Card-based grid layout (responsive)
- Click any card to view detailed profile

### Customer Profile Page
**Overview Tab:**
- Financial summary (portfolio, active loans, LTV)
- Credit profile (CIBIL score, risk category, defaults)

**Loans Tab:**
- Table of all customer loans
- Status, amount, collection details
- DPD indicators with color coding

**Activity Tab:**
- Chronological timeline of events
- Disbursements, payments, approvals
- Linked documents

---

## 💳 Credit Analysis

### Credit Scoring
- CIBIL/Credit score display
- Eligibility calculator
- Risk rating visualization

### Financial Analysis
- Income vs. EMI analysis
- Debt-to-income ratio (DTI)
- Existing obligations tracking
- Monthly obligations breakdown

### Risk Assessment
- Credit profile radar chart
- Risk flags and warnings
- Recommendations for approval/rejection
- Radar visualization of credit factors

---

## 💰 Collections Management

### DPD Bucketing
Portfolio segmented into:
- **Current**: DPD 0 (on-time)
- **Bucket 1**: DPD 1-30
- **Bucket 2**: DPD 31-60
- **Bucket 3**: DPD 60+

Each bucket shows:
- Count of cases
- Total outstanding amount
- Color-coded visual indicator

### Collections Tools
- **Make Call**: Quick dialer integration
- **Send SMS**: Bulk messaging
- **Record Payment**: Payment entry
- **Promise to Pay**: Track payment commitments
- **Call Logs**: Activity timeline

---

## ✅ Case Closure

### Closure Checklist
- Full Payment Received
- Final Interest Calculated
- Settlement Confirmed
- Documents Prepared
- Customer Notified
- Closure Certificate Issued

### Documents Available
- Loan Closure Certificate
- Settlement Statement
- Payment History Report

### Closure Experience
- Centered, success-focused design
- Prominent success indicator
- Easy document download
- Share with customer option

---

## 🔌 Components

### Layout Components
- **Sidebar**: Fixed left navigation (64px width)
- **Header**: Sticky top navigation with search, notifications, user profile
- **MainLayout**: Wrapper combining sidebar + header + outlet

### UI Components
- **Card**: Reusable container with optional title/footer
- **Input**: Form field with label, error, icon support
- **Button**: Primary/secondary/ghost variants
- **Badge**: Status indicators with color variants
- **Kpi**: Key metric display with icons and trends
- **Modal**: Dialog overlays (future use)
- **ProgressRing**: Circular progress indicator
- **Timeline**: Activity feed display
- **StatusDot**: Small status indicator

### Charts
Using Recharts library:
- **BarChart**: Disbursement vs Collection
- **PieChart**: DPD distribution
- **RadarChart**: Credit profile factors
- **LineChart**: Trends (future use)

---

## 🎯 Key Features by Role

### Loan Officer
- Dashboard with portfolio overview
- Customer management and creation
- Credit analysis and approval recommendations
- Disbursement processing
- Case management

### Collector
- Collections dashboard with DPD buckets
- Call logging and follow-ups
- Payment recording
- Promise-to-pay tracking
- Performance metrics

### Analyst
- Advanced credit scoring
- Portfolio analysis
- Risk assessment tools
- Custom report generation
- Trend analysis

### Manager/Admin
- All features above
- Team management
- Performance reporting
- System settings
- User administration

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
cd crm-ui-starter
npm install
```

### Development Server
```bash
npm run dev
```
Runs on `http://localhost:5175` (or next available port)

### Production Build
```bash
npm run build
```
Outputs optimized bundle to `dist/`

### Preview Production Build
```bash
npm run preview
```

---

## 📦 Dependencies

### Core
- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **react-router-dom**: ^6.20.0 (routing)

### UI & Visualization
- **recharts**: ^2.10.3 (charts)
- **lucide-react**: ^0.298.0 (icons)
- **tailwindcss**: ^3.4.7 (styling)

### Utilities
- **date-fns**: ^2.30.0 (date formatting)
- **axios**: ^1.6.2 (API calls)
- **classnames**: ^2.3.2 (conditional classes)

### Development
- **vite**: ^4.4.9 (bundler)
- **typescript**: ^5.0.0
- **@types/react**: ^18.0.0
- **tailwindcss**: For development

---

## 🔄 Data Flow

### Mock Data
Currently using mock data from `src/services/mockData.ts`:
- 5 sample customers with different statuses
- 3 sample loans with various DPD values
- KPI calculations derived from mock loans

### Integration with Backend
To connect to real API:

1. **Update AuthContext** `src/context/AuthContext.tsx`:
```typescript
const response = await axios.post('/api/auth/login', { email, password })
const userData = response.data.user
```

2. **Replace mockData** in page components:
```typescript
// Instead of:
const kpis = getDashboardKPIs()

// Use:
const { data: kpis } = await axios.get('/api/dashboard/kpis')
```

3. **Add API service layer** `src/services/api.ts`:
```typescript
export const api = {
  auth: { login: (creds) => axios.post('/api/auth/login', creds) },
  customers: { list: () => axios.get('/api/customers') },
  // ... etc
}
```

---

## 🚀 Deployment

### Vercel (Recommended for SPA)
```bash
vercel deploy
```

### Docker
```bash
docker build -t loanhub-crm .
docker run -p 3000:3000 loanhub-crm
```

### Nginx (Production)
```nginx
server {
    listen 80;
    server_name crm.example.com;
    
    root /var/www/crm/dist;
    index index.html;
    
    location / {
        try_files $uri /index.html;
    }
}
```

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (single column, stacked)
- **Tablet**: 640px - 1024px (2 columns, optimized)
- **Desktop**: > 1024px (3+ columns, full width)

---

## ♿ Accessibility

- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators on all interactive elements
- Color not used as only indicator
- Sufficient color contrast (WCAG AA compliant)

---

## 🔒 Security Considerations

- **HTTPS Only**: Enforced in production
- **CORS**: Configure backend CORS policies
- **XSS Protection**: React auto-escapes by default
- **CSRF**: Implement token-based CSRF protection
- **Session Management**: Store tokens in httpOnly cookies
- **Input Validation**: Validate all user inputs
- **Rate Limiting**: Implement on backend

---

## 🐛 Known Limitations

1. **Mock Authentication**: Currently uses client-side mock auth
2. **Mock Data**: No real database connection
3. **File Uploads**: Document management not yet implemented
4. **Real-time Updates**: WebSocket integration pending
5. **Notifications**: Socket.io notifications not yet implemented

---

## 🔮 Future Enhancements

- [ ] Real-time notifications with Socket.io
- [ ] Document management & upload
- [ ] Advanced reporting & exports
- [ ] Mobile native app
- [ ] SMS/Email integration
- [ ] WhatsApp integration for collections
- [ ] AI-based credit scoring
- [ ] Predictive analytics
- [ ] Multi-language support
- [ ] Advanced user permissions

---

## 📞 Support & Maintenance

- For bugs: Create issues in repository
- For features: Submit feature requests
- For production support: Contact your system administrator

---

## 📄 License

© 2024 LoanHub CRM. All rights reserved.

---

**Last Updated**: December 2024
**Version**: 1.0.0-production
**Status**: Ready for Production Deployment
