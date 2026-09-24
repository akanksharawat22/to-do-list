import React from 'react';
import { useTasks } from '../context/TaskContext';
import {
  TrendingUp,
  PieChart,
  CheckCheck,
  AlertTriangle,
  Award,
} from 'lucide-react';

export const AnalyticsView = () => {
  const { stats, tasks } = useTasks();

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  // Breakdown by Priority
  const lowCount = tasks.filter((t) => t.priority === 'Low').length;
  const mediumCount = tasks.filter((t) => t.priority === 'Medium').length;
  const highCount = tasks.filter((t) => t.priority === 'High').length;
  const urgentCount = tasks.filter((t) => t.priority === 'Urgent').length;

  // Overdue Tasks count
  const overdueCount = tasks.filter(
    (t) =>
      t.dueDate &&
      t.status !== 'Completed' &&
      new Date(t.dueDate) < new Date()
  ).length;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Productivity Analytics Dashboard</h2>
        <p>Real-time insights on task workflow, priority distribution, and completion rates.</p>
      </div>

      <div className="analytics-grid">
        {/* Completion Rate Widget */}
        <div className="analytics-card widget-completion">
          <div className="card-title">
            <TrendingUp size={20} className="icon-pulse" />
            <h3>Completion Ratio</h3>
          </div>
          <div className="circular-progress">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle-progress"
                strokeDasharray={`${completionRate}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">
                {completionRate}%
              </text>
            </svg>
          </div>
          <p className="widget-subtitle">
            {stats.completed} of {stats.total} total tasks completed
          </p>
        </div>

        {/* Priority Breakdown Widget */}
        <div className="analytics-card widget-priority">
          <div className="card-title">
            <PieChart size={20} />
            <h3>Priority Distribution</h3>
          </div>
          <div className="priority-bars">
            <div className="p-bar-item">
              <div className="p-bar-label">
                <span>Low Priority</span>
                <span>{lowCount}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bg-low"
                  style={{ width: `${tasks.length ? (lowCount / tasks.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div className="p-bar-item">
              <div className="p-bar-label">
                <span>Medium Priority</span>
                <span>{mediumCount}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bg-medium"
                  style={{ width: `${tasks.length ? (mediumCount / tasks.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div className="p-bar-item">
              <div className="p-bar-label">
                <span>High Priority</span>
                <span>{highCount}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bg-high"
                  style={{ width: `${tasks.length ? (highCount / tasks.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div className="p-bar-item">
              <div className="p-bar-label">
                <span>Urgent Priority</span>
                <span>{urgentCount}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bg-urgent"
                  style={{ width: `${tasks.length ? (urgentCount / tasks.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insights Widget */}
        <div className="analytics-card widget-insights">
          <div className="card-title">
            <Award size={20} />
            <h3>Quick Insights</h3>
          </div>
          <ul className="insights-list">
            <li className="insight-item">
              <CheckCheck size={18} className="text-success" />
              <div>
                <strong>Active Pipeline</strong>
                <p>{stats.pending + stats.inProgress} tasks requiring action</p>
              </div>
            </li>
            <li className="insight-item">
              <AlertTriangle size={18} className="text-warning" />
              <div>
                <strong>Overdue Warning</strong>
                <p>{overdueCount} task(s) past expected due date</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
