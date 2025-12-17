
import React, { useState, useEffect } from 'react';
import { Calendar, Phone, Mail, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const FollowUpScheduler = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    collector: 'all',
    status: 'all'
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFollowUps([
        {
          id: 1,
          customer: 'Rajesh Kumar',
          loanId: 'LN001',
          phone: '+91 98765 43210',
          email: 'rajesh@email.com',
          amount: '₹45,000',
          dpd: 15,
          bucket: '8-15',
          lastContact: '2024-01-10',
          nextFollowUp: '2024-01-15',
          method: 'phone',
          status: 'scheduled',
          collector: 'Amit Singh'
        },
        {
          id: 2,
          customer: 'Priya Sharma',
          loanId: 'LN002',
          phone: '+91 87654 32109',
          email: 'priya@email.com',
          amount: '₹1,25,000',
          dpd: 45,
          bucket: '31-60',
          lastContact: '2024-01-08',
          nextFollowUp: '2024-01-16',
          method: 'email',
          status: 'scheduled',
          collector: 'Sunita Reddy'
        },
        {
          id: 3,
          customer: 'Amit Patel',
          loanId: 'LN003',
          phone: '+91 76543 21098',
          email: 'amit@email.com',
          amount: '₹2,15,000',
          dpd: 95,
          bucket: '90+',
          lastContact: '2024-01-05',
          nextFollowUp: '2024-01-20',
          method: 'field-visit',
          status: 'scheduled',
          collector: 'Vikram Mehta'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [filters]);

  const handleScheduleFollowUp = (account) => {
    setSelectedAccount(account);
    setShowModal(true);
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'field-visit': return <Calendar className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'scheduled': 'warning',
      'completed': 'success',
      'missed': 'danger'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Follow-up Scheduler</h1>
          <p className="text-gray-600 mt-1">Schedule and track collection follow-ups</p>
        </div>
        <Button>
          <Calendar className="h-5 w-5 mr-2" />
          Schedule Follow-up
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <Input 
            type="date" 
            label="Date"
            value={filters.date}
            onChange={(e) => setFilters({...filters, date: e.target.value})}
          />

          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={filters.collector}
            onChange={(e) => setFilters({...filters, collector: e.target.value})}
          >
            <option value="all">All Collectors</option>
            <option value="amit">Amit Singh</option>
            <option value="sunita">Sunita Reddy</option>
            <option value="vikram">Vikram Mehta</option>
          </select>

          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
          </select>
        </div>
      </Card>

      {/* Follow-ups Table */}
      <Card>
        <Card.Header>
          <Card.Title>Scheduled Follow-ups</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount Due</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">DPD</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Next Follow-up</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Method</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Collector</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {followUps.map((followUp) => (
                  <tr key={followUp.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{followUp.customer}</p>
                        <p className="text-sm text-gray-600">Loan: {followUp.loanId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-1" />
                          {followUp.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-1" />
                          {followUp.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-red-600">{followUp.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${
                        followUp.dpd <= 30 ? 'text-yellow-600' :
                        followUp.dpd <= 60 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {followUp.dpd} days
                      </span>
                    </td>
                    <td className="py-3 px-4">{followUp.nextFollowUp}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getMethodIcon(followUp.method)}
                        <span className="ml-2 capitalize">{followUp.method.replace('-', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{followUp.collector}</td>
                    <td className="py-3 px-4">{getStatusBadge(followUp.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleScheduleFollowUp(followUp)}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Reschedule
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
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Schedule Follow-up"
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
                  <span className="ml-2 font-medium">{selectedAccount.amount}</span>
                </div>
                <div>
                  <span className="text-blue-700">Days Overdue:</span>
                  <span className="ml-2 font-medium">{selectedAccount.dpd} days</span>
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
              <Input label="Follow-up Date" type="datetime-local" defaultValue="2024-01-16T10:00" />
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
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button>
                <CheckCircle className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FollowUpScheduler;
