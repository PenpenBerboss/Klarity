"use client";

import React, { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight, Calendar, MoveHorizontal } from 'lucide-react';

import { Task } from '@/lib/api';

interface TimelineViewProps {
  filteredTasks: Task[];
}

export function TimelineView({ filteredTasks }: TimelineViewProps) {
  const [startDate, setStartDate] = useState(new Date(2026, 2, 1)); // March 2026 default
  const totalDays = 60; // 60 days scrollable range
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mouse drag-to-scroll states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Generate date array
  const days = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.8; // scroll multiplier
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const shiftDays = (amount: number) => {
    const next = new Date(startDate);
    next.setDate(startDate.getDate() + amount);
    setStartDate(next);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs animate-in fade-in duration-300 flex flex-col">
      {/* Navigation Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50 dark:bg-gray-800/40">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Vue Timeline Gantt ({days[0].toLocaleDateString('fr', { month: 'short', year: 'numeric' })} - {days[days.length - 1].toLocaleDateString('fr', { month: 'short', year: 'numeric' })})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 flex items-center gap-1 mr-2 hidden md:flex">
            <MoveHorizontal size={14} /> Glisser pour défiler les jours
          </span>
          <button 
            onClick={() => shiftDays(-7)}
            className="p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft size={16} /> -7 jours
          </button>
          <button 
            onClick={() => setStartDate(new Date(2026, 2, 1))}
            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/60 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors text-xs font-medium cursor-pointer"
          >
            Aujourd&apos;hui
          </button>
          <button 
            onClick={() => shiftDays(7)}
            className="p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
          >
            +7 jours <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Draggable Scroll Area */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={clsx(
          "overflow-x-auto custom-scrollbar select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        <div className="min-w-[2400px]">
          {/* Header Row */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-100/60 dark:bg-gray-800/80 sticky top-0 z-20">
            <div className="w-64 p-3.5 border-r border-gray-200 dark:border-gray-800 font-bold text-xs text-gray-600 dark:text-gray-300 uppercase tracking-wider shrink-0 bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-xs">
              Tâche / Projet
            </div>
            <div className="flex-1 flex">
              {days.map((day, i) => {
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                const isToday = day.toDateString() === new Date().toDateString();
                return (
                  <div 
                    key={i} 
                    className={clsx(
                      "flex-1 min-w-[45px] p-2 text-center border-r border-gray-200/50 dark:border-gray-800/50 last:border-0 shrink-0",
                      isWeekend && "bg-gray-100/40 dark:bg-gray-800/20",
                      isToday && "bg-indigo-50 dark:bg-indigo-950/40"
                    )}
                  >
                    <p className="text-[10px] text-gray-400 font-medium uppercase">{day.toLocaleDateString('fr', { weekday: 'short' }).charAt(0)}</p>
                    <p className={clsx("text-xs font-bold", isToday ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300")}>
                      {day.getDate()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Body Rows */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredTasks.map(task => {
              const taskDueDate = new Date(task.dueDate);
              
              // Calculate day index relative to timeline start
              const diffTime = taskDueDate.getTime() - startDate.getTime();
              const endDayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              const duration = 5; // default bar length in days
              const startDayIndex = Math.max(0, endDayIndex - duration);
              
              const isVisible = startDayIndex < totalDays && endDayIndex >= 0;

              return (
                <div key={task.id} className="flex hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                  <div className="w-64 p-3.5 border-r border-gray-200 dark:border-gray-800 flex flex-col justify-center shrink-0 bg-white dark:bg-gray-900 group-hover:bg-gray-50/50 dark:group-hover:bg-gray-800/30">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{task.title}</p>
                    <p className="text-[10px] text-gray-400 truncate">{task.project} • {task.id}</p>
                  </div>
                  
                  <div className="flex-1 flex relative h-14 items-center">
                    {/* Grid Lines */}
                    {days.map((day, i) => {
                      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                      return (
                        <div key={i} className={clsx(
                          "flex-1 h-full border-r border-gray-100 dark:border-gray-800/40 last:border-0 shrink-0 min-w-[45px]",
                          isWeekend && "bg-gray-50/30 dark:bg-gray-800/10"
                        )}></div>
                      );
                    })}
                    
                    {/* Task Bar */}
                    {isVisible && (
                      <div 
                        className={clsx(
                          "absolute h-7 rounded-lg shadow-xs flex items-center px-3 text-[10px] font-bold text-white transition-all transform hover:scale-[1.01] cursor-pointer z-10",
                          task.priority === 'critical' ? 'bg-red-500' : task.priority === 'high' ? 'bg-amber-500' : 'bg-indigo-600'
                        )}
                        style={{ 
                          left: `${(startDayIndex / totalDays) * 100}%`, 
                          width: `${(duration / totalDays) * 100}%` 
                        }}
                        title={`${task.title} - ${task.assignee} (${task.dueDate})`}
                      >
                        <span className="truncate">{task.assignee}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="p-3 bg-gray-50/80 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span>Critique</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-500"></div>
            <span>Haute</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-indigo-600"></div>
            <span>Moyenne</span>
          </div>
        </div>
        <span className="text-[11px] text-gray-400">Maintenez le bouton de la souris enfoncé et glissez pour faire défiler la ligne du temps</span>
      </div>
    </div>
  );
}
