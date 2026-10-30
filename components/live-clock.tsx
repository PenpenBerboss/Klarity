"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';
import { getStoredUserSettings, COMMON_TIMEZONES } from '@/lib/api';
import { useAppearance } from '@/components/appearance-provider';

export function LiveClock() {
  const { setSettingsSection } = useAppearance();
  const [activeTimeZone, setActiveTimeZone] = useState<string>('Europe/Paris');
  const [timeState, setTimeState] = useState<{
    timeStr: string;
    dateStr: string;
    timeZoneStr: string;
    offsetStr: string;
  } | null>(null);

  // Initialize and synchronize with user settings and system timezone events
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedSettings = getStoredUserSettings();
        if (savedSettings?.timezone) {
          setActiveTimeZone(savedSettings.timezone);
        } else {
          const localTz = localStorage.getItem('klarity_timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (localTz) setActiveTimeZone(localTz);
        }
      } catch {
        // Fallback
      }
    }, 0);

    const handleTzChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ timezone: string }>;
      if (customEvent.detail?.timezone) {
        setActiveTimeZone(customEvent.detail.timezone);
      }
    };

    window.addEventListener('klarity_timezone_changed', handleTzChange);
    window.addEventListener('storage', (e) => {
      if (e.key === 'klarity_timezone' && e.newValue) {
        setActiveTimeZone(e.newValue);
      }
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('klarity_timezone_changed', handleTzChange);
    };
  }, []);

  // Update clock every second according to active timezone
  useEffect(() => {
    function updateClock() {
      const now = new Date();

      try {
        // Format time in the selected timezone
        const timeStr = now.toLocaleTimeString('fr-FR', {
          timeZone: activeTimeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });

        // Format date in the selected timezone
        const dateStr = now.toLocaleDateString('fr-FR', {
          timeZone: activeTimeZone,
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        });

        // Compute current timezone label and offset
        const tzMatch = COMMON_TIMEZONES.find(t => t.value === activeTimeZone);
        let timeZoneName = activeTimeZone.split('/')[1] || activeTimeZone;
        timeZoneName = timeZoneName.replace(/_/g, ' ');

        let offsetStr = tzMatch?.offset || '';
        if (!offsetStr) {
          try {
            const parts = new Intl.DateTimeFormat('en-US', {
              timeZone: activeTimeZone,
              timeZoneName: 'shortOffset',
            }).formatToParts(now);
            const tzPart = parts.find(p => p.type === 'timeZoneName');
            offsetStr = tzPart ? tzPart.value.replace('GMT', 'UTC') : 'UTC';
          } catch {
            offsetStr = 'UTC';
          }
        }

        const timeZoneStr = `${timeZoneName} (${offsetStr})`;
        setTimeState({ timeStr, dateStr, timeZoneStr, offsetStr });
      } catch {
        // Fallback to local time if timezone format throws
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
        setTimeState({ timeStr, dateStr, timeZoneStr: activeTimeZone, offsetStr: 'UTC' });
      }
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [activeTimeZone]);

  if (!timeState) {
    return (
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 text-xs text-gray-400">
        <Clock size={14} className="animate-spin text-indigo-500" />
        <span>Chargement de l&apos;heure...</span>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setSettingsSection('language')}
      className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50/90 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 text-xs font-mono shadow-2xs transition-all hover:border-indigo-300 dark:hover:border-indigo-500/40 cursor-pointer group"
      title={`Fuseau horaire actif : ${activeTimeZone} (${timeState.offsetStr}) - Cliquer pour changer`}
    >
      <Clock size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
      <span className="font-bold text-gray-900 dark:text-gray-100 tracking-tight">{timeState.timeStr}</span>
      <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-sans font-medium">{timeState.dateStr}</span>
      <div className="hidden lg:flex items-center gap-1 text-[10px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded-md font-sans font-semibold border border-indigo-100 dark:border-indigo-900/40">
        <Globe size={10} className="shrink-0" />
        <span className="truncate max-w-[110px]">{timeState.timeZoneStr}</span>
      </div>
    </div>
  );
}
