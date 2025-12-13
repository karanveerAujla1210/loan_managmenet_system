import { useState } from 'react';
import { Search, Filter, ChevronRight, Eye } from 'lucide-react';

const customersData = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    loanAmount: '₹2,50,000',
    status: 'active',
    dpd: 0,
    emi: '₹8,500',
    nextPayment: '2024-01-15',
  },
  {
    id: 2,
    name: 'Priya Singh',
    email: 'priya@example.com',
    phone: '+91 98765 43211',
    loanAmount: '₹1,80,000',
    status: 'active',
    dpd: 0,
    emi: '₹6,200',
    nextPayment: '2024-01-16',
  },
  {
    id: 3,
    name: 'Amit Patel',
    email: 'amit@example.com',
    phone: '+91 98765 43212',
    loanAmount: '₹3,50,000',
    status: 'dpd',
    dpd: 15,
    emi: '₹12,000',
    nextPayment: '2023-12-20',
  },
  {
    id: 4,
    name: 'Neha Sharma',
    email: 'neha@example.com',
    phone: '+91 98765 43213',
    loanAmount: '₹1,50,000',
    status: 'active',
    dpd: 0,
    emi: '₹5,200',
    nextPayment: '2024-01-18',
  },
  {
    id: 5,
    name: 'Vikram Desai',
    email: 'vikram@example.com',
    phone: '+91 98765 43214',
    loanAmount: '₹2,80,000',
    status: 'closed',
    dpd: 0,
    emi: '₹9,500',
    nextPayment: 'Closed',
  },
];

const statusBadges = {
  active: 'bg-green-50 text-green-700 border border-green-200',
  dpd: 'bg-red-50 text-red-700 border border-red-200',
  closed: 'bg-gray-50 text-gray-700 border border-gray-200',
};

export default function ModernCustomers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customersData.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">Manage and track all customer accounts</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1741FF] focus:border-transparent outline-none transition"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1741FF] focus:border-transparent outline-none transition"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="dpd">DPD</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Loan Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  EMI
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  DPD
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{customer.loanAmount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{customer.emi}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadges[customer.status]}`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        customer.dpd === 0
                          ? 'bg-green-50 text-green-700'
                          : customer.dpd > 30
                          ? 'bg-red-50 text-red-700'
                          : 'bg-orange-50 text-orange-700'
                      }`}
                    >
                      {customer.dpd} days
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No customers found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{selectedCustomer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Loan Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Loan Amount</p>
                    <p className="font-medium text-gray-900">{selectedCustomer.loanAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monthly EMI</p>
                    <p className="font-medium text-gray-900">{selectedCustomer.emi}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${statusBadges[selectedCustomer.status]}`}>
                      {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Payment</p>
                    <p className="font-medium text-gray-900">{selectedCustomer.nextPayment}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="flex-1 px-4 py-2.5 bg-[#1741FF] text-white rounded-lg font-medium hover:bg-[#1230cc] transition">
                  View Full Profile
                </button>
                <button className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
