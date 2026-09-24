import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Clock, Loader2, CheckCircle2, Layers } from 'lucide-react';

export const StatsOverview = () => {
  const { stats } = useTasks();

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="stats-container">
      {/* Total Tasks Card */}
      <div className="stat-card card-total">
        <div className="stat-icon-bg">
          <Layers size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Tasks</span>
          <h3 className="stat-value">{stats.total}</h3>
        </div>
      </div>

      {/* Pending Card */}
      <div className="stat-card card-pending">
        <div className="stat-icon-bg">
          <Clock size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Pending</span>
          <h3 className="stat-value">{stats.pending}</h3>
        </div>
      </div>

      {/* In-Progress Card */}
      <div className="stat-card card-inprogress">
        <div className="stat-icon-bg">
          <Loader2 size={22} className="spin-slow" />
        </div>
        <div className="stat-content">
          <span className="stat-label">In-Progress</span>
          <h3 className="stat-value">{stats.inProgress}</h3>
        </div>
      </div>

      {/* Completed Card */}
      <div className="stat-card card-completed">
        <div className="stat-icon-bg">
          <CheckCircle2 size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Completed</span>
          <h3 className="stat-value">{stats.completed}</h3>
        </div>
        <div className="progress-ring">
          <span>{completionRate}%</span>
        </div>
      </div>
    </div>
  );
};
