import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  DocumentTextIcon, 
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

const CaseClosure = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [showClosureModal, setShowClosureModal] = useState(false);
  const [closureType, setClosureType] = useState('');

  const cases = [
    {
      id: 'CC001',
      loanId: 'LN001',
      customer: 'Rajesh Kumar',
      originalAmount: '₹5,00,000',
      outstandingAmount: '₹0',
      status: 'ready-for-closure',
      type: 'full-payment',
      lastPayment: '2024-01-15',
      tenure: '24 months',
      closureReason: 'Loan fully repaid'
    },
    {
      id: 'CC002',
      loanId: 'LN005',
      customer: 'Sunita Devi',
      originalAmount: '₹3,50,000',
      outstandingAmount: '₹45,000',
      status: 'settlement-pending',
      type: 'settlement',
      lastPayment: '2024-01-10',
      tenure: '36 months',
      closureReason: 'One-time settlement agreed'
    },
    {
      id: 'CC003',
      loanId: 'LN008',
      customer: 'Vikash Singh',
      originalAmount: '₹8,00,000',
      outstandingAmount: '₹2,15,000',
      status: 'write-off-pending',
      type: 'write-off',
      lastPayment: '2023-11-20',
      tenure: '48 months',
      closureReason: 'Customer deceased, no recoverable assets'
    },
    {
      id: 'CC004',
      loanId: 'LN012',
      customer: 'Meera Joshi',
      originalAmount: '₹6,75,000',
      outstandingAmount: '₹0',
      status: 'closed',
      type: 'foreclosure',
      lastPayment: '2024-01-12',
      tenure: '30 months',
      closureReason: 'Foreclosure - customer paid full amount early'
    }
  ];

  const closureStats = [
    { title: 'Ready for Closure', value: 12, icon: CheckCircleIcon, color: 'text-green-600' },
    { title: 'Settlement Pending', value: 8, icon: ClockIcon, color: 'text-yellow-600' },
    { title: 'Write-off Pending', value: 5, icon: ExclamationTriangleIcon, color: 'text-red-600' },
    { title: 'Closed This Month', value: 45, icon: DocumentTextIcon, color: 'text-blue-600' }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      'ready-for-closure': 'success',
      'settlement-pending': 'warning',
      'write-off-pending': 'danger',
      'closed': 'info'
    };
    return <Badge variant={variants[status]}>{status.replace('-', ' ')}</Badge>;
  };

  const getTypeBadge = (type) => {
    const variants = {
      'full-payment': 'success',
      'settlement': 'warning',
      'write-off': 'danger',
      'foreclosure': 'info'
    };
    return <Badge variant={variants[type]}>{type.replace('-', ' ')}</Badge>;
  };

  const handleClosure = (caseItem) => {
    setSelectedCase(caseItem);
    setClosureType(caseItem.type);
    setShowClosureModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Case Closure</h1>
          <p className="text-base text-gray-600 mt-1">Manage loan closures and final settlements</p>
        </div>
        <Button>
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          Closure Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {closureStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Cases Table */}
      <Card>
        <Card.Header>
          <Card.Title>Cases for Closure</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Case ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Loan Details</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Outstanding</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Closure Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((caseItem) => (
                  <tr key={caseItem.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-primary-600">{caseItem.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{caseItem.customer}</p>
                        <p className="text-sm text-gray-600">Loan: {caseItem.loanId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{caseItem.originalAmount}</p>
                        <p className="text-sm text-gray-600">{caseItem.tenure} tenure</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className={`font-semibold ${
                        caseItem.outstandingAmount === '₹0' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {caseItem.outstandingAmount}
                      </p>
                    </td>
                    <td className="py-3 px-4">{getTypeBadge(caseItem.type)}</td>
                    <td className="py-3 px-4">{getStatusBadge(caseItem.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View</Button>
                        {caseItem.status !== 'closed' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleClosure(caseItem)}
                          >
                            Process
                          </Button>
                        )}
                        {caseItem.status === 'closed' && (
                          <Button size="sm" variant="outline">Certificate</Button>
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

      {/* Closure Timeline */}
      <Card>
        <Card.Header>
          <Card.Title>Closure Process Timeline</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div className="flex-1">
                <p className="font-medium text-green-900">Final Payment Verification</p>
                <p className="text-sm text-green-700">Verify all payments and calculate final outstanding</p>
              </div>
              <Badge variant="success">Completed</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <ClockIcon className="h-8 w-8 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">Documentation Review</p>
                <p className="text-sm text-blue-700">Review all loan documents and agreements</p>
              </div>
              <Badge variant="info">In Progress</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <DocumentTextIcon className="h-8 w-8 text-gray-400" />
              <div className="flex-1">
                <p className="font-medium text-gray-600">Closure Certificate Generation</p>
                <p className="text-sm text-gray-500">Generate and issue loan closure certificate</p>
              </div>
              <Badge variant="default">Pending</Badge>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Closure Processing Modal */}
      <Modal
        isOpen={showClosureModal}
        onClose={() => setShowClosureModal(false)}
        title="Process Case Closure"
        size="lg"
      >
        {selectedCase && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Case Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Case ID:</span>
                  <span className="ml-2 font-medium">{selectedCase.id}</span>
                </div>
                <div>
                  <span className="text-blue-700">Customer:</span>
                  <span className="ml-2 font-medium">{selectedCase.customer}</span>
                </div>
                <div>
                  <span className="text-blue-700">Original Amount:</span>
                  <span className="ml-2 font-medium">{selectedCase.originalAmount}</span>
                </div>
                <div>
                  <span className="text-blue-700">Outstanding:</span>
                  <span className="ml-2 font-medium">{selectedCase.outstandingAmount}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Closure Type</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={closureType}
                onChange={(e) => setClosureType(e.target.value)}
              >
                <option value="full-payment">Full Payment</option>
                <option value="settlement">One-time Settlement</option>
                <option value="write-off">Write-off</option>
                <option value="foreclosure">Foreclosure</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Closure Date" type="date" defaultValue="2024-01-16" />
              <Input label="Final Settlement Amount" placeholder="Enter amount" />
              <Input label="Reference Number" placeholder="Enter reference" />
              <Input label="Processed By" defaultValue="Current User" disabled />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Closure Reason</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Provide detailed reason for closure..."
                defaultValue={selectedCase.closureReason}
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Once processed, this closure cannot be reversed. 
                Please ensure all details are accurate before proceeding.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowClosureModal(false)}>
                Cancel
              </Button>
              <Button>Process Closure</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CaseClosure;