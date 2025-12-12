import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customers';
import Loans from '../pages/Loans';
import Collections from '../pages/Collections';
import Analytics from '../pages/Analytics';
import LegalDashboard from '../pages/LegalDashboard';
import DefaultsDashboard from '../pages/DefaultsDashboard';
import ClosedLoansDashboard from '../pages/ClosedLoansDashboard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/loans" element={<Loans />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/analytics/legal" element={<LegalDashboard />} />
                  <Route path="/analytics/defaults" element={<DefaultsDashboard />} />
                  <Route path="/analytics/closed" element={<ClosedLoansDashboard />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;