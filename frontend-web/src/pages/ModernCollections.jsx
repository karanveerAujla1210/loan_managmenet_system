import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Filter,
  Download,
  Plus,
  Search,
  MapPin,
  FileText,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from '../components/ui/ModernCard';
import { ModernButton } from '../components/ui/ModernButton';
import { ModernInput } from '../components/ui/ModernInput';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Progress } from '../components/ui/Progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { formatCurrency, formatDate, getDPDColor, getInitials } from '../lib/utils';

const ModernCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dpdFilter, setDpdFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const mockCollections = [
    {
      id: 'COLL001',
      customerId: 'CUST001',
      customerName: 'John Doe',
      loanId: 'LN001',
      principalAmount: 500000,
      outstandingAmount: 125000,
      overdueAmount: 25000,
      dpd: 15,
      emi: 12500,
      nextDueDate: '2024-01-20',
      lastPayment: '2023-12-15',
      lastPaymentAmount: 12500,
      phone: '+91 98765 43210',
      email: 'john.doe@email.com',
      address: 'Mumbai, Maharashtra',
      collectorAssigned: 'Sarah Collector',
      status: 'contacted',
      priority: 'medium',
      promiseToPay: '2024-01-22',
      callHistory: [
        { date: '2024-01-15', status: 'connected', notes: 'Customer promised to pay by 22nd Jan' },
        { date: '2024-01-10', status: 'no_answer', notes: 'No response' },
        { date: '2024-01-08', status: 'connected', notes: 'Discussed payment plan' }
      ],
      paymentHistory: [
        { date: '2023-12-15', amount: 12500, method: 'bank_transfer' },
        { date: '2023-11-15', amount: 12500, method: 'cheque' },
        { date: '2023-10-15', amount: 12500, method: 'bank_transfer' }
      ]
    },
    {
      id: 'COLL002',
      customerId: 'CUST002',
      customerName: 'Jane Smith',
      loanId: 'LN002',
      principalAmount: 750000,
      outstandingAmount: 200000,
      overdueAmount: 50000,
      dpd: 30,
      emi: 18750,
      nextDueDate: '2024-01-18',
      lastPayment: '2023-11-20',
      lastPaymentAmount: 18750,
      phone: '+91 87654 32109',
      email: 'jane.smith@email.com',
      address: 'Delhi, Delhi',
      collectorAssigned: 'Mike Collector',
      status: 'legal_notice',
      priority: 'high',
      promiseToPay: null,
      callHistory: [
        { date: '2024-01-14', status: 'connected', notes: 'Customer avoiding payment' },
        { date: '2024-01-12', status: 'no_answer', notes: 'Phone switched off' },
        { date: '2024-01-10', status: 'connected', notes: 'Requested more time' }
      ],
      paymentHistory: [
        { date: '2023-11-20', amount: 18750, method: 'bank_transfer' },
        { date: '2023-10-20', amount: 18750, method: 'cash' }
      ]
    },
    {
      id: 'COLL003',
      customerId: 'CUST003',
      customerName: 'Mike Johnson',
      loanId: 'LN003',
      principalAmount: 300000,
      outstandingAmount: 75000,
      overdueAmount: 15000,
      dpd: 7,
      emi: 7500,
      nextDueDate: '2024-01-25',
      lastPayment: '2024-01-08',
      lastPaymentAmount: 7500,
      phone: '+91 76543 21098',
      email: 'mike.johnson@email.com',
      address: 'Bangalore, Karnataka',
      collectorAssigned: 'Anna Collector',
      status: 'promised',
      priority: 'low',
      promiseToPay: '2024-01-20',
      callHistory: [
        { date: '2024-01-15', status: 'connected', notes: 'Will pay by 20th Jan' },
        { date: '2024-01-12', status: 'connected', notes: 'Acknowledged overdue' }
      ],
      paymentHistory: [
        { date: '2024-01-08', amount: 7500, method: 'upi' },
        { date: '2023-12-08', amount: 7500, method: 'bank_transfer' },
        { date: '2023-11-08', amount: 7500, method: 'upi' }
      ]
    }
  ];

  const dpdBuckets = [
    { range: '0-30', count: 45, amount: 2250000, color: 'bg-yellow-500' },
    { range: '31-60', count: 23, amount: 1150000, color: 'bg-orange-500' },
    { range: '61-90', count: 12, amount: 600000, color: 'bg-red-500' },
    { range: '90+', count: 8, amount: 400000, color: 'bg-red-700' }
  ];

  useEffect(() => {
    setTimeout(() => {
      setCollections(mockCollections);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      contacted: 'info',
      promised: 'warning',
      legal_notice: 'error',
      paid: 'success',
      follow_up: 'default'
    };
    return variants[status] || 'default';
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'error'
    };
    return variants[priority] || 'default';
  };

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.loanId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.phone.includes(searchQuery);
    
    let matchesDPD = true;
    if (dpdFilter !== 'all') {
      const dpd = collection.dpd;
      switch (dpdFilter) {
        case '0-30':
          matchesDPD = dpd >= 0 && dpd <= 30;
          break;
        case '31-60':
          matchesDPD = dpd >= 31 && dpd <= 60;
          break;
        case '61-90':
          matchesDPD = dpd >= 61 && dpd <= 90;
          break;
        case '90+':
          matchesDPD = dpd > 90;
          break;
      }
    }
    
    return matchesSearch && matchesDPD;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-3xl font-semibold text-gray-900">Collections</h1>
          <p className="text-base text-gray-600 mt-1">
            Manage overdue accounts and payment collections
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <ModernButton variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </ModernButton>
          <ModernButton size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Payment
          </ModernButton>
        </div>
      </div>

      {/* DPD Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dpdBuckets.map((bucket, index) => (
          <motion.div
            key={bucket.range}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ModernCard className="hover:shadow-lg transition-all duration-200">
              <ModernCardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bucket.color} bg-opacity-10`}>
                    <AlertTriangle className={`w-6 h-6 ${bucket.color.replace('bg-', 'text-')}`} />
                  </div>
                  <Badge variant="outline">{bucket.range} DPD</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Accounts</span>
                    <span className="text-2xl font-semibold text-gray-900">{bucket.count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="text-lg font-semibold text-gray-900">{formatCurrency(bucket.amount)}</span>
                  </div>
                </div>
              </ModernCardContent>
            </ModernCard>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="calls">Call Log</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <ModernCard>
            <ModernCardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex-1 max-w-md">
                  <ModernInput
                    icon={Search}
                    placeholder="Search by customer, loan ID, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={dpdFilter}
                    onChange={(e) => setDpdFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All DPD</option>
                    <option value="0-30">0-30 DPD</option>
                    <option value="31-60">31-60 DPD</option>
                    <option value="61-90">61-90 DPD</option>
                    <option value="90+">90+ DPD</option>
                  </select>
                  
                  <ModernButton variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </ModernButton>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          {/* Collections List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ModernCard className="hover:shadow-lg transition-all duration-200">
                  <ModernCardContent className="p-6">
                    {/* Customer Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar size="lg" className="bg-red-100 text-red-700">
                          {getInitials(collection.customerName)}
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{collection.customerName}</h3>
                          <p className="text-sm text-gray-600">{collection.loanId}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={getDPDColor(collection.dpd)} size="sm">
                          {collection.dpd} DPD
                        </Badge>
                        <Badge variant={getPriorityBadge(collection.priority)} size="sm">
                          {collection.priority}
                        </Badge>
                      </div>
                    </div>

                    {/* Amount Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-red-50 rounded-xl p-3">
                        <p className="text-xs text-red-600 mb-1">Overdue Amount</p>
                        <p className="text-lg font-semibold text-red-700">
                          {formatCurrency(collection.overdueAmount)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-600 mb-1">Outstanding</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(collection.outstandingAmount)}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{collection.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="truncate">{collection.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span>Assigned to: {collection.collectorAssigned}</span>
                      </div>
                    </div>

                    {/* Status & Promise to Pay */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        <Badge variant={getStatusBadge(collection.status)}>
                          {collection.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      {collection.promiseToPay && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Promise to Pay</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(collection.promiseToPay)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        Last payment: {formatDate(collection.lastPayment)}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <ModernButton size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </ModernButton>
                        <ModernButton size="sm">
                          <DollarSign className="w-4 h-4 mr-1" />
                          Payment
                        </ModernButton>
                      </div>
                    </div>
                  </ModernCardContent>
                </ModernCard>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accounts">
          <ModernCard>
            <ModernCardHeader>
              <ModernCardTitle>Collection Accounts</ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Loan ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">DPD</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Overdue</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Collector</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCollections.map((collection) => (
                      <tr key={collection.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar size="sm" className="bg-red-100 text-red-700 mr-3">
                              {getInitials(collection.customerName)}
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{collection.customerName}</div>
                              <div className="text-sm text-gray-500">{collection.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {collection.loanId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getDPDColor(collection.dpd)}>
                            {collection.dpd}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                          {formatCurrency(collection.overdueAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusBadge(collection.status)}>
                            {collection.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {collection.collectorAssigned}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <ModernButton size="sm" variant="outline">
                              <Phone className="w-4 h-4" />
                            </ModernButton>
                            <ModernButton size="sm">
                              <DollarSign className="w-4 h-4" />
                            </ModernButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ModernCardContent>
          </ModernCard>
        </TabsContent>

        <TabsContent value="calls">
          <ModernCard>
            <ModernCardHeader>
              <ModernCardTitle>Call History</ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent>
              <div className="space-y-4">
                {collections.flatMap(collection => 
                  collection.callHistory.map((call, index) => (
                    <div key={`${collection.id}-${index}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <Avatar size="sm" className="bg-primary-100 text-primary-700">
                          {getInitials(collection.customerName)}
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{collection.customerName}</p>
                          <p className="text-sm text-gray-600">{call.notes}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatDate(call.date)}</p>
                        <Badge variant={call.status === 'connected' ? 'success' : 'warning'} size="sm">
                          {call.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ModernCardContent>
          </ModernCard>
        </TabsContent>

        <TabsContent value="payments">
          <ModernCard>
            <ModernCardHeader>
              <ModernCardTitle>Recent Payments</ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent>
              <div className="space-y-4">
                {collections.flatMap(collection => 
                  collection.paymentHistory.map((payment, index) => (
                    <div key={`${collection.id}-${index}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{collection.customerName}</p>
                          <p className="text-sm text-gray-600">{collection.loanId} • {payment.method.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-gray-500">{formatDate(payment.date)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ModernCardContent>
          </ModernCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModernCollections;