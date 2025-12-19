import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Download } from 'lucide-react';

const MISReports = () => {
  const [reports, setReports] = useState({});
  const [dateRange, setDateRange] = useState('today');

  useEffect(() => {
    fetchMISReports();
  }, [dateRange]);

  const fetchMISReports = async () => {
    try {
      // const response = await fetch(`/api/v1/mis-reports?range=${dateRange}`);
      // const data = await response.json();
      // setReports(data);
      setReports({
        portfolio: {
          totalLoans: 281,
          totalPrincipal: 8500000,
          totalOutstanding: 7850000,
          totalInterest: 1200000
        },
        buckets: {
          'CURRENT': { count: 150, amount: 5000000, percentage: 63.7 },
          '1-7': { count: 45, amount: 1200000, percentage: 15.3 },
          '8-15': { count: 28, amount: 850000, percentage: 10.8 },
          '16-22': { count: 15, amount: 450000, percentage: 5.7 },
          '23-29': { count: 12, amount: 380000, percentage: 4.8 },
          '30+': { count: 8, amount: 250000, percentage: 3.2 },
          '60+': { count: 5, amount: 180000, percentage: 2.3 },
          'LEGAL': { count: 3, amount: 120000, percentage: 1.5 }
        },
        efficiency: {
          dueAmount: 450000,
          collectedAmount: 380000,
          efficiency: 84.4
        },
        legal: {
          totalCases: 3,
          totalOutstanding: 120000,
          avgDPD: 95,
          percentage: 1.5
        },
        collectors: [
          { name: 'Rajesh Kumar', cases: 45, collected: 380000, efficiency: 26.7 },
          { name: 'Priya Singh', cases: 38, collected: 420000, efficiency: 39.5 },
          { name: 'Amit Patel', cases: 42, collected: 350000, efficiency: 23.8 },
          { name: 'Neha Sharma', cases: 35, collected: 410000, efficiency: 40.0 }
        ]
      });
    } catch (error) {
      console.error('Failed to fetch MIS reports:', error);
    }
  };

  const bucketColors = {
    'CURRENT': '#10B981',
    '1-7': '#F59E0B',
    '8-15': '#EF4444',
    '16-22': '#DC2626',
    '23-29': '#991B1B',
    '30+': '#7C2D12',
    '60+': '#6366F1',
    'LEGAL': '#4F46E5'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MIS Reports</h1>
          <p className="text-gray-600 mt-1">COO's Command Center - Real-time Portfolio Insights</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Download size={20} /> Export
          </button>
        </div>
      </div>

      {/* Portfolio Snapshot */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Total Active Loans</div>
          <div className="text-3xl font-bold text-blue-600">{reports.portfolio?.totalLoans}</div>
          <div className="text-xs text-gray-500 mt-2">Portfolio size</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Total Outstanding</div>
          <div className="text-3xl font-bold text-green-600">₹{(reports.portfolio?.totalOutstanding / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-gray-500 mt-2">At risk</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Collection Efficiency</div>
          <div className="text-3xl font-bold text-orange-600">{reports.efficiency?.efficiency?.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-2">Today's collection</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Legal Exposure</div>
          <div className="text-3xl font-bold text-red-600">₹{(reports.legal?.totalOutstanding / 100000).toFixed(1)}L</div>
          <div className="text-xs text-gray-500 mt-2">{reports.legal?.totalCases} cases</div>
        </div>
      </div>

      {/* Bucket Distribution */}
      <div className="grid grid-cols-2 gap-6">
        {/* Buckets Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bucket-wise Exposure</h2>
          <div className="space-y-2">
            {Object.entries(reports.buckets || {}).map(([bucket, data]) => (
              <div key={bucket} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: bucketColors[bucket] }}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{bucket} DPD</div>
                    <div className="text-xs text-gray-500">{data.count} loans</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">₹{(data.amount / 100000).toFixed(1)}L</div>
                  <div className="text-xs text-gray-500">{data.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collector Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Collectors</h2>
          <div className="space-y-3">
            {reports.collectors?.map((collector, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-gray-900">{collector.name}</div>
                  <div className="text-sm font-semibold text-green-600">{collector.efficiency}%</div>
                </div>
                <div className="flex gap-4 text-xs text-gray-600 mb-2">
                  <span>Cases: {collector.cases}</span>
                  <span>Collected: ₹{(collector.collected / 100000).toFixed(1)}L</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min(collector.efficiency, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Portfolio Health</h3>
            <TrendingUp className="text-green-600" size={24} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current (0 DPD)</span>
              <span className="font-semibold text-green-600">63.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">At Risk (1-30 DPD)</span>
              <span className="font-semibold text-orange-600">20.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stressed (30+ DPD)</span>
              <span className="font-semibold text-red-600">15.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Collection Metrics</h3>
            <BarChart3 className="text-blue-600" size={24} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Due Today</span>
              <span className="font-semibold">₹{(reports.efficiency?.dueAmount / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Collected</span>
              <span className="font-semibold text-green-600">₹{(reports.efficiency?.collectedAmount / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Efficiency</span>
              <span className="font-semibold text-blue-600">{reports.efficiency?.efficiency?.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Risk Indicators</h3>
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Legal Cases</span>
              <span className="font-semibold text-red-600">{reports.legal?.totalCases}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Legal Exposure</span>
              <span className="font-semibold">₹{(reports.legal?.totalOutstanding / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg DPD (Legal)</span>
              <span className="font-semibold text-orange-600">{reports.legal?.avgDPD} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MISReports;
