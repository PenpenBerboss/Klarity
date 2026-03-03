import React from 'react';

export function SecuritySection() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Sécurité</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Gérez la sécurité de votre compte et vos mots de passe.</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe actuel</label>
          <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nouveau mot de passe</label>
          <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmer le nouveau mot de passe</label>
          <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" />
        </div>
        <div className="pt-4 flex justify-end">
          <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            Mettre à jour le mot de passe
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
         <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Authentification à deux facteurs (2FA)</h4>
         <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
         <button className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
            Activer 2FA
         </button>
      </div>
    </div>
  );
}
