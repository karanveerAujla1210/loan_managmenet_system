import { useState, useEffect } from 'react';
import { getMISReports } from '../../services/reports';

export default function MISReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getMISReports();
        setReports(response.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">MIS Reports</h1>
      {reports && (
        <div className="grid grid-cols-2 gap-4">
          <div className="border p-4">
            <h2 className="font-bold">Portfolio Snapshot</h2>
            <p>Total Loans: {reports.portfolioSnapshot?.totalLoans}</p>
            <p>Total Principal: ₹{reports.portfolioSnapshot?.totalPrincipal?.toLocaleString()}</p>
            <p>Total Outstanding: ₹{reports.portfolioSnapshot?.totalOutstanding?.toLocaleString()}</p>
          </div>
          <div className="border p-4">
            <h2 className="font-bold">Collection Efficiency</h2>
            <p>Efficiency: {(reports.collectionEfficiency?.efficiency * 100).toFixed(2)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
