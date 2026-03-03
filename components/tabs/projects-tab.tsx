"use client";

import React, { useState } from 'react';
import { MoreVertical, Calendar, CheckCircle2, AlertCircle, Clock, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { ProjectModal } from './projects/project-modal';

const initialProjects = [
  { id: 'PRJ-1', name: 'Refonte ERP', status: 'at_risk', progress: 65, budget: 135, totalBudget: 120, dueDate: '2026-10-15', manager: 'Alex M.' },
  { id: 'PRJ-2', name: 'App Mobile', status: 'delayed', progress: 40, budget: 65, totalBudget: 80, dueDate: '2026-11-02', manager: 'Sarah K.' },
  { id: 'PRJ-3', name: 'Migration Cloud', status: 'on_track', progress: 85, budget: 180, totalBudget: 200, dueDate: '2026-09-28', manager: 'Thomas L.' },
  { id: 'PRJ-4', name: 'Site Web', status: 'on_track', progress: 100, budget: 40, totalBudget: 40, dueDate: '2026-09-01', manager: 'Marie D.' },
  { id: 'PRJ-5', name: 'CRM V2', status: 'on_track', progress: 20, budget: 45, totalBudget: 90, dueDate: '2026-12-10', manager: 'Jean P.' },
];

export function ProjectsTab() {
  const [projects, setProjects] = useState(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    status: 'on_track',
    progress: 0,
    budget: 0,
    totalBudget: 0,
    dueDate: '',
    manager: ''
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `PRJ-${projects.length + 1}`;
    setProjects([...projects, { ...newProject, id, progress: Number(newProject.progress), budget: Number(newProject.budget), totalBudget: Number(newProject.totalBudget) }]);
    setIsModalOpen(false);
    setNewProject({ name: '', status: 'on_track', progress: 0, budget: 0, totalBudget: 0, dueDate: '', manager: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Projets</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gérez et suivez l&apos;avancement de vos projets actifs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Nouveau Projet
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:border-gray-700 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{project.id}</span>
                  {project.status === 'on_track' && <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-md flex items-center gap-1.5"><CheckCircle2 size={12} /> Dans les temps</span>}
                  {project.status === 'at_risk' && <span className="px-2 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium rounded-md flex items-center gap-1.5"><AlertCircle size={12} /> À risque</span>}
                  {project.status === 'delayed' && <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium rounded-md flex items-center gap-1.5"><Clock size={12} /> En retard</span>}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{project.name}</h3>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><MoreVertical size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Progression</span>
                  <span className="font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div className={clsx("h-2 rounded-full", project.status === 'at_risk' ? 'bg-red-500' : project.status === 'delayed' ? 'bg-amber-500' : 'bg-emerald-500')} style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Budget (M FCFA)</p>
                  <p className={clsx("text-sm font-medium", project.budget > project.totalBudget ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white")}>
                    {project.budget} / {project.totalBudget}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Échéance</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400 dark:text-gray-500" /> {project.dueDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProjectModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        newProject={newProject}
        setNewProject={setNewProject}
        handleCreateProject={handleCreateProject}
      />
    </div>
  );
}
