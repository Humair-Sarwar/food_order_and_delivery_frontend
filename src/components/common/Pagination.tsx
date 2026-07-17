import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  from: number;
  to: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
  onEntriesPerPageChange?: (entries: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1, // Safe default state fallback
  totalPages,
  onPageChange = () => {}, // Safe default callback
  totalEntries,
  entriesPerPage = 10, // Safe default dynamic mapping
  onEntriesPerPageChange,
  from,
  to
}) => {
  // if (totalPages <= 1) return null;

  // Logic to calculate layout pages windows numbers array
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always include start indicator entry page
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push('ellipsis-start');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('ellipsis-end');
      }

      // Always include final terminal page route pointer
      pages.push(totalPages);
    }

    return pages;
  };


  // Dropdown values dataset
  const rowsOptions = [1, 15, 25, 30, 50, 60];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-gray-100 bg-white mt-4 rounded-2xl shadow-sm">
      
      {/* 1. DATA ENTRIES COUNTER META (Left Section) */}
      {totalEntries && entriesPerPage ? (
        <span className="text-[11px] font-bold text-gray-400 text-center sm:text-left">
          Showing <span className="text-gray-700 font-black">{from}</span> to{' '}
          <span className="text-gray-700 font-black">{to}</span> of{' '}
          <span className="text-gray-700 font-black">{totalEntries}</span> Entries
        </span>
      ) : (
        <div className="hidden sm:block" />
      )}

      {/* 2. DROPDOWN & COMPACT NAVIGATION CONTROL SWITCHES (Right Side Container) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 self-center sm:self-auto">
        
        

        {/* COMPACT NAVIGATION CONTROL SWITCHES */}
        <div className="flex items-center gap-1.5">
          
          {/* PREVIOUS PAGE ACCENT HOOK */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 px-2.5 inline-flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* DYNAMIC NUMBER TOKENS LOOP GENERATOR */}
          {getPageNumbers().map((page, idx) => {
            if (typeof page === 'string') {
              return (
                <div 
                  key={`ellipsis-${idx}`} 
                  className="h-8 w-8 inline-flex items-center justify-center text-gray-400"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </div>
              );
            }

            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 inline-flex items-center justify-center rounded-xl text-xs transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-orange-500 text-white font-black shadow-sm shadow-orange-500/20'
                    : 'bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* NEXT PAGE ACCENT HOOK */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 px-2.5 inline-flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

        {/* ROWS PER PAGE SELECTOR DROPDOWN */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">Rows per page:</span>
          <div className="relative">
            <select
              value={entriesPerPage}
              onChange={(e) => onEntriesPerPageChange && onEntriesPerPageChange(Number(e.target.value))}
              className="appearance-none h-8 pl-3 pr-8 text-[11px] font-black text-gray-600 bg-white border border-gray-200 rounded-xl outline-none hover:bg-gray-50 focus:border-orange-500 transition-all cursor-pointer min-w-[65px]"
            >
              {rowsOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Pagination;