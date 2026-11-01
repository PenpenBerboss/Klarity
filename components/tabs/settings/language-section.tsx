"use client";

import React, { useState, useEffect } from 'react';
import { Globe, Clock, Check, Calendar } from 'lucide-react';
import { getStoredUserSettings, saveUserSettings, COMMON_TIMEZONES } from '@/lib/api';

export function LanguageSection() {
  const [language, setLanguage] = useState('fr');
  const [timezone, setTimezone] = useState('Africa/Douala');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [previewTime, setPreviewTime] = useState<string>('');
  const [previewDate, setPreviewDate] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const settings = getStoredUserSettings();
        if (settings) {
          if (settings.language) setLanguage(settings.language);
          if (settings.timezone) setTimezone(settings.timezone);
          if (settings.dateFormat) setDateFormat(settings.dateFormat);
        }
      } catch {
        // Fallback
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Update preview clock in real-time for the selected timezone
  useEffect(() => {
    function updatePreview() {
      const now = new Date();
      try {
        const time = now.toLocaleTimeString('fr-CM', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        const date = now.toLocaleDateString('fr-CM', {
          timeZone: timezone,
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        setPreviewTime(time);
        setPreviewDate(date);
      } catch {
        setPreviewTime(now.toLocaleTimeString());
        setPreviewDate(now.toLocaleDateString());
      }
    }

    updatePreview();
    const interval = setInterval(updatePreview, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const handleTimezoneChange = (newTz: string) => {
    setTimezone(newTz);
    // Instant live update
    saveUserSettings({ timezone: newTz });
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveUserSettings({
      language,
      timezone,
      dateFormat,
    });
  };

  const selectedTzObj = COMMON_TIMEZONES.find(t => t.value === timezone);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          <Globe className="text-indigo-600 dark:text-indigo-400" size={20} />
          Langue &amp; Région
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Configurez le fuseau horaire de l&apos;équipe, la langue de l&apos;interface et les formats d&apos;affichage.
        </p>
      </div>

      {/* Live Timezone Preview Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-gray-50 dark:from-indigo-950/20 dark:via-gray-900 dark:to-gray-950 border border-indigo-100 dark:border-indigo-900/50 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Clock size={14} /> Aperçu en temps réel du fuseau actif
          </span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold">
            {selectedTzObj?.offset || 'UTC'}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="text-3xl font-mono font-bold tracking-tight text-gray-900 dark:text-white">
            {previewTime || '--:--:--'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {previewDate || 'Chargement...'}
          </div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
          Région sélectionnée : <span className="font-bold text-gray-900 dark:text-white">{selectedTzObj?.label || timezone}</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Fuseau horaire selector */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Clock size={14} className="text-indigo-500" />
            Fuseau horaire système &amp; horloge
          </label>
          <select 
            value={timezone}
            onChange={(e) => handleTimezoneChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white font-medium"
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label} — ({tz.offset})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Ce réglage ajuste instantanément l&apos;horloge de l&apos;en-tête, les dates de livraison des projets et l&apos;ensemble des plannings.
          </p>
        </div>

        {/* Quick select buttons */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Raccourcis fuseaux fréquents
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'Africa/Douala', label: 'Douala (UTC+1)' },
              { id: 'Europe/Paris', label: 'Paris (UTC+1)' },
              { id: 'Africa/Dakar', label: 'Dakar (UTC+0)' },
              { id: 'Europe/London', label: 'Londres (UTC+0)' },
              { id: 'America/New_York', label: 'New York (UTC-5)' },
              { id: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
            ].map(tz => (
              <button
                key={tz.id}
                type="button"
                onClick={() => handleTimezoneChange(tz.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  timezone === tz.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-2xs'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                {tz.label}
              </button>
            ))}
          </div>
        </div>

        {/* Langue de l'interface */}
        <div className="space-y-1.5 pt-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Globe size={14} className="text-indigo-500" />
            Langue de l&apos;interface
          </label>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
          >
            <option value="fr">Français (Cameroun)</option>
            <option value="en">English (International)</option>
            <option value="es">Español</option>
          </select>
        </div>

        {/* Format de date */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Calendar size={14} className="text-indigo-500" />
            Format de date
          </label>
          <select 
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
          >
            <option value="DD/MM/YYYY">JJ/MM/AAAA (ex: 30/10/2026)</option>
            <option value="MM/DD/YYYY">MM/JJ/AAAA (ex: 10/30/2026)</option>
            <option value="YYYY-MM-DD">AAAA-MM-JJ (Format ISO, ex: 2026-10-30)</option>
          </select>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400">
            Toutes les modifications sont immédiatement synchronisées.
          </span>
          <button 
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer flex items-center gap-2"
          >
            <Check size={16} />
            Enregistrer les préférences
          </button>
        </div>
      </form>
    </div>
  );
}
