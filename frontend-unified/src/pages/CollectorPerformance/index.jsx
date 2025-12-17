import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';

export default function CollectorPerformance() {
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(false);
  const { get } = useApi();

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    setLoading(true);
    try {
      const res = await get('/collector-performance');
      if (res.success) setPerformance(res.data);
    } catch (error) {
      console.error('Error fetching performance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Collector Performance</h1>
      
      {loading ? <div>Loading...</div> : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Collector</th>
              <th className="border p-2">Week</th>
              <th className="border p-2">On-Time (40)</th>
              <th className="border p-2">Early Recovery (25)</th>
              <th className="border p-2">Promise Discipline (15)</th>
              <th className="border p-2">Bucket Improvement (10)</th>
              <th className="border p-2">Total Score</th>
              <th className="border p-2">Incentive %</th>
            </tr>
          </thead>
          <tbody>
            {performance.map(p => (
              <tr key={p._id}>
                <td className="border p-2">{p.userId?.name}</td>
                <td className="border p-2">{new Date(p.weekStartDate).toLocaleDateString()}</td>
                <td className="border p-2">{p.onTimeCollections.score.toFixed(1)}</td>
                <td className="border p-2">{p.earlyOverdueRecovery.score.toFixed(1)}</td>
                <td className="border p-2">{p.promiseDiscipline.score.toFixed(1)}</td>
                <td className="border p-2">{p.bucketImprovement.score.toFixed(1)}</td>
                <td className="border p-2 font-bold">{p.totalScore.toFixed(1)}</td>
                <td className="border p-2">{p.incentivePercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
