"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';

export function LiveClock() {
  const [timeState, setTimeState] = useState<{
    timeStr: string;
    dateStr: string;
    timeZoneStr: string;
  } | null>(null);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      
      // Format local time: HH:MM:SS
      const timeStr = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
      });

      // Format local date: Ex "Jeu. 29 Oct."
      const dateStr = now.toLocaleDateString('fr-FR', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });

      // Detect timezone abbreviation or offset
      let timeZoneStr = '';
      try {
        const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const offsetMinutes = -now.getTimezoneOffset();
        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
        const sign = offsetMinutes >= 0 ? '+' : '-';
        const gmtOffset = `UTC${sign}${offsetHours}`;
        timeZoneStr = `${timeZoneName.split('/')[1] || timeZoneName} (${gmtOffset})`;
      } catch {
        timeZoneStr = 'Local';
      }

      setTimeState({ timeStr, dateStr, timeZoneStr });
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeState) {
    return (
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 text-xs text-gray-400">
        <Clock size={14} className="animate-spin" />
        <span>Chargement de l&apos;heure...</span>
      </div>
    );
  }

  return (
    <div 
      className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50/90 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 text-xs font-mono shadow-2xs transition-all hover:border-indigo-300 dark:hover:border-indigo-500/40"
      title={`Fuseau horaire détecté: ${timeState.timeZoneStr}`}
    >
      <Clock size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
      <span className="font-bold text-gray-900 dark:text-gray-100 tracking-tight">{timeState.timeStr}</span>
      <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-sans font-medium">{timeState.dateStr}</span>
      <div className="hidden lg:flex items-center gap-1 text-[10px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded-md font-sans font-semibold border border-indigo-100 dark:border-indigo-900/40">
        <Globe size={10} />
        <span className="truncate max-w-[100px]">{timeState.timeZoneStr}</span>
      </div>
    </div>
  );
}
