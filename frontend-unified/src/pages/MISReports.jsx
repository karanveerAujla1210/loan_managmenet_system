import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Download } from 'lucide-react';

const MISReports = () => {
  const [reports, setReports] = useState({});
  const [dateRange, setDateRange] = useState('today');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMISReports();
  }, [dateRange]);

  const fetchMISReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [portfolio, buckets, efficiency, legal, collectors, aging] = await Promise.all([
        fetch('/api/v1/reports/portfolio', { headers }).then(r => r.json()),
        fetch('/api/v1/reports/buckets', { headers }).then(r => r.json()),
        fetch('/api/v1/reports/efficiency', { headers }).then(r => r.json()),
        fetch('/api/v1/reports/legal', { headers }).then(r => r.json()),
        fetch('/api/v1/reports/collectors', { headers }).then(r => r.json()),
        fetch('/api/v1/reports/aging', { headers }).then(r => r.json())
      ]);
      
      const bucketMap = {};
      buckets.data?.forEach(b => {
        bucketMap[b._id] = { count: b.loanCount, amount: b.outstandingAmount, percentage: 0 };
      });
      
      const totalOutstanding = Object.values(bucketMap).reduce((sum, b) => sum + b.amount, 0);
      Object.values(bucketMap).forEach(b => {
        b.percentage = totalOutstanding > 0 ? ((b.amount / totalOutstanding) * 100).toFixed(1) : 0;
      });
      
      setReports({
        portfolio: portfolio.data || {},
        buckets: bucketMap,
        efficiency: efficiency.data || {},
        legal: legal.data || {},
        collectors: collectors.data || [],
        aging: aging.data || []
      });
    } catch (error) {
      console.error('Failed to fetch MIS reports:', error);
      setReports({
        portfolio: {},
        buckets: {},
        efficiency: {},
        legal: {},
        collectors: [],
        aging: []
      });
    } finally {
      setLoading(false);
    }
  };

  const bucketColors = {
    'current': '#10B981',
    'X': '#F59E0B',
    'Y': '#EF4444',
    'M1': '#DC2626',
    'M2': '#991B1B',
    'M3': '#7C2D12',
    'NPA': '#6366F1'
  };

  if (loading) {
    return <div className="p-6 text-center">Loading reports...</div>;
  }

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
          <div className="text-3xl font-bold text-blue-600">{reports.portfolio?.totalLoans || 0}</div>
          <div className="text-xs text-gray-500 mt-2">Portfolio size</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Total Outstanding</div>
          <div className="text-3xl font-bold text-green-600">₹{((reports.portfolio?.totalOutstanding || 0) / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-gray-500 mt-2">At risk</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Collection Efficiency</div>
          <div className="text-3xl font-bold text-orange-600">{(reports.efficiency?.efficiency || 0).toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-2">Today's collection</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Legal Exposure</div>
          <div className="text-3xl font-bold text-red-600">₹{((reports.legal?.totalOutstanding || 0) / 100000).toFixed(1)}L</div>
          <div className="text-xs text-gray-500 mt-2">{reports.legal?.totalCases || 0} cases</div>
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
                    style={{ backgroundColor: bucketColors[bucket] || '#999' }}
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
                  <div className="font-medium text-gray-900">{collector.name || 'N/A'}</div>
                  <div className="text-sm font-semibold text-green-600">{(collector.score || 0).toFixed(1)}%</div>
                </div>
                <div className="flex gap-4 text-xs text-gray-600 mb-2">
                  <span>Cases: {collector.loanCount || 0}</span>
                  <span>Collected: ₹{((collector.totalCollected || 0) / 100000).toFixed(1)}L</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min(collector.score || 0, 100)}%` }}
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
              <span className="font-semibold text-green-600">{((reports.buckets?.current?.percentage || 0)).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">At Risk (1-30 DPD)</span>
              <span className="font-semibold text-orange-600">{((reports.buckets?.X?.percentage || 0) + (reports.buckets?.Y?.percentage || 0)).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stressed (30+ DPD)</span>
              <span className="font-semibold text-red-600">{((reports.buckets?.M1?.percentage || 0) + (reports.buckets?.M2?.percentage || 0) + (reports.buckets?.M3?.percentage || 0) + (reports.buckets?.NPA?.percentage || 0)).toFixed(1)}%</span>
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
              <span className="font-semibold">₹{((reports.efficiency?.dueAmount || 0) / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Collected</span>
              <span className="font-semibold text-green-600">₹{((reports.efficiency?.collectedAmount || 0) / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Efficiency</span>
              <span className="font-semibold text-blue-600">{(reports.efficiency?.efficiency || 0).toFixed(1)}%</span>
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
              <span className="font-semibold text-red-600">{reports.legal?.totalCases || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Legal Exposure</span>
              <span className="font-semibold">₹{((reports.legal?.totalOutstanding || 0) / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg DPD (Legal)</span>
              <span className="font-semibold text-orange-600">{reports.legal?.avgDPD || 0} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MISReports;
