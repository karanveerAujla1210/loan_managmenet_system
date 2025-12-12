import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Table from '../components/Table';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { customerService } from '../services/customerService';
import { loanService } from '../services/loanService';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      const [customerResponse, loansResponse] = await Promise.all([
        customerService.getCustomerById(id),
        loanService.getAllLoans({ customerId: id })
      ]);
      
      setCustomer(customerResponse.data);
      setLoans(loansResponse.data || []);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loanColumns = [
    { key: 'loanId', header: 'Loan ID' },
    { 
      key: 'principal', 
      header: 'Principal',
      render: (value) => `₹${value?.toLocaleString()}`
    },
    { 
      key: 'interestRate', 
      header: 'Interest Rate',
      render: (value) => `${value}%`
    },
    { key: 'tenure', header: 'Tenure (months)' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const variant = value === 'active' ? 'success' : 
                      value === 'closed' ? 'default' : 'warning';
        return <Badge variant={variant}>{value}</Badge>;
      }
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading customer details...</div>
        </div>
      </Layout>
    );
  }

  if (!customer) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Customer not found</h2>
          <Button className="mt-4" onClick={() => navigate('/customers')}>
            Back to Customers
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title={customer.name}
        subtitle="Customer Details"
        action={
          <Button onClick={() => navigate('/customers')}>
            Back to Customers
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Contact Information">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900">{customer.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{customer.email}</p>
            </div>
          </div>
        </Card>

        <Card title="KYC Status">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge variant={customer.kycStatus === 'verified' ? 'success' : 'warning'}>
                  {customer.kycStatus || 'Pending'}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Loan Summary">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Total Loans</label>
              <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Loan History">
        {loans.length > 0 ? (
          <Table
            columns={loanColumns}
            data={loans}
            onRowClick={(loan) => navigate(`/loans/${loan._id}`)}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No loans found for this customer
          </div>
        )}
      </Card>
    </Layout>
  );
};

export default CustomerDetail;