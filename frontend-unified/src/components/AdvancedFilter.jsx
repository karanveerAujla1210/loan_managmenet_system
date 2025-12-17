import { useState } from 'react';
import { Filter, X, Calendar, DollarSign, Users, FileText } from 'lucide-react';

const AdvancedFilter = ({ onFilterChange, onClose }) => {
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    amountRange: { min: '', max: '' },
    status: [],
    bucket: [],
    region: '',
    agentId: '',
    riskLevel: []
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      dateRange: { start: '', end: '' },
      amountRange: { min: '', max: '' },
      status: [],
      bucket: [],
      region: '',
      agentId: '',
      riskLevel: []
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const statusOptions = ['pending', 'approved', 'disbursed', 'active', 'closed', 'npa'];
  const bucketOptions = ['current', 'X', 'Y', 'M1', 'M2', 'M3', 'NPA'];
  const riskLevels = ['Low', 'Medium', 'High'];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Advanced Filters
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Date Range
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Start date"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="End date"
            />
          </div>
        </div>

        {/* Amount Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="h-4 w-4 inline mr-1" />
            Amount Range
          </label>
          <div className="space-y-2">
            <input
              type="number"
              value={filters.amountRange.min}
              onChange={(e) => handleFilterChange('amountRange', { ...filters.amountRange, min: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Min amount"
            />
            <input
              type="number"
              value={filters.amountRange.max}
              onChange={(e) => handleFilterChange('amountRange', { ...filters.amountRange, max: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Max amount"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="h-4 w-4 inline mr-1" />
            Loan Status
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {statusOptions.map(status => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={(e) => {
                    const newStatus = e.target.checked
                      ? [...filters.status, status]
                      : filters.status.filter(s => s !== status);
                    handleFilterChange('status', newStatus);
                  }}
                  className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bucket */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Bucket
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {bucketOptions.map(bucket => (
              <label key={bucket} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.bucket.includes(bucket)}
                  onChange={(e) => {
                    const newBucket = e.target.checked
                      ? [...filters.bucket, bucket]
                      : filters.bucket.filter(b => b !== bucket);
                    handleFilterChange('bucket', newBucket);
                  }}
                  className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{bucket}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region
          </label>
          <select
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Regions</option>
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="east">East</option>
            <option value="west">West</option>
            <option value="central">Central</option>
          </select>
        </div>

        {/* Risk Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Level
          </label>
          <div className="space-y-2">
            {riskLevels.map(level => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.riskLevel.includes(level)}
                  onChange={(e) => {
                    const newRiskLevel = e.target.checked
                      ? [...filters.riskLevel, level]
                      : filters.riskLevel.filter(r => r !== level);
                    handleFilterChange('riskLevel', newRiskLevel);
                  }}
                  className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{level}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Clear All
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilter;
