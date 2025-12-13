import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getLoans, createLoan, updateLoan, approveLoan, rejectLoan } from '../../services/loans';
import { formatCurrency } from '../../lib/format';
import FilterBar from '../../components/FilterBar';
import Pagination from '../../components/Pagination';
import { toast } from 'react-hot-toast';
import { FileText, DollarSign, Users, AlertCircle } from 'lucide-react';

const Loans = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [formData, setFormData] = useState({
    customerId: '',
    principalAmount: '',
    interestRate: '',
    tenure: '',
    processingFee: '',
    disbursementDate: '',
  });

  const queryClient = useQueryClient();

  const { data: loans, isLoading } = useQuery(
    ['loans', { search: searchTerm, status: statusFilter, page: currentPage, limit: pageSize }],
    () => getLoans({ search: searchTerm, status: statusFilter, page: currentPage, limit: pageSize }),
    {
      keepPreviousData: true,
    }
  );

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
          <CardTitle>Loan Applications</CardTitle>
          <div className="mt-4">
            <FilterBar
              searchTerm={searchTerm}
              onSearch={(v) => setSearchTerm(v)}
              status={statusFilter}
              onStatusChange={(v) => setStatusFilter(v)}
              pageSize={pageSize}
              onPageSizeChange={(v) => setPageSize(v)}
            />
          </div>
        </CardHeader>
        <CardContent>
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
                    Interest Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans?.data?.map((loan) => (
                  <tr key={loan.id} tabIndex={0} className="focus:outline-none focus:ring-2 focus:ring-indigo-200" onKeyDown={(e) => { if (e.key === 'Enter') { /* noop - row clickable handlers could go here */ } }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.loanId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{loan.customerName}</div>
                      <div className="text-sm text-gray-500">{loan.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(loan.principalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.interestRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.tenure} months
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        loan.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : loan.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : loan.status === 'disbursed'
                          ? 'bg-blue-100 text-blue-800'
                          : loan.status === 'closed'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {loan.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="mr-2"
                            onClick={() => handleApprove(loan.id)}
                            disabled={approveMutation.isLoading}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(loan.id)}
                            disabled={rejectMutation.isLoading}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {loan.status === 'approved' && (
                        <Button size="sm">Disburse</Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-2"
                        onClick={() => handleEdit(loan)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!loans?.data || loans?.data?.length === 0) && (
            <div className="empty-state">
              <p className="text-gray-500">No loan applications found.</p>
            </div>
          )}
        </CardContent>

        <Pagination
          pagination={loans?.pagination}
          onPageChange={(p) => setCurrentPage(p)}
        />
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
