import React from 'react';
import { 
  CurrencyDollarIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const kpiData = [
    {
      title: 'Total Portfolio',
      value: '₹2.4Cr',
      change: '+12.5%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'text-green-600'
    },
    {
      title: 'Active Customers',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: UsersIcon,
      color: 'text-blue-600'
    },
    {
      title: 'Pending Applications',
      value: '89',
      change: '-5.1%',
      trend: 'down',
      icon: DocumentTextIcon,
      color: 'text-orange-600'
    },
    {
      title: 'Collection Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: ChartBarIcon,
      color: 'text-purple-600'
    }
  ];

  const recentLoans = [
    { id: 'LN001', customer: 'Rajesh Kumar', amount: '₹5,00,000', status: 'approved', date: '2024-01-15' },
    { id: 'LN002', customer: 'Priya Sharma', amount: '₹3,50,000', status: 'pending', date: '2024-01-14' },
    { id: 'LN003', customer: 'Amit Patel', amount: '₹7,50,000', status: 'disbursed', date: '2024-01-13' },
    { id: 'LN004', customer: 'Sunita Devi', amount: '₹2,25,000', status: 'rejected', date: '2024-01-12' }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      approved: 'success',
      pending: 'warning',
      disbursed: 'info',
      rejected: 'danger'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-base text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Export Report</Button>
          <Button>New Application</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{kpi.value}</p>
                <div className="flex items-center mt-2">
                  {kpi.trend === 'up' ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ml-1 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Loans */}
        <Card>
          <Card.Header>
            <Card.Title>Recent Loan Applications</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {recentLoans.map((loan) => (
                <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{loan.customer}</p>
                    <p className="text-sm text-gray-600">{loan.id} • {loan.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{loan.amount}</p>
                    {getStatusBadge(loan.status)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">View All Applications</Button>
            </div>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <Card.Title>Quick Actions</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <UsersIcon className="h-6 w-6 mb-2" />
                Add Customer
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <DocumentTextIcon className="h-6 w-6 mb-2" />
                New Application
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <CurrencyDollarIcon className="h-6 w-6 mb-2" />
                Record Payment
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <ChartBarIcon className="h-6 w-6 mb-2" />
                Generate Report
              </Button>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Collections Overview */}
      <Card>
        <Card.Header>
          <Card.Title>Collections Overview</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-600">₹45.2L</p>
              <p className="text-sm text-gray-600">Collected Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-orange-600">₹12.8L</p>
              <p className="text-sm text-gray-600">Pending Collection</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-red-600">₹8.5L</p>
              <p className="text-sm text-gray-600">Overdue Amount</p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Dashboard;