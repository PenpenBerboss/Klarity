import React from 'react';

export function PermissionsSection() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Permissions</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Gérez les accès et les permissions des applications tierces.</p>
      </div>
      
      <div className="space-y-4">
        {[
          { name: 'Google Calendar', desc: 'Accès en lecture et écriture à votre calendrier.', date: 'Ajouté le 12 Jan 2026' },
          { name: 'Slack', desc: 'Envoi de notifications dans vos canaux.', date: 'Ajouté le 05 Fév 2026' },
          { name: 'GitHub', desc: 'Liaison des commits aux tâches.', date: 'Ajouté le 20 Fév 2026' }
        ].map((app, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{app.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{app.desc}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{app.date}</p>
            </div>
            <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
              Révoquer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
