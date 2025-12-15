import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { managerService } from '../../services/managerService';
import BucketOverviewChart from '../../components/Charts/BucketOverviewChart';
import RiskTrendsChart from '../../components/Charts/RiskTrendsChart';
import CollectorPerformanceTable from '../../components/Tables/CollectorPerformanceTable';

const ManagerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardData = await managerService.getManagerDashboard(selectedDate);
      setData(dashboardData);
    } catch (error) {
      toast.error('Failed to load manager dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="text-gray-600 mt-2">Portfolio Health & Team Performance</p>
          </div>
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
            <p className="text-gray-600 text-sm font-medium">Total Active Loans</p>
            <p className="text-4xl font-bold text-indigo-600 mt-2">
              {data?.portfolio?.totalActiveLoan || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">Outstanding: ₹{(data?.portfolio?.outstandingAmount || 0).toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium">Today's Due</p>
            <p className="text-4xl font-bold text-yellow-600 mt-2">
              ₹{(data?.portfolio?.todaysDue || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-500 mt-2">{data?.portfolio?.todaysDueCount || 0} cases</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Today's Collection</p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              ₹{(data?.portfolio?.todaysCollection || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Collection Efficiency: {data?.portfolio?.collectionEfficiency || 0}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm font-medium">Portfolio At Risk</p>
            <p className="text-4xl font-bold text-red-600 mt-2">
              ₹{(data?.portfolio?.riskAmount || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {data?.portfolio?.riskPercentage || 0}% of portfolio
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bucket Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bucket Distribution</h2>
            <BucketOverviewChart
              data={data?.bucketDistribution || {}}
            />
            <div className="mt-6 space-y-2 text-sm">
              {[
                { bucket: 'NORMAL', label: '0 DPD', color: 'green' },
                { bucket: 'EARLY_OVERDUE', label: '1–7 DPD', color: 'yellow' },
                { bucket: 'OVERDUE', label: '8–30 DPD', color: 'orange' },
                { bucket: 'SEVERE_OVERDUE', label: '31–60 DPD', color: 'red' },
                { bucket: 'LONG_OVERDUE', label: '60+ DPD', color: 'dark-red' },
                { bucket: 'LEGAL', label: '90+ DPD (Legal)', color: 'purple' }
              ].map(item => (
                <div key={item.bucket} className="flex justify-between">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-900">
                    {data?.bucketDistribution?.[item.bucket]?.count || 0} loans
                    {' '}
                    (₹{(data?.bucketDistribution?.[item.bucket]?.amount || 0).toLocaleString('en-IN')})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Trends (7 Days)</h2>
            <RiskTrendsChart
              data={data?.riskTrends || []}
            />
          </div>
        </div>

        {/* Collector Performance */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Collector Performance Scores</h2>
          <CollectorPerformanceTable
            collectors={data?.collectorPerformance || []}
          />
        </div>

        {/* Legal Inflow Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Legal Inflow Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700 text-sm font-semibold">New Legal Cases</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {data?.legalSummary?.newCases || 0}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-orange-700 text-sm font-semibold">Under Legal Process</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {data?.legalSummary?.underProcess || 0}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 text-sm font-semibold">Recovered via Legal</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ₹{(data?.legalSummary?.recoveredAmount || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-700 text-sm font-semibold">Avg Days in Legal</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {data?.legalSummary?.avgDays || 0} days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
