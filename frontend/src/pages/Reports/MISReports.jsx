import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { misService } from '../../services';

const MISReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('DAILY');

  useEffect(() => {
    fetchMISData();
  }, []);

  const fetchMISData = async () => {
    try {
      setLoading(true);
      const misData = await misService.getMISDashboard();
      setData(misData);
    } catch (error) {
      toast.error('Failed to load MIS reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MIS reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MIS Reports</h1>
          <p className="text-gray-600 mt-2">Investor & Operations Dashboard</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex border-b">
            {[
              { id: 'DAILY', label: '📊 Daily Operations', icon: 'Daily MIS' },
              { id: 'PORTFOLIO', label: '🎯 Portfolio Health', icon: 'Bucket Distribution' },
              { id: 'ROLLRATE', label: '📈 Roll Rate', icon: 'Loan Movements' },
              { id: 'LEGAL', label: '⚖️ Legal & Loss', icon: 'Legal Cases' },
              { id: 'ECONOMICS', label: '💰 Unit Economics', icon: 'Economics' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-semibold transition border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'DAILY' && (
              <DailyMISSection data={data?.daily} />
            )}
            {activeTab === 'PORTFOLIO' && (
              <PortfolioHealthSection data={data?.health} />
            )}
            {activeTab === 'ROLLRATE' && (
              <RollRateSection data={data?.rollRate} />
            )}
            {activeTab === 'LEGAL' && (
              <LegalLossSection data={data?.legal} />
            )}
            {activeTab === 'ECONOMICS' && (
              <UnitEconomicsSection data={data?.economics} />
            )}
          </div>
        </div>

        {/* Trends Section */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">7-Day Trend</h2>
          <TrendsSection data={data?.trends} />
        </div>
      </div>
    </div>
  );
};

// Daily MIS Section
const DailyMISSection = ({ data }) => {
  if (!data?.metrics) return <p>No data</p>;

  const m = data.metrics;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Report for {new Date(data.dayStart).toLocaleDateString('en-IN')}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <MetricCard
          label="Total Active Loans"
          value={m.totalActiveLoan}
          icon="📋"
          color="blue"
        />
        <MetricCard
          label="Outstanding Amount"
          value={`₹${(m.totalOutstanding || 0).toLocaleString('en-IN')}`}
          icon="💳"
          color="red"
        />
        <MetricCard
          label="Today's Due"
          value={`₹${(m.todaysDue || 0).toLocaleString('en-IN')}`}
          icon="📅"
          color="yellow"
          subtitle={`${m.todaysDueCount} cases`}
        />
        <MetricCard
          label="Today's Collection"
          value={`₹${(m.todaysCollection || 0).toLocaleString('en-IN')}`}
          icon="✓"
          color="green"
          subtitle={`${m.recoveries} transactions`}
        />
        <MetricCard
          label="Collection Efficiency"
          value={`${m.collectionEfficiency}%`}
          icon="📊"
          color="indigo"
        />
        <MetricCard
          label="New Overdues"
          value={m.newOverdues}
          icon="⚠️"
          color="orange"
        />
      </div>

      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mt-8">
        <h3 className="font-bold text-blue-900 mb-3">Key Insights</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Collection Efficiency at {m.collectionEfficiency}% - {'Good progress' || 'Needs attention'}</li>
          <li>• {m.newOverdues} new cases entered overdue status - {'Monitor closely' || 'Under control'}</li>
          <li>• Today's recovery of ₹{(m.todaysCollection || 0).toLocaleString('en-IN')} covers {((m.todaysCollection / m.todaysDue) * 100).toFixed(1)}% of due amount</li>
        </ul>
      </div>
    </div>
  );
};

// Portfolio Health Section
const PortfolioHealthSection = ({ data }) => {
  if (!data?.bucketDistribution) return <p>No data</p>;

  const buckets = data.bucketDistribution;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Snapshot as of {new Date(data.reportDate).toLocaleDateString('en-IN')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-50 rounded-lg border">
          <h3 className="font-bold text-gray-900 mb-4">Portfolio Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Active Loans</span>
              <span className="font-semibold text-gray-900">{data.portfolioSummary.totalActiveLoans}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Outstanding</span>
              <span className="font-semibold text-red-600">
                ₹{(data.portfolioSummary.totalOutstanding || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg border">
          <h3 className="font-bold text-gray-900 mb-4">Health Indicator</h3>
          <div className="space-y-2">
            {['NORMAL', 'EARLY_OVERDUE', 'OVERDUE', 'SEVERE_OVERDUE', 'LONG_OVERDUE', 'LEGAL'].map(bucket => {
              const bucketData = buckets[bucket];
              if (!bucketData) return null;
              return (
                <div key={bucket} className="flex justify-between text-sm">
                  <span className="text-gray-600">{data.portfolioSummary.reportingBuckets[bucket]}</span>
                  <span className="font-semibold text-gray-900">
                    {bucketData.count} loans ({bucketData.percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-bold text-yellow-900 mb-2">At-Risk Portfolio</h3>
        <p className="text-sm text-yellow-800">
          {Object.values(buckets).reduce((sum, b) => sum + (b.count || 0), 0) - (buckets['NORMAL']?.count || 0)} loans
          {' '}
          (₹{Object.values(buckets).reduce((sum, b) => {
            if (b === buckets['NORMAL']) return sum;
            return sum + (b.amount || 0);
          }, 0).toLocaleString('en-IN')}) are in overdue or legal status
        </p>
      </div>
    </div>
  );
};

// Roll Rate Section
const RollRateSection = ({ data }) => {
  if (!data?.rollRatePercentage) return <p>No data</p>;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Analysis from {new Date(data.periodStart).toLocaleDateString('en-IN')} to{' '}
        {new Date(data.periodEnd).toLocaleDateString('en-IN')}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 border">
              <th className="px-4 py-3 text-left font-bold text-gray-900 border">From Bucket</th>
              <th className="px-4 py-3 text-center font-bold text-gray-900 border">Current</th>
              <th className="px-4 py-3 text-center font-bold text-gray-900 border">1–7 DPD</th>
              <th className="px-4 py-3 text-center font-bold text-gray-900 border">8–30 DPD</th>
              <th className="px-4 py-3 text-center font-bold text-gray-900 border">31–60 DPD</th>
              <th className="px-4 py-3 text-center font-bold text-gray-900 border">60+ DPD</th>
              <th className="px-4 py-3 text-center font-bold text-gray-900 border">Legal</th>
            </tr>
          </thead>
          <tbody>
            {['NORMAL', 'EARLY_OVERDUE', 'OVERDUE', 'SEVERE_OVERDUE', 'LONG_OVERDUE', 'LEGAL'].map(fromBucket => (
              <tr key={fromBucket} className="border hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900 border">{fromBucket}</td>
                {['NORMAL', 'EARLY_OVERDUE', 'OVERDUE', 'SEVERE_OVERDUE', 'LONG_OVERDUE', 'LEGAL'].map(toBucket => (
                  <td
                    key={toBucket}
                    className={`px-4 py-3 text-center border ${
                      toBucket === fromBucket ? 'bg-green-50 font-bold text-green-700' : ''
                    }`}
                  >
                    {data.rollRatePercentage[fromBucket]?.[toBucket] || 0}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold text-blue-900 mb-2">Interpretation</h3>
        <p className="text-sm text-blue-800">
          Read rows left-to-right to see where loans from each bucket moved. High diagonal values (staying in same bucket) indicate stability.
          Leftward movement (lower buckets) is good; rightward movement (higher buckets/worse) is concerning.
        </p>
      </div>
    </div>
  );
};

// Legal & Loss Section
const LegalLossSection = ({ data }) => {
  if (!data?.legal) return <p>No data</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetricCard
          label="Legal Cases"
          value={data.legal.totalLegalCases}
          icon="⚖️"
          color="red"
        />
        <MetricCard
          label="Legal Outstanding"
          value={`₹${(data.legal.totalLegalOutstanding || 0).toLocaleString('en-IN')}`}
          icon="💼"
          color="orange"
        />
        <MetricCard
          label="Avg DPD @ Legal"
          value={data.legal.avgDPDLegal}
          icon="📊"
          color="purple"
        />
        <MetricCard
          label="% of Portfolio"
          value={`${data.legal.legalPercentageOfPortfolio}%`}
          icon="⚠️"
          color="red"
        />
      </div>

      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-bold text-red-900 mb-2">Legal & Default Risk</h3>
        <ul className="space-y-2 text-sm text-red-800">
          <li>• {data.legal.totalLegalCases} cases in legal proceedings</li>
          <li>• ₹{(data.legal.totalLegalOutstanding || 0).toLocaleString('en-IN')} locked in legal disputes</li>
          <li>• {data.legal.legalPercentageOfPortfolio}% of portfolio in legal status</li>
          <li>• Average {data.legal.avgDPDLegal} DPD for legal cases (escalation threshold typically 90 DPD)</li>
        </ul>
      </div>
    </div>
  );
};

// Unit Economics Section
const UnitEconomicsSection = ({ data }) => {
  if (!data?.unitEconomics) return <p>No data</p>;

  const ue = data.unitEconomics;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Based on {data.loanCount} active loans
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-4">Revenue per Loan</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-blue-700">Avg Loan Size</p>
              <p className="text-2xl font-bold text-blue-600">₹{(ue.avgLoanSize || 0).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-blue-700">Monthly Interest Yield</p>
              <p className="text-lg font-bold text-blue-600">₹{(ue.avgMonthlyYield || 0).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-blue-700">Upfront Fees & GST</p>
              <p className="text-lg font-bold text-blue-600">₹{(parseFloat(ue.totalUpfrontRevenue) || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-4">Profitability</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-green-700">Avg Interest Earned</p>
              <p className="text-lg font-bold text-green-600">₹{(ue.avgInterestEarned || 0).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-green-700">Collection Cost</p>
              <p className="text-lg font-bold text-red-600">–₹{(ue.costOfCollectionEstimate || 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="pt-3 border-t border-green-300">
              <p className="text-xs text-green-700">Profit Per Loan</p>
              <p className="text-2xl font-bold text-green-700">₹{(ue.profitPerLoan || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-4">Returns</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-purple-700">ROI per Loan</p>
              <p className="text-2xl font-bold text-purple-600">{(ue.roi || 0).toLocaleString('en-IN')}%</p>
            </div>
            <div>
              <p className="text-xs text-purple-700">Break-even: {(ue.avgLoanSize / ue.profitPerLoan).toFixed(1)} months</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Trends Section
const TrendsSection = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-600">No trend data available</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Collection Trend</h3>
        <div className="space-y-2">
          {data.map((day, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">
                Day {idx + 1}
              </span>
              <span className="font-semibold text-gray-900">
                ₹{(day.todaysCollection || 0).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-4">Outstanding Trend</h3>
        <div className="space-y-2">
          {data.map((day, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">
                Day {idx + 1}
              </span>
              <span className="font-semibold text-red-600">
                ₹{(day.totalOutstanding || 0).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ label, value, icon = '', color = 'gray', subtitle = '' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    gray: 'bg-gray-50 border-gray-200 text-gray-600'
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color] || colorClasses.gray}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-gray-600 mt-2">{subtitle}</p>}
    </div>
  );
};

export default MISReports;
