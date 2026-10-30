"use client";

import React from 'react';
import { User, Bell, Lock, Palette, Globe, Database, ShieldHalf } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppearance } from '@/components/appearance-provider';
import { ProfileSection } from './settings/profile-section';
import { NotificationsSection } from './settings/notifications-section';
import { SecuritySection } from './settings/security-section';
import { AppearanceSection } from './settings/appearance-section';
import { LanguageSection } from './settings/language-section';
import { DataSection } from './settings/data-section';
import { PermissionsSection } from './settings/permissions-section';

export function SettingsTab() {
  const { settingsSection, setSettingsSection } = useAppearance();

  const sections = [
    { id: 'profile', icon: User, label: 'Profil' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Lock, label: 'Sécurité' },
    { id: 'appearance', icon: Palette, label: 'Apparence' },
    { id: 'language', icon: Globe, label: 'Langue & Région' },
    { id: 'data', icon: Database, label: 'Données & Stockage' },
    { id: 'permissions', icon: ShieldHalf, label: 'Permissions' },
  ];

  const renderContent = () => {
    switch (settingsSection) {
      case 'profile':
        return <ProfileSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'appearance':
        return <AppearanceSection />;
      case 'security':
        return <SecuritySection />;
      case 'language':
        return <LanguageSection />;
      case 'data':
        return <DataSection />;
      case 'permissions':
        return <PermissionsSection />;
      default:
        const ActiveIcon = sections.find(s => s.id === settingsSection)?.icon || User;
        return (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400 animate-in fade-in duration-300">
            <ActiveIcon className="w-10 h-10 mb-4 opacity-20" />
            <p>Paramètres de {sections.find(s => s.id === settingsSection)?.label} en cours de construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-full flex flex-col max-w-[1200px] mx-auto">
      <header className="mb-6 md:mb-8 shrink-0">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Paramètres</h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez vos préférences et la configuration de votre compte.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 flex-1">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col overflow-x-auto pb-2 md:pb-0 gap-1 custom-scrollbar">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setSettingsSection(section.id)}
                  className={clsx(
                    "flex items-center gap-2.5 px-3.5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-colors shrink-0 cursor-pointer",
                    settingsSection === section.id 
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold shadow-2xs" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                  )}
                >
                  <Icon className={clsx("w-4 h-4 shrink-0", settingsSection === section.id ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500")} />
                  <span className="whitespace-nowrap">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 sm:p-6 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
