import { useState, useEffect } from 'react';
import { Phone, CheckCircle, Clock, AlertCircle, User, DollarSign, Loader, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import * as loansService from '../services/loans';
import * as paymentsService from '../services/payments';

/**
 * COLLECTOR WORKBENCH
 * 
 * What collector sees:
 * - My assigned cases
 * - Prioritized by: Due today → 1-7 DPD → Higher buckets
 * - Each case shows: Customer, Amount, DPD, Last action
 * 
 * Collector actions:
 * - Call customer
 * - Record payment
 * - Log promise
 * - Update remarks
 * 
 * System response:
 * - Payment instantly recalculates DPD
 * - Case auto-moves bucket
 * - Promise sets reminder
 */

export default function CollectorWorkbench() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [filter, setFilter] = useState('due-today'); // due-today, promised-today, 1-7, 8-15, 16-22, 23-29, 30-60, 60-90, 90-plus
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [promiseDate, setPromiseDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [callOutcome, setCallOutcome] = useState('pending'); // pending, called, promised, refused, unreachable
  const [recordingPayment, setRecordingPayment] = useState(false);
  const [markingPromiseHonored, setMarkingPromiseHonored] = useState(false);

  const dpdColors = {
    'due-today': 'bg-blue-50 text-blue-700 border-blue-200',
    '1-7': 'bg-green-50 text-green-700 border-green-200',
    '8-15': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    '16-22': 'bg-orange-50 text-orange-700 border-orange-200',
    '23-29': 'bg-orange-100 text-orange-800 border-orange-200',
    '30-60': 'bg-red-50 text-red-700 border-red-200',
    '60-90': 'bg-red-100 text-red-800 border-red-200',
    '90-plus': 'bg-red-200 text-red-900 border-red-300',
  };

  const bucketPriority = {
    'due-today': 0,
    '1-7': 1,
    '8-15': 2,
    '16-22': 3,
    '23-29': 4,
    '30-60': 5,
    '60-90': 6,
    '90-plus': 7,
  };

  useEffect(() => {
    fetchMyCases();
  }, []);

  const fetchMyCases = async () => {
    try {
      setLoading(true);
      const data = await loansService.getLoans();
      const loans = (data?.data || []).filter(l => l.status === 'disbursed');

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const casesWithPriority = loans.map(loan => {
        // Determine bucket
        let bucket = 'due-today';
        if (loan.dpd > 90) bucket = '90-plus';
        else if (loan.dpd > 60) bucket = '60-90';
        else if (loan.dpd > 30) bucket = '30-60';
        else if (loan.dpd > 23) bucket = '23-29';
        else if (loan.dpd > 16) bucket = '16-22';
        else if (loan.dpd > 8) bucket = '8-15';
        else if (loan.dpd > 0) bucket = '1-7';

        // Check if promise is due today
        const promiseToPayDate = loan.promiseToPayDate ? new Date(loan.promiseToPayDate) : null;
        const isPromisedToday = promiseToPayDate && 
          promiseToPayDate.getTime() === today.getTime() &&
          loan.promiseStatus !== 'honored';

        return {
          id: loan._id,
          loanId: loan.loanId,
          customerId: loan.customerId,
          customer: loan.customerName,
          mobileNo: loan.mobileNo,
          amount: loan.loanAmount,
          emi: loan.emiAmount,
          paid: loan.paidAmount || 0,
          remaining: loan.remainingAmount || (loan.loanAmount - (loan.paidAmount || 0)),
          dpd: loan.dpd || 0,
          bucket,
          dueDate: loan.nextDueDate,
          lastPaymentDate: loan.lastPaymentDate,
          lastRemark: loan.lastRemark || 'No remarks',
          callOutcome: loan.callOutcome || 'pending',
          promiseDate: loan.promiseToPayDate || null,
          promiseStatus: loan.promiseStatus || 'none', // none, pending, honored, broken
          isPromisedToday,
          priority: bucketPriority[bucket],
        };
      });

      // Sort by priority (promised today at top)
      casesWithPriority.sort((a, b) => {
        if (a.isPromisedToday && !b.isPromisedToday) return -1;
        if (!a.isPromisedToday && b.isPromisedToday) return 1;
        return a.priority - b.priority;
      });
      setCases(casesWithPriority);
      
      if (casesWithPriority.length > 0) {
        setSelectedCase(casesWithPriority[0]);
      }
    } catch (err) {
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = filter === 'promised-today' 
    ? cases.filter(c => c.isPromisedToday)
    : cases.filter(c => c.bucket === filter);

  const handleRecordPayment = async () => {
    if (!selectedCase || !paymentAmount) {
      toast.error('Please enter amount');
      return;
    }

    try {
      setRecordingPayment(true);
      
      // Use new real-time payment recording function
      const result = await paymentsService.recordPaymentWithUpdate(
        selectedCase.loanId,
        {
          amount: parseFloat(paymentAmount),
          paymentDate: new Date().toISOString(),
          paymentMode,
          remarks,
        }
      );

      // Show notification about payment and bucket change
      if (result.notification.type === 'bucket_change') {
        toast.success(
          `💰 Payment recorded!\n${result.notification.oldBucket} → ${result.notification.newBucket}`,
          { duration: 5 }
        );
      } else {
        toast.success('💰 Payment recorded successfully!', { duration: 4 });
      }

      // Update the selected case with new data
      const updatedCase = {
        ...selectedCase,
        dpd: result.updatedLoan.dpd,
        remaining: result.updatedLoan.remainingAmount,
        bucket: result.notification.newBucket,
      };
      
      setSelectedCase(updatedCase);
      setPaymentAmount('');
      setRemarks('');
      setCallOutcome('pending');
      
      // Refresh all cases to update counts and positions
      fetchMyCases();
      
      // Auto-close panel if fully paid
      if (result.updatedLoan.remainingAmount <= 0) {
        setTimeout(() => {
          setSelectedCase(null);
          toast.success('✅ Loan fully paid! Case closed.', { duration: 5 });
        }, 2000);
      }
      
    } catch (err) {
      console.error('Error recording payment:', err);
      toast.error(err.message || 'Failed to record payment');
    } finally {
      setRecordingPayment(false);
    }
  };

  const handlePromiseToPayment = async () => {
    if (!selectedCase || !promiseDate) {
      toast.error('Please select a promise date');
      return;
    }

    try {
      // Update the loan with promise details
      const response = await loansService.updateLoan(selectedCase.loanId, {
        promiseToPayDate: promiseDate,
        promiseStatus: 'pending',
        lastRemark: `Promise made for ${new Date(promiseDate).toLocaleDateString()}`,
      });

      if (response.success) {
        toast.success(`✅ Promise set for ${new Date(promiseDate).toLocaleDateString()}!\nReminder will be sent at 8 AM.`, { duration: 5 });
        setPromiseDate('');
        fetchMyCases();
        setSelectedCase(null);
      }
    } catch (err) {
      console.error('Error recording promise:', err);
      toast.error('Failed to record promise');
    }
  };

  const handleMarkPromiseHonored = async () => {
    if (!selectedCase) return;

    try {
      setMarkingPromiseHonored(true);
      
      const response = await loansService.updateLoan(selectedCase.loanId, {
        promiseStatus: 'honored',
        lastRemark: 'Promise honored - payment received',
      });

      if (response.success) {
        toast.success('✅ Promise marked as honored!', { duration: 4 });
        setPaymentAmount('');
        setRemarks('');
        fetchMyCases();
      }
    } catch (err) {
      console.error('Error marking promise:', err);
      toast.error('Failed to mark promise honored');
    } finally {
      setMarkingPromiseHonored(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const bucketCounts = {
    'promised-today': cases.filter(c => c.isPromisedToday).length,
    'due-today': cases.filter(c => c.bucket === 'due-today').length,
    '1-7': cases.filter(c => c.bucket === '1-7').length,
    '8-15': cases.filter(c => c.bucket === '8-15').length,
    '16-22': cases.filter(c => c.bucket === '16-22').length,
    '23-29': cases.filter(c => c.bucket === '23-29').length,
    '30-60': cases.filter(c => c.bucket === '30-60').length,
    '60-90': cases.filter(c => c.bucket === '60-90').length,
    '90-plus': cases.filter(c => c.bucket === '90-plus').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📞 Collector Workbench</h1>
        <p className="text-gray-600 mt-1">Your daily collection tasks - {cases.length} assigned cases</p>
      </div>

      {/* Priority Filter */}
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {[
          { bucket: 'promised-today', label: '🤝 Promised Today', color: 'purple' },
          { bucket: 'due-today', label: '📅 Due Today', color: 'blue' },
          { bucket: '1-7', label: '⚠️ 1-7 DPD', color: 'green' },
          { bucket: '8-15', label: '⚠️ 8-15 DPD', color: 'yellow' },
          { bucket: '16-22', label: '🔴 16-22 DPD', color: 'orange' },
          { bucket: '23-29', label: '🔴 23-29 DPD', color: 'orange' },
          { bucket: '30-60', label: '🔴 30-60 DPD', color: 'red' },
          { bucket: '60-90', label: '🔴 60-90 DPD', color: 'red' },
          { bucket: '90-plus', label: '⛔ 90+ (LEGAL)', color: 'red' },
        ].map(b => (
          <button
            key={b.bucket}
            onClick={() => setFilter(b.bucket)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
              filter === b.bucket
                ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {b.label} <span className="ml-1 text-xs">({bucketCounts[b.bucket]})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              {filteredCases.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No cases in this bucket. Great work! ✅
                </div>
              ) : (
                filteredCases.map(caseItem => (
                  <div
                    key={caseItem.id}
                    onClick={() => setSelectedCase(caseItem)}
                    className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition ${
                      selectedCase?.id === caseItem.id ? 'bg-blue-100 border-l-4 border-l-blue-600' : 'border-b-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{caseItem.customer}</p>
                        <p className="text-sm text-gray-600">{caseItem.loanId}</p>
                        <p className="text-xs text-gray-500 mt-1">📱 {caseItem.mobileNo}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{caseItem.emi.toLocaleString()}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${dpdColors[caseItem.bucket]}`}>
                          {caseItem.dpd} DPD
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Last: {caseItem.lastRemark}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Case Detail & Actions */}
        {selectedCase ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-4 h-fit max-h-[600px] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{selectedCase.customer}</h2>

            {/* Case Summary */}
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Loan ID</span>
                <span className="font-medium">{selectedCase.loanId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EMI Due</span>
                <span className="font-bold text-lg">₹{selectedCase.emi.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining</span>
                <span className="font-bold text-red-600">₹{selectedCase.remaining.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">DPD</span>
                <span className="font-bold text-lg">{selectedCase.dpd} days</span>
              </div>
            </div>

            {/* Promise Status Indicator */}
            {selectedCase.isPromisedToday && (
              <div className="mb-6 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-900">🤝 Promise Due Today</p>
                    <p className="text-xs text-purple-700 mt-1">Expected: ₹{selectedCase.emi.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={handleMarkPromiseHonored}
                    disabled={markingPromiseHonored}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 disabled:opacity-50"
                  >
                    {markingPromiseHonored ? '⏳' : '✅'} Mark Honored
                  </button>
                </div>
              </div>
            )}

            {/* Action Tabs */}
            <div className="space-y-4">
              {/* Payment Recording */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">💰 Record Payment</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="upi">UPI</option>
                  </select>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Remarks"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    rows="2"
                  />
                  <button
                    onClick={handleRecordPayment}
                    disabled={!paymentAmount || recordingPayment}
                    className="w-full px-3 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 text-sm"
                  >
                    {recordingPayment ? '⏳ Recording...' : '✅ Record Payment'}
                  </button>
                </div>
              </div>

              {/* Promise to Pay */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">⏰ Promise to Pay</label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={promiseDate}
                    onChange={(e) => setPromiseDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={handlePromiseToPayment}
                    disabled={!promiseDate}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    🔔 Set Reminder
                  </button>
                </div>
              </div>

              {/* Call Outcome */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">📞 Call Outcome</label>
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="called">Called</option>
                  <option value="promised">Promised</option>
                  <option value="refused">Refused</option>
                  <option value="unreachable">Unreachable</option>
                </select>
              </div>
            </div>

            {/* Call Logs */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs font-semibold text-gray-600 uppercase">📋 Last Action</p>
              <p className="text-sm text-gray-700 mt-2">{selectedCase.lastRemark}</p>
              <p className="text-xs text-gray-500 mt-1">Last payment: {selectedCase.lastPaymentDate || 'None'}</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
            Select a case to view details
          </div>
        )}
      </div>

      {/* Work Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          💡 <strong>Workflow Reminder:</strong> Cases auto-escalate to Legal at 90+ DPD. Your job is to collect before that. Focus on 1-7 DPD cases first — highest recovery rate.
        </p>
      </div>
    </div>
  );
}
