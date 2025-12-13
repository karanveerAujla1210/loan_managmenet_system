import React from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Filter } from 'lucide-react';

const FilterBar = ({
  searchTerm,
  onSearch,
  status,
  onStatusChange,
  pageSize,
  onPageSizeChange,
  children
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-1">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {onStatusChange && (
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="disbursed">Disbursed</option>
            <option value="overdue">Overdue</option>
          </select>
        )}

        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        )}

        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>

        {children}
      </div>
    </div>
  );
};

export default FilterBar;
