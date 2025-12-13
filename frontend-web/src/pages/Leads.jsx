import React, { useState } from 'react';
import { PlusIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const Leads = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const leads = [
    { id: 'LD001', name: 'Vikash Singh', phone: '+91 98765 43210', email: 'vikash@email.com', amount: '₹8,00,000', status: 'hot', source: 'Website', date: '2024-01-15' },
    { id: 'LD002', name: 'Meera Joshi', phone: '+91 87654 32109', email: 'meera@email.com', amount: '₹5,50,000', status: 'warm', source: 'Referral', date: '2024-01-14' },
    { id: 'LD003', name: 'Rohit Gupta', phone: '+91 76543 21098', email: 'rohit@email.com', amount: '₹12,00,000', status: 'cold', source: 'Cold Call', date: '2024-01-13' },
    { id: 'LD004', name: 'Anjali Verma', phone: '+91 65432 10987', email: 'anjali@email.com', amount: '₹3,75,000', status: 'converted', source: 'Social Media', date: '2024-01-12' }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      hot: 'danger',
      warm: 'warning',
      cold: 'info',
      converted: 'success'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Lead Management</h1>
          <p className="text-base text-gray-600 mt-1">Track and manage potential customers</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
            <option value="converted">Converted</option>
          </select>
          <Button variant="outline">
            <FunnelIcon className="h-5 w-5 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Leads Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Lead ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Source</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-primary-600">{lead.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-600">{lead.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{lead.phone}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{lead.amount}</td>
                  <td className="py-3 px-4">{getStatusBadge(lead.status)}</td>
                  <td className="py-3 px-4 text-gray-600">{lead.source}</td>
                  <td className="py-3 px-4 text-gray-600">{lead.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm">Follow Up</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Lead Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Lead"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" required />
            <Input label="Phone Number" required />
            <Input label="Email Address" type="email" />
            <Input label="Loan Amount" />
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option>Select Lead Source</option>
              <option>Website</option>
              <option>Referral</option>
              <option>Cold Call</option>
              <option>Social Media</option>
            </select>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option>Lead Status</option>
              <option>Hot</option>
              <option>Warm</option>
              <option>Cold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Additional notes about the lead..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button>Add Lead</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Leads;