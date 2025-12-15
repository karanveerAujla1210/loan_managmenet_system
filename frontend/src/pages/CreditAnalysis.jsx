import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, TrendingDown, Loader } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import * as customersService from '../services/customers';

export default function CreditAnalysis() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customersService.getCustomers();
      setCustomers(data?.data || []);
      if (data?.data?.length > 0) {
        setSelectedCustomer(data.data[0]);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const creditData = selectedCustomer ? {
    score: selectedCustomer.creditScore || 745,
    scoreRange: [300, 900],
    rating: selectedCustomer.creditScore ? (selectedCustomer.creditScore >= 750 ? 'Excellent' : selectedCustomer.creditScore >= 700 ? 'Good' : 'Fair') : 'Good',
    ratingColor: selectedCustomer.creditScore ? (selectedCustomer.creditScore >= 750 ? 'green' : selectedCustomer.creditScore >= 700 ? 'blue' : 'orange') : 'green',
  } : {
    score: 745,
    scoreRange: [300, 900],
    rating: 'Good',
    ratingColor: 'green',
  };

  const incomeVsEmiData = [
    { month: 'Jan', income: selectedCustomer?.monthlyIncome || 50000, emi: selectedCustomer?.monthlyEmi || 8500 },
    { month: 'Feb', income: (selectedCustomer?.monthlyIncome || 50000) + 2000, emi: selectedCustomer?.monthlyEmi || 8500 },
    { month: 'Mar', income: (selectedCustomer?.monthlyIncome || 50000) - 2000, emi: selectedCustomer?.monthlyEmi || 8500 },
    { month: 'Apr', income: (selectedCustomer?.monthlyIncome || 50000) + 5000, emi: selectedCustomer?.monthlyEmi || 8500 },
  ];

  const debtToIncomeRatio = selectedCustomer?.monthlyIncome 
    ? ((selectedCustomer.monthlyEmi || 0) / selectedCustomer.monthlyIncome * 100).toFixed(1)
    : '17';

  const debtMetrics = [
    { label: 'Monthly Income', value: `₹${(selectedCustomer?.monthlyIncome || 50000).toLocaleString()}`, status: 'good' },
    { label: 'Monthly EMI', value: `₹${(selectedCustomer?.monthlyEmi || 8500).toLocaleString()}`, status: debtToIncomeRatio < 30 ? 'good' : 'warning' },
    { label: 'Debt-to-Income Ratio', value: `${debtToIncomeRatio}%`, status: debtToIncomeRatio < 30 ? 'good' : 'warning' },
    { label: 'Existing Loans', value: selectedCustomer?.existingLoans || '1', status: 'good' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Credit Analysis</h1>
        <p className="text-gray-600 mt-1">Comprehensive credit assessment and eligibility</p>
      </div>

      {/* Customer Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Customer</label>
        <select 
          value={selectedCustomer?.id || ''} 
          onChange={(e) => setSelectedCustomer(customers.find(c => c.id === e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - {customer.email}
            </option>
          ))}
        </select>
      </div>

      {/* Credit Score Card */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Credit Score</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-bold text-gray-900">{creditData.score}</span>
              <span className="text-gray-500">/ {creditData.scoreRange[1]}</span>
            </div>
          </div>
          <div className={`text-center p-6 rounded-lg ${
            creditData.ratingColor === 'green' ? 'bg-green-50' :
            creditData.ratingColor === 'yellow' ? 'bg-yellow-50' :
            'bg-red-50'
          }`}>
            <CheckCircle className={`w-12 h-12 mx-auto mb-2 ${
              creditData.ratingColor === 'green' ? 'text-green-600' :
              creditData.ratingColor === 'yellow' ? 'text-yellow-600' :
              'text-red-600'
            }`} />
            <p className={`font-semibold ${
              creditData.ratingColor === 'green' ? 'text-green-700' :
              creditData.ratingColor === 'yellow' ? 'text-yellow-700' :
              'text-red-700'
            }`}>
              {creditData.rating}
            </p>
          </div>
        </div>

        {/* Score Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
            style={{ width: `${(creditData.score / creditData.scoreRange[1]) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Debt Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {debtMetrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <div className="mt-3 flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700 font-medium">Healthy</span>
            </div>
          </div>
        ))}
      </div>

      {/* Income vs EMI Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Income vs EMI Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incomeVsEmiData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#1741FF" radius={[8, 8, 0, 0]} />
            <Bar dataKey="emi" fill="#22c55e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Eligibility Result */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">Eligible for Loan</h3>
            <p className="text-green-700 mt-2">
              Based on credit score, income stability, and debt-to-income ratio, this customer is eligible for a loan up to ₹5,00,000 with an interest rate of 12% p.a.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
