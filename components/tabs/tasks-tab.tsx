"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Plus, CalendarDays, Columns, ListTodo, GanttChartSquare, Search, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { TaskModal } from './tasks/task-modal';
import { CalendarView } from './tasks/calendar-view';
import { KanbanBoard } from './tasks/kanban-board';
import { PlanningView } from './tasks/planning-view';
import { TimelineView } from './tasks/timeline-view';
import { useNotifications } from '../notification-provider';

const initialColumns = [
  { id: 'todo', title: 'À faire' },
  { id: 'in_progress', title: 'En cours' },
  { id: 'review', title: 'En revue' },
  { id: 'done', title: 'Terminé' },
];

const teamMembers = ["Samuel Mbarga", "Chantal Abena", "Emmanuel Nguema", "Nathalie Ekotto", "Dieudonné Tchato"];
const projectsList = ["Refonte ERP", "App Mobile", "Migration Cloud", "Site Web", "CRM V2"];

const initialTasks = [
  { id: 'TSK-1', title: 'Maquette page accueil', project: 'Site Web', assignee: 'Nathalie Ekotto', status: 'todo', priority: 'high', dueDate: '2026-03-05', dependencies: [], sprintId: 'SPR-1', subtasks: [{ id: 's1', title: 'Zoning wireframe', completed: true }, { id: 's2', title: 'Prototypage Figma', completed: false }] },
  { id: 'TSK-2', title: 'API Authentification Mobile Money', project: 'App Mobile', assignee: 'Samuel Mbarga', status: 'in_progress', priority: 'critical', dueDate: '2026-03-01', dependencies: ['TSK-1'], sprintId: 'SPR-1', subtasks: [{ id: 's3', title: 'Connexion Orange Money', completed: true }, { id: 's4', title: 'Connexion MTN Mobile Money', completed: true }, { id: 's5', title: 'Gestion webhooks', completed: false }] },
  { id: 'TSK-3', title: 'Tests E2E & Validation', project: 'Refonte ERP', assignee: 'Chantal Abena', status: 'review', priority: 'medium', dueDate: '2026-03-15', dependencies: ['TSK-2'], sprintId: 'SPR-2', subtasks: [] },
  { id: 'TSK-4', title: 'Configuration CI/CD Kubernetes', project: 'Migration Cloud', assignee: 'Emmanuel Nguema', status: 'done', priority: 'high', dueDate: '2026-03-02', dependencies: [], sprintId: 'SPR-1', subtasks: [{ id: 's6', title: 'Script Helm charts', completed: true }] },
  { id: 'TSK-5', title: 'Design System & Composants', project: 'App Mobile', assignee: 'Nathalie Ekotto', status: 'in_progress', priority: 'medium', dueDate: '2026-03-20', dependencies: ['TSK-1'], sprintId: null, subtasks: [] },
  { id: 'TSK-6', title: 'Rédaction documentation technique', project: 'CRM V2', assignee: 'Dieudonné Tchato', status: 'todo', priority: 'medium', dueDate: '2026-03-25', dependencies: [], sprintId: null, subtasks: [] },
];

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'planned' | 'completed';
}

const initialSprints: Sprint[] = [
  { id: 'SPR-1', name: 'Sprint 1 - MVP Core', startDate: '2026-03-01', endDate: '2026-03-14', status: 'active' },
  { id: 'SPR-2', name: 'Sprint 2 - UI Refinement', startDate: '2026-03-15', endDate: '2026-03-28', status: 'planned' },
];

