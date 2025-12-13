import React, { useState } from 'react';
import { DocumentMagnifyingGlassIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const CreditAnalysis = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);

  const applications = [
    {
      id: 'CA001',
      customer: 'Rajesh Kumar',
      amount: '₹5,00,000',
      cibil: 750,
      income: '₹45,000',
      status: 'pending',
      riskScore: 'Low',
      documents: ['PAN', 'Aadhaar', 'Bank Statement', 'ITR'],
      submittedDate: '2024-01-15'
    },
    {
      id: 'CA002',
      customer: 'Priya Sharma',
      amount: '₹8,50,000',
      cibil: 680,
      income: '₹65,000',
      status: 'approved',
      riskScore: 'Medium',
      documents: ['PAN', 'Aadhaar', 'Salary Slip', 'Bank Statement'],
      submittedDate: '2024-01-14'
    },
    {
      id: 'CA003',
      customer: 'Amit Patel',
      amount: '₹12,00,000',
      cibil: 620,
      income: '₹55,000',
      status: 'rejected',
      riskScore: 'High',
      documents: ['PAN', 'Aadhaar', 'Bank Statement'],
      submittedDate: '2024-01-13'
    }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getRiskBadge = (risk) => {
    const variants = {
      Low: 'success',
      Medium: 'warning',
      High: 'danger'
    };
    return <Badge variant={variants[risk]}>{risk} Risk</Badge>;
  };

  const getCibilColor = (score) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Credit Analysis</h1>
          <p className="text-base text-gray-600 mt-1">Review and analyze loan applications</p>
        </div>
        <Button>
          <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2" />
          Bulk Analysis
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">24</p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">156</p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <XCircleIcon className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">43</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <DocumentMagnifyingGlassIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">89%</p>
              <p className="text-sm text-gray-600">Approval Rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <Card.Header>
          <Card.Title>Credit Applications</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Application ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">CIBIL Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Monthly Income</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Risk Level</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-primary-600">{app.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{app.customer}</p>
                        <p className="text-sm text-gray-600">Submitted: {app.submittedDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{app.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${getCibilColor(app.cibil)}`}>
                        {app.cibil}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{app.income}</td>
                    <td className="py-3 px-4">{getRiskBadge(app.riskScore)}</td>
                    <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedApplication(app)}
                        >
                          Review
                        </Button>
                        {app.status === 'pending' && (
                          <>
                            <Button size="sm" variant="success">Approve</Button>
                            <Button size="sm" variant="danger">Reject</Button>
                          </>
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

      {/* Application Review Modal */}
      <Modal
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        title="Credit Analysis Review"
        size="xl"
      >
        {selectedApplication && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedApplication.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application ID:</span>
                    <span className="font-medium">{selectedApplication.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Amount:</span>
                    <span className="font-medium">{selectedApplication.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Income:</span>
                    <span className="font-medium">{selectedApplication.income}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Credit Assessment</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">CIBIL Score:</span>
                    <span className={`font-semibold ${getCibilColor(selectedApplication.cibil)}`}>
                      {selectedApplication.cibil}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    {getRiskBadge(selectedApplication.riskScore)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Documents Submitted</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedApplication.documents.map((doc, index) => (
                  <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-green-800">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Analysis Notes</h4>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Add your analysis notes here..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                Close
              </Button>
              {selectedApplication.status === 'pending' && (
                <>
                  <Button variant="danger">Reject Application</Button>
                  <Button>Approve Application</Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CreditAnalysis;