import React, { useState } from 'react';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

const Collections = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [filterBucket, setFilterBucket] = useState('all');

  const accounts = [
    {
      id: 'AC001',
      customer: 'Rajesh Kumar',
      loanId: 'LN001',
      phone: '+91 98765 43210',
      email: 'rajesh@email.com',
      principalDue: '₹45,000',
      interestDue: '₹8,500',
      totalDue: '₹53,500',
      daysOverdue: 15,
      bucket: '0-30',
      lastPayment: '2024-01-01',
      lastContact: '2024-01-10',
      priority: 'medium',
      status: 'follow-up'
    },
    {
      id: 'AC002',
      customer: 'Priya Sharma',
      loanId: 'LN002',
      phone: '+91 87654 32109',
      email: 'priya@email.com',
      principalDue: '₹1,25,000',
      interestDue: '₹22,000',
      totalDue: '₹1,47,000',
      daysOverdue: 45,
      bucket: '31-60',
      lastPayment: '2023-12-01',
      lastContact: '2024-01-08',
      priority: 'high',
      status: 'legal-notice'
    },
    {
      id: 'AC003',
      customer: 'Amit Patel',
      loanId: 'LN003',
      phone: '+91 76543 21098',
      email: 'amit@email.com',
      principalDue: '₹2,15,000',
      interestDue: '₹45,000',
      totalDue: '₹2,60,000',
      daysOverdue: 95,
      bucket: '90+',
      lastPayment: '2023-10-15',
      lastContact: '2024-01-05',
      priority: 'critical',
      status: 'recovery'
    }
  ];

  const collectionStats = [
    { title: 'Total Outstanding', value: '₹45.2L', icon: CurrencyDollarIcon, color: 'text-red-600' },
    { title: 'Collected Today', value: '₹8.5L', icon: CheckCircleIcon, color: 'text-green-600' },
    { title: 'Follow-ups Due', value: '24', icon: ClockIcon, color: 'text-yellow-600' },
    { title: 'Recovery Cases', value: '12', icon: ExclamationTriangleIcon, color: 'text-red-600' }
  ];

  const getBucketBadge = (bucket) => {
    const variants = {
      '0-30': 'warning',
      '31-60': 'danger',
      '61-90': 'danger',
      '90+': 'danger'
    };
    return <Badge variant={variants[bucket]}>{bucket} Days</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      low: 'info',
      medium: 'warning',
      high: 'danger',
      critical: 'danger'
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      'follow-up': 'warning',
      'legal-notice': 'danger',
      'recovery': 'danger',
      'settled': 'success'
    };
    return <Badge variant={variants[status]}>{status.replace('-', ' ')}</Badge>;
  };

  const filteredAccounts = accounts.filter(account => {
    if (filterBucket === 'all') return true;
    return account.bucket === filterBucket;
  });

  const handleFollowUp = (account) => {
    setSelectedAccount(account);
    setShowFollowUpModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Collections</h1>
          <p className="text-base text-gray-600 mt-1">Manage overdue accounts and collections</p>
        </div>
        <Button>
          <CurrencyDollarIcon className="h-5 w-5 mr-2" />
          Record Payment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {collectionStats.map((stat, index) => (
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

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by customer name, loan ID..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={filterBucket}
            onChange={(e) => setFilterBucket(e.target.value)}
          >
            <option value="all">All Buckets</option>
            <option value="0-30">0-30 Days</option>
            <option value="31-60">31-60 Days</option>
            <option value="61-90">61-90 Days</option>
            <option value="90+">90+ Days</option>
          </select>
          <Button variant="outline">Export List</Button>
        </div>
      </Card>

      {/* Collections Table */}
      <Card>
        <Card.Header>
          <Card.Title>Overdue Accounts</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount Due</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Days Overdue</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Bucket</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Priority</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{account.customer}</p>
                        <p className="text-sm text-gray-600">Loan: {account.loanId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {account.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {account.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-red-600">{account.totalDue}</p>
                        <p className="text-sm text-gray-600">Principal: {account.principalDue}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${
                        account.daysOverdue <= 30 ? 'text-yellow-600' :
                        account.daysOverdue <= 60 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {account.daysOverdue} days
                      </span>
                    </td>
                    <td className="py-3 px-4">{getBucketBadge(account.bucket)}</td>
                    <td className="py-3 px-4">{getPriorityBadge(account.priority)}</td>
                    <td className="py-3 px-4">{getStatusBadge(account.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Call</Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleFollowUp(account)}
                        >
                          Follow Up
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>

      {/* Follow-up Modal */}
      <Modal
        isOpen={showFollowUpModal}
        onClose={() => setShowFollowUpModal(false)}
        title="Record Follow-up Activity"
        size="lg"
      >
        {selectedAccount && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Account Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Customer:</span>
                  <span className="ml-2 font-medium">{selectedAccount.customer}</span>
                </div>
                <div>
                  <span className="text-blue-700">Loan ID:</span>
                  <span className="ml-2 font-medium">{selectedAccount.loanId}</span>
                </div>
                <div>
                  <span className="text-blue-700">Amount Due:</span>
                  <span className="ml-2 font-medium">{selectedAccount.totalDue}</span>
                </div>
                <div>
                  <span className="text-blue-700">Days Overdue:</span>
                  <span className="ml-2 font-medium">{selectedAccount.daysOverdue} days</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Method</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>Phone Call</option>
                  <option>SMS</option>
                  <option>Email</option>
                  <option>Field Visit</option>
                  <option>Legal Notice</option>
                </select>
              </div>
              <Input label="Contact Date" type="datetime-local" defaultValue="2024-01-16T10:00" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Notes</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Record conversation details, customer response, next steps..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Response</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>Promised to Pay</option>
                  <option>Requested Extension</option>
                  <option>Disputed Amount</option>
                  <option>No Response</option>
                  <option>Refused to Pay</option>
                </select>
              </div>
              <Input label="Next Follow-up Date" type="date" />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowFollowUpModal(false)}>
                Cancel
              </Button>
              <Button>Save Follow-up</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Collections;