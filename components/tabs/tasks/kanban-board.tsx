"use client";

import React, { useState } from 'react';
import { MoreHorizontal, Plus, Trash2, Edit2, User, Tag, Link2, Copy, ArrowRight, Flag, CheckSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { DeadlineTimerBadge } from '../../deadline-timer-badge';

import { Task } from '@/lib/api';

interface Column {
  id: string;
  title: string;
}

interface KanbanBoardProps {
  initialColumns: Column[];
  filteredTasks: Task[];
  activeColumnId: string | null;
  draggedTaskId: string | null;
  handleDragOver: (e: React.DragEvent, columnId: string) => void;
  handleDragLeave: (e: React.DragEvent, columnId: string) => void;
  handleDrop: (e: React.DragEvent, columnId: string) => void;
  handleDragStart: (e: React.DragEvent, taskId: string) => void;
  handleDragEnd: () => void;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  openEditModal: (task: Task) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, newStatus: string) => void;
  updateTaskPriority: (taskId: string, newPriority: string) => void;
  updateTaskAssignee: (taskId: string, newAssignee: string) => void;
  teamMembers: string[];
  projectsList: string[];
}

export function KanbanBoard({
  initialColumns,
  filteredTasks,
  activeColumnId,
  draggedTaskId,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleDragStart,
  handleDragEnd,
  activeMenuId,
  setActiveMenuId,
  menuRef,
  openEditModal,
  deleteTask,
  duplicateTask,
  updateTaskStatus,
  updateTaskPriority,
  updateTaskAssignee,
  teamMembers,
  projectsList
}: KanbanBoardProps) {
  const [activeSubMenu, setActiveSubMenu] = useState<'status' | 'priority' | 'assignee' | null>(null);

  const priorityLabels: Record<string, { label: string; color: string }> = {
    critical: { label: 'Critique', color: 'bg-red-500 text-white' },
    high: { label: 'Haute', color: 'bg-amber-500 text-white' },
    medium: { label: 'Moyenne', color: 'bg-blue-500 text-white' },
  };

  return (
    <div className="flex-1 flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
      {initialColumns.map(col => {
        const columnTasks = filteredTasks.filter(t => t.status === col.id);
        const isActive = activeColumnId === col.id;
        
        return (
          <div 
            key={col.id} 
            className={clsx(
              "flex-shrink-0 w-88 lg:w-96 flex flex-col rounded-2xl border p-4 transition-colors duration-200",
              isActive 
                ? "bg-indigo-50/60 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/30 border-dashed" 
                : "bg-gray-50/60 dark:bg-gray-900/40 border-gray-200/80 dark:border-gray-800"
            )}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={(e) => handleDragLeave(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className={clsx(
                "font-semibold text-sm flex items-center gap-2 transition-colors",
                isActive ? "text-indigo-900 dark:text-indigo-300" : "text-gray-900 dark:text-gray-100"
              )}>
                <span>{col.title}</span>
                <span className={clsx(
                  "text-xs px-2 py-0.5 rounded-full font-medium transition-colors",
                  isActive ? "bg-indigo-200 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300" : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                )}>
                  {columnTasks.length}
                </span>
              </h3>
            </div>
            
            {/* Column Content */}
            <div className="flex-1 space-y-3.5 overflow-y-auto min-h-[160px] custom-scrollbar pr-1">
              {columnTasks.map(task => {
                const isDragging = draggedTaskId === task.id;
                const isMenuOpen = activeMenuId === task.id;
                const completedSubtasks = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
                const totalSubtasks = task.subtasks ? task.subtasks.length : 0;

                return (
                  <div 
                    key={task.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    className={clsx(
                      "group relative bg-white dark:bg-gray-900 p-4 rounded-xl border hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing min-h-[130px] flex flex-col justify-between",
                      isMenuOpen ? "z-40 border-indigo-400 dark:border-indigo-500 shadow-lg" : "z-10 border-gray-200/80 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-500/30",
                      isDragging && "opacity-40 scale-95 border-indigo-400 shadow-none"
                    )}
                  >
                    {/* Card Top Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-medium text-gray-400 dark:text-gray-500">{task.id}</span>
                        <DeadlineTimerBadge dueDate={task.dueDate} status={task.status} />
                      </div>

                      {/* 3-Dots Action Button */}
                      <div className="relative">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setActiveSubMenu(null);
                            setActiveMenuId(isMenuOpen ? null : task.id); 
                          }}
                          className={clsx(
                            "p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer",
                            isMenuOpen && "text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800"
                          )}
                          title="Actions de la tâche"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {/* Dropdown Menu - Elevate with z-50 */}
                        {isMenuOpen && (
                          <div 
                            ref={menuRef} 
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-8 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 py-1.5 z-50 text-xs text-gray-700 dark:text-gray-200 animate-in fade-in zoom-in-95 duration-100"
                          >
                            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 mb-1">
                              Actions rapides
                            </div>

                            <button 
                              onClick={() => { openEditModal(task); setActiveMenuId(null); }} 
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                            >
                              <Edit2 size={14} className="text-indigo-500" />
                              <span>Modifier la tâche</span>
                            </button>

                            <button 
                              onClick={() => { duplicateTask(task); setActiveMenuId(null); }} 
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                            >
                              <Copy size={14} className="text-emerald-500" />
                              <span>Dupliquer la tâche</span>
                            </button>

                            {/* Submenu Trigger: Status */}
                            <div className="relative">
                              <button 
                                onClick={() => setActiveSubMenu(activeSubMenu === 'status' ? null : 'status')}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-2.5">
                                  <ArrowRight size={14} className="text-blue-500" />
                                  <span>Changer statut</span>
                                </span>
                                <span className="text-[10px] text-gray-400">›</span>
                              </button>

                              {activeSubMenu === 'status' && (
                                <div className="bg-gray-50 dark:bg-gray-800/80 p-1 mx-2 rounded-lg my-1 space-y-0.5">
                                  {initialColumns.map(c => (
                                    <button
                                      key={c.id}
                                      onClick={() => {
                                        updateTaskStatus(task.id, c.id);
                                        setActiveMenuId(null);
                                      }}
                                      className={clsx(
                                        "w-full text-left px-2.5 py-1.5 rounded text-[11px] flex items-center justify-between cursor-pointer",
                                        task.status === c.id ? "font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40" : "hover:bg-gray-200/60 dark:hover:bg-gray-700/60 text-gray-600 dark:text-gray-300"
                                      )}
                                    >
                                      <span>{c.title}</span>
                                      {task.status === c.id && <span className="text-indigo-600 dark:text-indigo-400">✓</span>}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Submenu Trigger: Priority */}
                            <div className="relative">
                              <button 
                                onClick={() => setActiveSubMenu(activeSubMenu === 'priority' ? null : 'priority')}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-2.5">
                                  <Flag size={14} className="text-amber-500" />
                                  <span>Changer priorité</span>
                                </span>
                                <span className="text-[10px] text-gray-400">›</span>
                              </button>

                              {activeSubMenu === 'priority' && (
                                <div className="bg-gray-50 dark:bg-gray-800/80 p-1 mx-2 rounded-lg my-1 space-y-0.5">
                                  {[
                                    { id: 'critical', label: 'Critique', color: 'text-red-600 dark:text-red-400' },
                                    { id: 'high', label: 'Haute', color: 'text-amber-600 dark:text-amber-400' },
                                    { id: 'medium', label: 'Moyenne', color: 'text-blue-600 dark:text-blue-400' },
                                  ].map(p => (
                                    <button
                                      key={p.id}
                                      onClick={() => {
                                        updateTaskPriority(task.id, p.id);
                                        setActiveMenuId(null);
                                      }}
                                      className={clsx(
                                        "w-full text-left px-2.5 py-1.5 rounded text-[11px] flex items-center justify-between cursor-pointer",
                                        task.priority === p.id ? "font-semibold bg-gray-200/80 dark:bg-gray-700" : "hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
                                      )}
                                    >
                                      <span className={p.color}>{p.label}</span>
                                      {task.priority === p.id && <span>✓</span>}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Submenu Trigger: Assignee */}
                            <div className="relative">
                              <button 
                                onClick={() => setActiveSubMenu(activeSubMenu === 'assignee' ? null : 'assignee')}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-2.5">
                                  <User size={14} className="text-purple-500" />
                                  <span>Re-assigner</span>
                                </span>
                                <span className="text-[10px] text-gray-400">›</span>
                              </button>

                              {activeSubMenu === 'assignee' && (
                                <div className="bg-gray-50 dark:bg-gray-800/80 p-1 mx-2 rounded-lg my-1 space-y-0.5 max-h-36 overflow-y-auto custom-scrollbar">
                                  {teamMembers.map(m => (
                                    <button
                                      key={m}
                                      onClick={() => {
                                        updateTaskAssignee(task.id, m);
                                        setActiveMenuId(null);
                                      }}
                                      className={clsx(
                                        "w-full text-left px-2 py-1 rounded text-[11px] truncate cursor-pointer",
                                        task.assignee === m ? "font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40" : "hover:bg-gray-200/60 dark:hover:bg-gray-700/60 text-gray-600 dark:text-gray-300"
                                      )}
                                    >
                                      {m}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>

                            <button 
                              onClick={() => { deleteTask(task.id); setActiveMenuId(null); }} 
                              className="w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
                              <span>Supprimer la tâche</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Task Title */}
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white my-2 leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => openEditModal(task)}>
                      {task.title}
                    </h4>

                    {/* Subtasks Progress Bar if present */}
                    {totalSubtasks > 0 && (
                      <div className="my-2 bg-gray-50 dark:bg-gray-800/60 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                          <span className="flex items-center gap-1 font-medium">
                            <CheckSquare size={12} className="text-indigo-500" />
                            Sous-tâches
                          </span>
                          <span>{completedSubtasks}/{totalSubtasks}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
                            style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Card Footer Info */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80">
                      <div className="flex gap-2 items-center">
                        <span className="text-[11px] font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md border border-gray-200/50 dark:border-gray-700">
                          {task.project}
                        </span>

                        {task.priority && (
                          <span className={clsx(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-md",
                            priorityLabels[task.priority]?.color || "bg-gray-200 text-gray-700"
                          )}>
                            {priorityLabels[task.priority]?.label || task.priority}
                          </span>
                        )}

                        {task.dependencies && task.dependencies.length > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-md border border-amber-200/60 dark:border-amber-500/20 flex items-center gap-1" title={`Dépend de: ${task.dependencies.join(', ')}`}>
                            <Link2 size={11} />
                            {task.dependencies.length}
                          </span>
                        )}
                      </div>

                      {/* Assignee Avatar Badge */}
                      <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/50" title={`Assigné à: ${task.assignee}`}>
                        <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">
                          {task.assignee ? task.assignee.charAt(0) : <User size={10} />}
                        </div>
                        <span className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300 truncate max-w-[80px]">
                          {task.assignee ? task.assignee.split(' ')[0] : 'Inconnu'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Task Quick Button */}
              <button 
                onClick={() => openEditModal({ id: '', title: '', project: projectsList[0] || '', assignee: teamMembers[0] || '', status: col.id as any, priority: 'medium', dueDate: new Date().toISOString().split('T')[0] })}
                className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 rounded-xl transition-all border border-dashed border-gray-300 dark:border-gray-700 cursor-pointer"
              >
                <Plus size={14} /> Ajouter une tâche
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
