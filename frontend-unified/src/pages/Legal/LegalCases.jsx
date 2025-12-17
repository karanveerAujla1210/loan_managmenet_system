import { useState, useEffect } from 'react';
import { Upload, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LegalCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/v1/legal/cases', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await response.json();
      setCases(result.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDownloadTemplate = () => {
    const csv = 'loanId,dpdAtEntry,status,remarks\nLOAN001,90,FILED,Notice sent';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'legal-cases-template.csv';
    a.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/v1/admin/import-legal-cases', {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        toast.success('Imported successfully');
        fetchCases();
      } else toast.error('Import failed');
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Legal Cases</h1>
        <button onClick={handleDownloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
          <Download className="h-4 w-4" /> Download Template
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Import Legal Cases</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-2" />
            <label className="cursor-pointer">
              <span className="text-blue-600 font-medium">Click to upload</span>
              <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} disabled={loading} className="hidden" />
            </label>
            <p className="text-gray-500 text-sm mt-2">CSV/XLSX files</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Legal Cases (90+ DPD)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Loan ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">DPD at Entry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cases.length > 0 ? (
                cases.map((legalCase, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 text-sm">{legalCase.loanId}</td>
                    <td className="px-6 py-4 text-sm">{legalCase.dpdAtEntry || '-'}</td>
                    <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 rounded text-xs ${legalCase.status === 'FILED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{legalCase.status}</span></td>
                    <td className="px-6 py-4 text-sm">{legalCase.remarks || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No cases found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
