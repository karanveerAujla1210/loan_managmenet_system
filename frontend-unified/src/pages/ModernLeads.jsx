import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Star,
  MessageSquare
} from 'lucide-react';
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from '../components/ui/ModernCard';
import { ModernButton } from '../components/ui/ModernButton';
import { ModernInput } from '../components/ui/ModernInput';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Progress } from '../components/ui/Progress';
import { formatCurrency, formatDate, getInitials } from '../lib/utils';

const ModernLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'

  // Mock data
  const mockLeads = [
    {
      id: 'LEAD001',
      name: 'Robert Chen',
      email: 'robert.chen@email.com',
      phone: '+91 98765 43210',
      company: 'Tech Solutions Pvt Ltd',
      status: 'new',
      source: 'website',
      score: 85,
      loanAmount: 1500000,
      purpose: 'Business Expansion',
      assignedTo: 'John Counsellor',
      createdDate: '2024-01-15',
      lastContact: '2024-01-15',
      nextFollowUp: '2024-01-16',
      notes: 'Interested in quick processing',
      stage: 'qualification'
    },
    {
      id: 'LEAD002',
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@email.com',
      phone: '+91 87654 32109',
      company: 'Fashion Retail Co',
      status: 'contacted',
      source: 'referral',
      score: 72,
      loanAmount: 800000,
      purpose: 'Inventory Purchase',
      assignedTo: 'Sarah Counsellor',
      createdDate: '2024-01-14',
      lastContact: '2024-01-15',
      nextFollowUp: '2024-01-17',
      notes: 'Needs documentation guidance',
      stage: 'documentation'
    },
    {
      id: 'LEAD003',
      name: 'David Kumar',
      email: 'david.kumar@email.com',
      phone: '+91 76543 21098',
      company: 'Manufacturing Hub',
      status: 'qualified',
      source: 'campaign',
      score: 91,
      loanAmount: 2500000,
      purpose: 'Equipment Purchase',
      assignedTo: 'Mike Counsellor',
      createdDate: '2024-01-13',
      lastContact: '2024-01-15',
      nextFollowUp: '2024-01-18',
      notes: 'High potential, ready to proceed',
      stage: 'proposal'
    },
    {
      id: 'LEAD004',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      phone: '+91 65432 10987',
      company: 'Digital Marketing Agency',
      status: 'converted',
      source: 'social_media',
      score: 88,
      loanAmount: 1200000,
      purpose: 'Office Expansion',
      assignedTo: 'Anna Counsellor',
      createdDate: '2024-01-10',
      lastContact: '2024-01-14',
      nextFollowUp: null,
      notes: 'Successfully converted to customer',
      stage: 'closed_won'
    }
  ];

  const leadStages = [
    { id: 'new', title: 'New Leads', color: 'bg-blue-500' },
    { id: 'contacted', title: 'Contacted', color: 'bg-yellow-500' },
    { id: 'qualified', title: 'Qualified', color: 'bg-purple-500' },
    { id: 'proposal', title: 'Proposal', color: 'bg-orange-500' },
    { id: 'negotiation', title: 'Negotiation', color: 'bg-red-500' },
    { id: 'closed_won', title: 'Closed Won', color: 'bg-green-500' },
    { id: 'closed_lost', title: 'Closed Lost', color: 'bg-gray-500' }
  ];

  useEffect(() => {
    setTimeout(() => {
      setLeads(mockLeads);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      new: 'info',
      contacted: 'warning',
      qualified: 'success',
      converted: 'success',
      lost: 'error'
    };
    return variants[status] || 'default';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getLeadsByStage = (stageId) => {
    return filteredLeads.filter(lead => lead.stage === stageId);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Lead Management</h1>
          <p className="text-base text-gray-600 mt-1">
            Track and convert your sales pipeline
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </button>
          </div>
          <ModernButton size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </ModernButton>
        </div>
      </div>

      {/* Filters */}
      <ModernCard>
        <ModernCardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 max-w-md">
              <ModernInput
                icon={Search}
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
              </select>
              
              <ModernButton variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </ModernButton>
            </div>
          </div>
        </ModernCardContent>
      </ModernCard>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-7 gap-6 overflow-x-auto">
          {leadStages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.id);
            
            return (
              <div key={stage.id} className="min-w-[300px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <h3 className="font-semibold text-gray-900">{stage.title}</h3>
                    <Badge variant="secondary" size="sm">{stageLeads.length}</Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {stageLeads.map((lead, index) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ModernCard className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
                        <ModernCardContent className="p-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Avatar size="sm" className="bg-primary-100 text-primary-700">
                                {getInitials(lead.name)}
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-gray-900 text-sm">{lead.name}</h4>
                                <p className="text-xs text-gray-600">{lead.company}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className={`text-xs font-medium ${getScoreColor(lead.score)}`}>
                                {lead.score}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center text-xs text-gray-600">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {formatCurrency(lead.loanAmount)}
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <User className="w-3 h-3 mr-1" />
                              {lead.assignedTo}
                            </div>
                          </div>
                          
                          {lead.nextFollowUp && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Next follow-up:</span>
                              <span className="font-medium text-gray-900">
                                {formatDate(lead.nextFollowUp)}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <Badge variant={getStatusBadge(lead.status)} size="sm">
                              {lead.status}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                                <Phone className="w-3 h-3" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                                <Mail className="w-3 h-3" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                                <MessageSquare className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </ModernCardContent>
                      </ModernCard>
                    </motion.div>
                  ))}
                  
                  {stageLeads.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Plus className="w-6 h-6" />
                      </div>
                      <p className="text-sm">No leads in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <ModernCard>
          <ModernCardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Follow-up
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar size="sm" className="bg-primary-100 text-primary-700 mr-3">
                            {getInitials(lead.name)}
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(lead.loanAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
                            {lead.score}
                          </span>
                          <Star className="w-4 h-4 text-yellow-500 ml-1" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadge(lead.status)}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.assignedTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.nextFollowUp ? formatDate(lead.nextFollowUp) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-primary-600 hover:text-primary-900 transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                          <button className="text-primary-600 hover:text-primary-900 transition-colors">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="text-primary-600 hover:text-primary-900 transition-colors">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ModernCardContent>
        </ModernCard>
      )}
    </div>
  );
};

export default ModernLeads;
