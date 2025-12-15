import React from 'react';

const CollectorPerformanceTable = ({ collectors = [] }) => {
  const getScoreBadgeColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-l-4 border-green-500';
    if (score >= 75) return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500';
    return 'bg-red-100 text-red-800 border-l-4 border-red-500';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
              Rank
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
              Collector
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
              Total Score
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
              Due Date %
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
              Early Recovery
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
              Promise Discipline
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
              Bucket Movement
            </th>
          </tr>
        </thead>
        <tbody>
          {collectors.length > 0 ? (
            collectors.map((collector, idx) => {
              const breakdown = collector.scoreBreakdown || {};
              return (
                <tr key={collector._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    #{idx + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {collector.collectorId?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {collector.collectorId?.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-block px-4 py-2 rounded-lg font-bold ${
                      getScoreBadgeColor(collector.totalScore)
                    }`}>
                      {collector.totalScore.toFixed(1)} / 100
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    {(breakdown.dueDateCollection || 0).toFixed(1)} / 40
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    {(breakdown.earlyOverdueRecovery || 0).toFixed(1)} / 25
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    {(breakdown.promiseDiscipline || 0).toFixed(1)} / 15
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    {(breakdown.bucketMovement || 0).toFixed(1)} / 10
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                No collector performance data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Legend */}
      {collectors.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t text-xs text-gray-600 space-y-2">
          <p className="font-semibold text-gray-900">Score Interpretation:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="inline-block w-3 h-3 bg-green-500 rounded mr-2"></span>
              90+ = Excellent
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-blue-500 rounded mr-2"></span>
              75–89 = Good
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded mr-2"></span>
              60–74 = Fair
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-red-500 rounded mr-2"></span>
              Below 60 = Needs Training
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectorPerformanceTable;
