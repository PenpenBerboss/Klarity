import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Search, Bell, Menu, Moon, Sun, User, ListTodo } from 'lucide-react';
import { useTheme } from 'next-themes';
import { NotificationCenter } from './notification-center';
import { useNotifications } from './notification-provider';
import { getStoredTasks, getStoredTeam, getStoredUserProfile, getStoredUserSettings, saveUserSettings, Task, UserMember } from '@/lib/api';

type SearchResult =
  | { type: 'task'; id: string; label: string; detail: string; task: Task }
  | { type: 'member'; id: string; label: string; detail: string; member: UserMember };

function normalizeSearchText(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');
}

const LiveClock = dynamic(() => import('./live-clock').then(m => m.LiveClock), {
  ssr: false,
  loading: () => (
    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50/90 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 text-xs text-gray-400">
      <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      <span>Chargement...</span>
    </div>
  ),
});

export function Topbar({ 
  toggleSidebar, 
  onOpenProfile,
  onSearchTask,
  onSearchMember,
}: { 
  toggleSidebar: () => void;
  onOpenProfile?: () => void;
  onSearchTask: (query: string) => void;
  onSearchMember: (query: string) => void;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<UserMember[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { unreadCount } = useNotifications();

  const searchResults = useMemo<SearchResult[]>(() => {
    const query = normalizeSearchText(searchQuery.trim());
    if (!query) return [];
    const taskResults = tasks
      .filter(task => normalizeSearchText(`${task.title} ${task.id} ${task.project} ${task.assignee}`).includes(query))
      .slice(0, 5)
      .map(task => ({
        type: 'task' as const,
        id: task.id,
        label: task.title,
        detail: `${task.id} · ${task.project} · ${task.assignee || 'Non assignée'}`,
        task,
      }));
    const memberResults = team
      .filter(member => normalizeSearchText(`${member.name} ${member.email} ${member.role} ${member.department}`).includes(query))
      .slice(0, 5)
      .map(member => ({
        type: 'member' as const,
        id: String(member.id),
        label: member.name,
        detail: `${member.role} · ${member.email}`,
        member,
      }));
    return [...taskResults, ...memberResults].slice(0, 8);
  }, [searchQuery, tasks, team]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadProfile = () => {
      const profile = getStoredUserProfile();
      setProfileName(profile?.name || '');
      setProfileAvatar(profile?.avatarUrl || '');
    };
    const syncTheme = (event: Event) => {
      if ((event as CustomEvent<{ key?: string }>).detail?.key === 'user_settings') {
        setTheme(getStoredUserSettings().theme);
      }
    };
    loadProfile();
    window.addEventListener('klarity_db_update', loadProfile);
    window.addEventListener('klarity_db_update', syncTheme);
    return () => {
      window.removeEventListener('klarity_db_update', loadProfile);
      window.removeEventListener('klarity_db_update', syncTheme);
    };
  }, [setTheme]);

  useEffect(() => {
    const refreshSearchData = () => {
      setTasks(getStoredTasks());
      setTeam(getStoredTeam());
    };
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
    };
    refreshSearchData();
    window.addEventListener('klarity_db_update', refreshSearchData);
    window.addEventListener('keydown', focusSearch);
    return () => {
      window.removeEventListener('klarity_db_update', refreshSearchData);
      window.removeEventListener('keydown', focusSearch);
    };
  }, []);

  const selectSearchResult = (result: SearchResult) => {
    if (result.type === 'task') onSearchTask(result.task.id);
    else onSearchMember(result.member.name);
    setSearchOpen(false);
  };

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
            ref={searchInputRef}
            type="text" 
            value={searchQuery}
            onFocus={() => setSearchOpen(true)}
            onChange={event => {
              setSearchQuery(event.target.value);
              setSearchOpen(true);
            }}
            onKeyDown={event => {
              if (event.key === 'Escape') setSearchOpen(false);
              if (event.key === 'Enter' && searchResults[0]) selectSearchResult(searchResults[0]);
            }}
            placeholder="Rechercher une tâche ou un membre..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all dark:text-gray-200 dark:placeholder-gray-500"
          />
          {searchOpen && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full z-[60] mt-2 max-h-96 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl dark:border-gray-700 dark:bg-gray-900">
              {searchResults.length ? searchResults.map(result => (
                <button
                  key={`${result.type}-${result.id}`}
                  type="button"
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => selectSearchResult(result)}
                  className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {result.type === 'task' ? <ListTodo size={16} className="mt-0.5 shrink-0 text-indigo-500" /> : <User size={16} className="mt-0.5 shrink-0 text-emerald-500" />}
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold text-gray-900 dark:text-gray-100">{result.label}</span>
                    <span className="block truncate text-[10px] text-gray-500 dark:text-gray-400">{result.detail}</span>
                  </span>
                </button>
              )) : (
                <p className="px-3 py-4 text-center text-xs text-gray-500">Aucune tâche ou personne trouvée.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <LiveClock />
        <button 
          onClick={() => {
            const nextTheme = theme === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
            saveUserSettings({ theme: nextTheme });
          }}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
          aria-label="Toggle theme"
          title={mounted ? (theme === 'dark' ? "Passer au thème clair" : "Passer au thème sombre") : "Changer de thème"}
          suppressHydrationWarning
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
          title={profileName ? `Mon profil : ${profileName}` : 'Mon profil'}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            {profileAvatar
              ? <Image src={profileAvatar} alt="" width={32} height={32} unoptimized className="h-full w-full rounded-full object-cover" />
              : <User size={18} />}
          </div>
          <span className="text-xs font-semibold pr-1.5 hidden sm:inline-block text-gray-700 dark:text-gray-200">
            {profileName.split(' ').slice(0, 2).join(' ')}
          </span>
        </button>
      </div>
    </header>
  );
}
