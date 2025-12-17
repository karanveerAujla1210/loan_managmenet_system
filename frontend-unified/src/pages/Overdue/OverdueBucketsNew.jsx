
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, Search, Calendar, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { overdueReportsService } from '../../services/overdueReports';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function OverdueBuckets() {
  const [overdueSummary, setOverdueSummary] = useState({
    totalOverdue: { count: 0, amount: 0 },
    overdueByBucket: [],
    recoveryRate: 0,
    generatedAt: null
  });
  const [overdueLoans, setOverdueLoans] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    bucket: 'all',
    branch: 'all',
    search: ''
  });

  useEffect(() => {
    const fetchOverdueSummary = async () => {
      try {
        setLoading(true);
        const data = await overdueReportsService.getOverdueSummary();
        setOverdueSummary(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching overdue summary:', error);
        setLoading(false);
      }
    };

    fetchOverdueSummary();
  }, [filters]);

  useEffect(() => {
    const fetchOverdueLoans = async () => {
      try {
        setLoading(true);
        const data = await overdueReportsService.getDetailedOverdueReport(filters);
        setOverdueLoans(data.loans);
        setPagination(data.pagination);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching overdue loans:', error);
        setLoading(false);
      }
    };

    fetchOverdueLoans();
  }, [filters]);

  const handleExport = async () => {
    try {
      const blob = await overdueReportsService.exportOverdueReport(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `overdue-report-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const pieData = overdueSummary.overdueByBucket.map(bucket => ({
    name: bucket._id,
    value: bucket.totalAmount,
    count: bucket.count
  }));

  const barData = overdueSummary.overdueByBucket.map(bucket => ({
    name: bucket._id,
    amount: bucket.totalAmount,
    count: bucket.count
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overdue Management</h1>
          <p className="text-gray-600 mt-1">Track and manage overdue loan accounts</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-5 w-5 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Overdue</dt>
                <dd className="text-lg font-medium text-gray-900">
                  ₹{overdueSummary.totalOverdue.amount.toLocaleString('en-IN')}
                </dd>
                <dd className="text-sm text-gray-500">
                  {overdueSummary.totalOverdue.count} accounts
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Recovery Rate</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {overdueSummary.recoveryRate}%
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Critical Overdue</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {overdueSummary.overdueByBucket.find(b => b._id === '90+')?.count || 0}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Last Updated</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {overdueSummary.generatedAt 
                    ? new Date(overdueSummary.generatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Loading...'
                  }
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Title>Overdue by Bucket</Card.Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'count' ? value : `₹${value.toLocaleString('en-IN')}`,
                  name === 'count' ? 'Accounts' : 'Amount'
                ]} 
              />
              <Legend />
              <Bar dataKey="amount" fill="#ef4444" name="amount" />
              <Bar dataKey="count" fill="#3b82f6" name="count" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <Card.Title>Overdue Distribution</Card.Title>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={filters.bucket}
              onChange={(e) => handleFilterChange('bucket', e.target.value)}
            >
              <option value="all">All Buckets</option>
              <option value="1-7">1-7 Days</option>
              <option value="8-15">8-15 Days</option>
              <option value="16-30">16-30 Days</option>
              <option value="31-60">31-60 Days</option>
              <option value="61-90">61-90 Days</option>
              <option value="90+">90+ Days</option>
            </select>
          </div>

          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={filters.branch}
            onChange={(e) => handleFilterChange('branch', e.target.value)}
          >
            <option value="all">All Branches</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi</option>
            <option value="bangalore">Bangalore</option>
          </select>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search by loan ID or customer..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Overdue Loans Table */}
      <Card>
        <Card.Title>Overdue Accounts</Card.Title>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Loan ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount Due</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">DPD</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Bucket</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Next Installment</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {overdueLoans.map((loan) => (
                  <tr key={loan._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{loan.loanId}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {loan.customerId?.firstName} {loan.customerId?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{loan.customerId?.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-red-600">
                      ₹{loan.totalRepayable.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${
                        loan.dpd <= 30 ? 'text-yellow-600' :
                        loan.dpd <= 60 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {loan.dpd} days
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={
                        loan.bucket === '90+' ? 'danger' :
                        loan.bucket === '61-90' ? 'warning' :
                        loan.bucket === '31-60' ? 'warning' :
                        'info'
                      }>
                        {loan.bucket}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {loan.nextInstallment ? (
                        <div>
                          <p className="text-sm text-gray-900">
                            {new Date(loan.nextInstallment.dueDate).toLocaleDateString('en-IN')}
                          </p>
                          <p className="text-sm font-medium text-gray-600">
                            ₹{loan.nextInstallment.emiAmount.toLocaleString('en-IN')}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Schedule Call</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
              >
                Next
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
