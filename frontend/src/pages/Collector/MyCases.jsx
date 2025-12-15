import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { collectorService } from '../../services';

const MyCases = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCases();
  }, [selectedFilter]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const collectorId = localStorage.getItem('userId');
      
      let filters = {};
      if (selectedFilter === 'DUE_TODAY') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filters.dueToday = true;
      } else if (selectedFilter === 'OVERDUE') {
        filters.overdue = true;
      } else if (selectedFilter === 'PROMISES') {
        filters.promisesToday = true;
      }

      const casesData = await collectorService.getMyCases(collectorId, filters);
      setCases(casesData);
    } catch (error) {
      toast.error('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(loan => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      loan.customerId?.name?.toLowerCase().includes(term) ||
      loan._id.toLowerCase().includes(term) ||
      loan.customerId?.phone?.includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Cases</h1>
          <p className="text-gray-600 mt-2">Sorted by priority — you cannot reorder</p>
        </div>

        {/* Locked Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-3 font-medium">PRIORITY FILTERS (Locked)</p>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'ALL', label: 'All Cases', icon: '📋' },
              { value: 'DUE_TODAY', label: 'Due Today', icon: '📅', color: 'yellow' },
              { value: 'OVERDUE', label: 'Overdue', icon: '⚠️', color: 'red' },
              { value: 'PROMISES', label: 'Promises Today', icon: '✓', color: 'blue' }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedFilter === filter.value
                    ? `bg-indigo-600 text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.icon} {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by customer name, phone, or loan ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading cases...</p>
              </div>
            </div>
          ) : filteredCases.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Loan ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      EMI
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      DPD (Days)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Bucket
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Last Remark
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map((loan, index) => (
                    <tr
                      key={loan._id}
                      className="border-b hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => navigate(`/collector/loan/${loan._id}`)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {loan.customerId?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {loan.customerId?.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                        {loan._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₹{loan.emiAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(loan.nextDueDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          loan.dpd > 30 ? 'bg-red-100 text-red-700' :
                          loan.dpd > 15 ? 'bg-orange-100 text-orange-700' :
                          loan.dpd > 7 ? 'bg-yellow-100 text-yellow-700' :
                          loan.dpd > 0 ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {loan.dpd}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          loan.bucket === 'NORMAL' ? 'bg-green-100 text-green-800' :
                          loan.bucket === 'EARLY_OVERDUE' ? 'bg-yellow-100 text-yellow-800' :
                          loan.bucket === 'OVERDUE' ? 'bg-orange-100 text-orange-800' :
                          loan.bucket === 'LEGAL' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {loan.bucket}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {loan.lastRemark || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/collector/loan/${loan._id}`);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold transition"
                        >
                          CALL
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No cases match your filter</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {filteredCases.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
            <p>
              Showing <span className="font-semibold">{filteredCases.length}</span> of{' '}
              <span className="font-semibold">{cases.length}</span> cases
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCases;
