import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ChevronRight, Loader, AlertCircle, CheckCircle, X } from 'lucide-react';

const MOCK_CUSTOMERS = [
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
    createdAt: '2023-06-15',
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
    createdAt: '2023-07-20',
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
    createdAt: '2023-05-10',
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
    createdAt: '2023-08-05',
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
    createdAt: '2023-04-12',
  },
];

const statusBadges = {
  active: 'bg-green-50 text-green-700 border border-green-200',
  dpd: 'bg-red-50 text-red-700 border border-red-200',
  closed: 'bg-gray-50 text-gray-700 border border-gray-200',
};

export default function ModernCustomersComplete() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);
  const [sortBy, setSortBy] = useState('name');

  // Load customers on mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCustomers(MOCK_CUSTOMERS);
    } catch (err) {
      setError('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search
  const filteredCustomers = useMemo(() => {
    let result = customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm);
      const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'dpd':
          return b.dpd - a.dpd;
        case 'amount':
          return parseInt(b.loanAmount) - parseInt(a.loanAmount);
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return result;
  }, [customers, searchTerm, filterStatus, sortBy]);

  // Get customer detail
  const getCustomerDetail = async (customerId) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const customer = customers.find(c => c.id === customerId);
      if (!customer) throw new Error('Customer not found');
      setSelectedCustomer(customer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle row click
  const handleRowClick = (customer) => {
    getCustomerDetail(customer.id);
  };

  // Close modal
  const closeModal = () => {
    setSelectedCustomer(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">Manage and track all customer accounts</p>
      </div>

      {/* Error Alert */}
      {error && !selectedCustomer && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={() => setError('')}
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
              aria-label="Search customers"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1741FF] focus:border-transparent outline-none transition"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="dpd">DPD</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1741FF] focus:border-transparent outline-none transition"
              aria-label="Sort by"
            >
              <option value="name">Sort: Name</option>
              <option value="dpd">Sort: DPD</option>
              <option value="amount">Sort: Amount</option>
              <option value="recent">Sort: Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-[#1741FF] mx-auto mb-2" />
            <p className="text-gray-600">Loading customers...</p>
          </div>
        </div>
      )}

      {/* Customers Table */}
      {!loading && (
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
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => handleRowClick(customer)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleRowClick(customer);
                      }}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <p className="text-gray-500">No customers found matching your criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredCustomers.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredCustomers.length} of {customers.length} customers
              </p>
            </div>
          )}
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
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

              {/* DPD Info */}
              {selectedCustomer.dpd > 0 && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm font-medium text-orange-900">
                    ⚠️ This customer is {selectedCustomer.dpd} days overdue
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="flex-1 px-4 py-2.5 bg-[#1741FF] text-white rounded-lg font-medium hover:bg-[#1230cc] transition">
                  View Full Profile
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
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
