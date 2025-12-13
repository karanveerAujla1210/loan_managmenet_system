# Component Reference Guide

## 🏗️ Layout Components

### AppLayout
Main layout wrapper that combines Sidebar and Topbar.

**Location**: `components/Layout/AppLayout.jsx`

**Props**: 
- `children` (ReactNode) - Page content

**Usage**:
```jsx
import AppLayout from './components/Layout/AppLayout';

export default function MyPage() {
  return (
    <AppLayout>
      <div>Page content here</div>
    </AppLayout>
  );
}
```

**Features**:
- Fixed sidebar (264px)
- Top navigation bar (64px)
- Scrollable content area
- Light gray background (#F7F8FA)

---

### Sidebar
Navigation sidebar with menu items and active state highlighting.

**Location**: `components/Layout/Sidebar.jsx`

**Menu Items**:
- Dashboard
- Customers
- Leads
- Credit Analysis
- Operations
- Disbursement
- Collections
- Reports
- Profile
- Settings

**Features**:
- Active state highlighting in primary blue
- Icon + label for each item
- Bottom section for Profile & Settings
- Smooth transitions
- Responsive design

**Customization**:
```jsx
// Add new menu item
const menuItems = [
  // ... existing items
  { label: 'New Item', path: '/new-item', icon: NewIcon },
];
```

---

### Topbar
Top navigation with search, notifications, and user profile.

**Location**: `components/Layout/Topbar.jsx`

**Features**:
- Search bar with icon
- Notifications bell with indicator
- User profile dropdown
- Logout option
- Responsive design

**Customization**:
```jsx
// Update search placeholder
<input placeholder="Your custom text..." />

// Add more dropdown options
{showProfileMenu && (
  <div className="...">
    {/* Add more menu items */}
  </div>
)}
```

---

## 🎨 UI Components

### KPICard
Reusable card component for displaying key performance indicators.

**Location**: `components/ui/KPICard.jsx`

**Props**:
```jsx
{
  label: string,           // Card label
  value: string,           // Main value to display
  icon: ReactComponent,    // Icon from lucide-react
  trend?: 'up' | 'down',   // Trend direction
  trendValue?: number,     // Trend percentage
  color?: 'blue' | 'green' | 'orange' | 'red'  // Icon background color
}
```

**Usage**:
```jsx
import KPICard from '../components/ui/KPICard';
import { Users, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <KPICard
    label="Total Leads"
    value="1,248"
    icon={Users}
    trend="up"
    trendValue="12"
    color="blue"
  />
  <KPICard
    label="Active Loans"
    value="368"
    icon={TrendingUp}
    trend="up"
    trendValue="8"
    color="green"
  />
  <KPICard
    label="Collections"
    value="₹45.2L"
    icon={DollarSign}
    trend="up"
    trendValue="15"
    color="orange"
  />
  <KPICard
    label="DPD Cases"
    value="34"
    icon={AlertCircle}
    trend="down"
    trendValue="5"
    color="red"
  />
</div>
```

**Styling**:
- White background with subtle shadow
- Icon in colored background
- Trend indicator with arrow
- Hover effect with increased shadow

---

## 📄 Page Components

### ModernLogin
Professional login page with split layout.

**Location**: `pages/ModernLogin.jsx`

**Features**:
- Split layout (branding left, form right)
- Email and password inputs
- Show/hide password toggle
- Loading state during submission
- Success/error message feedback
- Demo credentials display
- Gradient background

**Customization**:
```jsx
// Update branding text
<h1 className="text-4xl font-bold text-white mb-2">Your App Name</h1>

// Update features list
{[
  { title: 'Feature 1', desc: 'Description' },
  { title: 'Feature 2', desc: 'Description' },
].map((feature, i) => (...))}

// Update demo credentials
<p className="text-center text-sm text-gray-600">
  Demo credentials: your@email.com / password
</p>
```

---

### ModernDashboard
Main dashboard with KPIs, charts, and activity feed.

**Location**: `pages/ModernDashboard.jsx`

**Sections**:
1. **Page Header** - Title and description
2. **KPI Cards** - 4 key metrics with trends
3. **Performance Chart** - Line chart showing trends
4. **Status Distribution** - Pie chart
5. **Recent Activity** - Activity feed with status badges

**Charts Used**:
- LineChart (Recharts) - Performance trends
- PieChart (Recharts) - Status distribution

**Customization**:
```jsx
// Update KPI cards
<KPICard
  label="Your Metric"
  value="Your Value"
  icon={YourIcon}
  trend="up"
  trendValue="10"
  color="blue"
/>

// Update chart data
const performanceData = [
  { month: 'Jan', disbursed: 45000, collected: 38000 },
  // ... more data
];
```

---

### ModernCustomers
Customer management page with searchable table and detail modal.

**Location**: `pages/ModernCustomers.jsx`

**Features**:
- Searchable customer table
- Filter by status (Active, DPD, Closed)
- Status badges with color coding
- DPD indicators
- Click row to view details
- Customer detail modal
- Personal and loan information sections

**Table Columns**:
- Customer name and email
- Contact phone
- Loan amount
- EMI
- Status badge
- DPD days
- Action button

**Customization**:
```jsx
// Update customer data
const customersData = [
  {
    id: 1,
    name: 'Customer Name',
    email: 'email@example.com',
    phone: '+91 98765 43210',
    loanAmount: '₹2,50,000',
    status: 'active',
    dpd: 0,
    emi: '₹8,500',
    nextPayment: '2024-01-15',
  },
  // ... more customers
];

// Update status badges
const statusBadges = {
  active: 'bg-green-50 text-green-700 border border-green-200',
  dpd: 'bg-red-50 text-red-700 border border-red-200',
  closed: 'bg-gray-50 text-gray-700 border border-gray-200',
};
```

---

### ModernCollections
Collections management with DPD tracking and call history.

**Location**: `pages/ModernCollections.jsx`

**Features**:
- DPD bucket summary cards (0-15, 15-30, 30-60, 60+)
- Color-coded DPD buckets
- Call status tracking
- Call history timeline
- Quick action buttons (Call, SMS, Schedule)
- Case detail modal

**DPD Buckets**:
- 0-15 DPD: Green
- 15-30 DPD: Yellow
- 30-60 DPD: Orange
- 60+ DPD: Red

**Customization**:
```jsx
// Update DPD data
const collectionsData = [
  {
    id: 1,
    customer: 'Customer Name',
    loanId: 'LN-2024-001',
    dpdBucket: '15-30',
    amount: '₹12,000',
    lastPayment: '2023-12-05',
    nextDue: '2023-12-20',
    callStatus: 'pending',
    promiseToPayDate: null,
    callLogs: [
      { date: '2024-01-10', duration: '3 min', notes: 'Notes here' },
    ],
  },
  // ... more cases
];
```

---

### CreditAnalysis
Credit scoring and eligibility assessment page.

**Location**: `pages/CreditAnalysis.jsx`

**Features**:
- Credit score visualization with progress bar
- Debt-to-income ratio metrics
- Income vs EMI trend chart
- Eligibility assessment
- Risk indicators

**Metrics Displayed**:
- Credit score (0-900)
- Monthly income
- Monthly EMI
- Debt-to-income ratio
- Existing loans count

**Customization**:
```jsx
// Update credit data
const creditData = {
  score: 745,
  scoreRange: [300, 900],
  rating: 'Good',
  ratingColor: 'green',
};

// Update debt metrics
const debtMetrics = [
  { label: 'Monthly Income', value: '₹50,000', status: 'good' },
  // ... more metrics
];
```

---

### CaseClosure
Case closure celebration screen with checklist.

**Location**: `pages/CaseClosure.jsx`

**Features**:
- Success celebration with animated checkmark
- Closure checklist with completed steps
- Loan summary with final amounts
- Download closure certificate button
- Back to dashboard navigation
- Calm, celebratory design

**Customization**:
```jsx
// Update closure steps
const closureSteps = [
  { title: 'Step 1', desc: 'Description', completed: true },
  { title: 'Step 2', desc: 'Description', completed: true },
  // ... more steps
];

// Update loan summary
<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  <div>
    <p className="text-sm text-gray-500 mb-1">Original Amount</p>
    <p className="text-2xl font-bold text-gray-900">₹2,50,000</p>
  </div>
  // ... more summary items
</div>
```

---

### Leads
Lead management page with table and quick actions.

**Location**: `pages/Leads.jsx`

**Features**:
- Searchable leads table
- Status indicators (New, Contacted, Qualified)
- Lead source tracking
- Quick add new lead button

---

### Operations
Operational tasks management page.

**Location**: `pages/Operations.jsx`

**Features**:
- Task list with status
- Customer assignment
- Due date tracking
- Status indicators (Pending, Completed, In Progress)

---

### Disbursement
Loan disbursement tracking page.

**Location**: `pages/Disbursement.jsx`

**Features**:
- Disbursement summary cards
- Disbursement history table
- Status tracking
- Reference number tracking

---

### Reports
Business reports and analytics page.

**Location**: `pages/Reports.jsx`

**Features**:
- Performance metrics chart
- Recent reports list
- Download functionality
- Multiple report formats (PDF, Excel)

---

### Profile
User profile management page.

**Location**: `pages/Profile.jsx`

**Features**:
- User avatar
- Profile information form
- Editable fields
- Save/cancel buttons

---

### Settings
User settings and preferences page.

**Location**: `pages/Settings.jsx`

**Features**:
- Notification preferences
- Security settings
- Privacy controls
- Toggle switches for preferences

---

## 🎨 Styling Patterns

### Card Container
```jsx
<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
  {/* Content */}
</div>
```

### Status Badge
```jsx
<span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
  Active
</span>
```

### Button Primary
```jsx
<button className="px-4 py-2.5 bg-[#1741FF] text-white rounded-lg font-medium hover:bg-[#1230cc] transition">
  Action
</button>
```

### Button Secondary
```jsx
<button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
  Cancel
</button>
```

### Input Field
```jsx
<input
  type="text"
  placeholder="Placeholder text"
  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1741FF] focus:border-transparent outline-none transition"
/>
```

### Page Header
```jsx
<div>
  <h1 className="text-3xl font-bold text-gray-900">Page Title</h1>
  <p className="text-gray-600 mt-1">Page description</p>
</div>
```

### Section Header
```jsx
<h2 className="text-lg font-semibold text-gray-900 mb-6">Section Title</h2>
```

---

## 📊 Chart Examples

### Line Chart
```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
    <XAxis dataKey="month" stroke="#9ca3af" />
    <YAxis stroke="#9ca3af" />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="value" stroke="#1741FF" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>
```

### Bar Chart
```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
    <XAxis dataKey="month" stroke="#9ca3af" />
    <YAxis stroke="#9ca3af" />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#1741FF" radius={[8, 8, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

### Pie Chart
```jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
```

---

## 🔄 Common Patterns

### Modal/Dialog
```jsx
{selectedItem && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Modal content */}
    </div>
  </div>
)}
```

### Search and Filter
```jsx
<div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1741FF] outline-none"
    />
  </div>
  <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1741FF] outline-none"
  >
    <option value="all">All</option>
    <option value="active">Active</option>
  </select>
</div>
```

### Data Table
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Column</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50">
            <td className="px-6 py-4">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
```

---

## 🎯 Best Practices

1. **Always wrap pages with AppLayout**
2. **Use consistent spacing** (Tailwind scale)
3. **Apply hover states** to interactive elements
4. **Show loading states** during data fetching
5. **Handle errors gracefully** with user feedback
6. **Use semantic HTML** for accessibility
7. **Keep components reusable** and modular
8. **Follow naming conventions** (PascalCase for components)
9. **Use Lucide icons** for consistency
10. **Test on mobile** devices

---

**Last Updated**: January 2024  
**Version**: 1.0.0
