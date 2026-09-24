import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Sorting state
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: '',
  });

  const [sort, setSort] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    limit: 12,
  });

  // UI state
  const [viewMode, setViewMode] = useState('board'); // 'board', 'list', 'analytics'
  const [theme, setTheme] = useState(localStorage.getItem('todolist_theme') || 'light');
  const [editingTask, setEditingTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('taskpulse_theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {
        ...filters,
        ...sort,
        page: pagination.currentPage,
        limit: pagination.limit,
      };

      const res = await api.getTasks(queryParams);
      if (res.success) {
        setTasks(res.data);
        if (res.pagination) {
          setPagination((prev) => ({
            ...prev,
            totalPages: res.pagination.totalPages,
            totalTasks: res.pagination.totalTasks,
          }));
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters, sort, pagination.currentPage, pagination.limit]);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.getTaskStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  // CRUD Actions
  const addTask = async (taskData) => {
    try {
      const res = await api.createTask(taskData);
      if (res.success) {
        await fetchTasks();
        await fetchStats();
        return true;
      }
    } catch (err) {
      setError(err.message || 'Failed to create task');
      return false;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const res = await api.updateTask(id, taskData);
      if (res.success) {
        // Trigger celebratory confetti if task is marked Completed!
        if (taskData.status === 'Completed') {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#ec407a', '#ab47bc', '#42a5f5', '#66bb6a'],
          });
        }
        await fetchTasks();
        await fetchStats();
        return true;
      }
    } catch (err) {
      setError(err.message || 'Failed to update task');
      return false;
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    return await updateTask(id, { status: newStatus });
  };

  const deleteTask = async (id) => {
    try {
      const res = await api.deleteTask(id);
      if (res.success) {
        await fetchTasks();
        await fetchStats();
        return true;
      }
    } catch (err) {
      setError(err.message || 'Failed to delete task');
      return false;
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map((st) =>
      st._id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    await updateTask(taskId, { subtasks: updatedSubtasks });
  };

  // Filter & Sort Setters
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSortChange = (sortBy, sortOrder = 'desc') => {
    setSort({ sortBy, sortOrder });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        loading,
        error,
        filters,
        sort,
        pagination,
        viewMode,
        theme,
        editingTask,
        isTaskModalOpen,
        setViewMode,
        toggleTheme,
        fetchTasks,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        toggleSubtask,
        handleFilterChange,
        handleSortChange,
        handlePageChange,
        openCreateModal,
        openEditModal,
        closeModal,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
