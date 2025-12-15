import { useState, useEffect } from 'react';
import { Phone, MessageSquare, Clock, AlertCircle, CheckCircle, Filter, Loader, Search, Download, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import * as loansService from '../services/loans';
import * as paymentsService from '../services/payments';

const dpdColors = {
  'current': 'bg-green-50 text-green-700 border-green-200',
  '1-7': 'bg-blue-50 text-blue-700 border-blue-200',
  '8-15': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  '16-22': 'bg-orange-50 text-orange-700 border-orange-200',
  '23-29': 'bg-orange-100 text-orange-800 border-orange-200',
  '30+': 'bg-red-50 text-red-700 border-red-200',
  '60+': 'bg-red-100 text-red-800 border-red-200',
  '90+': 'bg-red-200 text-red-900 border-red-300',
  '120+': 'bg-red-300 text-red-900 border-red-400',
};

const bucketLabels = {
  'current': '0 DPD',
  '1-7': '1-7 DPD',
  '8-15': '8-15 DPD',
  '16-22': '16-22 DPD',
  '23-29': '23-29 DPD',
  '30+': '30-60 DPD',
  '60+': '60-90 DPD',
  '90+': '90-120 DPD',
  '120+': '120+ DPD',
};

export default function ModernCollections() {
  const [allCases, setAllCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [filterBucket, setFilterBucket] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    fetchAllCases();
  }, []);

  useEffect(() => {
    filterAndSearch();
  }, [allCases, filterBucket, searchTerm]);

  const fetchAllCases = async () => {
    try {
      setLoading(true);
      const data = await loansService.getLoans();
      const loans = (data?.data || []).filter(l => l.status === 'disbursed');
      
      const cases = loans.map((loan) => ({
        id: loan._id || loan.id,
        customerId: loan.customerId,
        customer: loan.customerName || loan.customerId,
        loanId: loan.loanId,
        dpdBucket: loan.bucket || 'current',
        amount: loan.loanAmount || 0,
        lastPayment: loan.lastPaymentDate ? new Date(loan.lastPaymentDate).toLocaleDateString() : 'N/A',
        nextDue: loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A',
        callStatus: loan.collectionStatus || 'pending',
        promiseToPayDate: loan.promiseToPayDate || null,
        remainingAmount: loan.remainingAmount || (loan.loanAmount - (loan.paidAmount || 0)),
        dpd: loan.dpd || 0,
        status: loan.status,
        branch: loan.branch || 'All',
        mobileNo: loan.mobileNo || 'N/A',
        email: loan.email || 'N/A',
        callLogs: loan.callLogs || [],
      }));
      
      setAllCases(cases);
      if (cases.length > 0) {
        setSelectedCase(cases[0]);
      }
    } catch (err) {
      console.error('Error fetching collections:', err);
      setAllCases([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearch = () => {
    let filtered = allCases;

    // Filter by DPD bucket
    if (filterBucket !== 'all') {
      filtered = filtered.filter(c => c.dpdBucket === filterBucket);
    }

    // Search by customer name, loan ID, mobile
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.customer.toLowerCase().includes(search) ||
        c.loanId.toLowerCase().includes(search) ||
        c.mobileNo.includes(search)
      );
    }

    setFilteredCases(filtered);
  };

  const getDPDCounts = () => {
    const buckets = {};
    allCases.forEach(c => {
      buckets[c.dpdBucket] = (buckets[c.dpdBucket] || 0) + 1;
    });
    return buckets;
  };

  const handlePaymentSubmit = async () => {
    if (!selectedCase || !paymentAmount) {
      toast.error('Please enter amount');
      return;
    }

    try {
      setPaymentLoading(true);
      
      // Use new real-time payment recording function
      const result = await paymentsService.recordPaymentWithUpdate(
        selectedCase.loanId,
        {
          amount: parseFloat(paymentAmount),
          paymentDate: paymentDate,
          paymentMode: 'manual',
          remarks: `Payment recorded on ${paymentDate}`
        }
      );

      // Show notification about payment and bucket change
      if (result.notification.type === 'bucket_change') {
        toast.success(
          `💰 Payment recorded!\n${result.notification.oldBucket} → ${result.notification.newBucket}`,
          { duration: 5 }
        );
      } else {
        toast.success('💰 Payment recorded successfully!', { duration: 4 });
      }

      setPaymentAmount('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      
      // Refresh collections data
      fetchAllCases();
      
      // Auto-close panel if fully paid
      if (result.updatedLoan.remainingAmount <= 0) {
        setTimeout(() => {
          setSelectedCase(null);
          toast.success('✅ Loan fully paid! Case closed.', { duration: 5 });
        }, 2000);
      }
    } catch (err) {
      console.error('Error recording payment:', err);
      toast.error(err.message || 'Failed to record payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Loan ID', 'Customer', 'Mobile', 'Amount', 'Remaining', 'DPD', 'Bucket', 'Status', 'Last Payment', 'Next Due'],
      ...filteredCases.map(c => [
        c.loanId,
        c.customer,
        c.mobileNo,
        c.amount,
        c.remainingAmount,
        c.dpd,
        c.dpdBucket,
        c.callStatus,
        c.lastPayment,
        c.nextDue
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `collections_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const dpdCounts = getDPDCounts();
  const allBuckets = ['current', '1-7', '8-15', '16-22', '23-29', '30+', '60+', '90+', '120+'];
  const activeBuckets = allBuckets.filter(b => dpdCounts[b] > 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collections Monitoring</h1>
          <p className="text-gray-600 mt-1">Track {allCases.length} disbursed cases with real-time DPD monitoring</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* DPD Summary Cards - All Buckets */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2">
        {allBuckets.map((bucket) => (
          <div
            key={bucket}
            onClick={() => setFilterBucket(bucket)}
            className={`rounded-lg p-3 cursor-pointer transition ${
              filterBucket === bucket ? 'ring-2 ring-blue-500' : ''
            } ${dpdColors[bucket]}`}
          >
            <p className="text-xs font-medium">{bucketLabels[bucket]}</p>
            <p className="text-xl font-bold">{dpdCounts[bucket] || 0}</p>
          </div>
        ))}
        <div
          onClick={() => setFilterBucket('all')}
          className={`rounded-lg p-3 cursor-pointer transition bg-gray-50 border border-gray-200 ${
            filterBucket === 'all' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <p className="text-xs font-medium">All Cases</p>
          <p className="text-xl font-bold">{allCases.length}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name, loan ID, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            {viewMode === 'grid' ? 'List' : 'Grid'}
          </button>
        </div>
      </div>

      {/* Cases Table/Grid View */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Loan ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Remaining</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">DPD</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Bucket</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Last Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Next Due</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCases.slice(0, 50).map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{caseItem.loanId}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{caseItem.customer}</td>
                    <td className="px-4 py-3 text-sm font-medium">₹{caseItem.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-medium">₹{caseItem.remainingAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-bold">{caseItem.dpd}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${dpdColors[caseItem.dpdBucket]}`}>
                        {bucketLabels[caseItem.dpdBucket]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{caseItem.lastPayment}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{caseItem.nextDue}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedCase(caseItem)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCases.length > 50 && (
            <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
              Showing 50 of {filteredCases.length} cases. Export CSV to view all.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.slice(0, 30).map((caseItem) => (
            <div
              key={caseItem.id}
              onClick={() => setSelectedCase(caseItem)}
              className={`p-4 rounded-lg border cursor-pointer transition ${
                selectedCase?.id === caseItem.id
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{caseItem.loanId}</p>
                  <p className="text-sm text-gray-600">{caseItem.customer}</p>
                </div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${dpdColors[caseItem.dpdBucket]}`}>
                  {caseItem.dpd} DPD
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{caseItem.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium">₹{caseItem.remainingAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Payment:</span>
                  <span>{caseItem.lastPayment}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case Detail Panel */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedCase.customer}</h2>
                <p className="text-sm text-gray-600">{selectedCase.loanId}</p>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Case Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Loan Amount</p>
                  <p className="text-2xl font-bold text-gray-900">₹{selectedCase.amount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Remaining Amount</p>
                  <p className="text-2xl font-bold text-gray-900">₹{selectedCase.remainingAmount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">DPD</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">{selectedCase.dpd}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${dpdColors[selectedCase.dpdBucket]}`}>
                      {bucketLabels[selectedCase.dpdBucket]}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Mobile</p>
                  <p className="text-lg font-medium text-gray-900">{selectedCase.mobileNo}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Last Payment Date</p>
                  <p className="font-medium text-gray-900">{selectedCase.lastPayment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Next Due Date</p>
                  <p className="font-medium text-gray-900">{selectedCase.nextDue}</p>
                </div>
              </div>

              {/* Payment Recording */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Payment</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Enter payment amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={!paymentAmount || paymentLoading}
                    className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {paymentLoading ? 'Recording...' : 'Record Payment'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Make Call</span>
                </button>
                <button onClick={() => setSelectedCase(null)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
