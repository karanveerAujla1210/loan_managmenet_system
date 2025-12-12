import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import analyticsService from '../services/analyticsService';
import PageHeader from '../components/PageHeader';

const DefaultsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadDefaultsData();
  }, []);

  const loadDefaultsData = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getDefaults();
      setData(response.data);
    } catch (error) {
      console.error('Error loading defaults data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalDefaults = data.reduce((sum, item) => sum + item.count, 0);
  const totalAmount = data.reduce((sum, item) => sum + item.totalAmount, 0);
  const avgDPD = data.reduce((sum, item) => sum + (item.avgDPD * item.count), 0) / totalDefaults || 0;

  const chartData = data.map(item => ({
    range: item._id.dpdRange,
    count: item.count,
    amount: item.totalAmount,
    avgDPD: item.avgDPD
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
        title="Defaults Dashboard" 
        subtitle="Default loans analysis and aging"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-red-50 border-2 border-red-200 text-red-900 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium opacity-75">Total Defaults</p>
              <p className="text-2xl font-bold">{totalDefaults}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border-2 border-orange-200 text-orange-900 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium opacity-75">Default Amount</p>
              <p className="text-2xl font-bold">
                ₹{new Intl.NumberFormat('en-IN').format(totalAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 text-purple-900 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium opacity-75">Avg DPD</p>
              <p className="text-2xl font-bold">{Math.round(avgDPD)} days</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-900 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <TrendingDown className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium opacity-75">Default Rate</p>
              <p className="text-2xl font-bold">
                {((totalDefaults / (totalDefaults + 1000)) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DPD Range Distribution */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Default Aging Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'count' ? value : `₹${new Intl.NumberFormat('en-IN').format(value)}`,
                name === 'count' ? 'Loans' : 'Amount'
              ]}
            />
            <Bar dataKey="count" fill="#EF4444" name="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">DPD Range Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DPD Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg DPD
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      {item._id.dpdRange} days
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{new Intl.NumberFormat('en-IN').format(item.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.round(item.avgDPD)} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {((item.count / totalDefaults) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DefaultsDashboard;