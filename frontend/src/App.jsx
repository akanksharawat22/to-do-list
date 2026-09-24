import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar } from './components/FilterBar';
import { TaskBoard } from './components/TaskBoard';
import { TaskList } from './components/TaskList';
import { AnalyticsView } from './components/AnalyticsView';
import { TaskModal } from './components/TaskModal';
import { AuthModal } from './components/AuthModal';
import { Pagination } from './components/Pagination';
import './styles/App.css';

const MainContent = () => {
  const { viewMode } = useTasks();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Top Navbar Header */}
      <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />

      <main className="app-main">
        <div className="main-container">
          {/* Top Quick Stats Dashboard */}
          <StatsOverview />

          {/* Filtering & Sorting Tool Bar */}
          <FilterBar />

          {/* Main View Switcher */}
          {viewMode === 'board' && <TaskBoard />}
          {viewMode === 'list' && (
            <>
              <TaskList />
              <Pagination />
            </>
          )}
          {viewMode === 'analytics' && <AnalyticsView />}
        </div>
      </main>

      {/* Task Edit/Create Modal */}
      <TaskModal />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <MainContent />
      </TaskProvider>
    </AuthProvider>
  );
}
