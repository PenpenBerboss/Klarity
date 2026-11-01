import React from 'react';
import { Plug } from 'lucide-react';

export function PermissionsSection() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">Permissions</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Gérez les accès des applications tierces connectées à votre compte.</p>
      </div>
      <div className="rounded-xl border border-gray-200 p-8 text-center dark:border-gray-800">
        <Plug size={24} className="mx-auto mb-3 text-gray-400" />
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Aucune intégration connectée</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Les intégrations s’afficheront ici lorsqu’un service OAuth sera configuré.</p>
      </div>
    </div>
  );
}
