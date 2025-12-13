# CoreUI React Template - Quick Reference & Code Patterns

## Directory Structure at a Glance

```
src/
├── components/           # Reusable shell & UI components
├── layout/              # Layout containers
├── views/               # Page-level components
├── scss/                # Global styles
├── _nav.js              # Navigation config
├── routes.js            # Route definitions
├── App.js               # Root component
├── store.js             # Redux store
└── index.js             # Entry point
```

---

## 1. Navigation Configuration Template

**_nav.js Pattern:**

```javascript
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { cilSpeedometer, cilPuzzle, cilBell } from '@coreui/icons'

const navigation = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: { color: 'info', text: 'NEW' }
  },
  {
    component: CNavTitle,
    name: 'Main Menu'
  },
  {
    component: CNavGroup,
    name: 'Components',
    to: '/components',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Sub Item 1',
        to: '/components/item1'
      },
      {
        component: CNavItem,
        name: 'Sub Item 2',
        to: '/components/item2'
      }
    ]
  },
  {
    component: CNavItem,
    name: 'Notifications',
    to: '/notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    badge: { color: 'danger', text: '5' }
  }
]

export default navigation
```

---

## 2. Layout Structure Template

**DefaultLayout.js:**

```jsx
import React from 'react'
import { AppSidebar, AppHeader, AppContent, AppFooter } from '../components'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
```

---

## 3. Routes Configuration Template

**routes.js:**

```javascript
import React from 'react'

// Lazy load components
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const LoanList = React.lazy(() => import('./views/loans/LoanList'))
const CustomerDetail = React.lazy(() => import('./views/customers/CustomerDetail'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const NotFound = React.lazy(() => import('./views/pages/page404/Page404'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/loans', name: 'Loans', element: LoanList },
  { path: '/loans/:id', name: 'Loan Detail', element: LoanDetail },
  { path: '/customers/:id', name: 'Customer', element: CustomerDetail },
  { path: '/login', name: 'Login', element: Login },
  { path: '/404', name: 'Not Found', element: NotFound },
]

export default routes
```

---

## 4. Common UI Components Cheat Sheet

### Buttons

```jsx
import { CButton } from '@coreui/react'

// Color variants
<CButton color="primary">Primary</CButton>
<CButton color="secondary">Secondary</CButton>
<CButton color="success">Success</CButton>
<CButton color="danger">Danger</CButton>
<CButton color="warning">Warning</CButton>
<CButton color="info">Info</CButton>

// Outlines
<CButton color="primary" variant="outline">Outline</CButton>

// Sizes
<CButton size="sm">Small</CButton>
<CButton size="lg">Large</CButton>

// States
<CButton disabled>Disabled</CButton>
<CButton active>Active</CButton>

// Button groups
<CButtonGroup>
  <CButton>Option 1</CButton>
  <CButton>Option 2</CButton>
  <CButton>Option 3</CButton>
</CButtonGroup>
```

### Forms

```jsx
import {
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CFormSwitch,
  CFormTextarea,
} from '@coreui/react'

<CForm>
  <CFormLabel>Email</CFormLabel>
  <CFormInput type="email" placeholder="Enter email" />

  <CFormLabel>Select Option</CFormLabel>
  <CFormSelect options={[
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
  ]} />

  <CFormCheck label="Check me out" />

  <CFormSwitch label="Toggle me" />

  <CFormLabel>Message</CFormLabel>
  <CFormTextarea rows={3} />
</CForm>
```

### Cards

```jsx
import { CCard, CCardHeader, CCardBody, CCardFooter } from '@coreui/react'

<CCard className="mb-4">
  <CCardHeader>Card Header</CCardHeader>
  <CCardBody>
    Card content goes here
  </CCardBody>
  <CCardFooter>Card Footer</CCardFooter>
</CCard>
```

### Tables

```jsx
import {
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableRow,
  CTableDataCell,
} from '@coreui/react'

<CTable responsive hover striped>
  <CTableHead>
    <CTableRow>
      <CTableHeaderCell>ID</CTableHeaderCell>
      <CTableHeaderCell>Name</CTableHeaderCell>
      <CTableHeaderCell>Email</CTableHeaderCell>
    </CTableRow>
  </CTableHead>
  <CTableBody>
    {data.map((item) => (
      <CTableRow key={item.id}>
        <CTableDataCell>{item.id}</CTableDataCell>
        <CTableDataCell>{item.name}</CTableDataCell>
        <CTableDataCell>{item.email}</CTableDataCell>
      </CTableRow>
    ))}
  </CTableBody>
</CTable>
```

### Modals

```jsx
import { CButton, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react'
import { useState } from 'react'

const MyModal = () => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <CButton onClick={() => setVisible(true)}>Open Modal</CButton>
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>Modal Title</CModalHeader>
        <CModalBody>Modal content</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
          <CButton color="primary">Save</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
```

### Dropdowns

```jsx
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'

<CDropdown>
  <CDropdownToggle color="primary">Dropdown</CDropdownToggle>
  <CDropdownMenu>
    <CDropdownItem>Action</CDropdownItem>
    <CDropdownItem>Another action</CDropdownItem>
    <CDropdownItem divider />
    <CDropdownItem>Separated link</CDropdownItem>
  </CDropdownMenu>
</CDropdown>
```

