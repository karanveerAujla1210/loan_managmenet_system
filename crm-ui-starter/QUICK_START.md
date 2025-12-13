# LoanHub CRM - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd crm-ui-starter
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

The app will open on `http://localhost:5175`

### Step 3: Login
Use demo credentials:
- **Email**: `officer@crm.com`
- **Password**: `password123`

---

## 🎯 Feature Tours

### 1. Dashboard
**What you'll see:**
- 6 KPI cards showing portfolio metrics
- Disbursement vs Collection bar chart
- DPD Distribution pie chart
- Recent loans table

**Try:**
- Hover over KPI cards to see trend indicators
- Click on loan rows in the table
- View the collection rate progress

### 2. Customers
**What you'll see:**
- Customer cards in a responsive grid
- Search functionality
- Status filters (Active/Closed/Default)

**Try:**
- Search for "Rajesh" or "Kumar"
- Filter by status
- Click any customer card to view detailed profile

### 3. Customer Detail
**What you'll see:**
- Customer header with profile info
- Overview, Loans, and Activity tabs
- Financial and credit summaries

**Try:**
- Navigate through tabs
- View linked loans
- Check activity timeline

### 4. Credit Analysis
**What you'll see:**
- Customer selector
- Credit score, eligibility, risk rating
- Income vs EMI analysis
- Credit profile radar chart
- Debt obligations tracker
- Risk assessment with recommendations

**Try:**
- Switch between customers
- View the radar chart
- Read risk recommendations

### 5. Collections
**What you'll see:**
- DPD buckets showing case distribution
- Loan details for selected bucket
- Call logs and activity timeline
- Quick action buttons

**Try:**
- Click different DPD bucket cards
- Select a loan to view details
- Scroll through call logs

### 6. Case Closure
**What you'll see:**
- Success indicator with checkmarks
- Closure checklist
- Downloadable documents
- Share options

**Try:**
- Click "Download All Documents"
- View the completion checklist

---

## 🧭 Navigation

### Sidebar Menu
- **Dashboard**: Portfolio overview and analytics
- **Customers**: Customer list and management
- **Credit Analysis**: Scoring and eligibility
- **Collections**: DPD tracking and call management
- **Case Closure**: Loan completion workflows
- **Reports**: Generate and download reports
- **Settings**: User preferences and account settings

### Top Bar
- **Search**: Find loans, customers, payments
- **Notifications**: View alerts and updates
- **Help**: Quick access to documentation
- **Profile**: User menu and sign out

---

## 🎨 Design Highlights

### Color Scheme
- **Blue (#1741FF)**: Primary actions and highlights
- **Green**: Success and positive metrics
- **Orange**: Warnings and caution
- **Red**: Errors and critical issues
- **Gray**: Neutral backgrounds and text

### Layout
- **Fixed Sidebar**: Always visible navigation
- **Sticky Header**: Top bar stays in view
- **Scrollable Content**: Main area scrolls independently
- **Card-Based**: Information grouped in cards
- **Responsive**: Adapts from mobile to desktop

### Interactions
- **Hover States**: Buttons and cards respond to hover
- **Loading States**: Spinner on sign-in
- **Error Messages**: Clear, actionable error display
- **Success Feedback**: Visual confirmation of actions
- **Smooth Transitions**: Animations between states

---

## 🔑 Key Workflows

### Workflow 1: Review Portfolio (2 min)
1. Login with demo credentials
2. View Dashboard KPIs
3. Check DPD distribution
4. Review recent loans table

### Workflow 2: Manage Customer (3 min)
1. Go to Customers
2. Search for a customer
3. Click to open detailed profile
4. Review financial summary and loans
5. Check activity timeline

### Workflow 3: Analyze Credit (3 min)
1. Go to Credit Analysis
2. Select a customer from dropdown
3. Review credit score and eligibility
4. Analyze income vs EMI ratio
5. Check risk assessment

### Workflow 4: Collections Management (3 min)
1. Go to Collections
2. Click on a DPD bucket (e.g., "1-30 DPD")
3. Select a loan from the list
4. View loan summary and call logs
5. Check promise-to-pay tracking

### Workflow 5: Close a Loan (2 min)
1. Go to Case Closure
2. View sample closure completion
3. Review checklist
4. Download certificate

---

## 💡 Tips & Tricks

### Search Tips
- Search by loan ID: "LA-00001"
- Search by customer name: "Rajesh"
- Search by phone: "9876543210"

### Filtering
- Use status filters on Customers page to segment portfolio
- Color coding shows status at a glance

### Responsive Design
- Works on mobile, tablet, desktop
- Sidebar collapses on smaller screens
- Touch-friendly on mobile

### Keyboard Shortcuts
- **Enter**: Submit login form
- **Tab**: Navigate between fields
- **Escape**: Close modals/dropdowns

---

## 🛠️ Customization

### Change Demo Data
Edit `src/services/mockData.ts`:
```typescript
export const mockCustomers: Customer[] = [
  // Add or modify customers here
]

export const mockLoans: Loan[] = [
  // Add or modify loans here
]
```

### Change Colors
Edit `tailwind.config.cjs`:
```javascript
colors: {
  primary: '#1741FF', // Change to your brand color
  // ... other colors
}
```

### Add New Pages
1. Create `src/pages/YourPage.tsx`
2. Add route in `src/Router.tsx`
3. Add menu item in `src/components/Sidebar.tsx`

---

## 🚀 Building for Production

### Create Optimized Build
```bash
npm run build
```
Generates optimized bundle in `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Test production build locally

### Deploy
```bash
# Vercel
vercel deploy

# Or build and serve manually
npm run build
# Upload dist/ folder to your hosting
```

---

## 🆘 Troubleshooting

### Issue: Port already in use
**Solution**: App auto-selects next available port (5173 → 5174 → 5175)

### Issue: "Cannot find module" error
**Solution**: Run `npm install` to ensure all dependencies are installed

### Issue: Styles not loading
**Solution**: 
- Clear browser cache (Ctrl+F5)
- Restart dev server

### Issue: Login not working
**Solution**: 
- Use exact demo credentials: `officer@crm.com` / `password123`
- Check browser console for errors (F12)

---

## 📱 Mobile Testing

### Test Responsive Design
1. Open DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select iPhone/Android preset
4. Test navigation and functionality

### Mobile Features
- Touch-friendly buttons (min 44px)
- Stacked layout on small screens
- Full-width cards and tables
- Bottom-aligned navigation (on small screens)

---

## 🔐 Security Notes

### For Development Only
- Demo credentials are hardcoded
- No real authentication
- Mock data stored in client

### For Production
- Implement real authentication API
- Store tokens in secure httpOnly cookies
- Add CSRF protection
- Enable HTTPS
- Implement rate limiting
- Add input validation

---

## 📚 Learning Resources

### Component Documentation
- See `src/components/ui/` for individual components
- Each component is documented with TypeScript props

### Type Definitions
- See `src/types/index.ts` for data structures
- TypeScript provides IDE autocomplete

### Mock Data
- See `src/services/mockData.ts` for data structure
- Use as template for API integration

---

## 🎓 Next Steps

1. **Explore the UI**: Spend 10 minutes clicking around
2. **Review Code**: Check `src/pages/` to understand structure
3. **Customize**: Modify colors, text, and mock data
4. **Integrate Backend**: Connect to real API endpoints
5. **Deploy**: Push to production environment

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review component code in `src/`
3. Check browser console for errors
4. Contact your system administrator

---

**Happy Using! 🎉**

The LoanHub CRM is ready for production deployment. Explore all features and customize as needed for your organization.
