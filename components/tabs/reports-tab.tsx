import React from 'react';
import { ProjectHealthChart, TeamWorkloadChart, SprintVelocityChart, CumulativeFlowChart } from '@/components/charts';
import { Download } from 'lucide-react';

export function ReportsTab() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Rapports & KPI</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Analysez les performances globales de votre organisation avec des métriques avancées.</p>
        </div>
        <button className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
          <Download size={16} /> Exporter PDF
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-medium mb-4 dark:text-white">Santé des Projets (Budget vs Réel)</h2>
          <ProjectHealthChart />
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-medium mb-4 dark:text-white">Vélocité de l&apos;équipe (Story points)</h2>
          <SprintVelocityChart />
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-medium mb-4 dark:text-white">Diagramme de Flux Cumulé (CFD)</h2>
          <CumulativeFlowChart />
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-medium mb-4 dark:text-white">Charge par Collaborateur</h2>
          <TeamWorkloadChart />
        </div>
      </div>
    </div>
  );
}