### Progress & Status

```jsx
import { CProgress, CBadge, CAlert } from '@coreui/react'

// Progress bar
<CProgress value={40} />
<CProgress color="success" value={75} />
<CProgress thin color="danger" value={50} />

// Badges
<CBadge color="success">Active</CBadge>
<CBadge color="danger">Inactive</CBadge>

// Alerts
<CAlert color="success">Success message!</CAlert>
<CAlert color="warning" closeButton>Closeable alert</CAlert>
```

### Avatars

```jsx
import { CAvatar } from '@coreui/react'

<CAvatar src="avatar.jpg" />
<CAvatar src="avatar.jpg" status="success" />
<CAvatar color="primary" textColor="white">U</CAvatar>
```

### Icons

```jsx
import CIcon from '@coreui/icons-react'
import { cilBell, cilMenu, cilUser, cibFacebook, cifUs } from '@coreui/icons'

<CIcon icon={cilBell} />
<CIcon icon={cilMenu} size="lg" />
<CIcon icon={cibFacebook} />
<CIcon icon={cifUs} />
```

---

## 5. Grid & Responsive Layout

### Grid System

```jsx
import { CRow, CCol } from '@coreui/react'

// Basic grid
<CRow>
  <CCol xs={12} md={6} lg={4}>
    <p>Column content</p>
  </CCol>
</CRow>

// Responsive columns per breakpoint
<CRow xs={{ cols: 1 }} sm={{ cols: 2 }} lg={{ cols: 4 }}>
  <CCol>Item 1</CCol>
  <CCol>Item 2</CCol>
  <CCol>Item 3</CCol>
  <CCol>Item 4</CCol>
</CRow>

// Gutter (spacing between columns)
<CRow xs={{ cols: 1, gutter: 4 }} sm={{ cols: 2 }} lg={{ cols: 3 }}>
  <CCol>Item</CCol>
</CRow>
```

### Responsive Utilities

```jsx
// Hide on mobile, show on medium and up
<div className="d-none d-md-block">Desktop only</div>

// Show on mobile, hide on medium and up
<div className="d-block d-md-none">Mobile only</div>

// Responsive text alignment
<div className="text-center text-md-start text-lg-end">Content</div>

// Responsive margins
<div className="mb-2 mb-md-4 mb-lg-5">Spacing changes by breakpoint</div>

// Flex utilities
<div className="d-flex justify-content-between align-items-center">
  <span>Left</span>
  <span>Right</span>
</div>
```

### Breakpoints

- **xs**: < 576px (mobile)
- **sm**: ≥ 576px (tablets)
- **md**: ≥ 768px (tablets/small desktop)
- **lg**: ≥ 992px (desktop)
- **xl**: ≥ 1200px (large desktop)
- **xxl**: ≥ 1400px (extra large)

---

## 6. State Management with Redux

### Store Setup (store.js)

```javascript
import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  notifications: [],
  // Add more state as needed
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    default:
      return state
  }
}

export default createStore(reducer)
```

### Using Redux in Components

```jsx
import { useSelector, useDispatch } from 'react-redux'

const MyComponent = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)
  const notifications = useSelector(state => state.notifications)

  const handleToggleSidebar = () => {
    dispatch({
      type: 'SET_STATE',
      payload: { sidebarShow: !sidebarShow }
    })
  }

  const handleAddNotification = (message) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { id: Date.now(), message }
    })
  }

  return (
    <div>
      <button onClick={handleToggleSidebar}>Toggle Sidebar</button>
      <p>Sidebar visible: {sidebarShow ? 'Yes' : 'No'}</p>
    </div>
  )
}

export default MyComponent
```

---

## 7. Custom Hooks Pattern

### Example: useLoans Hook

```javascript
// hooks/useLoans.js
import { useState, useEffect } from 'react'

export const useLoans = () => {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/loans')
        if (!response.ok) throw new Error('Failed to fetch loans')
        const data = await response.json()
        setLoans(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        setLoans([])
      } finally {
        setLoading(false)
      }
    }

    fetchLoans()
  }, [])

  return { loans, loading, error }
}
```

**Usage:**

```jsx
import { useLoans } from '../hooks/useLoans'

const LoanList = () => {
  const { loans, loading, error } = useLoans()

  if (loading) return <CSpinner color="primary" />
  if (error) return <CAlert color="danger">{error}</CAlert>

  return (
    <CTable responsive>
      <CTableBody>
        {loans.map(loan => (
          <CTableRow key={loan.id}>
            <CTableDataCell>{loan.id}</CTableDataCell>
            <CTableDataCell>{loan.amount}</CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}
```

---

## 8. Dashboard Widget Pattern

### Example Widget Component

```jsx
// components/WidgetMetric.jsx
import { CCard, CCardBody, CCardHeader, CProgress } from '@coreui/react'

export const WidgetMetric = ({ title, value, percentage, color = 'primary' }) => {
  return (
    <CCard className="mb-3">
      <CCardHeader>{title}</CCardHeader>
      <CCardBody>
        <h3>{value}</h3>
        <CProgress value={percentage} color={color} />
        <small>{percentage}%</small>
      </CCardBody>
    </CCard>
  )
}
```

