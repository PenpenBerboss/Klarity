"use client";

import React, { useState, useEffect } from 'react';
import { MoreVertical, Calendar, CheckCircle2, AlertCircle, Clock, Plus, Trash2, Edit2, Archive, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import { ProjectModal } from './projects/project-modal';
import { 
  getStoredProjects, 
  saveProject as saveProjectToDb, 
  deleteProject as deleteProjectFromDb, 
  getStoredTeam, 
  Project 
} from '@/lib/api';

export function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [managers, setManagers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Load from database storage
  useEffect(() => {
    const loadFromDb = () => {
      setProjects(getStoredProjects());
      const team = getStoredTeam().filter(m => m.status !== 'invité').map(m => m.name);
      setManagers(team.length > 0 ? team : ['Samuel Mbarga']);
    };

    loadFromDb();

    const handleDbUpdate = () => loadFromDb();
    window.addEventListener('klarity_db_update', handleDbUpdate);
    return () => window.removeEventListener('klarity_db_update', handleDbUpdate);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteProject = (id: string) => {
    const updated = deleteProjectFromDb(id);
    setProjects(updated);
    setActiveMenuId(null);
  };

  const handleToggleMilestone = (projectId: string, milestoneId: string) => {
    const targetProject = projects.find(p => p.id === projectId);
    if (!targetProject) return;

    const updatedMilestones = targetProject.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const progress = updatedMilestones.length > 0 
      ? Math.round((completedCount / updatedMilestones.length) * 100)
      : targetProject.progress;

    const updated = saveProjectToDb({
      ...targetProject,
      milestones: updatedMilestones,
      progress
    });

    setProjects(updated);
  };

  const handleSaveProject = (projectData: any) => {
    const updated = saveProjectToDb(projectData);
    setProjects(updated);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Projets & Jalons</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Suivi en direct des projets enregistrés en base de données.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
        >
          <Plus size={16} /> Nouveau Projet
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const completedMilestones = project.milestones.filter(m => m.completed).length;
          const totalMilestones = project.milestones.length;

          return (
            <div 
              key={project.id} 
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xs border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider">{project.id}</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{project.name}</h3>
                  </div>

                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === project.id ? null : project.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenuId === project.id && (
                      <div 
                        ref={menuRef}
                        className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 animate-in fade-in zoom-in-95"
                      >
                        <button 
                          onClick={() => openEditModal(project)}
                          className="w-full px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                        >
                          <Edit2 size={14} /> Modifier
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          className="w-full px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 size={14} /> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={clsx(
                    "px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5",
                    project.status === 'on_track' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" :
                    project.status === 'delayed' ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" :
                    project.status === 'at_risk' ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400" :
                    "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                  )}>
                    {project.status === 'on_track' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    {project.status === 'on_track' ? 'Dans les temps' :
                     project.status === 'delayed' ? 'En retard' :
                     project.status === 'at_risk' ? 'À risque' : 'Terminé'}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">• Manager: {project.manager}</span>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-500 dark:text-gray-400">Progression globale</span>
                    <span className="text-gray-900 dark:text-white font-bold">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                    <div 
                      className={clsx(
                        "h-2 rounded-full transition-all duration-300",
                        project.progress === 100 ? "bg-emerald-500" :
                        project.status === 'at_risk' ? "bg-red-500" : "bg-indigo-600 dark:bg-indigo-500"
                      )}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Milestones List */}
                <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                    Jalons ({completedMilestones}/{totalMilestones})
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                    {project.milestones.map(m => (
                      <div key={m.id} className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                          <input 
                            type="checkbox"
                            checked={m.completed}
                            onChange={() => handleToggleMilestone(project.id, m.id)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className={clsx("truncate", m.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300")}>
                            {m.title}
                          </span>
                        </label>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 ml-2">{m.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 mt-4">
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> {project.dueDate}
                </span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {project.budget} k$ / {project.totalBudget} k$
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProject={editingProject}
        onSave={handleSaveProject}
        managers={managers}
      />
    </div>
  );
}
