# Component Usage Guide

## Quick Reference for Enhanced Components

### EnhancedKPICard
Display key performance indicators with trends.

```jsx
import { EnhancedKPICard } from './components/ui';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

<EnhancedKPICard
  title="Total Portfolio"
  value="500"
  unit="Cr"
  change={15}
  trend="up"
  icon={CurrencyDollarIcon}
  color="blue"
  loading={false}
  subtitle="Active loans"
/>
```

**Props:**
- `title` (string): Card title
- `value` (string/number): Main value to display
- `unit` (string): Unit suffix (e.g., "Cr", "%")
- `change` (number): Percentage change
- `trend` (string): "up" or "down"
- `icon` (component): Heroicon component
- `color` (string): "blue", "green", "red", "purple", "amber", "indigo"
- `loading` (boolean): Show loading skeleton
- `subtitle` (string): Additional info
- `onClick` (function): Click handler

---

### EnhancedDataTable
Display tabular data with sorting and formatting.

```jsx
import { EnhancedDataTable } from './components/ui';

const columns = [
  { 
    key: 'loanId', 
    label: 'Loan ID', 
    sortable: true 
  },
  { 
    key: 'customerName', 
    label: 'Customer', 
    sortable: true 
  },
  { 
    key: 'amount', 
    label: 'Amount', 
    type: 'currency',
    sortable: true 
  },
  { 
    key: 'status', 
    label: 'Status',
    render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${
        value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    )
  }
];

<EnhancedDataTable
  columns={columns}
  data={loanData}
  loading={isLoading}
  onRowClick={(row) => navigate(`/loans/${row.loanId}`)}
  striped={true}
  hoverable={true}
  compact={false}
/>
```

**Props:**
- `columns` (array): Column definitions
- `data` (array): Row data
- `loading` (boolean): Show loading state
- `onRowClick` (function): Row click handler
- `striped` (boolean): Alternate row colors
- `hoverable` (boolean): Highlight on hover
- `compact` (boolean): Reduce row padding

**Column Definition:**
- `key` (string): Data key
- `label` (string): Column header
- `sortable` (boolean): Enable sorting
- `type` (string): "currency", "percentage", or undefined
- `render` (function): Custom render function

---

### EnhancedAlert
Display notifications and alerts.

```jsx
import { EnhancedAlert } from './components/ui';

<EnhancedAlert
  type="success"
  title="Payment Recorded"
  message="Payment of ₹50,000 has been successfully recorded"
  autoClose={true}
  duration={5000}
  onClose={() => console.log('Alert closed')}
/>
```

**Props:**
- `type` (string): "success", "error", "warning", "info"
- `title` (string): Alert title
- `message` (string): Alert message
- `autoClose` (boolean): Auto-dismiss
- `duration` (number): Auto-close duration in ms
- `onClose` (function): Close callback
- `action` (JSX): Custom action element

**Types:**
- `success`: Green - for successful operations
- `error`: Red - for errors
- `warning`: Amber - for warnings
- `info`: Blue - for information

---

### EnhancedButton
Versatile button component.

```jsx
import { EnhancedButton } from './components/ui';
import { SaveIcon, TrashIcon } from '@heroicons/react/24/outline';

// Primary button
<EnhancedButton
  variant="primary"
  size="md"
  onClick={handleSave}
  icon={SaveIcon}
>
  Save Changes
</EnhancedButton>

// Danger button
<EnhancedButton
  variant="danger"
  size="sm"
  icon={TrashIcon}
  iconPosition="right"
>
  Delete
</EnhancedButton>

// Loading state
<EnhancedButton
  variant="primary"
  loading={isSubmitting}
  fullWidth={true}
>
  Submit
</EnhancedButton>
```

