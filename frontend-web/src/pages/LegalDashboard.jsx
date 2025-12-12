import { useState, useEffect } from 'react';
import { Scale, Calendar, User, DollarSign } from 'lucide-react';
import analyticsService from '../services/analyticsService';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';

const LegalDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalLegalLoans: 0,
    totalLegalAmount: 0,
    casesByStage: [],
    avgCaseAge: 0,
    loans: []
  });

  useEffect(() => {
    loadLegalData();
  }, []);

  const loadLegalData = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getLegal();
      setData(response.data);
    } catch (error) {
      console.error('Error loading legal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Loan ID',
      accessor: 'loanId',
      cell: (value) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    {
      header: 'Customer',
      accessor: 'customerId',
      cell: (customer) => (
        <div>
          <p className="font-medium">{customer?.firstName} {customer?.lastName}</p>
          <p className="text-sm text-gray-500">{customer?.phone}</p>
        </div>
      )
    },
    {
      header: 'Outstanding',
      accessor: 'outstandingAmount',
      cell: (value) => (
        <span className="font-semibold">
          ₹{new Intl.NumberFormat('en-IN').format(value)}
        </span>
      )
    },
    {
      header: 'DPD',
      accessor: 'dpd',
      cell: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value > 180 ? 'bg-red-100 text-red-800' :
          value > 90 ? 'bg-orange-100 text-orange-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value} days
        </span>
      )
    },
    {
      header: 'Bucket',
      accessor: 'collectionBucket',
      cell: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'NPA' ? 'bg-red-100 text-red-800' :
          value === 'M3' ? 'bg-orange-100 text-orange-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      header: 'Escalation',
      accessor: 'escalationLevel',
      cell: (value) => (
        <span className="text-sm">
          Level {value}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Legal Dashboard" 
        subtitle="Legal cases and escalated loans"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-red-50 border-2 border-red-200 text-red-900 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <Scale className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium opacity-75">Total Legal Cases</p>
              <p className="text-2xl font-bold">{data.totalLegalLoans}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border-2 border-orange-200 text-orange-900 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium opacity-75">Legal Amount</p>
              <p className="text-2xl font-bold">
                ₹{new Intl.NumberFormat('en-IN').format(data.totalLegalAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 text-purple-900 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium opacity-75">Avg Case Age</p>
              <p className="text-2xl font-bold">{Math.round(data.avgCaseAge)} days</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 text-blue-900 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium opacity-75">Active Stages</p>
              <p className="text-2xl font-bold">{data.casesByStage.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cases by Stage */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Cases by Stage</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.casesByStage.map((stage, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 capitalize">{stage._id}</p>
              <p className="text-2xl font-bold text-gray-900">{stage.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Loans Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Legal Cases</h3>
        </div>
        <Table 
          columns={columns}
          data={data.loans}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default LegalDashboard;