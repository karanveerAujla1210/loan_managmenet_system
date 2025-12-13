import { lazy } from 'react';

// Lazy load heavy components for better performance
export const Dashboard = lazy(() => import('../pages/Dashboard/DashboardOptimized'));
export const Customers = lazy(() => import('../pages/Customers'));
export const Loans = lazy(() => import('../pages/Loans'));
export const Collections = lazy(() => import('../pages/Collections'));
export const Upload = lazy(() => import('../pages/Upload'));
export const Profile = lazy(() => import('../pages/Profile'));

// Dashboard sub-components
export const RiskAnalytics = lazy(() => import('../pages/Dashboard/components/RiskAnalytics'));
export const PortfolioCharts = lazy(() => import('../pages/Dashboard/components/PortfolioCharts'));
export const AdvancedCharts = lazy(() => import('../pages/Dashboard/components/AdvancedCharts'));

// Loading component
export const ComponentLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);