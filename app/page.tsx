"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { DashboardTab } from '@/components/tabs/dashboard-tab';
import { ProjectsTab } from '@/components/tabs/projects-tab';
import { TasksTab } from '@/components/tabs/tasks-tab';
import { ReportsTab } from '@/components/tabs/reports-tab';
import { TeamTab } from '@/components/tabs/team-tab';
import { SettingsTab } from '@/components/tabs/settings-tab';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'projects': return <ProjectsTab />;
      case 'tasks': return <TasksTab />;
      case 'reports': return <ReportsTab />;
      case 'team': return <TeamTab />;
      case 'settings': return <SettingsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
