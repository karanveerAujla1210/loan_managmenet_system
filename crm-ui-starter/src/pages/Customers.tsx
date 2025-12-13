import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Filter } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { mockCustomers } from '../services/mockData'

export const Customers: React.FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed' | 'default'>('all')

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusColors = {
    active: 'bg-success/10 text-success',
    closed: 'bg-gray-100 text-gray-700',
    default: 'bg-danger/10 text-danger'
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-display-sm font-bold text-gray-900 mb-2">Customers</h1>
          <p className="text-body-lg text-gray-600">Manage and view customer profiles</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-medium">
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'closed', 'default'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-primary'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Grid/Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card 
            key={customer.id}
            className="cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1"
            onClick={() => navigate(`/customers/${customer.id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <img 
                  src={customer.profileImage}
                  alt={customer.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                  <p className="text-sm text-gray-600">{customer.loanCount} loan(s)</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[customer.status]}`}>
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </span>
            </div>
            
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{customer.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium text-gray-900">{customer.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Portfolio:</span>
                <span className="font-medium text-primary">₹{(customer.totalLoanAmount / 100000).toFixed(1)}L</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-gray-600 mb-2">No customers found</p>
          <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
        </Card>
      )}
    </div>
  )
}

export default Customers
