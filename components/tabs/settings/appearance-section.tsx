import React from 'react';

export function AppearanceSection() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Apparence</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Personnalisez l&apos;interface de Klarity.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Thème</label>
          <div className="grid grid-cols-3 gap-4">
            <button className="border-2 border-indigo-600 dark:border-indigo-500 rounded-xl p-1">
              <div className="bg-gray-50 dark:bg-gray-900 h-24 rounded-lg border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
                <div className="h-4 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"></div>
                <div className="flex-1 flex">
                  <div className="w-6 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800"></div>
                  <div className="flex-1 p-2">
                    <div className="w-1/2 h-2 bg-indigo-100 dark:bg-indigo-900/50 rounded mb-1"></div>
                    <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  </div>
                </div>
              </div>
              <p className="text-xs font-medium text-center mt-2 text-indigo-700 dark:text-indigo-400">Clair</p>
            </button>
            <button className="border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded-xl p-1 transition-colors">
              <div className="bg-gray-900 dark:bg-gray-950 h-24 rounded-lg border border-gray-800 dark:border-gray-800 flex flex-col overflow-hidden">
                <div className="h-4 bg-gray-800 dark:bg-gray-900 border-b border-gray-700 dark:border-gray-800"></div>
                <div className="flex-1 flex">
                  <div className="w-6 bg-gray-800 dark:bg-gray-900 border-r border-gray-700 dark:border-gray-800"></div>
                  <div className="flex-1 p-2">
                    <div className="w-1/2 h-2 bg-indigo-900 dark:bg-indigo-900/50 rounded mb-1"></div>
                    <div className="w-3/4 h-2 bg-gray-700 dark:bg-gray-800 rounded"></div>
                  </div>
                </div>
              </div>
              <p className="text-xs font-medium text-center mt-2 text-gray-500 dark:text-gray-400">Sombre</p>
            </button>
            <button className="border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded-xl p-1 transition-colors">
              <div className="bg-gradient-to-br from-gray-50 to-gray-900 dark:from-gray-800 dark:to-gray-950 h-24 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-900/80 px-2 py-1 rounded backdrop-blur-sm">Auto</span>
              </div>
              <p className="text-xs font-medium text-center mt-2 text-gray-500 dark:text-gray-400">Système</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
