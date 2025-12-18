import React, { useState } from 'react';
import { ChevronUpDownIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../lib/format';

export default function EnhancedDataTable({
  columns,
  data,
  loading = false,
  onRowClick = null,
  striped = true,
  hoverable = true,
  compact = false
}) {
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const sortedData = getSortedData();

  const renderCell = (value, column) => {
    if (column.render) {
      return column.render(value);
    }

    if (typeof value === 'boolean') {
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Yes' : 'No'}
        </span>
      );
    }

    if (typeof value === 'number' && column.type === 'currency') {
      return formatCurrency(value);
    }

    if (typeof value === 'number' && column.type === 'percentage') {
      return `${value.toFixed(2)}%`;
    }

    return value || '-';
  };

  return (
    <div className=\"rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden\">
      {/* Table */}
      <div className=\"overflow-x-auto\">
        <table className=\"w-full\">
          {/* Header */}
          <thead>
            <tr className=\"border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50\">
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                  }`}
                >
                  <div className=\"flex items-center space-x-2\">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className=\"text-gray-400\">
                        {sortConfig?.key === column.key ? (
                          sortConfig?.direction === 'asc' ? (
                            <ChevronUpIcon className=\"w-4 h-4\" />
                          ) : (
                            <ChevronDownIcon className=\"w-4 h-4\" />
                          )
                        ) : (
                          <ChevronUpDownIcon className=\"w-4 h-4 opacity-50\" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className=\"px-6 py-8 text-center\">
                  <div className=\"flex justify-center\">
                    <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600\"></div>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className=\"px-6 py-8 text-center text-gray-500\">
                  No data available
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-gray-100 transition-colors ${
                    striped && idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } ${
                    hoverable ? 'hover:bg-blue-50 cursor-pointer' : ''
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={`${idx}-${column.key}`}
                      className={`px-6 ${compact ? 'py-2' : 'py-4'} text-sm text-gray-900`}
                    >
                      {renderCell(row[column.key], column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {sortedData.length > 0 && (
        <div className=\"px-6 py-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-600\">
          Showing {sortedData.length} of {data.length} records
        </div>
      )}
    </div>
  );
}
