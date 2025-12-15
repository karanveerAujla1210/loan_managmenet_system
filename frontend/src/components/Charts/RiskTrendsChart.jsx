import React from 'react';

const RiskTrendsChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Simple line chart visualization
  const maxValue = Math.max(...data.map(d => d.riskAmount || 0));
  const minValue = Math.min(...data.map(d => d.riskAmount || 0));
  const range = maxValue - minValue || 1;

  return (
    <div className="space-y-4">
      {/* Chart Area */}
      <div className="flex gap-2 items-flex-end h-48 p-4 bg-gray-50 rounded-lg border border-gray-200">
        {data.map((point, idx) => {
          const normalized = ((point.riskAmount - minValue) / range) * 100;
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center group"
              title={`${point.date}: ₹${(point.riskAmount || 0).toLocaleString('en-IN')}`}
            >
              <div
                className="w-full bg-red-500 rounded-t hover:bg-red-600 transition cursor-pointer group-hover:shadow-lg"
                style={{ height: `${Math.max(normalized, 5)}%` }}
              />
              <p className="text-xs text-gray-600 mt-2 text-center truncate w-full">
                {new Date(point.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-blue-50 rounded">
          <p className="text-blue-700 font-semibold">Current Risk</p>
          <p className="text-lg font-bold text-blue-600 mt-1">
            ₹{(data[data.length - 1]?.riskAmount || 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="p-2 bg-red-50 rounded">
          <p className="text-red-700 font-semibold">Peak Risk</p>
          <p className="text-lg font-bold text-red-600 mt-1">
            ₹{maxValue.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="p-2 bg-green-50 rounded">
          <p className="text-green-700 font-semibold">Trend</p>
          <p className="text-lg font-bold text-green-600 mt-1">
            {data[data.length - 1]?.riskAmount < data[0]?.riskAmount ? '↓ Improving' : '↑ Worsening'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskTrendsChart;
