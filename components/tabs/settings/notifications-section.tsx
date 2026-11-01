"use client";

import React, { useState } from 'react';
import { Bell, Mail } from 'lucide-react';
import { getStoredUserSettings, saveUserSettings } from '@/lib/api';

export function NotificationsSection() {
  const [settings, setSettings] = useState(() => getStoredUserSettings());

  const updatePreference = (key: 'pushNotifications' | 'emailNotifications', value: boolean) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveUserSettings({ [key]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">Préférences de notification</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Choisissez les canaux de notification à activer pour votre compte.
        </p>
      </div>

      <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white px-5 dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
        <label className="flex cursor-pointer items-center justify-between gap-4 py-5">
          <span className="flex items-start gap-3">
            <Bell size={18} className="mt-0.5 text-indigo-500" />
            <span>
              <span className="block text-sm font-medium text-gray-900 dark:text-white">Notifications dans l’application</span>
              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">Alertes visuelles et sonores pour les nouvelles notifications.</span>
            </span>
          </span>
          <input
            type="checkbox"
            checked={settings.pushNotifications}
            onChange={event => updatePreference('pushNotifications', event.target.checked)}
            className="h-4 w-4 accent-indigo-600"
          />
        </label>

        <label className="flex cursor-pointer items-center justify-between gap-4 py-5">
          <span className="flex items-start gap-3">
            <Mail size={18} className="mt-0.5 text-indigo-500" />
            <span>
              <span className="block text-sm font-medium text-gray-900 dark:text-white">Notifications par e-mail</span>
              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">Préférence enregistrée pour les communications par e-mail.</span>
            </span>
          </span>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={event => updatePreference('emailNotifications', event.target.checked)}
            className="h-4 w-4 accent-indigo-600"
          />
        </label>
      </div>
    </div>
  );
}
