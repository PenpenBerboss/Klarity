"use client";

import React, { useState } from 'react';
import { MoreVertical, Calendar, CheckCircle2, AlertCircle, Clock, Plus, Trash2, Edit2, Archive, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import { ProjectModal } from './projects/project-modal';
import { useNotifications } from '../notification-provider';

const initialProjects = [
  { 
    id: 'PRJ-1', 
    name: 'Refonte ERP', 
    status: 'at_risk', 
    progress: 65, 
    budget: 135, 
    totalBudget: 120, 
    dueDate: '2026-10-15', 
    manager: 'Samuel Mbarga',
    milestones: [
      { id: 'M1', title: 'Analyse des besoins', date: '2026-04-01', completed: true },
      { id: 'M2', title: 'Architecture BDD', date: '2026-06-15', completed: true },
      { id: 'M3', title: 'Développement Core', date: '2026-09-01', completed: false },
    ]
  },
  { 
    id: 'PRJ-2', 
    name: 'App Mobile', 
    status: 'delayed', 
    progress: 40, 
    budget: 65, 
    totalBudget: 80, 
    dueDate: '2026-11-02', 
    manager: 'Chantal Abena',
    milestones: [
      { id: 'M4', title: 'Maquettes UI/UX', date: '2026-05-10', completed: true },
      { id: 'M5', title: 'Version Beta', date: '2026-08-20', completed: false },
    ]
  },
  { 
    id: 'PRJ-3', 
    name: 'Migration Cloud', 
    status: 'on_track', 
    progress: 85, 
    budget: 180, 
    totalBudget: 200, 
    dueDate: '2026-09-28', 
    manager: 'Emmanuel Nguema',
    milestones: [
      { id: 'M6', title: 'Audit infra', date: '2026-03-15', completed: true },
      { id: 'M7', title: 'Migration Phase 1', date: '2026-07-01', completed: true },
    ]
  },
  { 
    id: 'PRJ-4', 
    name: 'Site Web', 
    status: 'on_track', 
    progress: 100, 
    budget: 40, 
    totalBudget: 40, 
    dueDate: '2026-09-01', 
    manager: 'Nathalie Ekotto',
    milestones: []
  },
  { 
    id: 'PRJ-5', 
    name: 'CRM V2', 
    status: 'on_track', 
    progress: 20, 
    budget: 45, 
    totalBudget: 90, 
    dueDate: '2026-12-10', 
    manager: 'Dieudonné Tchato',
    milestones: []
  },
];

export function ProjectsTab() {
  const [projects, setProjects] = useState(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const [newProject, setNewProject] = useState({
    name: '',
    status: 'on_track',
    progress: 0,
    budget: 0,
    totalBudget: 0,
    dueDate: '',
    manager: '',
    milestones: []
  });

  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editMilestoneForm, setEditMilestoneForm] = useState({ title: '', date: '' });
  const { addNotification } = useNotifications();

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProject) {
      // Check for status change to at_risk or delayed for Samuel Mbarga
      if (newProject.manager === 'Samuel Mbarga' && 
          (newProject.status === 'at_risk' || newProject.status === 'delayed') && 
          editingProject.status !== newProject.status) {
        addNotification({
          type: 'system',
          title: 'Alerte Statut Projet',
          message: `Le projet "${newProject.name}" est désormais ${newProject.status === 'at_risk' ? 'à risque' : 'en retard'}.`,
          link: '#'
        });
      }
      setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...newProject } : p));
      setEditingProject(null);
    } else {
      const id = `PRJ-${projects.length + 1}`;
      // Notify if Samuel Mbarga is the manager
      if (newProject.manager === 'Samuel Mbarga') {
        addNotification({
          type: 'system',
          title: 'Nouveau Projet Assigné',
          message: `Vous avez été assigné comme manager du projet "${newProject.name}".`,
          link: '#'
        });
      }
      const milestones = (newProject as any).milestonesText 
        ? (newProject as any).milestonesText.split(',').map((m: string, i: number) => ({
            id: `M${Date.now()}-${i}`,
            title: m.trim(),
            date: newProject.dueDate,
            completed: false
          }))
        : [];
      
      setProjects([...projects, { ...newProject, id, milestones, progress: Number(newProject.progress), budget: Number(newProject.budget), totalBudget: Number(newProject.totalBudget) } as any]);
    }
    
    setIsModalOpen(false);
    setNewProject({ name: '', status: 'on_track', progress: 0, budget: 0, totalBudget: 0, dueDate: '', manager: '', milestones: [] });
  };

  const openEditModal = (project: any) => {
    setEditingProject(project);
    setNewProject({
      name: project.name,
      status: project.status,
      progress: project.progress,
      budget: project.budget,
      totalBudget: project.totalBudget,
      dueDate: project.dueDate,
      manager: project.manager,
      milestones: project.milestones
    });
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setNewProject({ name: '', status: 'on_track', progress: 0, budget: 0, totalBudget: 0, dueDate: '', manager: '', milestones: [] });
    setIsModalOpen(true);
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.map(m => 
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        
        // Calculate new progress based on milestones
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const totalCount = updatedMilestones.length;
        const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : p.progress;

        // Notify if a milestone is completed and Samuel Mbarga is the manager
        const milestone = updatedMilestones.find(m => m.id === milestoneId);
        if (milestone?.completed && p.manager === 'Samuel Mbarga') {
          addNotification({
            type: 'system',
            title: 'Jalon Complété',
            message: `Le jalon "${milestone.title}" du projet "${p.name}" a été marqué comme terminé.`,
            link: '#'
          });
        }

        return {
          ...p,
          milestones: updatedMilestones,
          progress: newProgress
        };
      }
      return p;
    }));
  };

  const addMilestone = (projectId: string) => {
    if (!newMilestoneTitle.trim()) return;
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = [
          ...p.milestones,
          { id: `M${Date.now()}`, title: newMilestoneTitle, date: new Date().toISOString().split('T')[0], completed: false }
        ];
        
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const totalCount = updatedMilestones.length;
        const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : p.progress;

        return {
          ...p,
          milestones: updatedMilestones,
          progress: newProgress
        };
      }
      return p;
    }));
    setNewMilestoneTitle('');
  };

  const deleteMilestone = (projectId: string, milestoneId: string) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.filter(m => m.id !== milestoneId);
        
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const totalCount = updatedMilestones.length;
        const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : (updatedMilestones.length === 0 ? 0 : p.progress);

        return {
          ...p,
          milestones: updatedMilestones,
          progress: newProgress
        };
      }
      return p;
    }));
  };

  const startEditingMilestone = (milestone: any) => {
    setEditingMilestoneId(milestone.id);
    setEditMilestoneForm({ title: milestone.title, date: milestone.date });
  };

  const updateMilestone = (projectId: string, milestoneId: string) => {
    if (!editMilestoneForm.title.trim()) return;
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.map(m => 
          m.id === milestoneId ? { ...m, title: editMilestoneForm.title, date: editMilestoneForm.date } : m
        );
        return { ...p, milestones: updatedMilestones };
      }
      return p;
    }));
    setEditingMilestoneId(null);
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setActiveMenuId(null);
  };

  const archiveProject = (id: string) => {
    alert(`Projet ${id} archivé`);
    setActiveMenuId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Projets</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gérez et suivez l&apos;avancement de vos projets actifs.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Nouveau Projet
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => (
          <div 
            key={project.id} 
            id={project.id}
            onClick={() => setSelectedProjectId(selectedProjectId === project.id ? null : project.id)}
            className={clsx(
              "bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border transition-all cursor-pointer group relative",
              selectedProjectId === project.id ? "border-indigo-500 ring-4 ring-indigo-500/5" : "border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:border-gray-700"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{project.id}</span>
                  {project.status === 'on_track' && <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-md flex items-center gap-1.5"><CheckCircle2 size={12} /> Dans les temps</span>}
                  {project.status === 'at_risk' && <span className="px-2 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium rounded-md flex items-center gap-1.5"><AlertCircle size={12} /> À risque</span>}
                  {project.status === 'delayed' && <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium rounded-md flex items-center gap-1.5"><Clock size={12} /> En retard</span>}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{project.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manager : {project.manager}</p>
              </div>
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === project.id ? null : project.id);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <MoreVertical size={20} />
                </button>
                
                {activeMenuId === project.id && (
                  <div 
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditModal(project); }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Edit2 size={14} /> Modifier
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setSelectedProjectId(project.id); 
                        setActiveMenuId(null);
                        const element = document.getElementById(project.id);
                        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <ExternalLink size={14} /> Voir détails
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); archiveProject(project.id); }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Archive size={14} /> Archiver
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                )}
              </div>
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

              {selectedProjectId === project.id && (
                <div className="pt-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Jalons clés</p>
                  </div>
                  <div className="space-y-2">
                    {project.milestones.map(milestone => (
                      <div 
                        key={milestone.id} 
                        className="flex flex-col gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 group/milestone"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {editingMilestoneId === milestone.id ? (
                          <div className="space-y-2 w-full">
                            <input 
                              type="text" 
                              value={editMilestoneForm.title}
                              onChange={e => setEditMilestoneForm({ ...editMilestoneForm, title: e.target.value })}
                              className="w-full px-2 py-1 text-xs bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
                            />
                            <div className="flex gap-2">
                              <input 
                                type="date" 
                                value={editMilestoneForm.date}
                                onChange={e => setEditMilestoneForm({ ...editMilestoneForm, date: e.target.value })}
                                className="flex-1 px-2 py-1 text-[10px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
                              />
                              <button 
                                onClick={() => updateMilestone(project.id, milestone.id)}
                                className="px-2 py-1 bg-indigo-600 text-white text-[10px] rounded hover:bg-indigo-700 transition-colors"
                              >
                                Sauver
                              </button>
                              <button 
                                onClick={() => setEditingMilestoneId(null)}
                                className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMilestone(project.id, milestone.id);
                                }}
                                className={clsx(
                                  "w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer",
                                  milestone.completed ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-300 dark:border-gray-600"
                                )}
                              >
                                {milestone.completed && <CheckCircle2 size={10} />}
                              </div>
                              <span className={clsx("text-xs", milestone.completed ? "text-gray-400 line-through" : "text-gray-700 dark:text-gray-300")}>
                                {milestone.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400">{milestone.date}</span>
                              <div className="flex items-center gap-1 opacity-0 group-hover/milestone:opacity-100 transition-opacity">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditingMilestone(milestone);
                                  }}
                                  className="text-gray-400 hover:text-indigo-500"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteMilestone(project.id, milestone.id);
                                  }}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Add Milestone Form */}
                    <div className="flex gap-2 pt-2" onClick={e => e.stopPropagation()}>
                      <input 
                        type="text" 
                        placeholder="Nouveau jalon..."
                        value={newMilestoneTitle}
                        onChange={e => setNewMilestoneTitle(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addMilestone(project.id)}
                        className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
                      />
                      <button 
                        onClick={() => addMilestone(project.id)}
                        className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
        editingProject={editingProject}
      />
    </div>
  );
}
