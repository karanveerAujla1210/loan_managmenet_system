import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  DocumentArrowDownIcon, 
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const monthlyData = [
    { month: 'Jan', disbursed: 45, collected: 38, applications: 67 },
    { month: 'Feb', disbursed: 52, collected: 42, applications: 73 },
    { month: 'Mar', disbursed: 48, collected: 45, applications: 69 },
    { month: 'Apr', disbursed: 61, collected: 51, applications: 82 },
    { month: 'May', disbursed: 55, collected: 48, applications: 76 },
    { month: 'Jun', disbursed: 67, collected: 58, applications: 89 }
  ];

  const portfolioData = [
    { name: 'Performing', value: 85, color: '#22c55e' },
    { name: 'Standard', value: 10, color: '#f59e0b' },
    { name: 'Sub-Standard', value: 3, color: '#ef4444' },
    { name: 'Doubtful', value: 2, color: '#dc2626' }
  ];

  const collectionData = [
    { bucket: '0-30 Days', amount: 45.2, count: 156 },
    { bucket: '31-60 Days', amount: 12.8, count: 43 },
    { bucket: '61-90 Days', amount: 8.5, count: 28 },
    { bucket: '90+ Days', amount: 15.3, count: 67 }
  ];

  const reportTypes = [
    { id: 'overview', name: 'Portfolio Overview', description: 'Complete portfolio summary' },
    { id: 'disbursement', name: 'Disbursement Report', description: 'Loan disbursement analytics' },
    { id: 'collection', name: 'Collection Report', description: 'Payment collection analysis' },
    { id: 'performance', name: 'Performance Report', description: 'Team and system performance' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-base text-gray-600 mt-1">Comprehensive business insights and reporting</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Date Range
          </Button>
          <Button>
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Report Type Selector */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedReport === report.id
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {report.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-semibold text-primary-600">₹2.4Cr</p>
            <p className="text-sm text-gray-600 mt-1">Total Portfolio</p>
            <Badge variant="success" className="mt-2">+12.5%</Badge>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-semibold text-green-600">94.2%</p>
            <p className="text-sm text-gray-600 mt-1">Collection Rate</p>
            <Badge variant="success" className="mt-2">+2.1%</Badge>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-semibold text-blue-600">1,247</p>
            <p className="text-sm text-gray-600 mt-1">Active Customers</p>
            <Badge variant="info" className="mt-2">+8.2%</Badge>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-semibold text-orange-600">2.8%</p>
            <p className="text-sm text-gray-600 mt-1">NPL Ratio</p>
            <Badge variant="warning" className="mt-2">-0.5%</Badge>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <Card.Header>
            <Card.Title>Monthly Trends</Card.Title>
          </Card.Header>
          <Card.Content>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="disbursed" fill="#1741FF" name="Disbursed" />
                <Bar dataKey="collected" fill="#22c55e" name="Collected" />
              </BarChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>

        {/* Portfolio Quality */}
        <Card>
          <Card.Header>
            <Card.Title>Portfolio Quality</Card.Title>
          </Card.Header>
          <Card.Content>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>
      </div>

      {/* Collection Analysis */}
      <Card>
        <Card.Header>
          <Card.Title>Collection Bucket Analysis</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Bucket</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Outstanding Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Number of Accounts</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Percentage</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Action Required</th>
                </tr>
              </thead>
              <tbody>
                {collectionData.map((bucket, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{bucket.bucket}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">₹{bucket.amount}L</td>
                    <td className="py-3 px-4 text-gray-900">{bucket.count}</td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full" 
                          style={{ width: `${(bucket.amount / 82) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {index === 0 && <Badge variant="success">Regular Follow-up</Badge>}
                      {index === 1 && <Badge variant="warning">Intensive Follow-up</Badge>}
                      {index === 2 && <Badge variant="danger">Legal Notice</Badge>}
                      {index === 3 && <Badge variant="danger">Recovery Action</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <Card.Header>
            <Card.Title>Team Performance</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Priya Singh</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rohit Sharma</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }} />
                  </div>
                  <span className="text-sm font-medium">88%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Anjali Verma</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '76%' }} />
                  </div>
                  <span className="text-sm font-medium">76%</span>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Application Status</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Approved</span>
                <Badge variant="success">156 (68%)</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <Badge variant="warning">43 (19%)</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rejected</span>
                <Badge variant="danger">29 (13%)</Badge>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Quick Actions</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Download Monthly Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Generate Custom Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FunnelIcon className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Reports;