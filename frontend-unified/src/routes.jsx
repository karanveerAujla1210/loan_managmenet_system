import { Navigate } from 'react-router-dom';
import { RequireAuth, RequireRole } from './guards/RoleGuard';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized/index';
import Disputes from './pages/Disputes';
import Promises from './pages/Promises';
import CollectorPerformance from './pages/CollectorPerformance';
import MISReports from './pages/MISReports';
import Import from './pages/Import';

const CreditAnalysis = () => <div>Credit Analysis</div>;
const ActiveLoans = () => <div>Active Loans</div>;
const OverdueBuckets = () => <div>Overdue Buckets</div>;
const LegalCases = () => <div>Legal Cases</div>;
const ManualPayment = () => <div>Manual Payment</div>;
const BankReconciliation = () => <div>Bank Reconciliation</div>;
const CustomerProfile = () => <div>Customer Profile</div>;
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
        path: 'disputes',
        element: <RequireRole roles={['manager', 'admin']}><Disputes /></RequireRole>
      },
      {
        path: 'promises',
        element: <RequireRole roles={['collector', 'manager', 'admin']}><Promises /></RequireRole>
      },
      {
        path: 'collector-performance',
        element: <RequireRole roles={['manager', 'admin']}><CollectorPerformance /></RequireRole>
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
      },
      {
        path: 'import',
        element: <RequireRole roles={['admin']}><Import /></RequireRole>
      }
    ]
  },
  { path: '*', element: <Navigate to='/' /> }
];
