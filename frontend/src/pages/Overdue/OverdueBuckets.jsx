import { useState, useEffect } from 'react';
import { getOverdueBuckets } from '../../services/overdue';

export default function OverdueBuckets() {
  const [buckets, setBuckets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const response = await getOverdueBuckets();
        setBuckets(response.data);
      } catch (error) {
        console.error('Failed to fetch buckets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuckets();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Overdue Buckets</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Bucket</th>
            <th className="p-2">Loan Count</th>
            <th className="p-2">Outstanding Amount</th>
          </tr>
        </thead>
        <tbody>
          {buckets.map(b => (
            <tr key={b._id} className="border-t">
              <td className="p-2">{b._id}</td>
              <td className="p-2">{b.loanCount}</td>
              <td className="p-2">₹{b.outstandingAmount?.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
