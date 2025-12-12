import React, { useState, useEffect } from 'react';
import { loanAPI } from '../services/api';
import PaymentForm from './PaymentForm';
import moment from 'moment';

const LoanDetail = ({ loanId, onBack, onUpdate }) => {
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');

  useEffect(() => {
    fetchLoanDetail();
  }, [loanId]);

  const fetchLoanDetail = async () => {
    try {
      const response = await loanAPI.getById(loanId);
      setLoan(response.data.data);
    } catch (error) {
      console.error('Error fetching loan detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    fetchLoanDetail();
    onUpdate();
  };

  const getInstallmentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!loan) {
    return <div className="text-center py-8">Loan not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 mb-2"
          >
            ← Back to Loans
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Loan Details - {loan.loanId}
          </h1>
        </div>
        <button
          onClick={() => setShowPaymentForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Payment
        </button>
      </div>

      {/* Loan Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Loan Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
            <p className="text-gray-600">
              {loan.customerId?.firstName} {loan.customerId?.lastName}
            </p>
            <p className="text-gray-600">{loan.customerId?.phone}</p>
            <p className="text-gray-600">{loan.customerId?.email}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Loan Details</h3>
            <p className="text-gray-600">Principal: ₹{loan.principalAmount?.toLocaleString()}</p>
            <p className="text-gray-600">Interest Rate: {loan.interestRate}%</p>
            <p className="text-gray-600">Total Amount: ₹{loan.totalAmount?.toLocaleString()}</p>
            <p className="text-gray-600">Weekly Installment: ₹{loan.installmentAmount?.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Payment Status</h3>
            <p className="text-gray-600">Paid: ₹{loan.paidAmount?.toLocaleString()}</p>
            <p className="text-gray-600">Outstanding: ₹{loan.outstandingAmount?.toLocaleString()}</p>
            <p className="text-gray-600">Status: <span className="font-semibold">{loan.status}</span></p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {['schedule', 'payments', 'timeline'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'schedule' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Repayment Schedule</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Installment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Paid
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Remaining
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loan.schedule?.map((installment) => (
                      <tr key={installment.installmentNumber}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {installment.installmentNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {moment(installment.dueDate).format('DD/MM/YYYY')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{installment.totalAmount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{installment.paidAmount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{installment.remainingAmount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getInstallmentStatusColor(installment.status)}`}>
                            {installment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment History</h3>
              {loan.payments?.length > 0 ? (
                <div className="space-y-4">
                  {loan.payments.map((payment) => (
                    <div key={payment.paymentId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">₹{payment.amount?.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">
                            {moment(payment.paymentDate).format('DD/MM/YYYY HH:mm')}
                          </p>
                          <p className="text-sm text-gray-600">
                            Method: {payment.paymentMethod}
                          </p>
                          {payment.reference && (
                            <p className="text-sm text-gray-600">
                              Reference: {payment.reference}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Payment ID:</p>
                          <p className="text-sm font-mono">{payment.paymentId}</p>
                        </div>
                      </div>
                      {payment.allocatedTo?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Allocated to:</p>
                          <div className="text-sm text-gray-600">
                            {payment.allocatedTo.map((allocation, index) => (
                              <span key={index}>
                                Installment {allocation.installmentNumber}: ₹{allocation.amount?.toLocaleString()}
                                {index < payment.allocatedTo.length - 1 && ', '}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No payments recorded yet</p>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Loan Timeline</h3>
              {loan.events?.length > 0 ? (
                <div className="space-y-4">
                  {loan.events.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">{event.description}</p>
                        <p className="text-sm text-gray-600">
                          {moment(event.createdAt).format('DD/MM/YYYY HH:mm')}
                        </p>
                        {event.amount && (
                          <p className="text-sm text-gray-600">
                            Amount: ₹{event.amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No events recorded</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <PaymentForm
              loanId={loanId}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPaymentForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanDetail;