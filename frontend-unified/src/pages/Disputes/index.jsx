import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import toast from 'react-hot-toast';

export default function Disputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loanId, setLoanId] = useState('');
  const { get, put } = useApi();

  useEffect(() => {
    if (loanId) fetchDisputes();
  }, [loanId]);

  const fetchDisputes = async () => {
    if (!loanId) return;
    setLoading(true);
    try {
      const res = await get(`/disputes/loan/${loanId}`);
      if (res.success) setDisputes(res.data);
    } catch (error) {
      console.error('Error fetching disputes:', error);
      toast.error('Failed to fetch disputes');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (disputeId) => {
    try {
      const res = await put(`/disputes/${disputeId}/resolve`, { resolution: 'Resolved' });
      if (res.success) {
        toast.success('Dispute resolved');
        fetchDisputes();
      }
    } catch (error) {
      console.error('Error resolving dispute:', error);
      toast.error('Failed to resolve dispute');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Disputes</h1>
      
      <div className="mb-6 flex gap-2">
        <input 
          type="text" 
          placeholder="Enter Loan ID" 
          value={loanId}
          onChange={(e) => setLoanId(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button onClick={fetchDisputes} className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
      </div>

      {loading ? <div>Loading...</div> : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Loan ID</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">DPD Frozen</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {disputes.length > 0 ? disputes.map(d => (
              <tr key={d._id}>
                <td className="border p-2">{d.loanId}</td>
                <td className="border p-2">{d.reason}</td>
                <td className="border p-2">{d.status}</td>
                <td className="border p-2">{d.dpdFrozen ? 'Yes' : 'No'}</td>
                <td className="border p-2">
                  {d.status === 'OPEN' && (
                    <button onClick={() => handleResolve(d._id)} className="bg-blue-500 text-white px-3 py-1 rounded">Resolve</button>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="border p-2 text-center">No disputes found</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
