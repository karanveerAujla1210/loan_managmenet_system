import { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({
    systemName: 'Business Loan CRM',
    loanTenure: 100,
    interestRate: 20,
    processingFee: 10,
    gstRate: 18,
    latePaymentPenalty: 250,
    repaymentFrequency: 7,
    legalEscalationDPD: 90,
    emailNotifications: true,
    smsNotifications: true,
    autoLegalEscalation: true
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : isNaN(value) ? value : parseFloat(value)
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });
      if (response.ok) toast.success('Settings saved');
      else toast.error('Failed to save');
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">System Settings</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
            <input type="text" name="systemName" value={settings.systemName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loan Tenure (days)</label>
            <input type="number" name="loanTenure" value={settings.loanTenure} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
            <input type="number" name="interestRate" value={settings.interestRate} onChange={handleChange} step="0.1" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Processing Fee (%)</label>
            <input type="number" name="processingFee" value={settings.processingFee} onChange={handleChange} step="0.1" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GST Rate (%)</label>
            <input type="number" name="gstRate" value={settings.gstRate} onChange={handleChange} step="0.1" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Late Payment Penalty (₹)</label>
            <input type="number" name="latePaymentPenalty" value={settings.latePaymentPenalty} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Repayment Frequency (days)</label>
            <input type="number" name="repaymentFrequency" value={settings.repaymentFrequency} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Legal Escalation DPD</label>
            <input type="number" name="legalEscalationDPD" value={settings.legalEscalationDPD} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" name="emailNotifications" checked={settings.emailNotifications} onChange={handleChange} className="w-4 h-4 rounded" />
              <span className="ml-3 text-gray-700">Enable Email Notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="smsNotifications" checked={settings.smsNotifications} onChange={handleChange} className="w-4 h-4 rounded" />
              <span className="ml-3 text-gray-700">Enable SMS Notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="autoLegalEscalation" checked={settings.autoLegalEscalation} onChange={handleChange} className="w-4 h-4 rounded" />
              <span className="ml-3 text-gray-700">Auto Legal Escalation</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            <Save className="h-4 w-4" /> {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
