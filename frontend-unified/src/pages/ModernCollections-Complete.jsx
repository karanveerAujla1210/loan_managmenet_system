import { useState, useEffect, useMemo } from 'react';
import { Phone, MessageSquare, Clock, AlertCircle, CheckCircle, Filter, Loader, X } from 'lucide-react';

const MOCK_COLLECTIONS = [
  {
    id: 1,
    customer: 'Amit Patel',
    loanId: 'LN-2024-001',
    dpdBucket: '15-30',
    amount: '₹12,000',
    lastPayment: '2023-12-05',
    nextDue: '2023-12-20',
    callStatus: 'pending',
    promiseToPayDate: null,
    callLogs: [
      { date: '2024-01-10', duration: '3 min', notes: 'Customer promised payment by 15th' },
      { date: '2024-01-08', duration: '2 min', notes: 'Phone not reachable' },
    ],
  },
  {
    id: 2,
    customer: 'Suresh Verma',
    loanId: 'LN-2024-002',
    dpdBucket: '30-60',
    amount: '₹8,500',
    lastPayment: '2023-11-15',
    nextDue: '2023-12-15',
    callStatus: 'completed',
    promiseToPayDate: '2024-01-20',
    callLogs: [
      { date: '2024-01-09', duration: '5 min', notes: 'Promised payment on 20th' },
    ],
  },
  {
    id: 3,
    customer: 'Kavya Nair',
    loanId: 'LN-2024-003',
    dpdBucket: '60+',
    amount: '₹15,000',
    lastPayment: '2023-10-20',
    nextDue: '2023-11-20',
    callStatus: 'escalated',
    promiseToPayDate: null,
    callLogs: [
      { date: '2024-01-07', duration: '8 min', notes: 'Customer facing financial hardship' },
      { date: '2024-01-05', duration: '4 min', notes: 'Escalated to senior collector' },
    ],
  },
];

const dpdColors = {
  '0-15': 'bg-green-50 text-green-700 border-green-200',
  '15-30': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  '30-60': 'bg-orange-50 text-orange-700 border-orange-200',
  '60+': 'bg-red-50 text-red-700 border-red-200',
};

const callStatusColors = {
  pending: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  escalated: 'bg-red-50 text-red-700',
};

