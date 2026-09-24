import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Trash2,
  Edit3,
  Tag,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';

export const TaskCard = ({ task }) => {
  const { updateTaskStatus, deleteTask, toggleSubtask, openEditModal } = useTasks();
  const [showSubtasks, setShowSubtasks] = useState(false);

  // Status Badge Colors & Icons
  const statusConfig = {
    Pending: { icon: Clock, label: 'Pending', className: 'status-pending' },
    'In-Progress': { icon: Loader2, label: 'In-Progress', className: 'status-inprogress' },
    Completed: { icon: CheckCircle2, label: 'Completed', className: 'status-completed' },
  };

  const currentStatus = statusConfig[task.status] || statusConfig['Pending'];
  const StatusIcon = currentStatus.icon;

  // Priority Color Badge
  const priorityClasses = {
    Low: 'priority-low',
    Medium: 'priority-medium',
    High: 'priority-high',
    Urgent: 'priority-urgent',
  };

  // Due Date & Overdue Calculation
  const isOverdue =
    task.dueDate &&
    task.status !== 'Completed' &&
    new Date(task.dueDate) < new Date();

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  // Subtasks Completion Calculation
  const completedSubtasksCount = task.subtasks
    ? task.subtasks.filter((st) => st.completed).length
    : 0;
  const totalSubtasksCount = task.subtasks ? task.subtasks.length : 0;
  const subtasksPercent =
    totalSubtasksCount > 0
      ? Math.round((completedSubtasksCount / totalSubtasksCount) * 100)
      : 0;

  return (
    <div className={`task-card ${task.status === 'Completed' ? 'is-completed' : ''}`}>
      {/* Top Header Row */}
      <div className="card-header">
        <div className="card-badges">
          {/* Priority Pill */}
          <span className={`priority-badge ${priorityClasses[task.priority] || 'priority-medium'}`}>
            {task.priority}
          </span>
          {/* Category Pill */}
          <span className="category-badge">{task.category || 'Work'}</span>
        </div>

        {/* Action Buttons */}
        <div className="card-actions">
          <button
            className="action-btn edit-btn"
            onClick={() => openEditModal(task)}
            title="Edit Task"
          >
            <Edit3 size={15} />
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => deleteTask(task._id)}
            title="Delete Task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Task Content */}
      <div className="card-body">
        <h4 className="task-title">{task.title}</h4>
        {task.description && <p className="task-desc">{task.description}</p>}
      </div>

      {/* Status Workflow Selector */}
      <div className="status-workflow">
        <label className="workflow-label">Status:</label>
        <div className="workflow-buttons">
          <button
            className={`wf-btn ${task.status === 'Pending' ? 'active pending' : ''}`}
            onClick={() => updateTaskStatus(task._id, 'Pending')}
            title="Mark as Pending"
          >
            Pending
          </button>
          <button
            className={`wf-btn ${task.status === 'In-Progress' ? 'active inprogress' : ''}`}
            onClick={() => updateTaskStatus(task._id, 'In-Progress')}
            title="Mark as In-Progress"
          >
            In-Progress
          </button>
          <button
            className={`wf-btn ${task.status === 'Completed' ? 'active completed' : ''}`}
            onClick={() => updateTaskStatus(task._id, 'Completed')}
            title="Mark as Completed"
          >
            Completed
          </button>
        </div>
      </div>

      {/* Subtasks Progress Bar & Section */}
      {totalSubtasksCount > 0 && (
        <div className="subtasks-section">
          <div
            className="subtasks-header"
            onClick={() => setShowSubtasks(!showSubtasks)}
          >
            <div className="subtasks-info">
              <span>
                Subtasks ({completedSubtasksCount}/{totalSubtasksCount})
              </span>
            </div>
            <div className="subtasks-bar-container">
              <div className="subtasks-bar" style={{ width: `${subtasksPercent}%` }}></div>
            </div>
            <button className="btn-toggle-subtasks">
              {showSubtasks ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {showSubtasks && (
            <ul className="subtasks-list">
              {task.subtasks.map((st) => (
                <li
                  key={st._id}
                  className={`subtask-item ${st.completed ? 'completed' : ''}`}
                  onClick={() => toggleSubtask(task._id, st._id)}
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => {}} // Handled by container click
                  />
                  <span>{st.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Tags list */}
      {task.tags && task.tags.length > 0 && (
        <div className="card-tags">
          <Tag size={12} className="tag-icon" />
          {task.tags.map((tag, idx) => (
            <span key={idx} className="tag-pill">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Meta Details */}
      <div className="card-footer">
        {formattedDueDate ? (
          <div className={`due-date ${isOverdue ? 'overdue' : ''}`}>
            {isOverdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
            <span>{isOverdue ? `Overdue (${formattedDueDate})` : formattedDueDate}</span>
          </div>
        ) : (
          <div className="due-date empty">
            <Calendar size={14} />
            <span>No due date</span>
          </div>
        )}
      </div>
    </div>
  );
};
