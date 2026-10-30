import React from 'react';
import { KpiCards } from '@/components/kpi-cards';
import { ActionableTasks } from '@/components/actionable-tasks';

export function DashboardTab() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <header className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Vue d&apos;ensemble</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Voici les éléments qui requièrent votre attention aujourd&apos;hui.</p>
      </header>

      <KpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">Points de blocage & Retards prévus</h2>
            <button className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer">Voir tout</button>
          </div>
          <ActionableTasks />
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">Sprint en cours</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Sprint 1 - MVP Core</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">68%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-2 flex justify-between">
                <span>4 jours restants</span>
                <span>12/18 tâches terminées</span>
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Jalons imminents</h3>
              <div className="space-y-3">
                {[
                  { title: 'Audit infra Cloud', date: 'Demain', project: 'Migration' },
                  { title: 'Version Beta Mobile', date: 'Dans 3 jours', project: 'App Mobile' }
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 font-bold text-xs">
                      M{i+1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{m.title}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">{m.project} • {m.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
