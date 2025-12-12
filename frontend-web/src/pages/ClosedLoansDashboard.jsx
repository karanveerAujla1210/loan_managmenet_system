import { useState, useEffect } from 'react';
import { CheckCircle, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import analyticsService from '../services/analyticsService';
import PageHeader from '../components/PageHeader';

const ClosedLoansDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalClosed: 0,
    totalClosedAmount: 0,
    avgClosureDays: 0,
    earlyClosures: 0,
    monthlyTrend: []
  });

  useEffect(() => {
    loadClosedLoansData();
  }, []);

  const loadClosedLoansData = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getClosed();
      setData(response.data);
    } catch (error) {
      console.error('Error loading closed loans data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = data.monthlyTrend.map(item => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    count: item.count,
    amount: item.amount
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Closed Loans Dashboard" 
        subtitle="Closed loans analysis and trends"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-green-50 border-2 border-green-200 text-green-900 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium opacity-75">Total Closed</p>
              <p className="text-2xl font-bold">{data.totalClosed}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 text-blue-900 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium opacity-75">Closed Amount</p>
              <p className="text-2xl font-bold">
                ₹{new Intl.NumberFormat('en-IN').format(data.totalClosedAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 text-purple-900 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium opacity-75">Avg Closure Days</p>
              <p className="text-2xl font-bold">{Math.round(data.avgClosureDays)} days</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-900 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium opacity-75">Early Closures</p>
              <p className="text-2xl font-bold">{data.earlyClosures}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Closure Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => [
                name === 'count' ? value : `₹${new Intl.NumberFormat('en-IN').format(value)}`,
                name === 'count' ? 'Loans Closed' : 'Amount Closed'
              ]}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="count" 
              stroke="#10B981" 
              strokeWidth={2}
              name="count"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="amount" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="amount"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Closure Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Closure Rate</span>
              <span className="font-semibold">
                {((data.totalClosed / (data.totalClosed + 500)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Early Closure Rate</span>
              <span className="font-semibold">
                {((data.earlyClosures / data.totalClosed) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Amount per Closure</span>
              <span className="font-semibold">
                ₹{new Intl.NumberFormat('en-IN').format(data.totalClosedAmount / data.totalClosed || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Closure Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>{data.earlyClosures}</strong> loans closed early, indicating good customer satisfaction
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Average closure time of <strong>{Math.round(data.avgClosureDays)} days</strong> shows efficient processing
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800">
                Total recovered amount: <strong>₹{new Intl.NumberFormat('en-IN').format(data.totalClosedAmount)}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClosedLoansDashboard;