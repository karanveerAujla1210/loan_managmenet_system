import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loanService } from '../../services';
import RecordPaymentModal from '../../components/Modals/RecordPaymentModal';
import AddRemarkModal from '../../components/Modals/AddRemarkModal';
import PromiseToPayModal from '../../components/Modals/PromiseToPayModal';

const LoanDetail = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [showPromiseModal, setShowPromiseModal] = useState(false);

  useEffect(() => {
    fetchLoanDetails();
  }, [loanId]);

  const fetchLoanDetails = async () => {
    try {
      setLoading(true);
      const loanData = await loanService.getLoanById(loanId);
      setLoan(loanData);

      const installmentsData = await loanService.getInstallments(loanId);
      setInstallments(installmentsData);

      const paymentsData = await loanService.getPaymentHistory(loanId);
      setPayments(paymentsData);
    } catch (error) {
      toast.error('Failed to load loan details');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    fetchLoanDetails();
    toast.success('Payment recorded successfully');
  };

  const handleRemarkSuccess = () => {
    setShowRemarkModal(false);
    fetchLoanDetails();
    toast.success('Remark added');
  };

  const handlePromiseSuccess = () => {
    setShowPromiseModal(false);
    fetchLoanDetails();
    toast.success('Promise recorded');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading loan details...</p>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Loan not found</p>
          <button
            onClick={() => navigate('/collector/cases')}
            className="mt-4 text-indigo-600 hover:text-indigo-900 font-semibold"
          >
            ← Back to Cases
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/collector/cases')}
          className="mb-6 text-indigo-600 hover:text-indigo-900 font-semibold"
        >
          ← Back to Cases
        </button>

        {/* Loan Snapshot */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {loan.customerId?.name}
              </h1>
              <p className="text-gray-600 mt-2">Loan ID: {loan._id.slice(-8).toUpperCase()}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold text-white ${
              loan.bucket === 'LEGAL' ? 'bg-red-600' :
              loan.bucket === 'OVERDUE' ? 'bg-orange-600' :
              loan.bucket === 'EARLY_OVERDUE' ? 'bg-yellow-600' :
              'bg-green-600'
            }`}>
              {loan.bucket}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Loan Amount</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{loan.loanAmount?.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">EMI</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{loan.emiAmount?.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Outstanding</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                ₹{loan.outstandingAmount?.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">DPD</p>
              <p className={`text-2xl font-bold mt-1 ${
                loan.dpd > 30 ? 'text-red-700' :
                loan.dpd > 15 ? 'text-orange-600' :
                loan.dpd > 7 ? 'text-yellow-600' :
                loan.dpd > 0 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {loan.dpd}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Next Due</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {new Date(loan.nextDueDate).toLocaleDateString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Tenure</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {loan.tenure || 14} months
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Installment Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Installment Timeline</h2>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                {installments.map((inst, idx) => (
                  <div
                    key={inst._id}
                    className={`p-3 rounded-lg text-center cursor-pointer transition ${
                      inst.status === 'PAID'
                        ? 'bg-green-100 border-2 border-green-500'
                        : inst.status === 'OVERDUE'
                        ? 'bg-red-100 border-2 border-red-500'
                        : 'bg-yellow-100 border-2 border-yellow-500'
                    }`}
                    title={`EMI ${idx + 1}: ₹${inst.emiAmount}`}
                  >
                    <p className="text-xs font-semibold text-gray-700">EMI {idx + 1}</p>
                    <p className="text-xs mt-1">
                      {inst.status === 'PAID' && '✓'}
                      {inst.status === 'OVERDUE' && '✗'}
                      {inst.status === 'PENDING' && '–'}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                  <span>Paid ({installments.filter(i => i.status === 'PAID').length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
                  <span>Pending ({installments.filter(i => i.status === 'PENDING').length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
                  <span>Overdue ({installments.filter(i => i.status === 'OVERDUE').length})</span>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment History</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Mode</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Ref</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Penalty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length > 0 ? (
                      payments.map((payment) => (
                        <tr key={payment._id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            {new Date(payment.paymentDate).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            ₹{payment.amount?.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 text-xs">{payment.mode || '—'}</td>
                          <td className="px-4 py-3 text-xs font-mono">{payment.reference || '—'}</td>
                          <td className="px-4 py-3">
                            {payment.penaltyAmount ? `₹${payment.penaltyAmount}` : '—'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                          No payment history
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Collector Actions</h2>
              
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg mb-3 transition"
              >
                💰 Record Payment
              </button>

              <button
                onClick={() => setShowRemarkModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mb-3 transition"
              >
                📝 Add Remark
              </button>

              <button
                onClick={() => setShowPromiseModal(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                ✓ Promise to Pay
              </button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-900">
                  <strong>Note:</strong> You cannot edit EMI amount, loan amount, or due dates. 
                  Only record actual transactions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showPaymentModal && (
          <RecordPaymentModal
            loanId={loanId}
            emiAmount={loan.emiAmount}
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowPaymentModal(false)}
          />
        )}

        {showRemarkModal && (
          <AddRemarkModal
            loanId={loanId}
            onSuccess={handleRemarkSuccess}
            onClose={() => setShowRemarkModal(false)}
          />
        )}

        {showPromiseModal && (
          <PromiseToPayModal
            loanId={loanId}
            onSuccess={handlePromiseSuccess}
            onClose={() => setShowPromiseModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default LoanDetail;
