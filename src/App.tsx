/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar, ActiveView } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ContentModal } from './components/ContentModal';
import { ContentDatabaseView } from './components/views/ContentDatabaseView';
import { DashboardView } from './components/views/DashboardView';
import { KanbanView } from './components/views/KanbanView';
import { CalendarView } from './components/views/CalendarView';
import { AIExtractorView } from './components/views/AIExtractorView';
import { MaulAIView } from './components/views/MaulAIView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { TeamView } from './components/views/TeamView';
import { ContentItem } from './types/content';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('content-db');
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [contentToEdit, setContentToEdit] = useState<ContentItem | null>(null);

  const { notification } = useApp();

  const handleOpenNewModal = () => {
    setContentToEdit(null);
    setIsContentModalOpen(true);
  };

  const handleEditContent = (item: ContentItem) => {
    setContentToEdit(item);
    setIsContentModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsContentModalOpen(false);
    setContentToEdit(null);
  };

  return (
    <div className="flex min-h-screen bg-[#090D16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenNewContentModal={handleOpenNewModal}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Studio Header */}
        <TopHeader
          activeView={activeView}
          onOpenNewContentModal={handleOpenNewModal}
        />

        {/* Viewport View Container */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeView === 'dashboard' && (
            <DashboardView
              setActiveView={setActiveView}
              onOpenNewContentModal={handleOpenNewModal}
              onEditContent={handleEditContent}
            />
          )}

          {activeView === 'content-db' && (
            <ContentDatabaseView
              onOpenNewContentModal={handleOpenNewModal}
              onEditContent={handleEditContent}
            />
          )}

          {activeView === 'kanban' && (
            <KanbanView
              onOpenNewContentModal={handleOpenNewModal}
              onEditContent={handleEditContent}
            />
          )}

          {activeView === 'calendar' && (
            <CalendarView
              onOpenNewContentModal={handleOpenNewModal}
              onEditContent={handleEditContent}
            />
          )}

          {activeView === 'ai-extractor' && <AIExtractorView />}

          {activeView === 'maul-ai' && <MaulAIView />}

          {activeView === 'analytics' && <AnalyticsView />}

          {activeView === 'team' && <TeamView />}
        </main>
      </div>

      {/* Content Add/Edit Modal */}
      <ContentModal
        isOpen={isContentModalOpen}
        onClose={handleCloseModal}
        contentToEdit={contentToEdit}
      />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl text-xs font-medium text-white animate-in slide-in-from-bottom-2 duration-200">
          {notification.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          {notification.type === 'error' && (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          {notification.type === 'info' && (
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