**Usage on Dashboard:**

```jsx
import { WidgetMetric } from '../components/WidgetMetric'
import { CRow, CCol } from '@coreui/react'

const Dashboard = () => {
  return (
    <CRow xs={{ cols: 1 }} sm={{ cols: 2 }} lg={{ cols: 4 }}>
      <CCol>
        <WidgetMetric
          title="Total Loans"
          value="1,234"
          percentage={75}
          color="info"
        />
      </CCol>
      <CCol>
        <WidgetMetric
          title="Active Borrowers"
          value="567"
          percentage={45}
          color="success"
        />
      </CCol>
      <CCol>
        <WidgetMetric
          title="Pending Approvals"
          value="89"
          percentage={20}
          color="warning"
        />
      </CCol>
      <CCol>
        <WidgetMetric
          title="Defaults"
          value="12"
          percentage={5}
          color="danger"
        />
      </CCol>
    </CRow>
  )
}
```

---

## 9. Form Component Pattern

### Example: LoanForm Component

```jsx
// components/LoanForm.jsx
import { CForm, CFormLabel, CFormInput, CFormSelect, CButton, CFormTextarea } from '@coreui/react'
import { useState } from 'react'

export const LoanForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState(initialData)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormLabel>Loan Amount</CFormLabel>
      <CFormInput
        type="number"
        name="amount"
        value={formData.amount || ''}
        onChange={handleChange}
        placeholder="Enter amount"
      />

      <CFormLabel>Interest Rate</CFormLabel>
      <CFormInput
        type="number"
        name="rate"
        value={formData.rate || ''}
        onChange={handleChange}
        placeholder="Enter rate"
      />

      <CFormLabel>Term (months)</CFormLabel>
      <CFormSelect
        name="term"
        value={formData.term || ''}
        onChange={handleChange}
        options={[
          { label: 'Select term', value: '' },
          { label: '6 months', value: 6 },
          { label: '12 months', value: 12 },
          { label: '24 months', value: 24 },
        ]}
      />

      <CFormLabel>Description</CFormLabel>
      <CFormTextarea
        name="description"
        value={formData.description || ''}
        onChange={handleChange}
        rows={4}
      />

      <CButton type="submit" color="primary" className="mt-3">
        Submit
      </CButton>
    </CForm>
  )
}
```

---

## 10. Styling Patterns

### SCSS Variables & Mixins

```scss
// _variables.scss
$primary: #0d6efd;
$success: #198754;
$danger: #dc3545;
$warning: #ffc107;
$info: #0dcaf0;

$spacing-unit: 1rem;
$border-radius: 0.375rem;

// _mixins.scss
@mixin card-shadow {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

@mixin transition($property: all, $duration: 0.15s) {
  transition: $property $duration ease-in-out;
}

// _components.scss
.metric-card {
  @include card-shadow;
  @include transition;
  padding: $spacing-unit;
  border-radius: $border-radius;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  }
}

// main.scss
@import 'variables';
@import 'mixins';
@import 'components';
@import '@coreui/coreui/scss/coreui';
```

### CSS Classes for Responsive Spacing

```jsx
// Margin utilities
<div className="mb-2 mb-md-4 mb-lg-5">
  Margin-bottom: 2 on mobile, 4 on md, 5 on lg
</div>

// Padding utilities
<div className="p-2 p-md-4">
  Padding: 2 on mobile, 4 on md+
</div>

// Display utilities
<div className="d-none d-md-block">
  Hidden on mobile, shown on md+
</div>

// Text utilities
<p className="text-center text-md-start text-lg-end">
  Center on mobile, left-aligned on md, right-aligned on lg
</p>
```

---

## 11. Tips & Best Practices

### Do's ✓
- Use CoreUI components for consistency
- Lazy-load route components
- Centralize navigation in _nav.js
- Keep Redux state minimal (UI + critical data)
- Use responsive grid system for layouts
- Create reusable widget components
- Use CSS variables for theming
- Organize SCSS in separate files

### Don'ts ✗
- Don't hardcode navigation in components
- Don't mix Bootstrap & CoreUI classes inconsistently
- Don't overuse inline styles
- Don't create deep component nesting
- Don't forget `key` props on lists
- Don't duplicate form logic in multiple components
- Don't ignore responsive design
- Don't commit node_modules or build files

### Performance Tips
- Use `React.memo()` for expensive components
- Implement pagination for large tables
- Lazy-load images with loading="lazy"
- Use `useCallback` for event handlers in lists
- Debounce search/filter inputs
- Profile with React DevTools

---

## Resources

- **CoreUI Documentation:** https://coreui.io/react/docs/
- **Bootstrap 5 Utilities:** https://getbootstrap.com/docs/5.0/utilities/
- **Icon Sets:** https://coreui.io/icons/
- **Chart.js:** https://www.chartjs.org/
- **React Router:** https://reactrouter.com/

