"use client";

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface DeadlineTimerBadgeProps {
  dueDate: string;
  status: string;
}

export function DeadlineTimerBadge({ dueDate, status }: DeadlineTimerBadgeProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    text: string;
    level: 'completed' | 'overdue' | 'urgent' | 'upcoming' | 'normal';
  }>({ text: 'Calcul...', level: 'normal' });

  useEffect(() => {
    function calculateTime() {
      if (status === 'done') {
        setTimeRemaining({ text: 'Terminée', level: 'completed' });
        return;
      }

      if (!dueDate) {
        setTimeRemaining({ text: 'Sans échéance', level: 'normal' });
        return;
      }

      const now = new Date().getTime();
      const target = new Date(dueDate + 'T23:59:59').getTime();
      const diff = target - now;

      if (diff <= 0) {
        const absDiff = Math.abs(diff);
        const daysOver = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        const hoursOver = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const text = daysOver > 0 ? `En retard de ${daysOver}j` : `En retard de ${hoursOver}h`;
        setTimeRemaining({ text, level: 'overdue' });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days < 1) {
        setTimeRemaining({
          text: `${hours}h ${minutes}m restants`,
          level: 'urgent'
        });
      } else if (days <= 2) {
        setTimeRemaining({
          text: `${days}j ${hours}h restants`,
          level: 'urgent'
        });
      } else if (days <= 7) {
        setTimeRemaining({
          text: `${days} jours restants`,
          level: 'upcoming'
        });
      } else {
        setTimeRemaining({
          text: `${days} jours restants`,
          level: 'normal'
        });
      }
    }

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, [dueDate, status]);

  const badgeStyles = {
    completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    overdue: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20 animate-pulse',
    urgent: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
    upcoming: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20',
    normal: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
  };

  return (
    <div
      suppressHydrationWarning
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
        badgeStyles[timeRemaining.level]
      )}
      title={`Échéance: ${dueDate}`}
    >
      {timeRemaining.level === 'completed' && <CheckCircle2 size={12} className="shrink-0" />}
      {timeRemaining.level === 'overdue' && <AlertTriangle size={12} className="shrink-0" />}
      {timeRemaining.level !== 'completed' && timeRemaining.level !== 'overdue' && <Clock size={12} className="shrink-0" />}
      <span suppressHydrationWarning>{timeRemaining.text}</span>
    </div>
  );
}
