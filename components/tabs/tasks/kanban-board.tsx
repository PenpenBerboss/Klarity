import React from 'react';
import { MoreHorizontal, Plus, Trash2, Edit2, User, Tag, Link2 } from 'lucide-react';
import { clsx } from 'clsx';

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
  deleteTask
}: {
  initialColumns: any[],
  filteredTasks: any[],
  activeColumnId: string | null,
  draggedTaskId: string | null,
  handleDragOver: (e: React.DragEvent, columnId: string) => void,
  handleDragLeave: (e: React.DragEvent, columnId: string) => void,
  handleDrop: (e: React.DragEvent, columnId: string) => void,
  handleDragStart: (e: React.DragEvent, taskId: string) => void,
  handleDragEnd: () => void,
  activeMenuId: string | null,
  setActiveMenuId: (id: string | null) => void,
  menuRef: React.RefObject<HTMLDivElement | null>,
  openEditModal: (task: any) => void,
  deleteTask: (id: string) => void
}) {
  return (
    <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
      {initialColumns.map(col => {
        const columnTasks = filteredTasks.filter(t => t.status === col.id);
        const isActive = activeColumnId === col.id;
        
        return (
          <div 
            key={col.id} 
            className={clsx(
              "flex-shrink-0 w-96 flex flex-col rounded-2xl border p-5 transition-colors duration-200",
              isActive ? "bg-indigo-50/60 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/30 border-dashed" : "bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800"
            )}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={(e) => handleDragLeave(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="flex justify-between items-center mb-5 px-1">
              <h3 className={clsx("font-medium flex items-center gap-2 transition-colors", isActive ? "text-indigo-900 dark:text-indigo-300" : "text-gray-900 dark:text-gray-100")}>
                {col.title} <span className={clsx("text-xs px-2 py-0.5 rounded-full transition-colors", isActive ? "bg-indigo-200 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400")}>{columnTasks.length}</span>
              </h3>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><MoreHorizontal size={20} /></button>
            </div>
            
            <div className="flex-1 space-y-4 overflow-y-auto min-h-[150px] custom-scrollbar pr-1">
              {columnTasks.map(task => {
                const isDragging = draggedTaskId === task.id;
                return (
                  <div 
                    key={task.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    className={clsx(
                      "group relative bg-white dark:bg-gray-900 p-5 rounded-xl border hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-200 cursor-grab active:cursor-grabbing min-h-[130px] flex flex-col",
                      isDragging ? "opacity-40 scale-95 border-indigo-300 dark:border-indigo-500/50 shadow-none" : "opacity-100 border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-500/30"
                    )}
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === task.id ? null : task.id); }}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {activeMenuId === task.id && (
                      <div ref={menuRef} className="absolute top-12 right-3 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1 z-10 text-sm">
                        <button onClick={() => openEditModal(task)} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Edit2 size={14} className="text-gray-400" /> Modifier
                        </button>
                        <button onClick={() => openEditModal(task)} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <User size={14} className="text-gray-400" /> Changer l&apos;assigné
                        </button>
                        <button onClick={() => openEditModal(task)} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Tag size={14} className="text-gray-400" /> Modifier les labels
                        </button>
                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                        <button onClick={() => deleteTask(task.id)} className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-2">
                          <Trash2 size={14} /> Supprimer
                        </button>
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-3 pr-6">
                      <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{task.id}</span>
                      <span className={clsx(
                        "w-2.5 h-2.5 rounded-full",
                        task.priority === 'critical' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                      )} title={`Priorité: ${task.priority}`}></span>
                    </div>
                    <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4 leading-snug">{task.title}</h4>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex gap-2 items-center">
                        <span className="text-xs px-2.5 py-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md border border-gray-100 dark:border-gray-700">{task.project}</span>
                        {task.dependencies && task.dependencies.length > 0 && (
                          <span className="text-xs px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-md border border-amber-100 dark:border-amber-500/20 flex items-center gap-1.5" title={`Dépend de: ${task.dependencies.join(', ')}`}>
                            <Link2 size={12} />
                            {task.dependencies.length}
                          </span>
                        )}
                      </div>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-200 dark:from-indigo-500/20 dark:to-indigo-500/30 border border-white dark:border-gray-900 shadow-sm flex items-center justify-center text-xs font-medium text-indigo-700 dark:text-indigo-300" title={task.assignee}>
                        {task.assignee.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                    </div>
                  </div>
                );
              })}
              <button className="w-full py-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors border border-dashed border-gray-200 dark:border-gray-700">
                <Plus size={16} /> Ajouter une tâche
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
