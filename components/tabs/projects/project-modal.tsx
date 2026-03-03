import React from 'react';
import { X } from 'lucide-react';

export function ProjectModal({
  isModalOpen,
  setIsModalOpen,
  newProject,
  setNewProject,
  handleCreateProject
}: {
  isModalOpen: boolean,
  setIsModalOpen: (v: boolean) => void,
  newProject: any,
  setNewProject: (p: any) => void,
  handleCreateProject: (e: React.FormEvent) => void
}) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-transparent dark:border-gray-800">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Nouveau Projet</h2>
          <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleCreateProject} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom du projet</label>
            <input 
              type="text" 
              required
              value={newProject.name} 
              onChange={e => setNewProject({...newProject, name: e.target.value})} 
              className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white dark:placeholder-gray-500" 
              placeholder="Ex: Refonte Site Web"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Statut</label>
              <select 
                value={newProject.status} 
                onChange={e => setNewProject({...newProject, status: e.target.value})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              >
                <option value="on_track">Dans les temps</option>
                <option value="delayed">En retard</option>
                <option value="at_risk">À risque</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Progression (%)</label>
              <input 
                type="number" 
                min="0" max="100"
                value={newProject.progress} 
                onChange={e => setNewProject({...newProject, progress: Number(e.target.value)})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget Alloué (M FCFA)</label>
              <input 
                type="number" 
                required
                min="0"
                value={newProject.totalBudget} 
                onChange={e => setNewProject({...newProject, totalBudget: Number(e.target.value)})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget Consommé (M FCFA)</label>
              <input 
                type="number" 
                min="0"
                value={newProject.budget} 
                onChange={e => setNewProject({...newProject, budget: Number(e.target.value)})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Manager</label>
              <input 
                type="text" 
                required
                value={newProject.manager} 
                onChange={e => setNewProject({...newProject, manager: e.target.value})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white dark:placeholder-gray-500"
                placeholder="Nom du manager"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Échéance</label>
              <input 
                type="date" 
                required
                value={newProject.dueDate} 
                onChange={e => setNewProject({...newProject, dueDate: e.target.value})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Créer le projet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
