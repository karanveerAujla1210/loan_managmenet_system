import React, { useState, useEffect } from 'react';
import { Plus, Phone, MessageSquare, Calendar, ArrowRight, X } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch leads from API
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      // const response = await fetch('/api/v1/leads');
      // const data = await response.json();
      // setLeads(data.data);
      setLeads([]);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    }
  };

  const stats = {
    new: leads.filter(l => l.status === 'new').length,
    followup: leads.filter(l => l.status === 'followup').length,
    converted: leads.filter(l => l.status === 'converted').length,
    lost: leads.filter(l => l.status === 'lost').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Dashboard</h1>
          <p className="text-gray-600 mt-1">Capture demand and manage leads</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} /> Create Lead
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">New Leads</div>
          <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Follow-ups Due</div>
          <div className="text-2xl font-bold text-orange-600">{stats.followup}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Converted</div>
          <div className="text-2xl font-bold text-green-600">{stats.converted}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Lost</div>
          <div className="text-2xl font-bold text-red-600">{stats.lost}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'new', 'followup', 'converted', 'lost'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Next Follow-up</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map(lead => (
                <tr key={lead._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lead.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'followup' ? 'bg-orange-100 text-orange-700' :
                      lead.status === 'converted' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lead.nextFollowup || '-'}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded" title="Call">
                      <Phone size={16} className="text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded" title="Add Note">
                      <MessageSquare size={16} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded" title="Schedule Follow-up">
                      <Calendar size={16} className="text-orange-600" />
                    </button>
                    {lead.status === 'new' && (
                      <button className="p-2 hover:bg-gray-100 rounded" title="Convert to Application">
                        <ArrowRight size={16} className="text-green-600" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leads;
