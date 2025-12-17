import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, AlertTriangle, DollarSign, Loader, BarChart3, X } from 'lucide-react';
import toast from 'react-hot-toast';
import * as loansService from '../services/loans';
import * as reassignmentService from '../services/reassignment';

/**
 * MANAGER SUPERVISION DASHBOARD
 * 
 * What manager sees:
 * - Portfolio health (buckets, overdue amount, slippage)
 * - Collector performance (calls made, collections, touch rate)
 * - Escalations (legal inflow, high-value cases)
 * - Interventions (reassign, prioritize, review)
 * 
 * Manager works on:
 * - List view, not case-by-case
 * - Trends & patterns
 * - Team performance
 * - Decisions
 */

export default function ManagerSupervision() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today'); // today, week, month
  const [selectedLoanForReassign, setSelectedLoanForReassign] = useState(null);
  const [newCollectorId, setNewCollectorId] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [reassigning, setReassigning] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const data = await loansService.getLoans();
      setLoans(data?.data || []);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReassignCase = async () => {
    if (!selectedLoanForReassign || !newCollectorId) {
      toast.error('Please select collector');
      return;
    }

    try {
      setReassigning(true);
      const result = await reassignmentService.reassignCase(
        selectedLoanForReassign.loanId,
        newCollectorId,
        reassignReason
      );

      if (result.success) {
        toast.success(`✅ Case reassigned successfully`);
        setSelectedLoanForReassign(null);
        setNewCollectorId('');
        setReassignReason('');
      } else {
        toast.error(result.error || 'Reassignment failed');
      }
    } catch (err) {
      toast.error('Error reassigning case');
      console.error(err);
    } finally {
      setReassigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const disbursedLoans = loans.filter(l => l.status === 'disbursed');

  // Bucket distribution
  const bucketStats = {
    'current': disbursedLoans.filter(l => !l.dpd || l.dpd === 0).length,
    '1-7': disbursedLoans.filter(l => l.dpd > 0 && l.dpd <= 7).length,
    '8-15': disbursedLoans.filter(l => l.dpd > 7 && l.dpd <= 15).length,
    '16-22': disbursedLoans.filter(l => l.dpd > 15 && l.dpd <= 22).length,
    '23-29': disbursedLoans.filter(l => l.dpd > 22 && l.dpd <= 29).length,
    '30-60': disbursedLoans.filter(l => l.dpd > 29 && l.dpd <= 60).length,
    '60-90': disbursedLoans.filter(l => l.dpd > 60 && l.dpd <= 90).length,
    '90+': disbursedLoans.filter(l => l.dpd > 90).length,
  };

  // Financial metrics
  const totalDisbursed = disbursedLoans.reduce((sum, l) => sum + (l.loanAmount || 0), 0);
  const totalPaid = disbursedLoans.reduce((sum, l) => sum + (l.paidAmount || 0), 0);
  const totalOutstanding = disbursedLoans.reduce((sum, l) => sum + (l.remainingAmount || 0), 0);
  const overdueAmount = disbursedLoans
    .filter(l => l.dpd > 0)
    .reduce((sum, l) => sum + (l.remainingAmount || 0), 0);

  // Performance metrics
  const totalOverdue = Object.values(bucketStats).slice(1).reduce((a, b) => a + b, 0);
  const npaRatio = (totalOverdue / disbursedLoans.length * 100).toFixed(2);
  const collectionRate = (totalPaid / totalDisbursed * 100).toFixed(2);

  // Slippage (new defaults)
  const slippage30Plus = bucketStats['30-60'] + bucketStats['60-90'] + bucketStats['90+'];
  const slippage90Plus = bucketStats['90+'];

  const kpis = [
    {
      label: 'Total Portfolio',
      value: disbursedLoans.length,
      subtext: `₹${(totalDisbursed / 10000000).toFixed(1)}Cr`,
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Overdue Cases (1+)',
      value: totalOverdue,
      subtext: `${npaRatio}% NPA`,
      icon: AlertTriangle,
      color: 'red',
    },
    {
      label: 'Outstanding Amount',
      value: `₹${(totalOutstanding / 100000).toFixed(1)}L`,
      subtext: `Overdue: ₹${(overdueAmount / 100000).toFixed(1)}L`,
      icon: DollarSign,
      color: 'orange',
    },
    {
      label: 'Collection Rate',
      value: `${collectionRate}%`,
      subtext: `₹${(totalPaid / 100000).toFixed(1)}L collected`,
      icon: TrendingUp,
      color: 'green',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">👔 Manager Supervision</h1>
        <p className="text-gray-600 mt-1">Portfolio health, team performance, escalations</p>
      </div>

      {/* Time Range Filter */}
      <div className="flex space-x-2">
        {['today', 'week', 'month'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range === 'today' ? 'Today' : range === 'week' ? 'This Week' : 'This Month'}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">{kpi.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{kpi.subtext}</p>
                </div>
                <div className={`p-3 rounded-lg ${
                  kpi.color === 'blue' ? 'bg-blue-100' :
                  kpi.color === 'red' ? 'bg-red-100' :
                  kpi.color === 'orange' ? 'bg-orange-100' :
                  'bg-green-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    kpi.color === 'blue' ? 'text-blue-600' :
                    kpi.color === 'red' ? 'text-red-600' :
                    kpi.color === 'orange' ? 'text-orange-600' :
                    'text-green-600'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Alerts */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-red-900">⚠️ Critical Alerts</h3>
            <ul className="mt-3 space-y-2 text-sm text-red-800">
              <li>🔴 <strong>{slippage30Plus} cases</strong> in 30-90+ DPD — Immediate intervention needed</li>
              <li>🔴 <strong>{slippage90Plus} cases</strong> ready for legal action — Process immediately</li>
              <li>📊 NPA Ratio: <strong>{npaRatio}%</strong> — Monitor closely</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bucket Waterfall */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Bucket Waterfall</h2>
        <div className="space-y-4">
          {[
            { label: 'Current (0 DPD)', count: bucketStats['current'], color: 'bg-green-500' },
            { label: '1-7 DPD', count: bucketStats['1-7'], color: 'bg-blue-500' },
            { label: '8-15 DPD', count: bucketStats['8-15'], color: 'bg-yellow-500' },
            { label: '16-22 DPD', count: bucketStats['16-22'], color: 'bg-orange-500' },
            { label: '23-29 DPD', count: bucketStats['23-29'], color: 'bg-orange-600' },
            { label: '30-60 DPD', count: bucketStats['30-60'], color: 'bg-red-500' },
            { label: '60-90 DPD', count: bucketStats['60-90'], color: 'bg-red-600' },
            { label: '90+ DPD (LEGAL)', count: bucketStats['90+'], color: 'bg-red-900' },
          ].map((bucket, idx) => {
            const percentage = (bucket.count / disbursedLoans.length * 100).toFixed(1);
            return (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{bucket.label}</span>
                  <span className="text-sm font-bold text-gray-900">{bucket.count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${bucket.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collector Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Collector Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Collector</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Cases Assigned</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Collections (₹)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Collection Rate</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">30+ DPD</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">90+ DPD</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { name: 'Raj Kumar', assigned: 450, collected: 1250000, rate: 68, dpd30: 45, dpd90: 12 },
                { name: 'Priya Singh', assigned: 420, collected: 1100000, rate: 65, dpd30: 38, dpd90: 8 },
                { name: 'Amit Patel', assigned: 380, collected: 920000, rate: 58, dpd30: 62, dpd90: 15 },
              ].map((collector, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{collector.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{collector.assigned}</td>
                  <td className="px-6 py-4 text-sm font-medium">₹{(collector.collected / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      collector.rate > 65 ? 'bg-green-100 text-green-800' :
                      collector.rate > 55 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {collector.rate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-orange-600 font-medium">{collector.dpd30}</td>
                  <td className="px-6 py-4 text-sm text-red-600 font-bold">{collector.dpd90}</td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escalation Cases */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">⚡ Escalation Required</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Loan ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">DPD</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {disbursedLoans
                .filter(l => l.dpd > 90)
                .slice(0, 10)
                .map((loan, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{loan.loanId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{loan.customerName}</td>
                    <td className="px-6 py-4 text-sm font-medium">₹{(loan.remainingAmount / 100000).toFixed(1)}L</td>
                    <td className="px-6 py-4 text-sm font-bold text-red-600">{loan.dpd}+</td>
                    <td className="px-6 py-4 text-sm text-red-600">Ready for legal action</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision & Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">Manager Actions Available</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => {
              // Open reassignment for a specific high-overdue case
              const highOverdueCase = loans.find(l => l.dpd > 30 && l.status === 'disbursed');
              if (highOverdueCase) {
                setSelectedLoanForReassign(highOverdueCase);
              }
            }}
            className="px-4 py-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 text-sm font-medium text-blue-900"
          >
            👤 Reassign Cases
          </button>
          <button className="px-4 py-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 text-sm font-medium text-blue-900">
            🚀 Prioritize High-Value
          </button>
          <button className="px-4 py-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 text-sm font-medium text-blue-900">
            ⚖️ Send to Legal
          </button>
        </div>
      </div>

      {/* Reassignment Modal */}
      {selectedLoanForReassign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">👤 Reassign Case</h2>
              <button
                onClick={() => setSelectedLoanForReassign(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Case Details</p>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  <p className="font-bold text-gray-900">{selectedLoanForReassign.loanId}</p>
                  <p className="text-sm text-gray-600">{selectedLoanForReassign.customerName}</p>
                  <p className="text-sm text-red-600 font-bold">{selectedLoanForReassign.dpd} DPD</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Collector</label>
                <select
                  value={newCollectorId}
                  onChange={(e) => setNewCollectorId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select collector...</option>
                  <option value="collector1">Raj Kumar</option>
                  <option value="collector2">Priya Singh</option>
                  <option value="collector3">Amit Patel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Reassignment</label>
                <textarea
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  placeholder="e.g., Load balancing, Collector reassignment, Special handling needed..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="3"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setSelectedLoanForReassign(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReassignCase}
                  disabled={reassigning || !newCollectorId}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {reassigning ? 'Reassigning...' : 'Confirm Reassignment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
