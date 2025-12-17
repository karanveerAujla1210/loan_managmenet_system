import { Plus, Search, Filter } from 'lucide-react';

const leadsData = [
  { id: 1, name: 'Rohit Sharma', phone: '+91 98765 43215', amount: '₹3,00,000', status: 'new', source: 'Website' },
  { id: 2, name: 'Anjali Gupta', phone: '+91 98765 43216', amount: '₹2,00,000', status: 'contacted', source: 'Referral' },
  { id: 3, name: 'Deepak Singh', phone: '+91 98765 43217', amount: '₹4,50,000', status: 'qualified', source: 'Partner' },
];

export default function Leads() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600 mt-1">Manage and track new loan applications</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1741FF] outline-none"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2.5 bg-[#1741FF] text-white rounded-lg font-medium hover:bg-[#1230cc] transition">
          <Plus className="w-5 h-5" />
          <span>New Lead</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leadsData.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                <td className="px-6 py-4 text-gray-600">{lead.phone}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{lead.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lead.status === 'new' ? 'bg-blue-50 text-blue-700' :
                    lead.status === 'contacted' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-green-50 text-green-700'
                  }`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{lead.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
