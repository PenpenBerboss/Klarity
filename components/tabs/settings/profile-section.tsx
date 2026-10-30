import React from 'react';
import { User } from 'lucide-react';

export function ProfileSection() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Informations personnelles</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Mettez à jour votre photo et vos informations personnelles.</p>
      </div>
      
      <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl font-bold border-2 border-indigo-200 dark:border-indigo-500/30 shadow-sm">
          <User size={36} />
        </div>
        <div>
          <button className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm mb-2">
            Changer la photo
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400">JPG, GIF ou PNG. 1MB max.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Prénom</label>
          <input type="text" defaultValue="Samuel" className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom</label>
          <input type="text" defaultValue="Mbarga" className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input type="email" defaultValue="samuel.mbarga@klarity.cm" className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <textarea rows={4} defaultValue="Chef de projet senior passionné par l'agilité, la transformation digitale et l'efficacité opérationnelle au Cameroun." className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"></textarea>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
