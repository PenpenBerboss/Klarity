"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AccentColor = 'indigo' | 'emerald' | 'purple' | 'amber';
export type Density = 'comfortable' | 'compact';

interface AppearanceContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  density: Density;
  setDensity: (density: Density) => void;
  settingsSection: string;
  setSettingsSection: (section: string) => void;
  getAccentClasses: () => {
    primaryBg: string;
    primaryHoverBg: string;
    primaryText: string;
    lightBg: string;
    darkLightBg: string;
    borderColor: string;
    ringColor: string;
  };
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColorState] = useState<AccentColor>('indigo');
  const [density, setDensityState] = useState<Density>('comfortable');
  const [settingsSection, setSettingsSection] = useState<string>('profile');

  // Read saved local storage preferences after mount to prevent hydration mismatches
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedAccent = localStorage.getItem('klarity_accent') as AccentColor;
        if (savedAccent && ['indigo', 'emerald', 'purple', 'amber'].includes(savedAccent)) {
          setAccentColorState(savedAccent);
        }
        const savedDensity = localStorage.getItem('klarity_density') as Density;
        if (savedDensity && ['comfortable', 'compact'].includes(savedDensity)) {
          setDensityState(savedDensity);
        }
      } catch {
        // Ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Synchronize HTML attributes on change
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accentColor);
    document.documentElement.setAttribute('data-density', density);
  }, [accentColor, density]);

  const setAccentColor = useCallback((color: AccentColor) => {
    setAccentColorState(color);
    try {
      localStorage.setItem('klarity_accent', color);
    } catch {
      // Ignore
    }
  }, []);

  const setDensity = useCallback((d: Density) => {
    setDensityState(d);
    try {
      localStorage.setItem('klarity_density', d);
    } catch {
      // Ignore
    }
  }, []);

  const getAccentClasses = useCallback(() => {
    switch (accentColor) {
      case 'emerald':
        return {
          primaryBg: 'bg-emerald-600 dark:bg-emerald-500',
          primaryHoverBg: 'hover:bg-emerald-700 dark:hover:bg-emerald-600',
          primaryText: 'text-emerald-600 dark:text-emerald-400',
          lightBg: 'bg-emerald-50 dark:bg-emerald-500/10',
          darkLightBg: 'dark:bg-emerald-500/20',
          borderColor: 'border-emerald-500 dark:border-emerald-500/30',
          ringColor: 'focus:ring-emerald-500/20 focus:border-emerald-500',
        };
      case 'purple':
        return {
          primaryBg: 'bg-purple-600 dark:bg-purple-500',
          primaryHoverBg: 'hover:bg-purple-700 dark:hover:bg-purple-600',
          primaryText: 'text-purple-600 dark:text-purple-400',
          lightBg: 'bg-purple-50 dark:bg-purple-500/10',
          darkLightBg: 'dark:bg-purple-500/20',
          borderColor: 'border-purple-500 dark:border-purple-500/30',
          ringColor: 'focus:ring-purple-500/20 focus:border-purple-500',
        };
      case 'amber':
        return {
          primaryBg: 'bg-amber-600 dark:bg-amber-500',
          primaryHoverBg: 'hover:bg-amber-700 dark:hover:bg-amber-600',
          primaryText: 'text-amber-600 dark:text-amber-400',
          lightBg: 'bg-amber-50 dark:bg-amber-500/10',
          darkLightBg: 'dark:bg-amber-500/20',
          borderColor: 'border-amber-500 dark:border-amber-500/30',
          ringColor: 'focus:ring-amber-500/20 focus:border-amber-500',
        };
      case 'indigo':
      default:
        return {
          primaryBg: 'bg-indigo-600 dark:bg-indigo-500',
          primaryHoverBg: 'hover:bg-indigo-700 dark:hover:bg-indigo-600',
          primaryText: 'text-indigo-600 dark:text-indigo-400',
          lightBg: 'bg-indigo-50 dark:bg-indigo-500/10',
          darkLightBg: 'dark:bg-indigo-500/20',
          borderColor: 'border-indigo-500 dark:border-indigo-500/30',
          ringColor: 'focus:ring-indigo-500/20 focus:border-indigo-500',
        };
    }
  }, [accentColor]);

  return (
    <AppearanceContext.Provider
      value={{
        accentColor,
        setAccentColor,
        density,
        setDensity,
        settingsSection,
        setSettingsSection,
        getAccentClasses,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
}
