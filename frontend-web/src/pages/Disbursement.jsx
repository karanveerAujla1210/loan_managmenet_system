import React, { useState } from 'react';
import { 
  CurrencyDollarIcon, 
  BanknotesIcon, 
  CheckCircleIcon, 
  ClockIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

const Disbursement = () => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showDisbursementModal, setShowDisbursementModal] = useState(false);

  const approvedLoans = [
    {
      id: 'LN001',
      customer: 'Rajesh Kumar',
      amount: '₹5,00,000',
      approvedDate: '2024-01-10',
      bankAccount: 'HDFC Bank - ****1234',
      status: 'ready',
      documents: ['Loan Agreement', 'Bank Details', 'KYC'],
      processingFee: '₹15,000',
      netDisbursement: '₹4,85,000'
    },
    {
      id: 'LN002',
      customer: 'Priya Sharma',
      amount: '₹8,50,000',
      approvedDate: '2024-01-12',
      bankAccount: 'SBI - ****5678',
      status: 'disbursed',
      documents: ['Loan Agreement', 'Bank Details', 'KYC'],
      processingFee: '₹25,500',
      netDisbursement: '₹8,24,500',
      disbursedDate: '2024-01-15'
    },
    {
      id: 'LN003',
      customer: 'Amit Patel',
      amount: '₹12,00,000',
      approvedDate: '2024-01-14',
      bankAccount: 'ICICI Bank - ****9012',
      status: 'processing',
      documents: ['Loan Agreement', 'Bank Details'],
      processingFee: '₹36,000',
      netDisbursement: '₹11,64,000'
    }
  ];

  const disbursementStats = [
    { title: 'Ready for Disbursement', value: '₹45.2L', count: 12, icon: ClockIcon, color: 'text-yellow-600' },
    { title: 'Disbursed Today', value: '₹28.5L', count: 8, icon: CheckCircleIcon, color: 'text-green-600' },
    { title: 'Processing', value: '₹15.8L', count: 5, icon: CurrencyDollarIcon, color: 'text-blue-600' },
    { title: 'Total This Month', value: '₹2.4Cr', count: 156, icon: BanknotesIcon, color: 'text-purple-600' }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      ready: 'success',
      processing: 'warning',
      disbursed: 'info'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const handleDisbursement = (loan) => {
    setSelectedLoan(loan);
    setShowDisbursementModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Disbursement</h1>
          <p className="text-base text-gray-600 mt-1">Process and track loan disbursements</p>
        </div>
        <Button>
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Bulk Disbursement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {disbursementStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.count} loans</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Approved Loans Table */}
      <Card>
        <Card.Header>
          <Card.Title>Approved Loans for Disbursement</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Loan ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Approved Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Net Disbursement</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Bank Account</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedLoans.map((loan) => (
                  <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-primary-600">{loan.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{loan.customer}</p>
                        <p className="text-sm text-gray-600">Approved: {loan.approvedDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{loan.amount}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-green-600">{loan.netDisbursement}</p>
                        <p className="text-sm text-gray-500">Fee: {loan.processingFee}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{loan.bankAccount}</td>
                    <td className="py-3 px-4">{getStatusBadge(loan.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View</Button>
                        {loan.status === 'ready' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleDisbursement(loan)}
                          >
                            Disburse
                          </Button>
                        )}
                        {loan.status === 'disbursed' && (
                          <Button size="sm" variant="outline">Receipt</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>

      {/* Recent Disbursements */}
      <Card>
        <Card.Header>
          <Card.Title>Recent Disbursements</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {approvedLoans.filter(loan => loan.status === 'disbursed').map((loan) => (
              <div key={loan.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">{loan.customer}</p>
                    <p className="text-sm text-gray-600">{loan.id} • Disbursed on {loan.disbursedDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{loan.netDisbursement}</p>
                  <p className="text-sm text-gray-600">{loan.bankAccount}</p>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Disbursement Modal */}
      <Modal
        isOpen={showDisbursementModal}
        onClose={() => setShowDisbursementModal(false)}
        title="Process Disbursement"
        size="lg"
      >
        {selectedLoan && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Loan Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Loan ID:</span>
                  <span className="ml-2 font-medium">{selectedLoan.id}</span>
                </div>
                <div>
                  <span className="text-blue-700">Customer:</span>
                  <span className="ml-2 font-medium">{selectedLoan.customer}</span>
                </div>
                <div>
                  <span className="text-blue-700">Approved Amount:</span>
                  <span className="ml-2 font-medium">{selectedLoan.amount}</span>
                </div>
                <div>
                  <span className="text-blue-700">Processing Fee:</span>
                  <span className="ml-2 font-medium">{selectedLoan.processingFee}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Net Disbursement Amount" value={selectedLoan.netDisbursement} disabled />
              <Input label="Bank Account" value={selectedLoan.bankAccount} disabled />
              <Input label="Disbursement Date" type="date" defaultValue="2024-01-16" />
              <Input label="Reference Number" placeholder="Enter UTR/Reference" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Disbursement Method</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option>NEFT Transfer</option>
                <option>RTGS Transfer</option>
                <option>IMPS Transfer</option>
                <option>Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Add any remarks for this disbursement..."
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Please verify all details before processing the disbursement. 
                This action cannot be undone once completed.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowDisbursementModal(false)}>
                Cancel
              </Button>
              <Button>Process Disbursement</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Disbursement;