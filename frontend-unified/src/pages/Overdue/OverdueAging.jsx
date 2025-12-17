
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const OverdueAging = () => {
  const [agingData, setAgingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    branch: 'all',
    dateRange: '30days'
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAgingData([
        { bucket: '1-7', count: 45, amount: 2250000 },
        { bucket: '8-15', count: 32, amount: 1600000 },
        { bucket: '16-30', count: 28, amount: 1400000 },
        { bucket: '31-60', count: 22, amount: 1100000 },
        { bucket: '61-90', count: 15, amount: 750000 },
        { bucket: '90+', count: 8, amount: 400000 }
      ]);
      setLoading(false);
    }, 1000);
  }, [filters]);

  const handleExport = () => {
    // Export functionality
    console.log('Exporting aging report...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overdue Aging Report</h1>
          <p className="text-gray-600 mt-1">Analysis of overdue loans by age buckets</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-5 w-5 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={filters.branch}
              onChange={(e) => setFilters({...filters, branch: e.target.value})}
            >
              <option value="all">All Branches</option>
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="bangalore">Bangalore</option>
            </select>
          </div>

          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </Card>

      {/* Aging Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Overdue Distribution</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={agingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="bucket" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'count' ? value : `₹${value.toLocaleString('en-IN')}`,
                name === 'count' ? 'Accounts' : 'Amount'
              ]} 
            />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" name="count" />
            <Bar dataKey="amount" fill="#ef4444" name="amount" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Aging Table */}
      <Card>
        <Card.Header>
          <Card.Title>Overdue Aging Details</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">DPD Bucket</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Account Count</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Outstanding Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Percentage</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agingData.map((bucket, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{bucket.bucket} Days</td>
                    <td className="py-3 px-4">{bucket.count}</td>
                    <td className="py-3 px-4">₹{bucket.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        parseInt(bucket.bucket.split('-')[1]) < 30 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {((bucket.amount / agingData.reduce((sum, b) => sum + b.amount, 0)) * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline">View Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default OverdueAging;
