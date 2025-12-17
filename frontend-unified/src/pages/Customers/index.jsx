import { Phone, Mail, MapPin } from 'lucide-react';

const customersData = [
  { id: 1, name: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@email.com', city: 'Mumbai', status: 'active', loans: 2 },
  { id: 2, name: 'Priya Singh', phone: '9876543211', email: 'priya@email.com', city: 'Delhi', status: 'active', loans: 1 },
  { id: 3, name: 'Neha Sharma', phone: '9876543212', email: 'neha@email.com', city: 'Bangalore', status: 'active', loans: 3 },
  { id: 4, name: 'Amit Patel', phone: '9876543213', email: 'amit@email.com', city: 'Ahmedabad', status: 'inactive', loans: 0 },
  { id: 5, name: 'Sneha Gupta', phone: '9876543214', email: 'sneha@email.com', city: 'Pune', status: 'active', loans: 2 },
];

export default function Customers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">Manage customer profiles and information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Total Customers</p>
          <p className="text-3xl font-bold text-gray-900">1,250</p>
          <p className="text-xs text-green-600 mt-2">↑ 8% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Active Customers</p>
          <p className="text-3xl font-bold text-gray-900">1,180</p>
          <p className="text-xs text-blue-600 mt-2">94.4% active</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">New This Month</p>
          <p className="text-3xl font-bold text-gray-900">92</p>
          <p className="text-xs text-purple-600 mt-2">New registrations</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">City</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Loans</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customersData.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                <td className="px-6 py-4 text-gray-600">{customer.phone}</td>
                <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                <td className="px-6 py-4 text-gray-600">{customer.city}</td>
                <td className="px-6 py-4 text-gray-600">{customer.loans}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    customer.status === 'active' 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-gray-50 text-gray-700'
                  }`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
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
