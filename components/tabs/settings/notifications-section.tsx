import React from 'react';

export function NotificationsSection() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Préférences de notification</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choisissez comment vous souhaitez être informé.</p>
      </div>

      <div className="space-y-4">
        {[
          { title: 'Mentions', desc: 'Quand quelqu\'un vous mentionne dans un commentaire.' },
          { title: 'Assignations', desc: 'Quand une nouvelle tâche vous est assignée.' },
          { title: 'Mises à jour de projet', desc: 'Quand le statut d\'un projet change.' },
          { title: 'Rapports hebdomadaires', desc: 'Recevoir un résumé de l\'activité chaque lundi.' }
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked={i !== 3} />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
