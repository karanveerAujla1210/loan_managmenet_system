import { useState, useEffect } from 'react';
import { Upload, Download, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentProcessing() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/v1/payments', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await response.json();
      setPayments(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (payment) => {
    setEditingId(payment._id || payment.id);
    setEditData({ ...payment });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/v1/payments/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editData)
      });
      if (response.ok) {
        toast.success('Updated successfully');
        setEditingId(null);
        fetchPayments();
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  };

  const handleDownloadTemplate = () => {
    const csv = 'loanId,amount,paymentDate,mode,utr\nLOAN001,5000,2024-01-01,online,UTR123456';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payment-template.csv';
    a.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/v1/admin/import-payments', {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        toast.success('Imported successfully');
        fetchPayments();
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
        <h1 className="text-3xl font-bold">Payment Processing</h1>
        <button onClick={handleDownloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
          <Download className="h-4 w-4" /> Download Template
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Import Bulk Payments</h2>
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
          <h2 className="text-xl font-semibold">Payment Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Loan ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Mode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">UTR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment._id || payment.id}>
                    {editingId === (payment._id || payment.id) ? (
                      <>
                        <td className="px-6 py-4"><input type="text" value={editData.loanId || ''} onChange={(e) => setEditData({ ...editData, loanId: e.target.value })} className="w-full px-2 py-1 border rounded" /></td>
                        <td className="px-6 py-4"><input type="number" value={editData.amount || ''} onChange={(e) => setEditData({ ...editData, amount: e.target.value })} className="w-full px-2 py-1 border rounded" /></td>
                        <td className="px-6 py-4"><input type="date" value={editData.paymentDate || ''} onChange={(e) => setEditData({ ...editData, paymentDate: e.target.value })} className="w-full px-2 py-1 border rounded" /></td>
                        <td className="px-6 py-4"><select value={editData.mode || ''} onChange={(e) => setEditData({ ...editData, mode: e.target.value })} className="w-full px-2 py-1 border rounded"><option>cash</option><option>cheque</option><option>online</option><option>upi</option></select></td>
                        <td className="px-6 py-4"><input type="text" value={editData.utr || ''} onChange={(e) => setEditData({ ...editData, utr: e.target.value })} className="w-full px-2 py-1 border rounded" /></td>
                        <td className="px-6 py-4 flex gap-2"><button onClick={handleSave} className="text-green-600"><Save className="h-4 w-4" /></button><button onClick={() => setEditingId(null)} className="text-red-600"><X className="h-4 w-4" /></button></td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-sm">{payment.loanId}</td>
                        <td className="px-6 py-4 text-sm">₹{payment.amount || 0}</td>
                        <td className="px-6 py-4 text-sm">{payment.paymentDate || '-'}</td>
                        <td className="px-6 py-4 text-sm">{payment.mode || '-'}</td>
                        <td className="px-6 py-4 text-sm">{payment.utr || '-'}</td>
                        <td className="px-6 py-4"><button onClick={() => handleEdit(payment)} className="text-blue-600"><Edit2 className="h-4 w-4" /></button></td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No payments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
