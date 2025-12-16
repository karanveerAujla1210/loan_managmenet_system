import { useState, useEffect } from 'react';
import { Download, TrendingUp, Users, AlertCircle, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MISReports() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [data, setData] = useState({
    portfolio: null,
    buckets: [],
    efficiency: null,
    legal: null,
    collectors: [],
    aging: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [pRes, bRes, eRes, lRes, cRes, aRes] = await Promise.all([
        fetch('/api/v1/reports/portfolio', { headers }).catch(() => ({ ok: false })),
        fetch('/api/v1/reports/buckets', { headers }).catch(() => ({ ok: false })),
        fetch('/api/v1/reports/efficiency', { headers }).catch(() => ({ ok: false })),
        fetch('/api/v1/reports/legal', { headers }).catch(() => ({ ok: false })),
        fetch('/api/v1/reports/collectors', { headers }).catch(() => ({ ok: false })),
        fetch('/api/v1/reports/aging', { headers }).catch(() => ({ ok: false }))
      ]);

      const newData = { ...data };
      
      if (pRes.ok) {
        const pData = await pRes.json();
        newData.portfolio = pData.data || null;
      }
      if (bRes.ok) {
        const bData = await bRes.json();
        newData.buckets = bData.data || [];
      }
      if (eRes.ok) {
        const eData = await eRes.json();
        newData.efficiency = eData.data || null;
      }
      if (lRes.ok) {
        const lData = await lRes.json();
        newData.legal = lData.data || null;
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        newData.collectors = cData.data || [];
      }
      if (aRes.ok) {
        const aData = await aRes.json();
        newData.aging = aData.data || [];
      }

      setData(newData);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format = 'json') => {
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mis-report-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    toast.success('Report exported');
  };

  if (loading) return <div className="p-6 text-center">Loading reports...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <button onClick={() => handleExport('json')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {[
          { id: 'portfolio', label: 'Portfolio', icon: DollarSign },
          { id: 'buckets', label: 'Buckets', icon: AlertCircle },
          { id: 'efficiency', label: 'Efficiency', icon: TrendingUp },
          { id: 'collectors', label: 'Collectors', icon: Users },
          { id: 'aging', label: 'Aging', icon: TrendingUp },
          { id: 'legal', label: 'Legal', icon: AlertCircle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && data.portfolio && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Loans</p>
            <p className="text-3xl font-bold text-blue-600">{data.portfolio.totalLoans || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Principal</p>
            <p className="text-3xl font-bold text-green-600">₹{(data.portfolio.totalPrincipal || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Outstanding</p>
            <p className="text-3xl font-bold text-orange-600">₹{(data.portfolio.totalOutstanding || 0).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Buckets Tab */}
      {activeTab === 'buckets' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Bucket-wise Exposure</h2>
          </div>
          {data.buckets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Loan Count</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Outstanding</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.buckets.map((bucket, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 text-sm font-medium">{bucket._id || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">{bucket.loanCount || 0}</td>
                      <td className="px-6 py-4 text-sm">₹{(bucket.outstandingAmount || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">No bucket data available</div>
          )}
        </div>
      )}

      {/* Efficiency Tab */}
      {activeTab === 'efficiency' && data.efficiency && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-gray-600 text-sm">Due Amount</p>
            <p className="text-2xl font-bold text-blue-600">₹{(data.efficiency.dueAmount || 0).toLocaleString()}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <p className="text-gray-600 text-sm">Collected</p>
            <p className="text-2xl font-bold text-green-600">₹{(data.efficiency.collectedAmount || 0).toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6">
            <p className="text-gray-600 text-sm">Efficiency</p>
            <p className="text-2xl font-bold text-purple-600">{(data.efficiency.efficiency || 0).toFixed(2)}%</p>
          </div>
        </div>
      )}

      {/* Collectors Tab */}
      {activeTab === 'collectors' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Collector Performance</h2>
          </div>
          {data.collectors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Collector</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Week</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Incentive %</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.collectors.map((col, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 text-sm font-medium">{col.userId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">{new Date(col.weekStartDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">{(col.totalScore || 0).toFixed(1)}/100</td>
                      <td className="px-6 py-4 text-sm">{col.incentivePercentage || 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">No collector data available</div>
          )}
        </div>
      )}

      {/* Aging Tab */}
      {activeTab === 'aging' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Aging Analysis</h2>
          </div>
          {data.aging.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Loan Count</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Outstanding</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.aging.map((age, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 text-sm font-medium">{age.period}</td>
                      <td className="px-6 py-4 text-sm">{age.loanCount || 0}</td>
                      <td className="px-6 py-4 text-sm">₹{(age.outstandingAmount || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">No aging data available</div>
          )}
        </div>
      )}

      {/* Legal Tab */}
      {activeTab === 'legal' && data.legal && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-lg p-6">
            <p className="text-gray-600 text-sm">Total Cases</p>
            <p className="text-3xl font-bold text-red-600">{data.legal.totalCases || 0}</p>
          </div>
          {data.legal.breakdown && data.legal.breakdown.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-4">Cases by Status</p>
              {data.legal.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm mb-2">
                  <span>{item._id}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
