import React from 'react';

const BucketOverviewChart = ({ data }) => {
  // Calculate total
  const total = Object.values(data).reduce((sum, bucket) => sum + (bucket.amount || 0), 0);

  const bucketOrder = ['NORMAL', 'EARLY_OVERDUE', 'OVERDUE', 'SEVERE_OVERDUE', 'LONG_OVERDUE', 'LEGAL'];
  const bucketColors = {
    'NORMAL': '#10b981',
    'EARLY_OVERDUE': '#eab308',
    'OVERDUE': '#f97316',
    'SEVERE_OVERDUE': '#ef4444',
    'LONG_OVERDUE': '#991b1b',
    'LEGAL': '#7c3aed'
  };

  const bucketLabels = {
    'NORMAL': '0 DPD (Healthy)',
    'EARLY_OVERDUE': '1–7 DPD',
    'OVERDUE': '8–30 DPD',
    'SEVERE_OVERDUE': '31–60 DPD',
    'LONG_OVERDUE': '60+ DPD',
    'LEGAL': '90+ (Legal)'
  };

  return (
    <div className="space-y-4">
      {/* Horizontal Stacked Bar */}
      <div className="flex h-12 rounded-lg overflow-hidden shadow">
        {bucketOrder.map(bucket => {
          const bucketAmount = data[bucket]?.amount || 0;
          const percentage = total > 0 ? (bucketAmount / total) * 100 : 0;

          return (
            <div
              key={bucket}
              style={{
                width: `${percentage}%`,
                backgroundColor: bucketColors[bucket],
                minWidth: percentage > 3 ? 'auto' : '0'
              }}
              className="transition hover:opacity-80 cursor-pointer"
              title={`${bucketLabels[bucket]}: ₹${bucketAmount.toLocaleString('en-IN')} (${percentage.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {bucketOrder.map(bucket => {
          const bucketAmount = data[bucket]?.amount || 0;
          const percentage = total > 0 ? (bucketAmount / total) * 100 : 0;

          return (
            <div key={bucket} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: bucketColors[bucket] }}
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {percentage.toFixed(1)}%
                </p>
                <p className="text-gray-600">{bucketLabels[bucket]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BucketOverviewChart;
