import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

export const FilterBar = () => {
  const { filters, sort, handleFilterChange, handleSortChange } = useTasks();

  const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Education', 'Finance', 'Other'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const hasActiveFilters =
    filters.status || filters.priority || filters.category || filters.search;

  const clearFilters = () => {
    handleFilterChange('status', '');
    handleFilterChange('priority', '');
    handleFilterChange('category', '');
    handleFilterChange('search', '');
  };

  return (
    <div className="filter-bar">
      {/* Search Input Box */}
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by title, description, or tags..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        {filters.search && (
          <button className="btn-clear-search" onClick={() => handleFilterChange('search', '')}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Selectors */}
      <div className="filter-controls">
        {/* Status Filter Tabs */}
        <div className="status-tabs">
          <button
            className={`status-tab ${filters.status === '' ? 'active' : ''}`}
            onClick={() => handleFilterChange('status', '')}
          >
            All
          </button>
          <button
            className={`status-tab ${filters.status === 'Pending' ? 'active' : ''}`}
            onClick={() => handleFilterChange('status', 'Pending')}
          >
            Pending
          </button>
          <button
            className={`status-tab ${filters.status === 'In-Progress' ? 'active' : ''}`}
            onClick={() => handleFilterChange('status', 'In-Progress')}
          >
            In-Progress
          </button>
          <button
            className={`status-tab ${filters.status === 'Completed' ? 'active' : ''}`}
            onClick={() => handleFilterChange('status', 'Completed')}
          >
            Completed
          </button>
        </div>

        {/* Priority Filter */}
        <div className="select-wrapper">
          <Filter size={14} className="select-icon" />
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p} Priority
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="select-wrapper">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="select-wrapper">
          <ArrowUpDown size={14} className="select-icon" />
          <select
            value={`${sort.sortBy}-${sort.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              handleSortChange(sortBy, sortOrder);
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="dueDate-desc">Due Date (Latest)</option>
            <option value="priority-desc">Priority (High to Low)</option>
            <option value="title-asc">Title (A-Z)</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button className="btn-reset" onClick={clearFilters} title="Reset all filters">
            <X size={15} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
