import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, FileText, DollarSign, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const stats = {
    totalCustomers: 1250,
    activeLoans: 890,
    totalDisbursed: 45000000,
    monthlyCollections: 3200000
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLoans.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalDisbursed / 10000000).toFixed(1)}Cr</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Collections</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.monthlyCollections / 100000).toFixed(1)}L</div>
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
              <div className="flex justify-between">
                <span>Loan Disbursed - NITIN CHAURASIA</span>
                <span className="text-green-600">₹25,000</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Received - AFREEN</span>
                <span className="text-blue-600">₹2,500</span>
              </div>
              <div className="flex justify-between">
                <span>New Customer - PAWAN KESARWANI</span>
                <span className="text-gray-600">Added</span>
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
              <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100">
                <div className="font-medium">Add New Customer</div>
                <div className="text-sm text-gray-500">Create customer profile</div>
              </button>
              <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100">
                <div className="font-medium">Process Loan</div>
                <div className="text-sm text-gray-500">Create loan application</div>
              </button>
              <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100">
                <div className="font-medium">Record Payment</div>
                <div className="text-sm text-gray-500">Add payment entry</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;