import React from 'react';
import { ChevronLeft, ChevronRight, Link2 } from 'lucide-react';
import { clsx } from 'clsx';
import { UserMember } from '@/lib/api';
import { TaskAssigneeAvatar } from './task-assignee-avatar';

export function CalendarView({
  currentMonth,
  setCurrentMonth,
  filteredTasks,
  openEditModal,
  teamProfiles,
}: {
  currentMonth: Date,
  setCurrentMonth: (date: Date) => void,
  filteredTasks: any[],
  openEditModal: (task: any) => void,
  teamProfiles: UserMember[],
}) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startingEmptyCells = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Lundi = 1er jour

  const days = [];
  for (let i = 0; i < startingEmptyCells; i++) {
    days.push(<div key={`empty-${i}`} className="bg-gray-50/30 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800 min-h-[120px] rounded-xl"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayTasks = filteredTasks.filter(t => t.dueDate === dateStr);
    
    const isToday = dateStr === new Date().toISOString().split('T')[0];

    days.push(
      <div key={d} className={clsx(
        "bg-white dark:bg-gray-900 border min-h-[140px] p-3 rounded-xl flex flex-col transition-colors group",
        isToday ? "border-indigo-300 dark:border-indigo-500/50 shadow-sm" : "border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-500/30"
      )}>
        <div className="flex justify-between items-start mb-3">
          <span className={clsx(
            "text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full",
            isToday ? "bg-indigo-600 text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
          )}>
            {d}
          </span>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          {dayTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => openEditModal(task)}
              className={clsx(
                "text-xs px-2.5 py-2 rounded-md cursor-pointer hover:opacity-80 transition-opacity border flex items-center justify-between gap-1",
                task.priority === 'critical' ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20' :
                task.priority === 'high' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20' :
                'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20'
              )}
              title={task.title}
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{task.title}</div>
                <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[10px] opacity-80">
                  <TaskAssigneeAvatar assignee={task.assignee || ''} teamMembers={teamProfiles} size={18} />
                  <span className="truncate">{task.assignee || 'Non assignée'}</span>
                </div>
              </div>
              {task.dependencies && task.dependencies.length > 0 && (
                <span title={`Dépend de: ${task.dependencies.join(', ')}`} className="shrink-0 opacity-70 flex items-center">
                  <Link2 size={12} />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden min-h-[600px]">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white w-48">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-1 shadow-sm">
            <button 
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 h-8 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors"
            >
              Aujourd&apos;hui
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
          <div key={d} className="bg-white dark:bg-gray-900 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{d}</div>
        ))}
      </div>
      
      <div className="flex-1 grid grid-cols-7 gap-2 p-3 bg-gray-50/30 dark:bg-gray-800/10 overflow-y-auto">
        {days}
      </div>
    </div>
  );
}
