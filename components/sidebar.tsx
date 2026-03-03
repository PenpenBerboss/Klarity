import React from 'react';
import { 
  PieChart, FolderOpen, ListTodo, BarChart3, 
  Users, Settings, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar({ isOpen, setIsOpen, activeTab, setActiveTab }: { isOpen: boolean, setIsOpen: (v: boolean) => void, activeTab: string, setActiveTab: (t: string) => void }) {
  const navItems = [
    { id: 'dashboard', icon: PieChart, label: 'Dashboard' },
    { id: 'projects', icon: FolderOpen, label: 'Projets' },
    { id: 'tasks', icon: ListTodo, label: 'Tâches' },
    { id: 'reports', icon: BarChart3, label: 'Rapports' },
    { id: 'team', icon: Users, label: 'Équipe' },
  ];

  return (
    <aside className={clsx(
      "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col relative shrink-0",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-gray-800">
        {isOpen ? (
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">K</span>
            </div>
            Klarity
          </div>
        ) : (
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">
            K
          </div>
        )}
      </div>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 z-10 w-6 h-6 flex items-center justify-center text-gray-500 dark:text-gray-400"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                activeTab === item.id 
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200",
                !isOpen && "justify-center"
              )}
              title={!isOpen ? item.label : undefined}
            >
              <div className="w-5 flex justify-center">
                <Icon size={20} className={clsx(activeTab === item.id ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500")} />
              </div>
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={() => setActiveTab('settings')}
          className={clsx(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
            activeTab === 'settings' 
              ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium" 
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200",
            !isOpen && "justify-center"
          )}
          title={!isOpen ? "Paramètres" : undefined}
        >
          <div className="w-5 flex justify-center">
            <Settings size={20} className={clsx(activeTab === 'settings' ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500")} />
          </div>
          {isOpen && <span>Paramètres</span>}
        </button>
      </div>
    </aside>
  );
}
