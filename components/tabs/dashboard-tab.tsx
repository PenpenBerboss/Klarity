import React from 'react';
import { KpiCards } from '@/components/kpi-cards';
import { ActionableTasks } from '@/components/actionable-tasks';

export function DashboardTab() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Vue d&apos;ensemble</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Voici les éléments qui requièrent votre attention aujourd&apos;hui.</p>
      </header>

      <KpiCards />

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium dark:text-white">Points de blocage & Retards prévus</h2>
          <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300">Voir tout</button>
        </div>
        <ActionableTasks />
      </div>
    </div>
  );
}
