import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';

// Mock API functions - replace with actual API calls
const getCustomers = async (params = {}) => {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        customers: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            company: 'ABC Corp',
            address: '123 Main St, City, State',
            createdAt: '2024-01-15',
            status: 'active',
            totalLoans: 2,
            totalAmount: 75000
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+1234567891',
            company: 'XYZ Inc',
            address: '456 Oak Ave, City, State',
            createdAt: '2024-01-20',
            status: 'active',
            totalLoans: 1,
            totalAmount: 50000
          },
          {
            id: 3,
            name: 'Robert Johnson',
            email: 'robert@example.com',
            phone: '+1234567892',
            company: 'DEF Ltd',
            address: '789 Pine Rd, City, State',
            createdAt: '2024-02-01',
            status: 'inactive',
            totalLoans: 3,
            totalAmount: 125000
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 3,
          pages: 1
        }
      });
    }, 1000);
  });
};

const deleteCustomer = async (id) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery(
    ['customers', { page: currentPage, search: searchTerm }],
    () => getCustomers({ page: currentPage, search: searchTerm })
  );
  
  const deleteMutation = useMutation(deleteCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      alert('Customer deleted successfully!');
    },
    onError: () => {
      alert('Failed to delete customer');
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading customers. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loans
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.customers?.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.totalLoans}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${customer.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(customer.id)}
                          disabled={deleteMutation.isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {data?.customers?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No customers found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
