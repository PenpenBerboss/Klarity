import React from 'react';

export function NotificationsSection() {
  const notificationTypes = [
    { id: 'mentions', title: 'Mentions', desc: 'Quand quelqu\'un vous mentionne dans un commentaire.' },
    { id: 'assignments', title: 'Assignations', desc: 'Quand une nouvelle tâche vous est assignée.' },
    { id: 'due_dates', title: 'Échéances', desc: 'Quand une tâche arrive à son échéance.' },
    { id: 'status_changes', title: 'Mises à jour de projet', desc: 'Quand le statut d\'un projet change.' },
    { id: 'weekly_reports', title: 'Rapports hebdomadaires', desc: 'Recevoir un résumé de l\'activité chaque lundi.' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Préférences de notification</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Choisissez comment vous souhaitez être informé pour chaque type d&apos;événement.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Événement</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">In-App</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {notificationTypes.map((type) => (
              <tr key={type.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{type.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{type.desc}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </td>
                <td className="px-6 py-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={type.id !== 'weekly_reports'} />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          Annuler
        </button>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm shadow-indigo-200 dark:shadow-none transition-all">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
