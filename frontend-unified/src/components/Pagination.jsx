import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination) return null;

  const { page, pages } = pagination;

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="text-sm text-gray-600">
        Page <span className="font-medium">{page}</span> of <span className="font-medium">{pages}</span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="inline-flex items-center px-3 py-2 rounded-md bg-white border text-sm text-gray-700 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Prev
        </button>

        <button
          onClick={() => onPageChange(Math.min(pages, page + 1))}
          disabled={page >= pages}
          className="inline-flex items-center px-3 py-2 rounded-md bg-white border text-sm text-gray-700 disabled:opacity-50"
        >
          Next <ChevronRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
