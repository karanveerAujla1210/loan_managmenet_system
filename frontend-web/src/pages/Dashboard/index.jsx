import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
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
          <CardHeader className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-indigo-50 flex items-center justify-center">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900">{stats.totalCustomers.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Customers in system</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-yellow-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-yellow-600" />
              </div>
              <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900">{stats.activeLoans.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Currently active</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-green-50 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900">₹{(stats.totalDisbursed / 10000000).toFixed(1)}Cr</div>
            <div className="text-sm text-gray-500 mt-1">All-time disbursed</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-indigo-50 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-indigo-600" />
              </div>
              <CardTitle className="text-sm font-medium">Monthly Collections</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900">₹{(stats.monthlyCollections / 100000).toFixed(1)}L</div>
            <div className="text-sm text-gray-500 mt-1">This month's total</div>
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
              <Button className="w-full justify-start" variant="secondary">
                <span className="font-medium">Add New Customer</span>
                <span className="ml-2 text-sm text-gray-500">Create customer profile</span>
              </Button>
              <Button className="w-full justify-start" variant="default">
                <span className="font-medium">Process Loan</span>
                <span className="ml-2 text-sm text-gray-500">Create loan application</span>
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <span className="font-medium">Record Payment</span>
                <span className="ml-2 text-sm text-gray-500">Add payment entry</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;