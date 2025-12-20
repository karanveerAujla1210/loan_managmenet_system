import { useEffect, useState } from 'react';
import { Users, TrendingUp, DollarSign, AlertCircle, Loader } from 'lucide-react';
import KPICard from '../components/ui/KPICard';
import { LineChart, Line, PieChart as PieChartComponent, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as loansService from '../services/loans';
import * as customersService from '../services/customers';

export default function ModernDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [loansData, customersData] = await Promise.all([
        loansService.getLoans().catch(err => {
          console.error('Loans fetch error:', err);
          return { data: [] };
        }),
        customersService.getCustomers().catch(err => {
          console.error('Customers fetch error:', err);
          return { data: [] };
        })
      ]);

      const loans = loansData?.data || [];
      const customers = customersData?.data || [];

      const stats = {
        totalCustomers: customers.length,
        activeLoans: loans.filter(l => l.status === 'disbursed').length,
        totalDisbursed: loans.reduce((sum, l) => sum + (l.principalAmount || 0), 0),
        overdueLoans: loans.filter(l => l.dpd > 30).length,
        monthlyCollections: 0,
      };

      setDashboardData(stats);

      const activities = loans.slice(0, 5).map(l => ({
        id: l.id,
        customer: l.customerName || l.customerId,
        action: 'Loan Disbursed',
        amount: `₹${(l.principalAmount || 0).toLocaleString()}`,
        time: new Date(l.disbursementDate || l.createdAt).toLocaleDateString(),
        status: 'success',
        type: 'disbursement'
      }));

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setDashboardData({
        totalCustomers: 0,
        activeLoans: 0,
        totalDisbursed: 0,
        overdueLoans: 0,
        monthlyCollections: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboardData || {
    totalCustomers: 0,
    activeLoans: 0,
    totalDisbursed: 0,
    overdueLoans: 0,
    monthlyCollections: 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const performanceData = [
    { month: 'Jan', disbursed: 45000, collected: 38000 },
    { month: 'Feb', disbursed: 52000, collected: 41000 },
    { month: 'Mar', disbursed: 48000, collected: 45000 },
    { month: 'Apr', disbursed: 61000, collected: 52000 },
    { month: 'May', disbursed: 55000, collected: 48000 },
    { month: 'Jun', disbursed: 67000, collected: 61000 },
  ];

  const statusData = [
    { name: 'Active', value: stats.activeLoans || 0, color: '#1741FF' },
    { name: 'DPD', value: stats.overdueLoans || 0, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your performance snapshot today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Total Customers"
          value={stats.totalCustomers?.toLocaleString() || '0'}
          icon={Users}
          trend="up"
          trendValue="12"
          color="blue"
        />
        <KPICard
          label="Active Loans"
          value={stats.activeLoans?.toLocaleString() || '0'}
          icon={TrendingUp}
          trend="up"
          trendValue="8"
          color="green"
        />
        <KPICard
          label="Total Disbursed"
          value={`₹${((stats.totalDisbursed || 0) / 100000).toFixed(1)}L`}
          icon={DollarSign}
          trend="up"
          trendValue="15"
          color="orange"
        />
        <KPICard
          label="DPD Cases"
          value={stats.overdueLoans?.toLocaleString() || '0'}
          icon={AlertCircle}
          trend="down"
          trendValue="5"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
            <p className="text-sm text-gray-500 mt-1">Disbursement vs Collection trends</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="disbursed"
                stroke="#1741FF"
                strokeWidth={2}
                dot={{ fill: '#1741FF', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="collected"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Loan Status</h2>
            <p className="text-sm text-gray-500 mt-1">Distribution overview</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChartComponent>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChartComponent>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-500 mt-1">Latest transactions and updates</p>
        </div>

        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.customer}</p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{activity.amount}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <div className="ml-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'success'
                        ? 'bg-green-50 text-green-700'
                        : activity.status === 'warning'
                        ? 'bg-orange-50 text-orange-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {activity.status === 'success' ? '✓' : activity.status === 'warning' ? '!' : 'i'} {activity.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
