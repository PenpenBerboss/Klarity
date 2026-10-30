import React, { useEffect, useState } from 'react';
import { Search, Bell, Menu, Moon, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { NotificationCenter } from './notification-center';
import { useNotifications } from './notification-provider';
import { LiveClock } from './live-clock';

export function Topbar({ 
  toggleSidebar, 
  onOpenProfile 
}: { 
  toggleSidebar: () => void;
  onOpenProfile?: () => void;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-20">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={toggleSidebar} 
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
          title="Basculer le menu"
        >
          <Menu size={20} />
        </button>
        
        <div className="relative hidden md:block w-56 lg:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher (Cmd+K)..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all dark:text-gray-200 dark:placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <LiveClock />
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
          aria-label="Toggle theme"
          title={theme === 'dark' ? "Passer au thème clair" : "Passer au thème sombre"}
        >
          {mounted ? (theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-gray-600" />) : <div className="w-5 h-5" />}
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
            title="Centre de notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationCenter isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        </div>

        {/* Profile button opens profile page directly */}
        <button 
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all cursor-pointer group shadow-2xs"
          title="Mon Profil : Samuel Mbarga (Cliquer pour ouvrir)"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <User size={18} />
          </div>
          <span className="text-xs font-semibold pr-1.5 hidden sm:inline-block text-gray-700 dark:text-gray-200">
            Samuel M.
          </span>
        </button>
      </div>
    </header>
  );
}
