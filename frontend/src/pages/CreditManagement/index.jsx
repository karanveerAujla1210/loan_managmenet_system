import { useState } from 'react';
import { Upload, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreditManagement() {
  const [loading, setLoading] = useState(false);

  const handleDownloadTemplate = () => {
    const csv = 'loanId,customerId,principal,disbursementDate,branch\nLOAN001,CUST001,50000,2024-01-01,Mumbai';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'credit-template.csv';
    a.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/v1/admin/import-disbursements', {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) toast.success('Imported successfully');
      else toast.error('Import failed');
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Credit Management</h1>
        <button onClick={handleDownloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
          <Download className="h-4 w-4" /> Download Template
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Import Disbursements</h2>
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

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Credit Analysis</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Total Loans</p>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Total Principal</p>
            <p className="text-3xl font-bold text-green-600">₹0</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">At Risk</p>
            <p className="text-3xl font-bold text-red-600">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
