"use client";

import React, { useEffect, useState } from 'react';
import { Download, Database } from 'lucide-react';
import {
  getStoredActionableTasks,
  getStoredNotifications,
  getStoredProjects,
  getStoredSprints,
  getStoredTasks,
  getStoredTeam,
  getStoredUserSettings,
} from '@/lib/api';
import { showToast } from '@/lib/toast';

function getDataSnapshot() {
  return {
    exportedAt: new Date().toISOString(),
    team: getStoredTeam(),
    projects: getStoredProjects(),
    tasks: getStoredTasks(),
    sprints: getStoredSprints(),
    notifications: getStoredNotifications(),
    actionableTasks: getStoredActionableTasks(),
    userSettings: getStoredUserSettings(),
  };
}

function getRecordCount(): number {
  const snapshot = getDataSnapshot();
  return snapshot.team.length + snapshot.projects.length + snapshot.tasks.length
    + snapshot.sprints.length + snapshot.notifications.length + snapshot.actionableTasks.length;
}

export function DataSection() {
  const [recordCount, setRecordCount] = useState(getRecordCount);

  useEffect(() => {
    const handleUpdate = () => setRecordCount(getRecordCount());
    window.addEventListener('klarity_db_update', handleUpdate);
    return () => window.removeEventListener('klarity_db_update', handleUpdate);
  }, []);

  const exportData = () => {
    const contents = JSON.stringify(getDataSnapshot(), null, 2);
    const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `klarity-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Export des données téléchargé');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">Données & Stockage</h3>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Consultez et exportez les données synchronisées avec le backend.</p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <Database size={20} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Données synchronisées</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{recordCount} enregistrements chargés depuis votre espace de travail.</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-5 dark:border-gray-800">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Exporter les données</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">Téléchargez les données synchronisées au format JSON.</p>
        </div>
        <button type="button" onClick={exportData} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
          <Download size={15} />
          Exporter
        </button>
      </div>

      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
        La suppression du compte n’est pas disponible tant qu’un système d’authentification sécurisé n’est pas configuré.
      </p>
    </div>
  );
}
