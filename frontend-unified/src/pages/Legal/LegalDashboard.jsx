import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { legalService } from '../../services';

const LegalDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [legalCases, setLegalCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    fetchLegalData();
  }, [selectedStatus]);

  const fetchLegalData = async () => {
    try {
      setLoading(true);

      // Fetch legal stats
      const statsData = await legalService.getLegalStats();
      setStats(statsData);

      // Fetch legal cases
      const casesData = await legalService.getLegalCases(selectedStatus === 'ALL' ? null : selectedStatus);
      setLegalCases(casesData);
    } catch (error) {
      toast.error('Failed to load legal dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getLegalStageBadgeColor = (stage) => {
    switch (stage) {
      case 'NOTICE_SENT':
        return 'bg-blue-100 text-blue-800';
      case 'HEARING_SCHEDULED':
        return 'bg-yellow-100 text-yellow-800';
      case 'JUDGMENT_PASSED':
        return 'bg-orange-100 text-orange-800';
      case 'RECOVERY_IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'RECOVERED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (stage) => {
    const labels = {
      'NOTICE_SENT': 'Notice Sent',
      'HEARING_SCHEDULED': 'Hearing Scheduled',
      'JUDGMENT_PASSED': 'Judgment Passed',
      'RECOVERY_IN_PROGRESS': 'Recovery In Progress',
      'RECOVERED': 'Recovered'
    };
    return labels[stage] || stage;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading legal dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Legal Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor legal proceedings and recovery</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* New Legal Cases */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm font-medium">New Legal Cases</p>
            <p className="text-4xl font-bold text-red-600 mt-2">
              {stats?.newCases || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
          </div>

          {/* Notices Sent */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium">Notices Sent</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {stats?.noticesSent || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">Pending response</p>
          </div>

          {/* Recovery via Legal */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Recovery via Legal</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ₹{(stats?.recoveryAmount || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-500 mt-2">{stats?.recoveryCount || 0} cases recovered</p>
          </div>

          {/* Aging Legal Cases */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm font-medium">Aging 90+ Days</p>
            <p className="text-4xl font-bold text-orange-600 mt-2">
              {stats?.agingCases || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">Pending clearance</p>
          </div>
        </div>

        {/* Legal Cases Table */}
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Legal Cases</h2>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 bg-gray-50 border-b flex flex-wrap gap-2">
            {[
              { value: 'ALL', label: 'All Cases' },
              { value: 'NOTICE_SENT', label: 'Notice Sent' },
              { value: 'HEARING_SCHEDULED', label: 'Hearing Scheduled' },
              { value: 'JUDGMENT_PASSED', label: 'Judgment Passed' },
              { value: 'RECOVERY_IN_PROGRESS', label: 'Recovery In Progress' }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedStatus === filter.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Loan ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Outstanding
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    DPD
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Legal Stage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Last Action
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Days in Legal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {legalCases.length > 0 ? (
                  legalCases.map((legalCase) => (
                    <tr key={legalCase._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">
                        {legalCase.loanId._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {legalCase.loanId.customerId?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {legalCase.loanId.customerId?.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-red-600">
                        ₹{(legalCase.loanId.outstandingAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-red-700">
                        {legalCase.loanId.dpd} DPD
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          getLegalStageBadgeColor(legalCase.legalStage)
                        }`}>
                          {getStatusLabel(legalCase.legalStage)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        {legalCase.lastAction || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {Math.floor((new Date() - new Date(legalCase.createdAt)) / (1000 * 60 * 60 * 24))} days
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => navigate(`/legal/case/${legalCase._id}`)}
                          className="text-indigo-600 hover:text-indigo-900 font-semibold"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      No legal cases found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legal Summary Stats */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-4">Legal Operations Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-blue-700 font-semibold">Average Resolution Time</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats?.avgResolutionDays || 0} days</p>
            </div>
            <div>
              <p className="text-blue-700 font-semibold">Win Rate</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats?.winRate || 0}%</p>
            </div>
            <div>
              <p className="text-blue-700 font-semibold">Recovery Rate</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats?.recoveryRate || 0}%</p>
            </div>
            <div>
              <p className="text-blue-700 font-semibold">Cost per Recovery</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">₹{(stats?.costPerRecovery || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalDashboard;
