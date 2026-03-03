import React from 'react';
import { X } from 'lucide-react';

export function TaskModal({ 
  editingTask, 
  setEditingTask, 
  saveTask, 
  projectsList, 
  teamMembers, 
  tasks 
}: { 
  editingTask: any, 
  setEditingTask: (task: any) => void, 
  saveTask: (e: React.FormEvent) => void,
  projectsList: string[],
  teamMembers: string[],
  tasks: any[]
}) {
  if (!editingTask) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-transparent dark:border-gray-800">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Configuration de la tâche</h2>
          <button onClick={() => setEditingTask(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={saveTask} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Titre</label>
            <input 
              type="text" 
              value={editingTask.title} 
              onChange={e => setEditingTask({...editingTask, title: e.target.value})} 
              className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Projet</label>
              <select 
                value={editingTask.project} 
                onChange={e => setEditingTask({...editingTask, project: e.target.value})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              >
                {projectsList.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Assigné</label>
              <select 
                value={editingTask.assignee} 
                onChange={e => setEditingTask({...editingTask, assignee: e.target.value})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              >
                {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priorité</label>
              <select 
                value={editingTask.priority} 
                onChange={e => setEditingTask({...editingTask, priority: e.target.value})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              >
                <option value="medium">Moyenne (Bleu)</option>
                <option value="high">Haute (Orange)</option>
                <option value="critical">Critique (Rouge)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Échéance</label>
              <input 
                type="date" 
                value={editingTask.dueDate || ''} 
                onChange={e => setEditingTask({...editingTask, dueDate: e.target.value})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dépendances (Bloqué par)</label>
            <div className="max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-800 rounded-lg p-2 bg-gray-50/50 dark:bg-gray-950 space-y-1 custom-scrollbar">
              {tasks.filter(t => t.id !== editingTask.id).map(t => (
                <label key={t.id} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer p-1.5 hover:bg-white dark:hover:bg-gray-900 rounded-md transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm">
                  <input
                    type="checkbox"
                    checked={editingTask.dependencies?.includes(t.id) || false}
                    onChange={(e) => {
                      const deps = editingTask.dependencies || [];
                      if (e.target.checked) {
                        setEditingTask({ ...editingTask, dependencies: [...deps, t.id] });
                      } else {
                        setEditingTask({ ...editingTask, dependencies: deps.filter((id: string) => id !== t.id) });
                      }
                    }}
                    className="rounded border-gray-300 dark:border-gray-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-white dark:bg-gray-900"
                  />
                  <span className="font-mono text-xs text-gray-400 dark:text-gray-500 w-12">{t.id}</span>
                  <span className="truncate flex-1">{t.title}</span>
                </label>
              ))}
              {tasks.length <= 1 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 p-2 text-center">Aucune autre tâche disponible.</div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
            <button 
              type="button" 
              onClick={() => setEditingTask(null)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
