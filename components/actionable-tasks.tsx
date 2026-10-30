"use client";

import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle2, Plus, X } from 'lucide-react';
import { clsx } from 'clsx';
import { 
  getStoredActionableTasks, 
  saveActionableTask, 
  getStoredTeam, 
  getStoredProjects, 
  ActionableTask 
} from '@/lib/api';

export function ActionableTasks() {
  const [tasks, setTasks] = useState<ActionableTask[]>([]);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
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
      setTeamMembers(team.length > 0 ? team : ['Samuel Mbarga']);

      const projs = getStoredProjects().map(p => p.name);
      setProjects(projs.length > 0 ? projs : ['Refonte ERP']);

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
      id: `TSK-${Math.floor(Math.random() * 1000) + 1000}`,
      title: formData.title,
      project: formData.project || projects[0] || 'Refonte ERP',
      assignee: formData.assignee || teamMembers[0] || 'Samuel Mbarga',
      status: formData.status,
      reason: formData.reason,
      impact: formData.impact
    };

    const updated = saveActionableTask(newTask);
    setTasks(updated);
    setIsFormOpen(false);
    setFormData({
      title: '',
      project: projects[0] || '',
      assignee: teamMembers[0] || '',
      status: 'blocked',
      reason: '',
      impact: ''
    });
  };

  const handleUpdateTask = (updatedTask: ActionableTask) => {
    const updated = saveActionableTask(updatedTask);
    setTasks(updated);
  };

  const cycleStatus = (task: ActionableTask) => {
    const nextStatusMap: Record<ActionableTask['status'], ActionableTask['status']> = {
      blocked: 'delayed',
      delayed: 'warning',
      warning: 'completed',
      completed: 'blocked'
    };
    handleUpdateTask({
      ...task,
      status: nextStatusMap[task.status]
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors cursor-pointer"
        >
          {isFormOpen ? <X size={16} /> : <Plus size={16} />}
          {isFormOpen ? "Fermer" : "Déclarer un blocage"}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 mb-4">
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
              Enregistrer en BDD
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-100 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-colors">
            <div 
              className="relative mt-0.5 cursor-pointer hover:scale-110 transition-transform" 
              title="Cliquer pour changer le statut"
              onClick={() => cycleStatus(task)}
            >
              {task.status === 'blocked' && <AlertCircle className="text-red-500" size={20} />}
              {task.status === 'delayed' && <Clock className="text-amber-500" size={20} />}
              {task.status === 'warning' && <AlertCircle className="text-orange-500" size={20} />}
              {task.status === 'completed' && <CheckCircle2 className="text-emerald-500" size={20} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1 gap-2">
                <input 
                  type="text"
                  value={task.title}
                  onChange={(e) => handleUpdateTask({ ...task, title: e.target.value })}
                  className={clsx(
                    "text-xs sm:text-sm font-semibold truncate bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-0 p-0 m-0 w-full transition-colors",
                    task.status === 'completed' ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-900 dark:text-gray-100"
                  )}
                />
                <span className="text-xs font-mono text-gray-400 dark:text-gray-500 shrink-0">{task.id}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md font-medium text-[11px]">{task.project}</span>
                <span>•</span>
                <select 
                  value={task.assignee}
                  onChange={(e) => handleUpdateTask({ ...task, assignee: e.target.value })}
                  className="bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-0 p-0 m-0 text-xs text-gray-500 dark:text-gray-400 cursor-pointer transition-colors font-medium"
                >
                  {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              
              <div className="flex items-center gap-2 text-xs w-full">
                <input
                  type="text"
                  value={task.reason}
                  onChange={(e) => handleUpdateTask({ ...task, reason: e.target.value })}
                  className={clsx(
                    "font-medium text-xs bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-0 p-0 m-0 transition-colors",
                    task.status === 'blocked' ? "text-red-600 dark:text-red-400" : 
                    task.status === 'delayed' ? "text-amber-600 dark:text-amber-400" : 
                    task.status === 'warning' ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400"
                  )}
                  style={{ width: `${Math.max(task.reason.length, 5)}ch` }}
                />
                <span className="text-gray-300 dark:text-gray-700 shrink-0">|</span>
                <input
                  type="text"
                  value={task.impact}
                  onChange={(e) => handleUpdateTask({ ...task, impact: e.target.value })}
                  className="text-xs text-gray-500 dark:text-gray-400 bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-0 p-0 m-0 transition-colors flex-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
