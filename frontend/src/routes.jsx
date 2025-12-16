import { Navigate } from 'react-router-dom';
import { RequireAuth, RequireRole } from './guards';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized/index';

// Lazy load pages
const CreditAnalysis = () => <div>Credit Analysis</div>;
const ActiveLoans = () => <div>Active Loans</div>;
const OverdueBuckets = () => <div>Overdue Buckets</div>;
const LegalCases = () => <div>Legal Cases</div>;
const ManualPayment = () => <div>Manual Payment</div>;
const BankReconciliation = () => <div>Bank Reconciliation</div>;
const CustomerProfile = () => <div>Customer Profile</div>;
const MISReports = () => <div>MIS Reports</div>;
const Settings = () => <div>Settings</div>;

export const routes = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />
  },
  {
    path: '/',
    element: <RequireAuth><Dashboard /></RequireAuth>,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      {
        path: 'credit',
        element: <RequireRole roles={['admin', 'manager']}><CreditAnalysis /></RequireRole>
      },
      {
        path: 'loans',
        element: <ActiveLoans />
      },
      {
        path: 'overdue',
        element: <OverdueBuckets />
      },
      {
        path: 'legal',
        element: <RequireRole roles={['legal', 'admin', 'manager']}><LegalCases /></RequireRole>
      },
      {
        path: 'payments',
        element: <ManualPayment />
      },
      {
        path: 'reconciliation',
        element: <RequireRole roles={['admin']}><BankReconciliation /></RequireRole>
      },
      {
        path: 'customers/:id',
        element: <CustomerProfile />
      },
      {
        path: 'reports',
        element: <RequireRole roles={['admin', 'manager']}><MISReports /></RequireRole>
      },
      {
        path: 'settings',
        element: <RequireRole roles={['admin']}><Settings /></RequireRole>
      }
    ]
  },
  { path: '*', element: <Navigate to='/dashboard' /> }
];
