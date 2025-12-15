import { useState, useEffect } from 'react';
import { Phone, MessageSquare, Clock, AlertCircle, CheckCircle, Filter, Loader } from 'lucide-react';
import * as collectionsService from '../services/collections';
import * as paymentsService from '../services/payments';

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

export default function ModernCollections() {
  const [collectionsData, setCollectionsData] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [filterBucket, setFilterBucket] = useState('all');
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const data = await collectionsService.getOverdueLoans();
      const cases = (data?.data || []).map((loan, idx) => ({
        id: idx + 1,
        customer: loan.customerName || loan.customerId,
        loanId: loan.loanId,
        dpdBucket: loan.dpd ? (loan.dpd <= 15 ? '0-15' : loan.dpd <= 30 ? '15-30' : loan.dpd <= 60 ? '30-60' : '60+') : '0-15',
        amount: `₹${(loan.loanAmount || 0).toLocaleString()}`,
        lastPayment: loan.lastPaymentDate || 'N/A',
        nextDue: loan.nextDueDate || 'N/A',
        callStatus: loan.collectionStatus || 'pending',
        promiseToPayDate: loan.promiseToPayDate || null,
        remainingAmount: loan.remainingAmount || 0,
        dpd: loan.dpd || 0,
        callLogs: [
          { date: new Date().toISOString(), duration: '0 min', notes: 'Case loaded from database' }
        ],
      }));
      setCollectionsData(cases);
      if (cases.length > 0) {
        setSelectedCase(cases[0]);
      }
    } catch (err) {
      console.error('Error fetching collections:', err);
      setCollectionsData([]);
    } finally {
      setLoading(false);
    }
  };

  const getDPDCounts = () => {
    return {
      '0-15': collectionsData.filter(c => c.dpdBucket === '0-15').length,
      '15-30': collectionsData.filter(c => c.dpdBucket === '15-30').length,
      '30-60': collectionsData.filter(c => c.dpdBucket === '30-60').length,
      '60+': collectionsData.filter(c => c.dpdBucket === '60+').length,
    };
  };

  const handlePaymentSubmit = async () => {
    if (!selectedCase || !paymentAmount) return;
    try {
      setPaymentLoading(true);
      await paymentsService.recordPayment(selectedCase.loanId, {
        amount: parseFloat(paymentAmount),
        date: new Date(),
        paymentMethod: 'manual'
      });
      setPaymentAmount('');
      fetchCollections();
    } catch (err) {
      console.error('Error recording payment:', err);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const dpdCounts = getDPDCounts();
  const filteredCases = collectionsData.filter(
    (c) => filterBucket === 'all' || c.dpdBucket === filterBucket
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
        <p className="text-gray-600 mt-1">Manage DPD cases and follow-ups - {collectionsData.length} cases</p>
      </div>

      {/* DPD Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '0-15 DPD', bucket: '0-15', count: dpdCounts['0-15'], color: 'green' },
          { label: '15-30 DPD', bucket: '15-30', count: dpdCounts['15-30'], color: 'yellow' },
          { label: '30-60 DPD', bucket: '30-60', count: dpdCounts['30-60'], color: 'orange' },
          { label: '60+ DPD', bucket: '60+', count: dpdCounts['60+'], color: 'red' },
        ].map((bucket) => (
          <div
            key={bucket.label}
            className={`rounded-lg p-4 cursor-pointer transition hover:shadow-md ${
              bucket.color === 'green'
                ? 'bg-green-50 border border-green-200'
                : bucket.color === 'yellow'
                ? 'bg-yellow-50 border border-yellow-200'
                : bucket.color === 'orange'
                ? 'bg-orange-50 border border-orange-200'
                : 'bg-red-50 border border-red-200'
            }`}
            onClick={() => setFilterBucket(bucket.bucket)}
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
          </div>
        ))}
      </div>

      {/* Collections List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Active Cases</h2>
            <select
              value={filterBucket}
              onChange={(e) => setFilterBucket(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1741FF] outline-none"
            >
              <option value="all">All DPD Buckets</option>
              <option value="0-15">0-15 DPD</option>
              <option value="15-30">15-30 DPD</option>
              <option value="30-60">30-60 DPD</option>
              <option value="60+">60+ DPD</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredCases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="p-6 hover:bg-gray-50 transition cursor-pointer"
              onClick={() => setSelectedCase(caseItem)}
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
                <button className="flex items-center space-x-2 text-sm text-[#1741FF] hover:text-[#1230cc] font-medium">
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
                <button className="flex items-center space-x-2 text-sm text-[#1741FF] hover:text-[#1230cc] font-medium">
                  <MessageSquare className="w-4 h-4" />
                  <span>SMS</span>
                </button>
                <button className="flex items-center space-x-2 text-sm text-[#1741FF] hover:text-[#1230cc] font-medium">
                  <Clock className="w-4 h-4" />
                  <span>Schedule</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{selectedCase.customer}</h2>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

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
                  {selectedCase.callLogs.map((log, idx) => (
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
                  ))}
                </div>
              </div>

              {/* Payment Section */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Payment</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Enter payment amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={!paymentAmount || paymentLoading}
                    className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {paymentLoading ? 'Recording...' : 'Record Payment'}
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="flex-1 px-4 py-2.5 bg-[#1741FF] text-white rounded-lg font-medium hover:bg-[#1230cc] transition flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Make Call</span>
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
