import React from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { Inbox, Loader2 } from 'lucide-react';

export const TaskList = () => {
  const { tasks, loading, openCreateModal } = useTasks();

  if (loading) {
    return (
      <div className="list-loading">
        <Loader2 size={32} className="spin" />
        <p>Fetching your tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-bg">
          <Inbox size={48} />
        </div>
        <h3>No Tasks Found</h3>
        <p>Get started by adding a task or adjusting your filter criteria.</p>
        <button className="btn-primary" onClick={openCreateModal}>
          Create First Task
        </button>
      </div>
    );
  }

  return (
    <div className="task-list-grid">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
};