**Props:**
- `variant` (string): "primary", "secondary", "danger", "success", "outline", "ghost"
- `size` (string): "sm", "md", "lg", "xl"
- `loading` (boolean): Show loading spinner
- `disabled` (boolean): Disable button
- `icon` (component): Heroicon component
- `iconPosition` (string): "left" or "right"
- `fullWidth` (boolean): Full width button
- `onClick` (function): Click handler
- `type` (string): "button", "submit", "reset"

---

### EnhancedLayout
Main application layout with sidebar and top bar.

```jsx
import EnhancedLayout from './components/EnhancedLayout';

<EnhancedLayout>
  <div>Your page content here</div>
</EnhancedLayout>
```

**Features:**
- Responsive sidebar (collapsible on mobile)
- Top navigation bar with search
- User profile menu
- Notifications bell
- Logout button
- Navigation menu with submenus

---

### EnhancedLogin
Modern login page.

```jsx
import EnhancedLogin from './pages/Login/EnhancedLogin';

// In router
{ path: '/login', element: <EnhancedLogin /> }
```

**Features:**
- Split-screen design
- Feature showcase
- Statistics display
- Demo credentials
- Responsive design
- Animated backgrounds

---

## Common Patterns

### Dashboard with KPI Cards
```jsx
import { EnhancedKPICard } from './components/ui';
import { CurrencyDollarIcon, UsersIcon, TrendingUpIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <EnhancedKPICard
        title="Total Portfolio"
        value="500"
        unit="Cr"
        change={12}
        trend="up"
        icon={CurrencyDollarIcon}
        color="blue"
      />
      <EnhancedKPICard
        title="Active Customers"
        value="2,450"
        change={8}
        trend="up"
        icon={UsersIcon}
        color="green"
      />
      {/* More cards */}
    </div>
  );
}
```

### Data Table with Actions
```jsx
import { EnhancedDataTable, EnhancedButton } from './components/ui';
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function LoansTable() {
  const columns = [
    { key: 'loanId', label: 'Loan ID', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'amount', label: 'Amount', type: 'currency' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <EnhancedButton
            variant="outline"
            size="sm"
            icon={EyeIcon}
            onClick={() => navigate(`/loans/${row.loanId}`)}
          >
            View
          </EnhancedButton>
        </div>
      )
    }
  ];

  return <EnhancedDataTable columns={columns} data={loans} />;
}
```

### Form with Alerts
```jsx
import { EnhancedAlert, EnhancedButton } from './components/ui';
import { useState } from 'react';

export default function PaymentForm() {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Submit logic
      setAlert({
        type: 'success',
        title: 'Success',
        message: 'Payment recorded successfully'
      });
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {alert && (
        <EnhancedAlert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields */}
        <EnhancedButton
          variant="primary"
          type="submit"
          loading={loading}
          fullWidth
        >
          Submit Payment
        </EnhancedButton>
      </form>
    </div>
  );
}
```

## Color Usage Guide

### When to use each color:

**Blue** - Primary actions, main metrics
- Total portfolio
- Active loans
- Primary buttons

**Green** - Success, positive trends
- Successful payments
- Positive growth
- Active status

**Red** - Overdue, negative trends, danger
- Overdue loans
- Negative growth
- Delete actions

**Purple** - Secondary metrics
- Collections
- Performance metrics

**Amber** - Warnings, pending
- Pending approvals
- Warning alerts

**Indigo** - Tertiary actions
- Secondary buttons
- Additional info

## Responsive Design

All components are mobile-first and responsive:

```jsx
// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Cards */}
</div>

// Sidebar visibility
<div className="hidden lg:block">
  {/* Desktop only */}
</div>

// Text sizing
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Title
</h1>
```

## Accessibility

All components follow accessibility best practices:
- Keyboard navigation
- ARIA labels
- Color contrast
- Focus indicators
- Semantic HTML

## Performance Tips

1. Use React.memo for expensive components
2. Lazy load heavy components
3. Optimize images
4. Use CSS classes instead of inline styles
5. Memoize callbacks with useCallback
6. Use useMemo for expensive computations
