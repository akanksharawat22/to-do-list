import React from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { Clock, Loader2, CheckCircle2, Plus } from 'lucide-react';

export const TaskBoard = () => {
  const { tasks, loading, openCreateModal, updateTaskStatus } = useTasks();

  const pendingTasks = tasks.filter((t) => t.status === 'Pending');
  const inProgressTasks = tasks.filter((t) => t.status === 'In-Progress');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateTaskStatus(taskId, targetStatus);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const renderColumn = (title, columnTasks, statusKey, icon, badgeClass) => {
    const IconComponent = icon;

    return (
      <div
        className="board-column"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, statusKey)}
      >
        <div className="column-header">
          <div className="column-title">
            <span className={`column-status-icon ${badgeClass}`}>
              <IconComponent size={18} />
            </span>
            <h3>{title}</h3>
            <span className="column-count">{columnTasks.length}</span>
          </div>
          <button
            className="btn-column-add"
            onClick={openCreateModal}
            title={`Add ${title} task`}
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="column-content">
          {loading ? (
            <div className="column-loading">
              <Loader2 size={24} className="spin" />
              <span>Loading tasks...</span>
            </div>
          ) : columnTasks.length === 0 ? (
            <div className="column-empty">
              <p>No {title.toLowerCase()} tasks</p>
            </div>
          ) : (
            columnTasks.map((task) => (
              <div
                key={task._id}
                draggable
                onDragStart={(e) => handleDragStart(e, task._id)}
                className="draggable-task"
              >
                <TaskCard task={task} />
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="task-board">
      {renderColumn('Pending', pendingTasks, 'Pending', Clock, 'ic-pending')}
      {renderColumn('In-Progress', inProgressTasks, 'In-Progress', Loader2, 'ic-inprogress')}
      {renderColumn('Completed', completedTasks, 'Completed', CheckCircle2, 'ic-completed')}
    </div>
  );
};
