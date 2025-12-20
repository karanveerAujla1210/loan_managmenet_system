import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ModernLayout from './components/Layout/ModernLayout';

// Pages
import Login from './pages/Login/OptimizedLogin';
import Dashboard from './pages/Dashboard/DashboardOptimized';
import Leads from './pages/Leads';
import Application from './pages/Application';
import CreditAssessment from './pages/CreditManagement';
import Approval from './pages/Approval';
import Disbursement from './pages/Disbursement';
import ActiveLoans from './pages/ActiveLoans';
import LoanDetail from './pages/LoanDetail';
import Collections from './pages/Collections';
import CollectorWorklist from './pages/Collector/MyCases';
import Legal from './pages/Legal/LegalDashboard';
import Closure from './pages/CaseClosure';
import MISReports from './pages/MISReports';
import Users from './pages/Users';
import AuditLog from './pages/AuditLog';
import Configuration from './pages/Configuration';
import Unauthorized from './pages/Unauthorized';
import PageNotFound from './pages/PageNotFound';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<PageNotFound />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute user={user} />}>
            <Route element={<ModernLayout user={user} />}>
              {/* Dashboard */}
              <Route path="/" element={<Dashboard />} />

              {/* STAGE 1: LEAD & APPLICATION */}
              <Route path="/leads" element={<ProtectedRoute user={user} requiredRoles={['telecaller', 'manager', 'admin']}><Leads /></ProtectedRoute>} />
              <Route path="/application" element={<ProtectedRoute user={user} requiredRoles={['customer', 'telecaller', 'manager', 'admin']}><Application /></ProtectedRoute>} />

              {/* STAGE 2: CREDIT & RISK */}
              <Route path="/credit-assessment" element={<ProtectedRoute user={user} requiredRoles={['credit_analyst', 'manager', 'admin']}><CreditAssessment /></ProtectedRoute>} />
              <Route path="/approval" element={<ProtectedRoute user={user} requiredRoles={['manager', 'admin']}><Approval /></ProtectedRoute>} />

              {/* STAGE 3: DISBURSEMENT */}
              <Route path="/disbursement" element={<ProtectedRoute user={user} requiredRoles={['operations', 'finance', 'manager', 'admin']}><Disbursement /></ProtectedRoute>} />

              {/* STAGE 4: REPAYMENT */}
              <Route path="/active-loans" element={<ProtectedRoute user={user} requiredRoles={['operations', 'manager', 'admin', 'collector', 'collections_head']}><ActiveLoans /></ProtectedRoute>} />
              <Route path="/loan/:id" element={<ProtectedRoute user={user} requiredRoles={['all']}><LoanDetail /></ProtectedRoute>} />

              {/* STAGE 5: COLLECTIONS */}
              <Route path="/collections" element={<ProtectedRoute user={user} requiredRoles={['collections_head', 'manager', 'admin']}><Collections /></ProtectedRoute>} />
              <Route path="/collector-worklist" element={<ProtectedRoute user={user} requiredRoles={['collector']}><CollectorWorklist /></ProtectedRoute>} />

              {/* STAGE 6: LEGAL */}
              <Route path="/legal" element={<ProtectedRoute user={user} requiredRoles={['legal_officer', 'manager', 'admin']}><Legal /></ProtectedRoute>} />

              {/* STAGE 7: CLOSURE */}
              <Route path="/closure" element={<ProtectedRoute user={user} requiredRoles={['operations', 'finance', 'manager', 'admin']}><Closure /></ProtectedRoute>} />

              {/* STAGE 8: MIS & CONTROL */}
              <Route path="/mis-reports" element={<ProtectedRoute user={user} requiredRoles={['manager', 'admin', 'coo']}><MISReports /></ProtectedRoute>} />

              {/* SYSTEM-WIDE */}
              <Route path="/users" element={<ProtectedRoute user={user} requiredRoles={['admin']}><Users /></ProtectedRoute>} />
              <Route path="/audit-log" element={<ProtectedRoute user={user} requiredRoles={['admin', 'manager']}><AuditLog /></ProtectedRoute>} />
              <Route path="/configuration" element={<ProtectedRoute user={user} requiredRoles={['admin']}><Configuration /></ProtectedRoute>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
