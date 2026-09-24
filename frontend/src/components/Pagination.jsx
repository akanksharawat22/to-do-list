import React from 'react';
import { useTasks } from '../context/TaskContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = () => {
  const { pagination, handlePageChange } = useTasks();

  if (pagination.totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= pagination.totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-container">
      <span className="pagination-info">
        Showing Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalTasks} total tasks)
      </span>

      <div className="pagination-controls">
        <button
          className="page-btn"
          disabled={pagination.currentPage === 1}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            className={`page-num ${p === pagination.currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(p)}
          >
            {p}
          </button>
        ))}

        <button
          className="page-btn"
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
