import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingDown, Users, Target, ArrowUp } from 'lucide-react';

const Collections = () => {
  const [buckets, setBuckets] = useState({});
  const [collectors, setCollectors] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState('1-7');

  useEffect(() => {
    fetchCollectionsData();
  }, []);

  const fetchCollectionsData = async () => {
    try {
      // const response = await fetch('/api/v1/collections/dashboard');
      // const data = await response.json();
      // setBuckets(data.buckets);
      // setCollectors(data.collectors);
      setBuckets({
        'CURRENT': { count: 150, amount: 5000000 },
        '1-7': { count: 45, amount: 1200000 },
        '8-15': { count: 28, amount: 850000 },
        '16-22': { count: 15, amount: 450000 },
        '23-29': { count: 12, amount: 380000 },
        '30+': { count: 8, amount: 250000 },
        '60+': { count: 5, amount: 180000 },
        'LEGAL': { count: 3, amount: 120000 }
      });
    } catch (error) {
      console.error('Failed to fetch collections data:', error);
    }
  };

  const bucketColors = {
    'CURRENT': 'bg-green-100 text-green-700',
    '1-7': 'bg-yellow-100 text-yellow-700',
    '8-15': 'bg-orange-100 text-orange-700',
    '16-22': 'bg-red-100 text-red-700',
    '23-29': 'bg-red-200 text-red-800',
    '30+': 'bg-red-300 text-red-900',
    '60+': 'bg-purple-100 text-purple-700',
    'LEGAL': 'bg-indigo-100 text-indigo-700'
  };

  const totalLoans = Object.values(buckets).reduce((sum, b) => sum + b.count, 0);
  const totalOutstanding = Object.values(buckets).reduce((sum, b) => sum + b.amount, 0);
  const atRisk = Object.entries(buckets)
    .filter(([key]) => key !== 'CURRENT')
    .reduce((sum, [, b]) => sum + b.count, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Collections Dashboard</h1>
        <p className="text-gray-600 mt-1">Prevent loss through strategic collections</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Active Loans</div>
              <div className="text-2xl font-bold text-blue-600">{totalLoans}</div>
            </div>
            <Target className="text-blue-400" size={32} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Outstanding</div>
              <div className="text-2xl font-bold text-green-600">₹{(totalOutstanding / 1000000).toFixed(1)}M</div>
            </div>
            <TrendingDown className="text-green-400" size={32} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">At Risk (>0 DPD)</div>
              <div className="text-2xl font-bold text-red-600">{atRisk}</div>
            </div>
            <AlertCircle className="text-red-400" size={32} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Risk %</div>
              <div className="text-2xl font-bold text-orange-600">{((atRisk / totalLoans) * 100).toFixed(1)}%</div>
            </div>
            <ArrowUp className="text-orange-400" size={32} />
          </div>
        </div>
      </div>

      {/* Bucket Distribution */}
      <div className="grid grid-cols-2 gap-6">
        {/* Buckets */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">DPD Buckets</h2>
          <div className="space-y-3">
            {Object.entries(buckets).map(([bucket, data]) => (
              <div
                key={bucket}
                onClick={() => setSelectedBucket(bucket)}
                className={`p-4 rounded-lg cursor-pointer transition ${
                  selectedBucket === bucket
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${bucketColors[bucket]}`}>
                      {bucket}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{data.count} loans</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹{(data.amount / 100000).toFixed(1)}L</div>
                    <div className="text-xs text-gray-500">{((data.amount / totalOutstanding) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collector Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Collector Performance</h2>
          <div className="space-y-3">
            {[
              { name: 'Rajesh Kumar', cases: 45, recovered: 12, efficiency: 26.7 },
              { name: 'Priya Singh', cases: 38, recovered: 15, efficiency: 39.5 },
              { name: 'Amit Patel', cases: 42, recovered: 10, efficiency: 23.8 },
              { name: 'Neha Sharma', cases: 35, recovered: 14, efficiency: 40.0 }
            ].map((collector, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-gray-900">{collector.name}</div>
                  <div className="text-sm font-semibold text-blue-600">{collector.efficiency}%</div>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>Cases: {collector.cases}</span>
                  <span>Recovered: {collector.recovered}</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${collector.efficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Bucket Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedBucket} DPD - {buckets[selectedBucket]?.count} Loans
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">Loan ID</th>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">Customer</th>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">Outstanding</th>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">Assigned To</th>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">LN000001</td>
                <td className="px-4 py-3 text-gray-600">Rajesh Kumar</td>
                <td className="px-4 py-3 text-gray-900 font-medium">₹45,000</td>
                <td className="px-4 py-3 text-gray-600">Amit Patel</td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:text-blue-700 font-medium">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Collections;
