import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function SecuritySection() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">Sécurité</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">La gestion des mots de passe et de l’authentification nécessite un service de comptes sécurisé.</p>
      </div>
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
        <ShieldAlert size={18} className="mt-0.5 shrink-0" />
        <p className="text-sm">Aucun système d’authentification n’est actuellement connecté. Les actions de mot de passe et de 2FA ne sont donc pas disponibles.</p>
      </div>
    </div>
  );
}
