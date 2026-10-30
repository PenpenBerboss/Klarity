"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAppearance, AccentColor, Density } from '@/components/appearance-provider';
import { Sun, Moon, Monitor, Check, Palette, Sliders } from 'lucide-react';
import { clsx } from 'clsx';

export function AppearanceSection() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { accentColor, setAccentColor, density, setDensity } = useAppearance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const accentColors: { id: AccentColor; name: string; colorClass: string; borderClass: string }[] = [
    { id: 'indigo', name: 'Indigo (Défaut)', colorClass: 'bg-indigo-600', borderClass: 'border-indigo-600' },
    { id: 'emerald', name: 'Émeraude', colorClass: 'bg-emerald-600', borderClass: 'border-emerald-600' },
    { id: 'purple', name: 'Violet', colorClass: 'bg-purple-600', borderClass: 'border-purple-600' },
    { id: 'amber', name: 'Ambre', colorClass: 'bg-amber-600', borderClass: 'border-amber-600' },
    { id: 'blue', name: 'Bleu Océan', colorClass: 'bg-blue-600', borderClass: 'border-blue-600' },
  ];

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
        <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Apparence</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Personnalisez le thème visuel, les couleurs d&apos;accent et la densité de l&apos;interface.
        </p>
      </div>

      {/* Theme selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          Thème principal
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Light Theme */}
          <button 
            type="button"
            onClick={() => setTheme('light')}
            className={clsx(
              "relative border-2 rounded-xl p-2 text-left transition-all cursor-pointer group",
              theme === 'light' 
                ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-500/5" 
                : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
            )}
          >
            <div className="bg-gray-50 h-24 rounded-lg border border-gray-200 flex flex-col overflow-hidden mb-2 relative">
              <div className="h-4 bg-white border-b border-gray-200 flex items-center px-2">
                <div className="w-2 h-2 rounded-full bg-red-400 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 flex">
                <div className="w-6 bg-white border-r border-gray-200"></div>
                <div className="flex-1 p-2 space-y-1">
                  <div className="w-1/2 h-2 bg-indigo-200 rounded"></div>
                  <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Sun size={14} className="text-amber-500" /> Clair
              </span>
              {theme === 'light' && (
                <span className="w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                  <Check size={10} />
                </span>
              )}
            </div>
          </button>

          {/* Dark Theme */}
          <button 
            type="button"
            onClick={() => setTheme('dark')}
            className={clsx(
              "relative border-2 rounded-xl p-2 text-left transition-all cursor-pointer group",
              theme === 'dark' 
                ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-500/5" 
                : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
            )}
          >
            <div className="bg-gray-950 h-24 rounded-lg border border-gray-800 flex flex-col overflow-hidden mb-2 relative">
              <div className="h-4 bg-gray-900 border-b border-gray-800 flex items-center px-2">
                <div className="w-2 h-2 rounded-full bg-gray-700 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-700 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
              </div>
              <div className="flex-1 flex">
                <div className="w-6 bg-gray-900 border-r border-gray-800"></div>
                <div className="flex-1 p-2 space-y-1">
                  <div className="w-1/2 h-2 bg-indigo-900/60 rounded"></div>
                  <div className="w-3/4 h-2 bg-gray-800 rounded"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Moon size={14} className="text-indigo-400" /> Sombre
              </span>
              {theme === 'dark' && (
                <span className="w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                  <Check size={10} />
                </span>
              )}
            </div>
          </button>

          {/* System Theme */}
          <button 
            type="button"
            onClick={() => setTheme('system')}
            className={clsx(
              "relative border-2 rounded-xl p-2 text-left transition-all cursor-pointer group",
              theme === 'system' 
                ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-500/5" 
                : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
            )}
          >
            <div className="bg-gradient-to-br from-gray-50 to-gray-900 h-24 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center mb-2">
              <div className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg backdrop-blur-xs flex items-center gap-2">
                <Monitor size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Auto</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Monitor size={14} className="text-gray-500" /> Système ({resolvedTheme === 'dark' ? 'Sombre' : 'Clair'})
              </span>
              {theme === 'system' && (
                <span className="w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                  <Check size={10} />
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Accent Color Selection */}
      <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Palette size={16} className="text-indigo-500" /> Couleur d&apos;accentuation
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {accentColors.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => setAccentColor(color.id)}
              className={clsx(
                "flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer",
                accentColor === color.id
                  ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-500/10 text-gray-900 dark:text-white"
                  : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className={clsx("w-4 h-4 rounded-full shrink-0 shadow-xs", color.colorClass)}></span>
                <span>{color.name}</span>
              </div>
              {accentColor === color.id && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Interface Density */}
      <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Sliders size={16} className="text-indigo-500" /> Densité de l&apos;interface
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setDensity('comfortable')}
            className={clsx(
              "p-4 rounded-xl border text-left text-xs transition-all cursor-pointer",
              density === 'comfortable'
                ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-500/10 text-gray-900 dark:text-white font-medium"
                : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
            )}
          >
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-sm">Confortable</p>
              {density === 'comfortable' && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Espacement aéré, marges généreuses et lisibilité maximale.</p>
          </button>
          <button
            type="button"
            onClick={() => setDensity('compact')}
            className={clsx(
              "p-4 rounded-xl border text-left text-xs transition-all cursor-pointer",
              density === 'compact'
                ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-500/10 text-gray-900 dark:text-white font-medium"
                : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
            )}
          >
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-sm">Compacte</p>
              {density === 'compact' && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Interface resserrée pour afficher un maximum d&apos;informations à l&apos;écran.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
