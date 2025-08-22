import React from 'react';

interface PaginationProps {
  totalRecords: number;
  limit: number;
  offset: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalRecords,
  limit,
  offset,
  onPageChange,
  className = ''
}) => {
  // Calculate current page and total pages from API data
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalRecords / limit);
  
  // Don't render if there's only one page or no records
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Handle edge cases first
    if (totalPages <= 7) {
      // If total pages is small, show all pages
      for (let i = 1; i <= totalPages; i++) {
        rangeWithDots.push(i);
      }
      return rangeWithDots;
    }

    // Calculate the range around current page
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add first page
    if (start > 2) {
      rangeWithDots.push(1);
      if (start > 3) {
        rangeWithDots.push('...');
      }
    } else {
      rangeWithDots.push(1);
    }

    // Add middle range
    rangeWithDots.push(...range);

    // Add last page
    if (end < totalPages - 1) {
      if (end < totalPages - 2) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(totalPages);
    } else if (end === totalPages - 1) {
      rangeWithDots.push(totalPages);
    }

    // Remove duplicates while preserving order
    const uniquePages = [];
    const seen = new Set();
    
    for (const page of rangeWithDots) {
      if (!seen.has(page)) {
        uniquePages.push(page);
        seen.add(page);
      }
    }

    return uniquePages;
  };

  const visiblePages = getVisiblePages();

  const handlePrevious = () => {
    console.log('Previous clicked, current page:', currentPage); // Debug log
    if (currentPage > 1) {
      console.log('Calling onPageChange with:', currentPage - 1); // Debug log
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    console.log('Next clicked, current page:', currentPage, 'total pages:', totalPages); // Debug log
    if (currentPage < totalPages) {
      console.log('Calling onPageChange with:', currentPage + 1); // Debug log
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 border border-gray-200  rounded-md"
    
    >
      
      {/* Pagination controls */}
      <div className={`inline-flex items-center bg-white rounded-full shadow-sm px-1 py-1 ${className}`}>
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-teal-500 hover:bg-teal-50'
          }`}
        >
          Prev
        </button>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => (
          <React.Fragment key={`page-${index}-${page}`}>
            {page === '...' ? (
              <span className="px-2 py-1 text-xs text-gray-400">...</span>
            ) : (
              <button
                onClick={() => handlePageClick(page)}
                className={`min-w-[28px] h-6 text-xs font-medium rounded-full transition-all duration-200 ${
                  page === currentPage
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-teal-500 hover:bg-teal-50'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-teal-500 hover:bg-teal-50'
          }`}
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default Pagination;