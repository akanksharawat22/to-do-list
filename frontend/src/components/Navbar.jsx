import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import {
  CheckCircle2,
  Plus,
  Moon,
  Sun,
  LayoutGrid,
  List,
  BarChart3,
  LogOut,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export const Navbar = ({ onOpenAuth }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { viewMode, setViewMode, theme, toggleTheme, openCreateModal } = useTasks();

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo - 'To Do List' */}
        <div className="brand">
          <div className="brand-icon animated-glow">
            <CheckCircle2 size={24} className="icon-bounce" />
          </div>
          <div className="brand-text">
            <h2>To Do List</h2>
            <span className="badge-mern">
              <Sparkles size={11} /> Advanced MERN
            </span>
          </div>
        </div>

        {/* View Mode Selector Tabs */}
        <div className="view-mode-tabs">
          <button
            className={`tab-btn ${viewMode === 'board' ? 'active' : ''}`}
            onClick={() => setViewMode('board')}
            title="Workflow Board View"
          >
            <LayoutGrid size={17} />
            <span>Board</span>
          </button>
          <button
            className={`tab-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Compact List View"
          >
            <List size={17} />
            <span>List</span>
          </button>
          <button
            className={`tab-btn ${viewMode === 'analytics' ? 'active' : ''}`}
            onClick={() => setViewMode('analytics')}
            title="Productivity Analytics"
          >
            <BarChart3 size={17} />
            <span>Analytics</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* New Task Button */}
          <button className="btn-primary btn-add-task pulse-hover" onClick={openCreateModal}>
            <Plus size={18} />
            <span>Add Task</span>
          </button>

          {/* Theme Switcher */}
          <button className="btn-icon theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} className="text-sun spin-hover" /> : <Moon size={20} className="text-moon float-anim" />}
          </button>

          {/* User Profile / Auth */}
          {isAuthenticated ? (
            <div className="user-profile">
              <div className="avatar" title={user?.email}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name || 'User'}</span>
              </div>
              <button className="btn-icon logout-btn" onClick={logout} title="Sign Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button className="btn-secondary" onClick={onOpenAuth}>
              <UserCheck size={18} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
