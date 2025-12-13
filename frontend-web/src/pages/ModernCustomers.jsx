import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical
} from 'lucide-react';
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from '../components/ui/ModernCard';
import { ModernButton } from '../components/ui/ModernButton';
import { ModernInput } from '../components/ui/ModernInput';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { formatCurrency, formatDate, getStatusColor, getInitials } from '../lib/utils';

const ModernCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const mockCustomers = [
    {
      id: 'CUST001',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 98765 43210',
      address: 'Mumbai, Maharashtra',
      status: 'active',
      kycStatus: 'verified',
      totalLoans: 2,
      activeLoans: 1,
      totalAmount: 750000,
      lastActivity: '2024-01-15',
      joinDate: '2023-06-15',
      creditScore: 750,
      riskCategory: 'low'
    },
    {
      id: 'CUST002',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+91 87654 32109',
      address: 'Delhi, Delhi',
      status: 'active',
      kycStatus: 'pending',
      totalLoans: 1,
      activeLoans: 1,
      totalAmount: 500000,
      lastActivity: '2024-01-14',
      joinDate: '2023-08-20',
      creditScore: 680,
      riskCategory: 'medium'
    },
    {
      id: 'CUST003',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+91 76543 21098',
      address: 'Bangalore, Karnataka',
      status: 'inactive',
      kycStatus: 'verified',
      totalLoans: 3,
      activeLoans: 0,
      totalAmount: 1200000,
      lastActivity: '2023-12-20',
      joinDate: '2023-03-10',
      creditScore: 720,
      riskCategory: 'low'
    },
    {
      id: 'CUST004',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+91 65432 10987',
      address: 'Chennai, Tamil Nadu',
      status: 'active',
      kycStatus: 'rejected',
      totalLoans: 1,
      activeLoans: 0,
      totalAmount: 300000,
      lastActivity: '2024-01-13',
      joinDate: '2023-11-05',
      creditScore: 620,
      riskCategory: 'high'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomers(mockCustomers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getKYCStatusBadge = (status) => {
    const variants = {
      verified: 'success',
      pending: 'warning',
      rejected: 'error'
    };
    return variants[status] || 'default';
  };

  const getRiskBadge = (risk) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'error'
    };
    return variants[risk] || 'default';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
          <h1 className="text-3xl font-semibold text-gray-900">Customers</h1>
          <p className="text-base text-gray-600 mt-1">
            Manage your customer database and relationships
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <ModernButton variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </ModernButton>
          <ModernButton size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
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
                placeholder="Search customers..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <ModernButton
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </ModernButton>
            </div>
          </div>
        </ModernCardContent>
      </ModernCard>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ModernCard className="hover:shadow-lg transition-all duration-200">
              <ModernCardContent className="p-6">
                {/* Customer Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar size="lg" className="bg-primary-100 text-primary-700">
                      {getInitials(customer.name)}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                      <p className="text-sm text-gray-600">{customer.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={customer.status === 'active' ? 'success' : 'secondary'}>
                      {customer.status}
                    </Badge>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                </div>

                {/* KYC & Risk Status */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">KYC Status</p>
                    <Badge variant={getKYCStatusBadge(customer.kycStatus)} size="sm">
                      {customer.kycStatus}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Risk</p>
                    <Badge variant={getRiskBadge(customer.riskCategory)} size="sm">
                      {customer.riskCategory}
                    </Badge>
                  </div>
                </div>

                {/* Loan Summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{customer.activeLoans}</p>
                      <p className="text-xs text-gray-600">Active Loans</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(customer.totalAmount)}</p>
                      <p className="text-xs text-gray-600">Total Amount</p>
                    </div>
                  </div>
                </div>

                {/* Credit Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Credit Score</span>
                    <span className="text-sm font-semibold text-gray-900">{customer.creditScore}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        customer.creditScore >= 700 ? 'bg-green-500' :
                        customer.creditScore >= 650 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(customer.creditScore / 850) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    Last active: {formatDate(customer.lastActivity)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/customers/${customer.id}`}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </ModernCardContent>
            </ModernCard>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
          
          <div className="flex items-center space-x-2">
            <ModernButton variant="outline" size="sm" disabled>
              Previous
            </ModernButton>
            <ModernButton variant="outline" size="sm">
              Next
            </ModernButton>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCustomers.length === 0 && !loading && (
        <ModernCard>
          <ModernCardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search criteria' : 'Get started by adding your first customer'}
            </p>
            <ModernButton>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </ModernButton>
          </ModernCardContent>
        </ModernCard>
      )}
    </div>
  );
};

export default ModernCustomers;