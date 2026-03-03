import React from 'react';

export function DataSection() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Données & Stockage</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Gérez vos données et l&apos;espace de stockage de votre compte.</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Stockage utilisé</span>
            <span className="text-gray-500 dark:text-gray-400">2.4 GB / 10 GB</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '24%' }}></div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Exporter les données</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Téléchargez une archive de toutes vos données.</p>
            </div>
            <button className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
              Exporter
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-red-600 dark:text-red-400">Supprimer le compte</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Cette action est irréversible.</p>
            </div>
            <button className="px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors shadow-sm">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
