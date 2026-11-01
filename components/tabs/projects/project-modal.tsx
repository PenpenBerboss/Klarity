"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Project, Milestone } from '@/lib/api';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProject: Project | null;
  onSave: (projectData: any) => void;
  managers: string[];
}

export function ProjectModal({
  isOpen,
  onClose,
  editingProject,
  onSave,
  managers
}: ProjectModalProps) {
  const [formData, setFormData] = useState<{
    id?: string;
    name: string;
    status: Project['status'];
    progress: number;
    budget: number;
    totalBudget: number;
    manager: string;
    dueDate: string;
    description: string;
    milestones: Milestone[];
  }>({
    name: '',
    status: 'on_track',
    progress: 0,
    budget: 0,
    totalBudget: 0,
    manager: managers[0] || '',
    dueDate: new Date().toISOString().split('T')[0],
    description: '',
    milestones: []
  });

  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  // Key-based state reset on editingProject change
  const [prevEditingProject, setPrevEditingProject] = useState<Project | null>(null);
  if (editingProject !== prevEditingProject) {
    setPrevEditingProject(editingProject);
    if (editingProject) {
      setFormData({
        id: editingProject.id,
        name: editingProject.name,
        status: editingProject.status,
        progress: editingProject.progress,
        budget: editingProject.budget,
        totalBudget: editingProject.totalBudget,
        manager: editingProject.manager,
        dueDate: editingProject.dueDate,
        description: editingProject.description || '',
        milestones: editingProject.milestones || []
      });
    } else {
      setFormData({
        name: '',
        status: 'on_track',
        progress: 0,
        budget: 0,
        totalBudget: 0,
        manager: managers[0] || '',
        dueDate: new Date().toISOString().split('T')[0],
        description: '',
        milestones: []
      });
    }
  }

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    const milestone: Milestone = {
      id: `M-${Date.now()}`,
      title: newMilestoneTitle.trim(),
      date: newMilestoneDate || formData.dueDate,
      completed: false
    };
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, milestone]
    }));
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
  };

  const handleDeleteMilestone = (id: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 cursor-default max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {editingProject ? 'Modifier le Projet' : 'Nouveau Projet'}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Nom du projet</label>
            <input 
              type="text" 
              required
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" 
              placeholder="Ex: Refonte Système ERP"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white resize-none" 
              placeholder="Description synthétique des objectifs..."
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Statut</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value as Project['status']})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white cursor-pointer"
              >
                <option value="on_track">Dans les temps</option>
                <option value="delayed">En retard</option>
                <option value="at_risk">À risque</option>
                <option value="completed">Terminé</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Progression (%)</label>
              <input 
                type="number" 
                min="0" max="100"
                value={formData.progress} 
                onChange={e => setFormData({...formData, progress: Number(e.target.value)})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Budget consommé (FCFA)</label>
              <input 
                type="number" 
                min="0"
                value={formData.budget} 
                onChange={e => setFormData({...formData, budget: Number(e.target.value)})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Budget total alloué (FCFA)</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.totalBudget} 
                onChange={e => setFormData({...formData, totalBudget: Number(e.target.value)})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Manager de projet</label>
              <select 
                value={formData.manager} 
                onChange={e => setFormData({...formData, manager: e.target.value})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white cursor-pointer"
              >
                <option value="">Aucun responsable</option>
                {managers.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Date d&apos;échéance</label>
              <input 
                type="date" 
                required
                value={formData.dueDate} 
                onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              />
            </div>
          </div>

          {/* Milestones Management */}
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 block">
              Jalons du projet ({formData.milestones.length})
            </label>

            <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
              {formData.milestones.map(m => (
                <div key={m.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200/60 dark:border-gray-800 text-xs">
                  <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{m.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">{m.date}</span>
                    <button 
                      type="button"
                      onClick={() => handleDeleteMilestone(m.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={newMilestoneTitle}
                onChange={e => setNewMilestoneTitle(e.target.value)}
                placeholder="Titre du jalon..."
                className="flex-1 px-2.5 py-1.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-xs focus:outline-none dark:text-white"
              />
              <input 
                type="date" 
                value={newMilestoneDate}
                onChange={e => setNewMilestoneDate(e.target.value)}
                className="px-2 py-1.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-xs focus:outline-none dark:text-white"
              />
              <button 
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus size={14} /> Ajouter
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
            >
              {editingProject ? 'Enregistrer' : 'Créer le projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
