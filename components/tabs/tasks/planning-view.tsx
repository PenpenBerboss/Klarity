"use client";

import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, GripVertical, Play, Clock, Calendar, Edit2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import { useNotifications } from '@/components/notification-provider';

import { Task, Sprint } from '@/lib/api';

interface PlanningViewProps {
  tasks: Task[];
  setTasks: (tasks: any) => void;
  sprints: Sprint[];
  setSprints: (sprints: Sprint[]) => void;
  openEditModal: (task: Task) => void;
}

export function PlanningView({ tasks, setTasks, sprints, setSprints, openEditModal }: PlanningViewProps) {
  const [expandedSprints, setExpandedSprints] = useState<string[]>(['SPR-1', 'SPR-2', 'backlog']);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [sprintForm, setSprintForm] = useState({ name: '', startDate: '', endDate: '' });
  const { addNotification } = useNotifications();

  const toggleSprint = (id: string) => {
    setExpandedSprints(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getSprintTasks = (sprintId: string | null) => {
    return tasks.filter(t => t.sprintId === sprintId);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, sprintId: string | null) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.assignee === 'Samuel Mbarga' && task.sprintId !== sprintId) {
        addNotification({
          type: 'task_assigned',
          title: 'Tâche Réassignée',
          message: `La tâche "${task.title}" a été déplacée vers le sprint "${sprints.find(s => s.id === sprintId)?.name || 'Backlog'}".`,
          link: '#'
        });
      }
      setTasks(tasks.map(t => t.id === taskId ? { ...t, sprintId } : t));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSprintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSprint) {
      setSprints(sprints.map(s => s.id === editingSprint.id ? { ...s, ...sprintForm } : s));
    } else {
      const newSprint: Sprint = {
        id: `SPR-${Date.now()}`,
        name: sprintForm.name,
        startDate: sprintForm.startDate,
        endDate: sprintForm.endDate,
        status: 'planned',
      };
      setSprints([...sprints, newSprint]);
    }
    setIsSprintModalOpen(false);
    setEditingSprint(null);
    setSprintForm({ name: '', startDate: '', endDate: '' });
  };

  const openCreateSprint = () => {
    setEditingSprint(null);
    setSprintForm({ name: '', startDate: '', endDate: '' });
    setIsSprintModalOpen(true);
  };

  const openEditSprint = (sprint: Sprint) => {
    setEditingSprint(sprint);
    setSprintForm({
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate
    });
    setIsSprintModalOpen(true);
  };

  const deleteSprint = (sprintId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce sprint ? Les tâches seront déplacées vers le backlog.')) {
      setSprints(sprints.filter(s => s.id !== sprintId));
      setTasks(tasks.map(t => t.sprintId === sprintId ? { ...t, sprintId: null } : t));
    }
  };

  const completeSprint = (sprintId: string) => {
    const sprint = sprints.find(s => s.id === sprintId);
    if (sprint) {
      addNotification({
        type: 'system',
        title: 'Sprint Terminé',
        message: `Le sprint "${sprint.name}" a été marqué comme terminé.`,
        link: '#'
      });
    }
    setSprints(sprints.map(s => s.id === sprintId ? { ...s, status: 'completed' } : s));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Planification Agile</h2>
        <button 
          onClick={openCreateSprint}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} /> Créer un Sprint
        </button>
      </div>

      <div className="space-y-4">
        {/* Active & Planned Sprints */}
        {sprints.map(sprint => (
          <div 
            key={sprint.id} 
            className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, sprint.id)}
          >
            <div 
              className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer select-none"
              onClick={() => toggleSprint(sprint.id)}
            >
              <div className="flex items-center gap-3">
                {expandedSprints.includes(sprint.id) ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  {sprint.name}
                  {sprint.status === 'active' && <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase font-bold rounded-full flex items-center gap-1"><Play size={8} fill="currentColor" /> Actif</span>}
                  {sprint.status === 'planned' && <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] uppercase font-bold rounded-full flex items-center gap-1"><Clock size={8} /> Planifié</span>}
                </h3>
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Calendar size={12} /> {sprint.startDate} - {sprint.endDate}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEditSprint(sprint); }}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteSprint(sprint.id); }}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {getSprintTasks(sprint.id).length} tâches
                </span>
                {sprint.status !== 'completed' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); completeSprint(sprint.id); }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Terminer le Sprint
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {expandedSprints.includes(sprint.id) && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-2 space-y-1">
                    {getSprintTasks(sprint.id).map(task => (
                      <div 
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical size={14} className="text-gray-300 group-hover:text-gray-400" />
                        <span className="text-xs font-mono text-gray-400 w-16">{task.id}</span>
                        <p className="text-sm text-gray-700 dark:text-gray-200 flex-1 font-medium">{task.title}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                            {task.project}
                          </span>
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border border-white dark:border-gray-900" title={task.assignee}>
                              {task.assignee.charAt(0)}
                            </div>
                          </div>
                          <button 
                            onClick={() => openEditModal(task)}
                            className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Plus size={14} className="rotate-45" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {getSprintTasks(sprint.id).length === 0 && (
                      <div className="p-8 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-lg">
                        <p className="text-sm text-gray-400">Faites glisser des tâches ici pour les ajouter au sprint.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Backlog */}
        <div 
          className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, null)}
        >
          <div 
            className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer select-none"
            onClick={() => toggleSprint('backlog')}
          >
            <div className="flex items-center gap-3">
              {expandedSprints.includes('backlog') ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
              <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                Backlog du Produit
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] uppercase font-bold rounded-full">Non planifié</span>
              </h3>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {getSprintTasks(null).length} tâches
            </span>
          </div>

          <AnimatePresence>
            {expandedSprints.includes('backlog') && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-2 space-y-1">
                  {getSprintTasks(null).map(task => (
                    <div 
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical size={14} className="text-gray-300 group-hover:text-gray-400" />
                      <span className="text-xs font-mono text-gray-400 w-16">{task.id}</span>
                      <p className="text-sm text-gray-700 dark:text-gray-200 flex-1 font-medium">{task.title}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                          {task.project}
                        </span>
                        <button 
                          onClick={() => openEditModal(task)}
                          className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus size={14} className="rotate-45" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {getSprintTasks(null).length === 0 && (
                    <div className="p-8 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-lg">
                      <p className="text-sm text-gray-400">Le backlog est vide.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sprint Modal */}
      <AnimatePresence>
        {isSprintModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSprintModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingSprint ? 'Modifier le Sprint' : 'Nouveau Sprint'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Définissez les objectifs et la durée du sprint.</p>
              </div>
              <form onSubmit={handleSprintSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom du Sprint</label>
                  <input 
                    name="name"
                    required
                    value={sprintForm.name}
                    onChange={e => setSprintForm({ ...sprintForm, name: e.target.value })}
                    placeholder="Ex: Sprint 3 - Core Features"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date de début</label>
                    <input 
                      name="startDate"
                      type="date"
                      required
                      value={sprintForm.startDate}
                      onChange={e => setSprintForm({ ...sprintForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date de fin</label>
                    <input 
                      name="endDate"
                      type="date"
                      required
                      value={sprintForm.endDate}
                      onChange={e => setSprintForm({ ...sprintForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsSprintModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    {editingSprint ? 'Enregistrer les modifications' : 'Créer le Sprint'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
