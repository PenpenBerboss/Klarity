"use client";

import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, CircleX, X } from 'lucide-react';
import type { ToastKind } from '@/lib/toast';

interface ToastItem {
  id: string;
  kind: ToastKind;
  title: string;
  message?: string;
}

const toastStyles: Record<ToastKind, { icon: typeof CheckCircle2; classes: string }> = {
  success: {
    icon: CheckCircle2,
    classes: 'border-emerald-200 bg-white text-emerald-700 dark:border-emerald-900 dark:bg-gray-900 dark:text-emerald-300',
  },
  error: {
    icon: CircleX,
    classes: 'border-red-200 bg-white text-red-700 dark:border-red-900 dark:bg-gray-900 dark:text-red-300',
  },
  notification: {
    icon: Bell,
    classes: 'border-indigo-200 bg-white text-indigo-700 dark:border-indigo-900 dark:bg-gray-900 dark:text-indigo-300',
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const toast = (event as CustomEvent<ToastItem>).detail;
      if (!toast?.id || !toast.title) return;
      setToasts(current => [...current.slice(-2), toast]);
      window.setTimeout(() => {
        setToasts(current => current.filter(item => item.id !== toast.id));
      }, 5000);
    };

    window.addEventListener('klarity_toast', handleToast);
    return () => window.removeEventListener('klarity_toast', handleToast);
  }, []);

  return (
    <>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[200] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite" aria-relevant="additions">
        {toasts.map(toast => {
          const { icon: Icon, classes } = toastStyles[toast.kind];
          return (
            <div
              key={toast.id}
              role={toast.kind === 'error' ? 'alert' : 'status'}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-lg shadow-black/5 animate-in fade-in slide-in-from-top-2 ${classes}`}
            >
              <Icon size={19} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message && <p className="mt-0.5 text-xs opacity-80">{toast.message}</p>}
              </div>
              <button
                type="button"
                aria-label="Fermer la notification"
                onClick={() => setToasts(current => current.filter(item => item.id !== toast.id))}
                className="rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