export function TasksTab() {
  const [tasks, setTasks] = useState<any[]>(initialTasks);
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [viewMode, setViewMode] = useState<'kanban' | 'calendar' | 'planning' | 'timeline'>('kanban');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1));
  const [selectedProject, setSelectedProject] = useState<string>('Tous les projets');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const { addNotification } = useNotifications();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check for upcoming deadlines on mount for Samuel Mbarga
  useEffect(() => {
    const checkDeadlines = () => {
      const today = new Date();
      tasks.forEach(task => {
        if (task.assignee === 'Samuel Mbarga' && task.status !== 'done') {
          const dueDate = new Date(task.dueDate);
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays >= 0 && diffDays <= 2) {
            addNotification({
              type: 'due_date',
              title: 'Échéance proche',
              message: `La tâche "${task.title}" arrive à échéance sous peu.`,
              link: '#'
            });
          }
        }
      });
    };
    
    checkDeadlines();
  }, [addNotification, tasks]);

  const filteredTasks = tasks.filter(task => {
    const matchesProject = selectedProject === 'Tous les projets' || task.project === selectedProject;
    const matchesPriority = selectedPriorityFilter === 'all' || task.priority === selectedPriorityFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesPriority && matchesSearch;
  });

  // Drag & Drop Logic (Kanban)
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setActiveColumnId(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (activeColumnId !== columnId) {
      setActiveColumnId(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (activeColumnId === columnId) {
      setActiveColumnId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, columnId);
    }
    setActiveColumnId(null);
    setDraggedTaskId(null);
  };

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    if (newStatus === 'done') {
      addNotification({
        type: 'status_change',
        title: 'Tâche terminée',
        message: `La tâche "${task.title}" a été marquée comme terminée !`,
        link: '#'
      });
    }
  };

  const updateTaskPriority = (taskId: string, newPriority: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, priority: newPriority } : t));
  };

  const updateTaskAssignee = (taskId: string, newAssignee: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assignee: newAssignee } : t));
  };

  const deleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (task) {
      addNotification({
        type: 'system',
        title: 'Tâche supprimée',
        message: `La tâche "${task.title}" a été supprimée.`,
        link: '#'
      });
    }
  };

  const duplicateTask = (taskToDuplicate: any) => {
    const newId = `TSK-${tasks.length + 1}`;
    const duplicated = {
      ...taskToDuplicate,
      id: newId,
      title: `${taskToDuplicate.title} (Copie)`,
      subtasks: taskToDuplicate.subtasks ? taskToDuplicate.subtasks.map((s: any) => ({ ...s, id: 'sub-' + Date.now() + Math.random() })) : []
    };
    setTasks(prev => [...prev, duplicated]);
    addNotification({
      type: 'system',
      title: 'Tâche dupliquée',
      message: `La tâche "${duplicated.title}" a été créée avec succès.`,
      link: '#'
    });
  };

  const openCreateModal = () => {
    const newId = `TSK-${tasks.length + 1}`;
    setEditingTask({
      id: newId,
      title: '',
      project: selectedProject === 'Tous les projets' ? projectsList[0] : selectedProject,
      assignee: teamMembers[0],
      status: 'todo',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      dependencies: [],
      subtasks: [],
      comments: []
    });
  };

  const openEditModal = (task: any) => {
    setEditingTask({ ...task });
  };

  const saveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask.title.trim()) return;

    const exists = tasks.some(t => t.id === editingTask.id);
    if (exists) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? editingTask : t));
      addNotification({
        type: 'system',
        title: 'Tâche mise à jour',
        message: `Les modifications apportées à "${editingTask.title}" ont été enregistrées.`,
        link: '#'
      });
    } else {
      setTasks(prev => [...prev, editingTask]);
      addNotification({
        type: 'system',
        title: 'Nouvelle tâche',
        message: `La tâche "${editingTask.title}" a été créée.`,
        link: '#'
      });
    }
    setEditingTask(null);
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Top Controls & Search Bar */}
      <header className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Gestion des Tâches</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Suivi en temps réel des livrables et de l&apos;avancement des équipes</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* View switcher */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl">
              <button 
                onClick={() => setViewMode('kanban')}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                  viewMode === 'kanban' ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Columns size={14} /> Kanban
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                  viewMode === 'calendar' ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <CalendarDays size={14} /> Calendrier
              </button>
              <button 
                onClick={() => setViewMode('planning')}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                  viewMode === 'planning' ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <ListTodo size={14} /> Sprints
              </button>
              <button 
                onClick={() => setViewMode('timeline')}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                  viewMode === 'timeline' ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <GanttChartSquare size={14} /> Timeline
              </button>
            </div>
          </div>
        </div>

        {/* Search, Filter Bar & Action Button */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre, ID ou membre..."
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              />
            </div>

            {/* Project Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 hidden lg:inline">Projet:</span>
              <select 
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white cursor-pointer"
              >
                <option value="Tous les projets">Tous les projets</option>
                {projectsList.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800/60 p-1 rounded-xl shrink-0">
              <Filter size={12} className="text-gray-400 ml-1 mr-1" />
              {[
                { id: 'all', label: 'Toutes' },
                { id: 'critical', label: 'Critique' },
                { id: 'high', label: 'Haute' },
                { id: 'medium', label: 'Moyenne' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedPriorityFilter(f.id)}
                  className={clsx(
                    "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer",
                    selectedPriorityFilter === f.id 
                      ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus size={16} /> Nouvelle Tâche
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {viewMode === 'kanban' && (
        <KanbanBoard 
          initialColumns={initialColumns}
          filteredTasks={filteredTasks}
          activeColumnId={activeColumnId}
          draggedTaskId={draggedTaskId}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          activeMenuId={activeMenuId}
          setActiveMenuId={setActiveMenuId}
          menuRef={menuRef}
          openEditModal={openEditModal}
          deleteTask={deleteTask}
          duplicateTask={duplicateTask}
          updateTaskStatus={updateTaskStatus}
          updateTaskPriority={updateTaskPriority}
          updateTaskAssignee={updateTaskAssignee}
          teamMembers={teamMembers}
        />
      )}
      
      {viewMode === 'calendar' && (
        <CalendarView 
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          filteredTasks={filteredTasks}
          openEditModal={openEditModal}
        />
      )}

      {viewMode === 'planning' && (
        <PlanningView 
          tasks={tasks}
          setTasks={setTasks}
          sprints={sprints}
          setSprints={setSprints}
          openEditModal={openEditModal}
        />
      )}

      {viewMode === 'timeline' && (
        <TimelineView 
          filteredTasks={filteredTasks}
        />
      )}

      {/* Modal de configuration de tâche */}
      <TaskModal 
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        saveTask={saveTask}
        projectsList={projectsList}
        teamMembers={teamMembers}
        tasks={tasks}
        sprints={sprints}
      />
    </div>
  );
}
