import { TrendingUp } from 'lucide-react';

const loansData = [
  { id: 1, customer: 'Rajesh Kumar', amount: '₹2,50,000', date: '2024-01-10', status: 'active', reference: 'LOAN-2024-001' },
  { id: 2, customer: 'Priya Singh', amount: '₹1,80,000', date: '2024-01-11', status: 'active', reference: 'LOAN-2024-002' },
  { id: 3, customer: 'Neha Sharma', amount: '₹1,50,000', date: '2024-01-12', status: 'active', reference: 'LOAN-2024-003' },
];

export default function Loans() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Disbursed Loans</h1>
        <p className="text-gray-600 mt-1">View all disbursed loans</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Total Disbursed</p>
          <p className="text-3xl font-bold text-gray-900">₹58.5L</p>
          <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Active Loans</p>
          <p className="text-3xl font-bold text-gray-900">890</p>
          <p className="text-xs text-blue-600 mt-2">Currently active</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Avg Loan Amount</p>
          <p className="text-3xl font-bold text-gray-900">₹2.2L</p>
          <p className="text-xs text-purple-600 mt-2">Per loan</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Reference</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loansData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.customer}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{item.amount}</td>
                <td className="px-6 py-4 text-gray-600">{item.date}</td>
                <td className="px-6 py-4 text-gray-600">{item.reference}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
