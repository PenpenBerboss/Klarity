"use client";

import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle2, MoreHorizontal, Plus, X, Edit3 } from 'lucide-react';
import { clsx } from 'clsx';
import { 
  getStoredActionableTasks, 
  saveActionableTask, 
  getStoredTeam, 
  getStoredProjects, 
  ActionableTask,
  createEntityId
} from '@/lib/api';

export function ActionableTasks() {
  const [tasks, setTasks] = useState<ActionableTask[]>([]);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ActionableTask | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    project: '',
    assignee: '',
    status: 'blocked' as ActionableTask['status'],
    reason: '',
    impact: ''
  });

  useEffect(() => {
    const loadData = () => {
      const storedTasks = getStoredActionableTasks();
      setTasks(storedTasks);

      const team = getStoredTeam().filter(m => m.status !== 'invité').map(m => m.name);
      setTeamMembers(team);

      const projs = getStoredProjects().map(p => p.name);
      setProjects(projs);

      if (projs.length > 0 && team.length > 0) {
        setFormData(prev => ({
          ...prev,
          project: projs[0],
          assignee: team[0]
        }));
      }
    };

    loadData();

    const handleDbUpdate = () => loadData();
    window.addEventListener('klarity_db_update', handleDbUpdate);
    return () => window.removeEventListener('klarity_db_update', handleDbUpdate);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: ActionableTask = {
      id: editingTask?.id || createEntityId('BLK'),
      title: formData.title,
      project: formData.project || projects[0] || '',
      assignee: formData.assignee || teamMembers[0] || '',
      status: formData.status,
      reason: formData.reason,
      impact: formData.impact
    };

    const updated = saveActionableTask(newTask);
    setTasks(updated);
    setIsFormOpen(false);
    setEditingTask(null);
    setFormData({
      title: '',
      project: projects[0] || '',
      assignee: teamMembers[0] || '',
      status: 'blocked',
      reason: '',
      impact: ''
    });
  };

  const openCreateForm = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      project: projects[0] || '',
      assignee: teamMembers[0] || '',
      status: 'blocked',
      reason: '',
      impact: ''
    });
    setIsFormOpen(true);
  };

  const openEditForm = (task: ActionableTask) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      project: task.project,
      assignee: task.assignee,
      status: task.status,
      reason: task.reason,
      impact: task.impact
    });
    setActiveMenuId(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <button 
          onClick={() => isFormOpen ? setIsFormOpen(false) : openCreateForm()}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors cursor-pointer"
        >
          {isFormOpen ? <X size={16} /> : <Plus size={16} />}
          {isFormOpen ? "Fermer" : "Déclarer un blocage"}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {editingTask ? 'Modifier le point de blocage' : 'Nouveau point de blocage'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Titre</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" placeholder="Ex: Retard livraison module" />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Projet</label>
              <select value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white cursor-pointer">
                {projects.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Assigné</label>
              <select value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white cursor-pointer">
                {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Statut</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as ActionableTask['status']})} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white cursor-pointer">
                <option value="blocked">Bloqué</option>
                <option value="delayed">Retard</option>
                <option value="warning">Avertissement</option>
                <option value="completed">Terminé</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Raison</label>
              <input required type="text" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" placeholder="Ex: Attente retour partenaire" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Impact</label>
              <input required type="text" value={formData.impact} onChange={e => setFormData({...formData, impact: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" placeholder="Ex: +2 jours sur le sprint" />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer">
              {editingTask ? "Enregistrer les modifications" : "Enregistrer en BDD"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-100 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-colors">
            <div className="relative mt-0.5">
              {task.status === 'blocked' && <AlertCircle className="text-red-500" size={20} />}
              {task.status === 'delayed' && <Clock className="text-amber-500" size={20} />}
              {task.status === 'warning' && <AlertCircle className="text-orange-500" size={20} />}
              {task.status === 'completed' && <CheckCircle2 className="text-emerald-500" size={20} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1 gap-2">
                <p className={clsx(
                    "text-xs sm:text-sm font-semibold truncate",
                    task.status === 'completed' ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-900 dark:text-gray-100"
                  )}>{task.title}</p>
                <span className="text-xs font-mono text-gray-400 dark:text-gray-500 shrink-0">{task.id}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md font-medium text-[11px]">{task.project}</span>
                <span>•</span>
                <span className="truncate">{task.assignee || 'Non assigné'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs w-full">
                <span className={clsx(
                    "font-medium text-xs",
                    task.status === 'blocked' ? "text-red-600 dark:text-red-400" : 
                    task.status === 'delayed' ? "text-amber-600 dark:text-amber-400" : 
                    task.status === 'warning' ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400"
                  )}>{task.reason}</span>
                <span className="text-gray-300 dark:text-gray-700 shrink-0">|</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex-1">{task.impact}</span>
              </div>
            </div>
            <div className="relative shrink-0">
              <button
                type="button"
                aria-label={`Actions pour ${task.title}`}
                onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <MoreHorizontal size={18} />
              </button>
              {activeMenuId === task.id && (
                <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                  <button
                    type="button"
                    onClick={() => openEditForm(task)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <Edit3 size={14} /> Modifier le blocage
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
