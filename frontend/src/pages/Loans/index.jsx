import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getLoans, createLoan, updateLoan, approveLoan, rejectLoan } from '../../services/loans';
import { formatCurrency } from '../../lib/format';
import FilterBar from '../../components/FilterBar';
import Pagination from '../../components/Pagination';
import { toast } from 'react-hot-toast';
import { FileText, DollarSign, Users, AlertCircle, Filter, Search } from 'lucide-react';

const Loans = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('disbursed');
  const [branchFilter, setBranchFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    customerId: '',
    principalAmount: '',
    interestRate: '',
    tenure: '',
    processingFee: '',
    disbursementDate: '',
  });

  const queryClient = useQueryClient();

  const { data: loansResponse, isLoading } = useQuery(
    ['loans', { search: searchTerm, status: statusFilter, page: currentPage, limit: pageSize }],
    () => getLoans({ search: searchTerm, status: statusFilter, page: currentPage, limit: pageSize }),
    {
      keepPreviousData: true,
    }
  );

  // Extract unique branches from loans
  useEffect(() => {
    if (loansResponse?.data) {
      const uniqueBranches = [...new Set(loansResponse.data.map(l => l.metadata?.branch).filter(Boolean))];
      setBranches(uniqueBranches);
    }
  }, [loansResponse]);

  const loans = loansResponse || {};

  const createMutation = useMutation(createLoan, {
    onSuccess: () => {
      queryClient.invalidateQueries(['loans']);
      toast.success('Loan created successfully');
      setIsCreateModalOpen(false);
      setFormData({
        customerId: '',
        principalAmount: '',
        interestRate: '',
        tenure: '',
        processingFee: '',
        disbursementDate: '',
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create loan');
    },
  });

  const updateMutation = useMutation(
    ({ id, data }) => updateLoan(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['loans']);
        toast.success('Loan updated successfully');
        setEditingLoan(null);
        setFormData({
          customerId: '',
          principalAmount: '',
          interestRate: '',
          tenure: '',
          processingFee: '',
          disbursementDate: '',
        });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update loan');
      },
    }
  );

  const approveMutation = useMutation(approveLoan, {
    onSuccess: () => {
      queryClient.invalidateQueries(['loans']);
      toast.success('Loan approved successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve loan');
    },
  });

  const rejectMutation = useMutation(rejectLoan, {
    onSuccess: () => {
      queryClient.invalidateQueries(['loans']);
      toast.success('Loan rejected successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject loan');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingLoan) {
      updateMutation.mutate({ id: editingLoan.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (loan) => {
    setEditingLoan(loan);
    setFormData({
      customerId: loan.customerId,
      principalAmount: loan.principalAmount,
      interestRate: loan.interestRate,
      tenure: loan.tenure,
      processingFee: loan.processingFee,
      disbursementDate: loan.disbursementDate,
    });
    setIsCreateModalOpen(true);
  };

  const handleApprove = (loanId) => {
    if (window.confirm('Are you sure you want to approve this loan?')) {
      approveMutation.mutate(loanId);
    }
  };

  const handleReject = (loanId) => {
    if (window.confirm('Are you sure you want to reject this loan?')) {
      rejectMutation.mutate(loanId);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Loans' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'disbursed', label: 'Disbursed' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create Loan</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loans?.totalApplications || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{loans?.pendingApproval || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disbursed This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(loans?.disbursedThisMonth || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loans?.activeLoans || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disbursed Loans by Branch & Date</CardTitle>
          <div className="mt-6 space-y-4">
            {/* Search and Filter Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Loan ID or Customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1741FF] outline-none"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1741FF] outline-none"
                >
                  <option value="">All Branches</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1741FF] outline-none"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading loans...</div>
          ) : !loans?.data || loans.data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No loans found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loan ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Disbursement Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loans.data.map((loan) => (
                    <tr key={loan._id || loan.loanId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {loan.loanId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{loan.customerName || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{loan.principal?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {loan.metadata?.branch || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(loan.disbursementDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          loan.status === 'disbursed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {loans?.pagination && (
            <Pagination
              pagination={loans.pagination}
              onPageChange={(p) => setCurrentPage(p)}
            />
          )}
        </CardContent>
      </Card>

      {isCreateModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                      Customer ID
                    </label>
                    <Input
                      id="customerId"
                      name="customerId"
                      type="text"
                      required
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="principalAmount" className="block text-sm font-medium text-gray-700">
                      Principal Amount
                    </label>
                    <Input
                      id="principalAmount"
                      name="principalAmount"
                      type="number"
                      required
                      value={formData.principalAmount}
                      onChange={(e) => setFormData({ ...formData, principalAmount: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
                      Interest Rate (%)
                    </label>
                    <Input
                      id="interestRate"
                      name="interestRate"
                      type="number"
                      step="0.01"
                      required
                      value={formData.interestRate}
                      onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="tenure" className="block text-sm font-medium text-gray-700">
                      Tenure (months)
                    </label>
                    <Input
                      id="tenure"
                      name="tenure"
                      type="number"
                      required
                      value={formData.tenure}
                      onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="processingFee" className="block text-sm font-medium text-gray-700">
                      Processing Fee
                    </label>
                    <Input
                      id="processingFee"
                      name="processingFee"
                      type="number"
                      required
                      value={formData.processingFee}
                      onChange={(e) => setFormData({ ...formData, processingFee: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="disbursementDate" className="block text-sm font-medium text-gray-700">
                      Disbursement Date
                    </label>
                    <Input
                      id="disbursementDate"
                      name="disbursementDate"
                      type="date"
                      required
                      value={formData.disbursementDate}
                      onChange={(e) => setFormData({ ...formData, disbursementDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                    className="w-full sm:ml-3 sm:w-auto"
                  >
                    {editingLoan ? 'Update' : 'Create'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingLoan(null);
                      setFormData({
                        customerId: '',
                        principalAmount: '',
                        interestRate: '',
                        tenure: '',
                        processingFee: '',
                        disbursementDate: '',
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
