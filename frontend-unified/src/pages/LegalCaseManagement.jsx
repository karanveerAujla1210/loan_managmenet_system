import { useState, useEffect } from 'react';
import { Scale, FileText, Calendar, DollarSign, CheckCircle, Clock, AlertTriangle, Loader, Download } from 'lucide-react';
import * as loansService from '../services/loans';

/**
 * LEGAL CASE MANAGEMENT
 * 
 * What legal sees:
 * - Only 90+ DPD cases (auto-escalated by system)
 * - Case status: notice pending, notice sent, hearing scheduled, hearing completed, recovered, written-off
 * - Actions: upload documents, schedule hearing, record recovery, mark closed
 * 
 * Workflow:
 * - Case auto-escalates at 90+ DPD
 * - Legal team reviews and takes action
 * - Progress tracked: notice → hearing → recovery/settlement
 * - Case closed when fully recovered or written-off
 */

export default function LegalCaseManagement() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);
  const [recoveryAmount, setRecoveryAmount] = useState('');
  const [caseStatus, setCaseStatus] = useState('notice_pending');

  useEffect(() => {
    fetchLegalCases();
  }, []);

  const fetchLegalCases = async () => {
    try {
      setLoading(true);
      const data = await loansService.getLoans();
      const legalCases = (data?.data || [])
        .filter(l => l.status === 'disbursed' && l.dpd > 90)
        .map(l => ({
          ...l,
          legalStatus: l.legalStatus || 'notice_pending',
          noticeDate: l.noticeDate || null,
          hearingDate: l.hearingDate || null,
          recoveryAmount: l.recoveryAmount || 0,
        }));
      setLoans(legalCases);
    } catch (err) {
      console.error('Error fetching legal cases:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const filterCases = () => {
    if (filterStatus === 'all') return loans;
    return loans.filter(l => l.legalStatus === filterStatus);
  };

  const filteredLoans = filterCases();

  // Statistics
  const stats = {
    total: loans.length,
    noticePending: loans.filter(l => l.legalStatus === 'notice_pending').length,
    noticeSent: loans.filter(l => l.legalStatus === 'notice_sent').length,
    hearingScheduled: loans.filter(l => l.legalStatus === 'hearing_scheduled').length,
    hearingCompleted: loans.filter(l => l.legalStatus === 'hearing_completed').length,
    recovered: loans.filter(l => l.legalStatus === 'recovered').length,
    writtenOff: loans.filter(l => l.legalStatus === 'written_off').length,
  };

  const totalOutstanding = loans.reduce((sum, l) => sum + (l.remainingAmount || 0), 0);
  const totalRecovered = loans.reduce((sum, l) => sum + (l.recoveryAmount || 0), 0);
  const recoveryRate = (totalRecovered / (totalOutstanding + totalRecovered) * 100).toFixed(1);

  const handleUpdateCaseStatus = (loanId, newStatus) => {
    setLoans(loans.map(l => 
      l.loanId === loanId ? { ...l, legalStatus: newStatus } : l
    ));
    if (selectedCase?.loanId === loanId) {
      setSelectedCase({ ...selectedCase, legalStatus: newStatus });
    }
  };

  const handleRecordRecovery = () => {
    if (!selectedCase || !recoveryAmount) return;
    
    const amount = parseFloat(recoveryAmount);
    const updatedCases = loans.map(l => 
      l.loanId === selectedCase.loanId 
        ? {
            ...l,
            recoveryAmount: (l.recoveryAmount || 0) + amount,
            legalStatus: amount >= selectedCase.remainingAmount ? 'recovered' : 'hearing_completed',
          }
        : l
    );
    
    setLoans(updatedCases);
    setSelectedCase({
      ...updatedCases.find(l => l.loanId === selectedCase.loanId),
    });
    setRecoveryAmount('');
  };

  const statusOptions = [
    { value: 'notice_pending', label: '📬 Notice Pending', color: 'yellow' },
    { value: 'notice_sent', label: '📬 Notice Sent', color: 'blue' },
    { value: 'hearing_scheduled', label: '📅 Hearing Scheduled', color: 'purple' },
    { value: 'hearing_completed', label: '✅ Hearing Completed', color: 'cyan' },
    { value: 'recovered', label: '💰 Recovered', color: 'green' },
    { value: 'written_off', label: '❌ Written Off', color: 'gray' },
  ];

  const getStatusColor = (status) => {
    const st = statusOptions.find(s => s.value === status);
    return st ? st.color : 'gray';
  };

  const getStatusLabel = (status) => {
    const st = statusOptions.find(s => s.value === status);
    return st ? st.label : status;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">⚖️ Legal Case Management</h1>
        <p className="text-gray-600 mt-1">90+ DPD cases — Notice, Hearing, Recovery</p>
      </div>

      {/* Critical Notice */}
      <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
          <div>
            <h3 className="font-bold text-red-900">⚠️ Auto-Escalated Cases</h3>
            <p className="text-sm text-red-800 mt-1">
              Cases with 90+ DPD are automatically escalated from collectors. All cases shown below are in legal recovery pipeline.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-600">Total Cases</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 shadow-sm border border-yellow-200">
          <p className="text-xs text-yellow-700">Notice Pending</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.noticePending}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-200">
          <p className="text-xs text-blue-700">Notice Sent</p>
          <p className="text-2xl font-bold text-blue-900">{stats.noticeSent}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 shadow-sm border border-purple-200">
          <p className="text-xs text-purple-700">Hearing</p>
          <p className="text-2xl font-bold text-purple-900">{stats.hearingScheduled + stats.hearingCompleted}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 shadow-sm border border-green-200">
          <p className="text-xs text-green-700">Recovered</p>
          <p className="text-2xl font-bold text-green-900">{stats.recovered}</p>
          <p className="text-xs text-green-600 mt-1">₹{(totalRecovered / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-700">Written Off</p>
          <p className="text-2xl font-bold text-gray-900">{stats.writtenOff}</p>
        </div>
      </div>

      {/* Recovery Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recovery Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Outstanding Amount</p>
            <p className="text-3xl font-bold text-red-600">₹{(totalOutstanding / 100000).toFixed(1)}L</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Amount Recovered</p>
            <p className="text-3xl font-bold text-green-600">₹{(totalRecovered / 100000).toFixed(1)}L</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Recovery Rate</p>
            <p className="text-3xl font-bold text-blue-600">{recoveryRate}%</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            filterStatus === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          All ({stats.total})
        </button>
        {statusOptions.map(opt => {
          const count = 
            opt.value === 'notice_pending' ? stats.noticePending :
            opt.value === 'notice_sent' ? stats.noticeSent :
            opt.value === 'hearing_scheduled' ? stats.hearingScheduled :
            opt.value === 'hearing_completed' ? stats.hearingCompleted :
            opt.value === 'recovered' ? stats.recovered :
            opt.value === 'written_off' ? stats.writtenOff : 0;
          
          return (
            <button
              key={opt.value}
              onClick={() => setFilterStatus(opt.value)}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition ${
                filterStatus === opt.value
                  ? `bg-${opt.color}-600 text-white`
                  : `bg-white border border-gray-200 text-gray-700 hover:bg-gray-50`
              }`}
            >
              {opt.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Loan ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">DPD</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Recovered</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLoans.map((loan, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCase(loan)}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{loan.loanId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{loan.customerName}</td>
                  <td className="px-6 py-4 text-sm font-medium">₹{(loan.remainingAmount / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600">{loan.dpd}+</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-bold bg-${getStatusColor(loan.legalStatus)}-100 text-${getStatusColor(loan.legalStatus)}-800`}>
                      {getStatusLabel(loan.legalStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">₹{(loan.recoveryAmount / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCase(loan);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Detail Panel */}
      {selectedCase && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedCase.loanId}</h2>
              <p className="text-gray-600">{selectedCase.customerName} • {selectedCase.mobileNo}</p>
            </div>
            <button
              onClick={() => setSelectedCase(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600">Outstanding Amount</p>
              <p className="text-2xl font-bold text-red-600">₹{(selectedCase.remainingAmount / 100000).toFixed(1)}L</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount Recovered</p>
              <p className="text-2xl font-bold text-green-600">₹{(selectedCase.recoveryAmount / 100000).toFixed(1)}L</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">DPD (Days)</p>
              <p className="text-2xl font-bold text-orange-600">{selectedCase.dpd}+</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Status</p>
              <p className="text-lg font-bold">{getStatusLabel(selectedCase.legalStatus)}</p>
            </div>
          </div>

          {/* Status Transition */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Update Case Status</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleUpdateCaseStatus(selectedCase.loanId, opt.value)}
                  className={`px-3 py-2 rounded text-xs font-medium transition ${
                    selectedCase.legalStatus === opt.value
                      ? `bg-${opt.color}-600 text-white`
                      : `bg-gray-100 text-gray-700 hover:bg-gray-200`
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recovery Recording */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Record Recovery Payment</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Amount (₹)"
                value={recoveryAmount}
                onChange={(e) => setRecoveryAmount(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleRecordRecovery}
                disabled={!recoveryAmount}
                className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:bg-gray-300"
              >
                Record ✓
              </button>
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">📄 Case Documents</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                <FileText className="w-4 h-4" />
                Upload Notice
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                <Calendar className="w-4 h-4" />
                Schedule Hearing
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Download Case File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guidance */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">⚖️ Legal Process Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs text-blue-900">
          <div className="text-center">
            <div className="font-bold">1️⃣</div>
            <div>Notice Pending</div>
          </div>
          <div className="text-center">→</div>
          <div className="text-center">
            <div className="font-bold">2️⃣</div>
            <div>Notice Sent</div>
          </div>
          <div className="text-center">→</div>
          <div className="text-center">
            <div className="font-bold">3️⃣+</div>
            <div>Hearing → Recovered</div>
          </div>
        </div>
      </div>
    </div>
  );
}
