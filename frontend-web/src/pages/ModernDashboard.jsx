import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Users,
  TrendingUp,
  DollarSign,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import KPICard from '../components/Dashboard/KPICard';
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from '../components/ui/ModernCard';
import { ModernButton } from '../components/ui/ModernButton';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { formatCurrency, formatDate, getStatusColor, getDPDColor } from '../lib/utils';

const ModernDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('today');

  // Mock data - replace with real API calls
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      totalLoans: { value: 1250, change: 12.5, trend: 'up' },
      activeCustomers: { value: 890, change: 8.3, trend: 'up' },
      disbursedAmount: { value: 25000000, change: 15.2, trend: 'up' },
      collectionRate: { value: 94.5, change: -2.1, trend: 'down' },
      pendingApplications: { value: 45, change: 5, trend: 'up' },
      overdueLoans: { value: 23, change: -8.5, trend: 'down' }
    },
    recentLoans: [
      { id: 'LN001', customer: 'John Doe', amount: 500000, status: 'approved', date: '2024-01-15' },
      { id: 'LN002', customer: 'Jane Smith', amount: 750000, status: 'processing', date: '2024-01-14' },
      { id: 'LN003', customer: 'Mike Johnson', amount: 300000, status: 'pending', date: '2024-01-13' },
      { id: 'LN004', customer: 'Sarah Wilson', amount: 1000000, status: 'approved', date: '2024-01-12' },
      { id: 'LN005', customer: 'David Brown', amount: 450000, status: 'rejected', date: '2024-01-11' }
    ],
    collections: [
      { customer: 'ABC Corp', amount: 125000, dpd: 5, status: 'contacted' },
      { customer: 'XYZ Ltd', amount: 85000, dpd: 15, status: 'promised' },
      { customer: 'Tech Solutions', amount: 200000, dpd: 30, status: 'legal' },
      { customer: 'Global Inc', amount: 95000, dpd: 2, status: 'paid' }
    ]
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getRoleSpecificKPIs = () => {
    const { kpis } = dashboardData;
    
    switch (user?.role) {
      case 'counsellor':
        return [
          { ...kpis.activeCustomers, title: 'Active Leads', icon: Users, color: 'primary' },
          { ...kpis.pendingApplications, title: 'New Applications', icon: Clock, color: 'warning' },
          { value: 15, title: 'Calls Today', icon: Phone, color: 'info', trend: 'up', change: 25 },
          { value: 8, title: 'Conversions', icon: CheckCircle, color: 'success', trend: 'up', change: 12.5 }
        ];
      
      case 'advisor':
        return [
          { ...kpis.pendingApplications, title: 'Pending Reviews', icon: Clock, color: 'warning' },
          { value: 32, title: 'Credit Assessments', icon: TrendingUp, color: 'primary', trend: 'up', change: 18 },
          { value: 28, title: 'Approved Today', icon: CheckCircle, color: 'success', trend: 'up', change: 15 },
          { value: 5, title: 'Risk Flags', icon: AlertTriangle, color: 'error', trend: 'down', change: -20 }
        ];
      
      case 'collector':
        return [
          { ...kpis.overdueLoans, title: 'Overdue Accounts', icon: AlertTriangle, color: 'error' },
          { ...kpis.collectionRate, title: 'Collection Rate', icon: TrendingUp, color: 'success', format: 'percentage' },
          { value: 850000, title: 'Collected Today', icon: DollarSign, color: 'success', format: 'currency', trend: 'up', change: 22 },
          { value: 45, title: 'Calls Made', icon: Phone, color: 'info', trend: 'up', change: 8 }
        ];
      
      default: // manager, admin
        return [
          { ...kpis.totalLoans, title: 'Total Loans', icon: CreditCard, color: 'primary' },
          { ...kpis.activeCustomers, title: 'Active Customers', icon: Users, color: 'info' },
          { ...kpis.disbursedAmount, title: 'Disbursed Amount', icon: DollarSign, color: 'success', format: 'currency' },
          { ...kpis.collectionRate, title: 'Collection Rate', icon: TrendingUp, color: 'warning', format: 'percentage' }
        ];
    }
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'counsellor':
        return [
          { label: 'Add New Lead', icon: Plus, variant: 'default' },
          { label: 'Schedule Call', icon: Phone, variant: 'outline' },
          { label: 'Upload Documents', icon: Upload, variant: 'outline' }
        ];
      
      case 'advisor':
        return [
          { label: 'Review Application', icon: CheckCircle, variant: 'default' },
          { label: 'Credit Analysis', icon: TrendingUp, variant: 'outline' },
          { label: 'Generate Report', icon: Download, variant: 'outline' }
        ];
      
      case 'collector':
        return [
          { label: 'Make Call', icon: Phone, variant: 'default' },
          { label: 'Update Status', icon: RefreshCw, variant: 'outline' },
          { label: 'Payment Receipt', icon: DollarSign, variant: 'outline' }
        ];
      
      default:
        return [
          { label: 'New Application', icon: Plus, variant: 'default' },
          { label: 'Generate Report', icon: Download, variant: 'outline' },
          { label: 'System Settings', icon: Filter, variant: 'outline' }
        ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="text-base text-gray-600 mt-1">
            Here's what's happening with your {user?.role || 'business'} today.
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          
          <ModernButton
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            loading={refreshing}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </ModernButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getRoleSpecificKPIs().map((kpi, index) => (
          <KPICard
            key={index}
            loading={loading}
            {...kpi}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <ModernCard>
        <ModernCardHeader>
          <ModernCardTitle>Quick Actions</ModernCardTitle>
        </ModernCardHeader>
        <ModernCardContent>
          <div className="flex flex-wrap gap-3">
            {getQuickActions().map((action, index) => (
              <ModernButton
                key={index}
                variant={action.variant}
                size="sm"
              >
                <action.icon className="w-4 h-4 mr-2" />
                {action.label}
              </ModernButton>
            ))}
          </div>
        </ModernCardContent>
      </ModernCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Loans */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Recent Loan Applications</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="space-y-4">
              {dashboardData.recentLoans.map((loan) => (
                <div key={loan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{loan.customer}</p>
                        <p className="text-sm text-gray-600">{loan.id}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(loan.amount)}</p>
                    <Badge variant={loan.status === 'approved' ? 'success' : loan.status === 'rejected' ? 'error' : 'default'}>
                      {loan.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Collections Overview */}
        {(user?.role === 'collector' || user?.role === 'manager' || user?.role === 'admin') && (
          <ModernCard>
            <ModernCardHeader>
              <ModernCardTitle>Collections Overview</ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent>
              <div className="space-y-4">
                {dashboardData.collections.map((collection, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{collection.customer}</p>
                          <div className="flex items-center space-x-2">
                            <Badge className={getDPDColor(collection.dpd)}>
                              {collection.dpd} DPD
                            </Badge>
                            <Badge variant={collection.status === 'paid' ? 'success' : 'default'}>
                              {collection.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(collection.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ModernCardContent>
          </ModernCard>
        )}
      </div>
    </div>
  );
};

export default ModernDashboard;