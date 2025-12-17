import { Download, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const reportData = [
  { month: 'Jan', disbursed: 45, collected: 38, dpd: 5 },
  { month: 'Feb', disbursed: 52, collected: 41, dpd: 6 },
  { month: 'Mar', disbursed: 48, collected: 45, dpd: 4 },
  { month: 'Apr', disbursed: 61, collected: 52, dpd: 7 },
];

const reports = [
  { name: 'Monthly Performance Report', date: '2024-01-10', type: 'PDF' },
  { name: 'Collections Summary', date: '2024-01-09', type: 'Excel' },
  { name: 'DPD Analysis', date: '2024-01-08', type: 'PDF' },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and download business reports</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-80">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={reportData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Legend />
            <Bar dataKey="disbursed" fill="#1741FF" radius={[8, 8, 0, 0]} />
            <Bar dataKey="collected" fill="#22c55e" radius={[8, 8, 0, 0]} />
            <Bar dataKey="dpd" fill="#ef4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report, idx) => (
            <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{report.name}</p>
                <p className="text-sm text-gray-500 mt-1">{report.date}</p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-[#1741FF] text-white rounded-lg hover:bg-[#1230cc] transition">
                <Download className="w-4 h-4" />
                <span className="text-sm">{report.type}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
