"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { useAppearance } from '@/components/appearance-provider';
import { DashboardTab } from '@/components/tabs/dashboard-tab';
import { ProjectsTab } from '@/components/tabs/projects-tab';
import { TasksTab } from '@/components/tabs/tasks-tab';
import { ReportsTab } from '@/components/tabs/reports-tab';
import { TeamTab } from '@/components/tabs/team-tab';
import { SettingsTab } from '@/components/tabs/settings-tab';
import { TutorialTab } from '@/components/tabs/tutorial-tab';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { setSettingsSection } = useAppearance();

  const handleOpenProfile = () => {
    setSettingsSection('profile');
    setActiveTab('settings');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'projects': return <ProjectsTab />;
      case 'tasks': return <TasksTab />;
      case 'reports': return <ReportsTab />;
      case 'team': return <TeamTab />;
      case 'tutorial': return <TutorialTab />;
      case 'settings': return <SettingsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Topbar 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          onOpenProfile={handleOpenProfile}
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
