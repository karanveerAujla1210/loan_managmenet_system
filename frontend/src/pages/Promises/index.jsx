import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import toast from 'react-hot-toast';

export default function Promises() {
  const [promises, setPromises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loanId, setLoanId] = useState('');
  const [formData, setFormData] = useState({
    loanId: '',
    promisedAmount: '',
    promisedDate: '',
    remarks: ''
  });
  const { get, post } = useApi();

  useEffect(() => {
    if (loanId) fetchPromises();
  }, [loanId]);

  const fetchPromises = async () => {
    if (!loanId) return;
    setLoading(true);
    try {
      const res = await get(`/promises/loan/${loanId}`);
      if (res.success) setPromises(res.data);
    } catch (error) {
      console.error('Error fetching promises:', error);
      toast.error('Failed to fetch promises');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromise = async (e) => {
    e.preventDefault();
    if (!formData.loanId || !formData.promisedAmount || !formData.promisedDate) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      const res = await post('/promises', formData);
      if (res.success) {
        toast.success('Promise created successfully');
        setFormData({ loanId: '', promisedAmount: '', promisedDate: '', remarks: '' });
        fetchPromises();
      }
    } catch (error) {
      console.error('Error creating promise:', error);
      toast.error('Failed to create promise');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Promises</h1>
      
      <form onSubmit={handleCreatePromise} className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="font-semibold mb-4">Create New Promise</h2>
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            name="loanId" 
            placeholder="Loan ID" 
            required 
            value={formData.loanId}
            onChange={(e) => setFormData({...formData, loanId: e.target.value})}
            className="border p-2 rounded" 
          />
          <input 
            type="number" 
            name="promisedAmount" 
            placeholder="Amount" 
            required 
            value={formData.promisedAmount}
            onChange={(e) => setFormData({...formData, promisedAmount: e.target.value})}
            className="border p-2 rounded" 
          />
          <input 
            type="date" 
            name="promisedDate" 
            required 
            value={formData.promisedDate}
            onChange={(e) => setFormData({...formData, promisedDate: e.target.value})}
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="remarks" 
            placeholder="Remarks" 
            value={formData.remarks}
            onChange={(e) => setFormData({...formData, remarks: e.target.value})}
            className="border p-2 rounded" 
          />
        </div>
        <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Create Promise</button>
      </form>

      <div className="mb-6 flex gap-2">
        <input 
          type="text" 
          placeholder="Enter Loan ID to view promises" 
          value={loanId}
          onChange={(e) => setLoanId(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button onClick={fetchPromises} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Search</button>
      </div>

      {loading ? <div>Loading...</div> : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Loan ID</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Promised Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {promises.length > 0 ? promises.map(p => (
              <tr key={p._id}>
                <td className="border p-2">{p.loanId}</td>
                <td className="border p-2">₹{p.promisedAmount}</td>
                <td className="border p-2">{new Date(p.promisedDate).toLocaleDateString()}</td>
                <td className="border p-2">{p.status}</td>
                <td className="border p-2">{p.remarks || '-'}</td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="border p-2 text-center">No promises found</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