export default function ModernCollectionsComplete() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [filterBucket, setFilterBucket] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cases, setCases] = useState([]);
  const [callAction, setCallAction] = useState(null);
  const [callLoading, setCallLoading] = useState(false);

  // Load cases on mount
  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCases(MOCK_COLLECTIONS);
    } catch (err) {
      setError('Failed to load cases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter cases
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const bucketMatch = filterBucket === 'all' || c.dpdBucket === filterBucket;
      const statusMatch = filterStatus === 'all' || c.callStatus === filterStatus;
      return bucketMatch && statusMatch;
    });
  }, [cases, filterBucket, filterStatus]);

  // Get DPD bucket summary
  const dpdSummary = useMemo(() => {
    return [
      { label: '0-15 DPD', bucket: '0-15', count: cases.filter(c => c.dpdBucket === '0-15').length, color: 'green' },
      { label: '15-30 DPD', bucket: '15-30', count: cases.filter(c => c.dpdBucket === '15-30').length, color: 'yellow' },
      { label: '30-60 DPD', bucket: '30-60', count: cases.filter(c => c.dpdBucket === '30-60').length, color: 'orange' },
      { label: '60+ DPD', bucket: '60+', count: cases.filter(c => c.dpdBucket === '60+').length, color: 'red' },
    ];
  }, [cases]);

  // Handle case click
  const handleCaseClick = async (caseItem) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSelectedCase(caseItem);
    } catch (err) {
      setError('Failed to load case details');
    } finally {
      setLoading(false);
    }
  };

  // Handle call action
  const handleCallAction = async (action) => {
    try {
      setCallLoading(true);
      setCallAction(action);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update case status
      const updatedCases = cases.map(c => 
        c.id === selectedCase.id 
          ? { ...c, callStatus: action === 'call' ? 'completed' : c.callStatus }
          : c
      );
      setCases(updatedCases);
      
      // Update selected case
      setSelectedCase(prev => ({
        ...prev,
        callStatus: action === 'call' ? 'completed' : prev.callStatus
      }));
    } catch (err) {
      setError('Action failed. Please try again.');
    } finally {
      setCallLoading(false);
      setCallAction(null);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedCase(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
        <p className="text-gray-600 mt-1">Manage DPD cases and follow-ups</p>
      </div>

      {/* Error Alert */}
      {error && !selectedCase && (
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

      {/* DPD Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {dpdSummary.map((bucket) => (
          <button
            key={bucket.bucket}
            onClick={() => setFilterBucket(bucket.bucket)}
            className={`rounded-lg p-4 cursor-pointer transition hover:shadow-md border ${
              bucket.color === 'green'
                ? 'bg-green-50 border-green-200 hover:border-green-300'
                : bucket.color === 'yellow'
                ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
                : bucket.color === 'orange'
                ? 'bg-orange-50 border-orange-200 hover:border-orange-300'
                : 'bg-red-50 border-red-200 hover:border-red-300'
            } ${filterBucket === bucket.bucket ? 'ring-2 ring-offset-2 ring-[#1741FF]' : ''}`}
          >
            <p className={`text-sm font-medium ${
              bucket.color === 'green'
                ? 'text-green-700'
                : bucket.color === 'yellow'
                ? 'text-yellow-700'
                : bucket.color === 'orange'
                ? 'text-orange-700'
                : 'text-red-700'
            }`}>
              {bucket.label}
            </p>
            <p className={`text-2xl font-bold mt-2 ${
              bucket.color === 'green'
                ? 'text-green-900'
                : bucket.color === 'yellow'
                ? 'text-yellow-900'
                : bucket.color === 'orange'
                ? 'text-orange-900'
                : 'text-red-900'
            }`}>
              {bucket.count}
            </p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterBucket}
            onChange={(e) => setFilterBucket(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1741FF] outline-none"
            aria-label="Filter by DPD bucket"
          >
            <option value="all">All DPD Buckets</option>
            <option value="0-15">0-15 DPD</option>
            <option value="15-30">15-30 DPD</option>
            <option value="30-60">30-60 DPD</option>
            <option value="60+">60+ DPD</option>
          </select>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1741FF] outline-none"
          aria-label="Filter by call status"
        >
          <option value="all">All Call Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="escalated">Escalated</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-[#1741FF] mx-auto mb-2" />
            <p className="text-gray-600">Loading cases...</p>
          </div>
        </div>
      )}

      {/* Collections List */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredCases.length > 0 ? (
              filteredCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="p-6 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleCaseClick(caseItem)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleCaseClick(caseItem);
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{caseItem.customer}</h3>
                      <p className="text-sm text-gray-500">{caseItem.loanId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{caseItem.amount}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${callStatusColors[caseItem.callStatus]}`}>
                        {caseItem.callStatus.charAt(0).toUpperCase() + caseItem.callStatus.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">DPD Bucket</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 border ${dpdColors[caseItem.dpdBucket]}`}>
                        {caseItem.dpdBucket}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Last Payment</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{caseItem.lastPayment}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Next Due</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{caseItem.nextDue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Promise to Pay</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {caseItem.promiseToPayDate || 'Not set'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                    <button className="flex items-center space-x-2 text-sm text-[#1741FF] hover:text-[#1230cc] font-medium transition">
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                    <button className="flex items-center space-x-2 text-sm text-[#1741FF] hover:text-[#1230cc] font-medium transition">
                      <MessageSquare className="w-4 h-4" />
                      <span>SMS</span>
                    </button>
                    <button className="flex items-center space-x-2 text-sm text-[#1741FF] hover:text-[#1230cc] font-medium transition">
                      <Clock className="w-4 h-4" />
                      <span>Schedule</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No cases found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{selectedCase.customer}</h2>
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
              {/* Case Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Loan ID</p>
                  <p className="font-medium text-gray-900">{selectedCase.loanId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Outstanding Amount</p>
                  <p className="font-medium text-gray-900">{selectedCase.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">DPD Bucket</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 border ${dpdColors[selectedCase.dpdBucket]}`}>
                    {selectedCase.dpdBucket}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Call Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${callStatusColors[selectedCase.callStatus]}`}>
                    {selectedCase.callStatus.charAt(0).toUpperCase() + selectedCase.callStatus.slice(1)}
                  </span>
                </div>
              </div>

              {/* Call Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Call History</h3>
                <div className="space-y-3">
                  {selectedCase.callLogs.length > 0 ? (
                    selectedCase.callLogs.map((log, idx) => (
                      <div key={idx} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-[#1741FF] flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{log.date}</p>
                          <p className="text-sm text-gray-600">{log.notes}</p>
                          <p className="text-xs text-gray-500 mt-1">Duration: {log.duration}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No call history</p>
                  )}
                </div>
              </div>

              {/* Error Alert in Modal */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleCallAction('call')}
                  disabled={callLoading}
                  className="flex-1 px-4 py-2.5 bg-[#1741FF] text-white rounded-lg font-medium hover:bg-[#1230cc] transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {callLoading && callAction === 'call' ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Calling...</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4" />
                      <span>Make Call</span>
                    </>
                  )}
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
