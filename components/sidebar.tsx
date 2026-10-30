import React from 'react';
import { 
  PieChart, FolderOpen, ListTodo, TrendingUp, 
  Users2, Settings, ChevronLeft, ChevronRight, BookOpen
} from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar({ isOpen, setIsOpen, activeTab, setActiveTab }: { isOpen: boolean, setIsOpen: (v: boolean) => void, activeTab: string, setActiveTab: (t: string) => void }) {
  const navItems = [
    { id: 'dashboard', icon: PieChart, label: 'Dashboard' },
    { id: 'projects', icon: FolderOpen, label: 'Projets' },
    { id: 'tasks', icon: ListTodo, label: 'Tâches' },
    { id: 'reports', icon: TrendingUp, label: 'Rapports' },
    { id: 'team', icon: Users2, label: 'Équipe' },
    { id: 'tutorial', icon: BookOpen, label: 'Tutoriel & Guide' },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    // On small screens, close sidebar after clicking
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={clsx(
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col z-40 shrink-0",
        // Desktop positioning
        "md:relative md:translate-x-0",
        // Mobile fixed drawer positioning
        "fixed inset-y-0 left-0",
        isOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
      )}>
        <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-gray-800">
          {isOpen ? (
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900 dark:text-white">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black shadow-xs">
                K
              </div>
              Klarity
            </div>
          ) : (
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-xs">
              K
            </div>
          )}
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 z-10 w-6 h-6 items-center justify-center text-gray-500 dark:text-gray-400 cursor-pointer"
          title={isOpen ? "Réduire le menu" : "Agrandir le menu"}
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id} 
                onClick={() => handleSelectTab(item.id)}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer",
                  activeTab === item.id 
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200",
                  !isOpen && "justify-center"
                )}
                title={!isOpen ? item.label : undefined}
              >
                <div className="w-5 flex justify-center shrink-0">
                  <Icon size={20} className={clsx(activeTab === item.id ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500")} />
                </div>
                {isOpen && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => handleSelectTab('settings')}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer",
              activeTab === 'settings' 
                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200",
              !isOpen && "justify-center"
            )}
            title={!isOpen ? "Paramètres" : undefined}
          >
            <div className="w-5 flex justify-center shrink-0">
              <Settings size={20} className={clsx(activeTab === 'settings' ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500")} />
            </div>
            {isOpen && <span className="text-sm">Paramètres</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
