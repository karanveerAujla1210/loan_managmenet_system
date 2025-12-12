import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

// Mock data for now - replace with actual API call
const getDashboardStats = async () => {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        totalCustomers: 1250,
        activeLoans: 847,
        totalDisbursed: 15420000,
        pendingApprovals: 23,
        monthlyCollections: 2450000,
        overdueLoans: 45
      });
    }, 1000);
  });
};

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery(['dashboard'], getDashboardStats);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-600">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalCustomers || 0}</div>
            <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-600">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.activeLoans || 0}</div>
            <p className="text-sm text-gray-500 mt-2">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-600">Total Disbursed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              ${stats?.totalDisbursed?.toLocaleString() || 0}
            </div>
            <p className="text-sm text-gray-500 mt-2">+15% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-600">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats?.pendingApprovals || 0}</div>
            <p className="text-sm text-gray-500 mt-2">Requires attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-600">Monthly Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${stats?.monthlyCollections?.toLocaleString() || 0}
            </div>
            <p className="text-sm text-gray-500 mt-2">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-600">Overdue Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats?.overdueLoans || 0}</div>
            <p className="text-sm text-gray-500 mt-2">-3% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">New loan application</p>
                  <p className="text-sm text-gray-500">John Doe - $50,000</p>
                </div>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment received</p>
                  <p className="text-sm text-gray-500">Jane Smith - $2,500</p>
                </div>
                <span className="text-xs text-gray-400">4 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">New customer registered</p>
                  <p className="text-sm text-gray-500">Robert Johnson</p>
                </div>
                <span className="text-xs text-gray-400">5 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-sm font-medium text-gray-900">Create New Customer</p>
                <p className="text-xs text-gray-500">Add a new customer to the system</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-sm font-medium text-gray-900">Apply for Loan</p>
                <p className="text-xs text-gray-500">Create a new loan application</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-sm font-medium text-gray-900">Record Payment</p>
                <p className="text-xs text-gray-500">Record a loan payment</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
