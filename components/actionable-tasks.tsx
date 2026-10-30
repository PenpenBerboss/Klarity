"use client";

import React, { useState } from 'react';
import { AlertCircle, Clock, CheckCircle2, Plus, X } from 'lucide-react';
import { clsx } from 'clsx';

type TaskStatus = 'blocked' | 'delayed' | 'warning' | 'completed';

interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  status: TaskStatus;
  reason: string;
  impact: string;
}

const initialTasks: Task[] = [
  {
    id: "TSK-842",
    title: "Validation API de paiement Mobile Money",
    project: "Refonte ERP",
    assignee: "Samuel Mbarga",
    status: "blocked",
    reason: "Attente retour partenaire Orange/MTN",
    impact: "Chemin critique impacté (+2j)"
  },
  {
    id: "TSK-890",
    title: "Design System V2",
    project: "App Mobile",
    assignee: "Chantal Abena",
    status: "delayed",
    reason: "Surcharge de travail détectée",
    impact: "Risque sur le sprint actuel"
  },
  {
    id: "TSK-901",
    title: "Migration DB Prod",
    project: "Migration Cloud",
    assignee: "Emmanuel Nguema",
    status: "warning",
    reason: "Budget infrastructure > 90%",
    impact: "Alerte financière"
  }
];

const teamMembers = ["Samuel Mbarga", "Chantal Abena", "Emmanuel Nguema", "Nathalie Ekotto", "Dieudonné Tchato"];
const projects = ["Refonte ERP", "App Mobile", "Migration Cloud", "Site Web", "CRM V2"];

export function ActionableTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    project: projects[0],
    assignee: teamMembers[0],
    status: 'blocked' as TaskStatus,
    reason: '',
    impact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: `TSK-${Math.floor(Math.random() * 1000) + 1000}`,
      ...formData
    };
    setTasks([newTask, ...tasks]);
    setIsFormOpen(false);
    setFormData({
      title: '',
      project: projects[0],
      assignee: teamMembers[0],
      status: 'blocked',
      reason: '',
      impact: ''
    });
  };

  const updateTask = (id: string, field: keyof Task, value: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const cycleStatus = (id: string, currentStatus: TaskStatus) => {
    const nextStatusMap: Record<TaskStatus, TaskStatus> = {
      blocked: 'delayed',
      delayed: 'warning',
      warning: 'completed',
      completed: 'blocked'
    };
    updateTask(id, 'status', nextStatusMap[currentStatus]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
        >
          {isFormOpen ? <X size={16} /> : <Plus size={16} />}
          {isFormOpen ? "Fermer" : "Nouvelle tâche"}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Titre</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" placeholder="Ex: Mise à jour serveur" />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Projet</label>
              <select value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white">
                {projects.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Assigné</label>
              <select value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white">
                {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Statut</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as TaskStatus})} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white">
                <option value="blocked">Bloqué</option>
                <option value="delayed">Retard</option>
                <option value="warning">Avertissement</option>
                <option value="completed">Terminé</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Raison</label>
              <input required type="text" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" placeholder="Ex: Attente client" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Impact</label>
              <input required type="text" value={formData.impact} onChange={e => setFormData({...formData, impact: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" placeholder="Ex: +2 jours sur le sprint" />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Créer la tâche
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
              onClick={() => cycleStatus(task.id, task.status)}
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
                  onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                  className={clsx(
                    "text-sm font-medium truncate bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-0 p-0 m-0 w-full transition-colors",
                    task.status === 'completed' ? "text-gray-500 dark:text-gray-500 line-through" : "text-gray-900 dark:text-gray-100"
                  )}
                  title="Modifier le titre"
                />
                <span className="text-xs font-mono text-gray-400 dark:text-gray-500 shrink-0">{task.id}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md">{task.project}</span>
                <span>•</span>
                <select 
                  value={task.assignee}
                  onChange={(e) => updateTask(task.id, 'assignee', e.target.value)}
                  className="bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-0 p-0 m-0 text-xs text-gray-500 dark:text-gray-400 cursor-pointer transition-colors"
                  title="Modifier l'assigné"
                >
                  {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              
              <div className="flex items-center gap-2 text-xs w-full">
                <input
                  type="text"
                  value={task.reason}
                  onChange={(e) => updateTask(task.id, 'reason', e.target.value)}
                  className={clsx(
                    "font-medium bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-0 p-0 m-0 transition-colors",
                    task.status === 'blocked' ? "text-red-600 dark:text-red-400" : 
                    task.status === 'delayed' ? "text-amber-600 dark:text-amber-400" : 
                    task.status === 'warning' ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400"
                  )}
                  style={{ width: `${Math.max(task.reason.length, 5)}ch` }}
                  title="Modifier la raison"
                />
                <span className="text-gray-300 dark:text-gray-700 shrink-0">|</span>
                <input
                  type="text"
                  value={task.impact}
                  onChange={(e) => updateTask(task.id, 'impact', e.target.value)}
                  className="text-gray-500 dark:text-gray-400 bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-0 p-0 m-0 transition-colors flex-1"
                  title="Modifier l'impact"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
