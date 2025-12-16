import { useState } from 'react';
import { useApi } from '../../hooks/useApi';

export default function Import() {
  const [importType, setImportType] = useState('customers');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { post } = useApi();

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const values = lines[i].split(',').map(v => v.trim());
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      data.push(obj);
    }

    return data;
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const text = await file.text();
      const data = parseCSV(text);

      const res = await post(`/import/${importType}`, { data });
      setResult(res.data);
    } catch (error) {
      alert('Import failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Import Data to MongoDB</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="mb-4">
          <label className="block mb-2">Import Type:</label>
          <select
            value={importType}
            onChange={(e) => setImportType(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="customers">Customers</option>
            <option value="loans">Loans</option>
            <option value="payments">Payments</option>
            <option value="users">Users</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Select CSV File:</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="border p-2 w-full"
          />
        </div>

        <button
          onClick={handleImport}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Importing...' : 'Import'}
        </button>
      </div>

      {result && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Import Result</h2>
          <p className="mb-2">✅ Success: {result.success}</p>
          <p className="mb-4">❌ Failed: {result.failed}</p>

          {result.errors && result.errors.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Errors:</h3>
              <div className="bg-red-50 p-4 rounded max-h-64 overflow-y-auto">
                {result.errors.map((err, i) => (
                  <div key={i} className="text-sm mb-2 pb-2 border-b">
                    <p className="font-mono text-red-600">{err.error}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-gray-50 p-6 rounded">
        <h3 className="font-bold mb-4">CSV Format Examples:</h3>

        {importType === 'customers' && (
          <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
{`firstName,lastName,phone,email,dob,address,city,state,pincode,aadhaar,pan
John,Doe,9876543210,john@example.com,1990-01-01,123 Main St,Mumbai,MH,400001,123456789012,ABCDE1234F`}
          </pre>
        )}

        {importType === 'loans' && (
          <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
{`loanId,customerPhone,principal,interestRate,tenure,disbursementDate
LN000001,9876543210,50000,20,14,2024-01-01`}
          </pre>
        )}

        {importType === 'payments' && (
          <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
{`loanId,utr,amount,method,paymentDate
LN000001,UTR123456,5000,bank_transfer,2024-01-08`}
          </pre>
        )}

        {importType === 'users' && (
          <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
{`name,email,password,role,branch
John Collector,john@example.com,password123,collector,Mumbai`}
          </pre>
        )}
      </div>
    </div>
  );
}
