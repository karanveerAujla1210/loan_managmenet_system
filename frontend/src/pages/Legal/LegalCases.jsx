import { useState, useEffect } from 'react';
import { getLegalCases } from '../../services/legal';

export default function LegalCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await getLegalCases();
        setCases(response.data);
      } catch (error) {
        console.error('Failed to fetch legal cases:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Legal Cases</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Loan ID</th>
            <th className="p-2">DPD at Entry</th>
            <th className="p-2">Status</th>
            <th className="p-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(c => (
            <tr key={c._id} className="border-t">
              <td className="p-2">{c.loanId}</td>
              <td className="p-2">{c.dpdAtEntry}</td>
              <td className="p-2">{c.status}</td>
              <td className="p-2">{new Date(c.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
