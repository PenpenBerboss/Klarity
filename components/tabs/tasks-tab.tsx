"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Plus, CalendarDays, Columns, ListTodo, GanttChartSquare, Search, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { TaskModal } from './tasks/task-modal';
import { CalendarView } from './tasks/calendar-view';
import { KanbanBoard } from './tasks/kanban-board';
import { PlanningView } from './tasks/planning-view';
import { TimelineView } from './tasks/timeline-view';
import { 
  getStoredTasks, 
  saveTask as saveTaskToDb, 
  deleteTask as deleteTaskFromDb, 
  getStoredTeam, 
  getStoredProjects, 
  getStoredSprints, 
  UserMember,
  canCompleteReviewedTasks,
  saveSprint as saveSprintToDb,
  deleteSprint as deleteSprintFromDb,
  createEntityId,
  Task, 
  Sprint 
} from '@/lib/api';

const initialColumns = [
  { id: 'todo', title: 'À faire' },
  { id: 'in_progress', title: 'En cours' },
  { id: 'review', title: 'En revue' },
  { id: 'done', title: 'Terminé' },
];

export function TasksTab({ initialSearchQuery = '' }: { initialSearchQuery?: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [teamProfiles, setTeamProfiles] = useState<UserMember[]>([]);
  const [projectsList, setProjectsList] = useState<string[]>([]);
  const teamMembers = teamProfiles.filter(member => member.status !== 'invité').map(member => member.name);
  
  const [viewMode, setViewMode] = useState<'kanban' | 'calendar' | 'planning' | 'timeline'>('kanban');
  const [currentMonth, setCurrentMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedProject, setSelectedProject] = useState<string>('Tous les projets');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load state from database API
  useEffect(() => {
    const loadData = () => {
      setTasks(getStoredTasks());
      setSprints(getStoredSprints());
      
      setTeamProfiles(getStoredTeam().filter(member => member.status !== 'invité'));

      const projects = getStoredProjects().map(p => p.name);
      setProjectsList(projects);
    };

    loadData();

    const handleDbUpdate = () => loadData();
    window.addEventListener('klarity_db_update', handleDbUpdate);
    return () => window.removeEventListener('klarity_db_update', handleDbUpdate);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesProject = selectedProject === 'Tous les projets' || task.project === selectedProject;
    const matchesPriority = selectedPriorityFilter === 'all' || task.priority === selectedPriorityFilter;
    const normalizedQuery = searchQuery.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');
    const matchesSearch = searchQuery.trim() === '' || 
      `${task.title} ${task.id} ${task.project} ${task.assignee}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').includes(normalizedQuery);
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

    if (task.status === 'review' && newStatus === 'done' && !canCompleteReviewedTasks()) {
      saveTaskToDb({ ...task, status: 'done' });
      return;
    }

    const updatedTasks = saveTaskToDb({ ...task, status: newStatus as any });
    setTasks(updatedTasks);
  };

  const updateTaskPriority = (taskId: string, newPriority: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTasks = saveTaskToDb({ ...task, priority: newPriority as any });
    setTasks(updatedTasks);
  };

  const updateTaskAssignee = (taskId: string, newAssignee: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTasks = saveTaskToDb({ ...task, assignee: newAssignee });
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = deleteTaskFromDb(taskId);
    setTasks(updatedTasks);
  };

  const duplicateTask = (taskToDuplicate: any) => {
    const newId = createEntityId('TSK');
    const duplicated = {
      ...taskToDuplicate,
      id: newId,
      title: `${taskToDuplicate.title} (Copie)`,
      subtasks: taskToDuplicate.subtasks ? taskToDuplicate.subtasks.map((s: any) => ({ ...s, id: 'sub-' + Date.now() + Math.random() })) : []
    };

    const updatedTasks = saveTaskToDb(duplicated);
    setTasks(updatedTasks);
  };

  const openCreateModal = () => {
    const newId = createEntityId('TSK');
    setEditingTask({
      id: newId,
      title: '',
      project: selectedProject === 'Tous les projets' ? (projectsList[0] || '') : selectedProject,
      assignee: teamMembers[0] || '',
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

    const updatedTasks = saveTaskToDb(editingTask);
    setTasks(updatedTasks);
    setEditingTask(null);
  };

  const handleUpdateSprints = (newSprints: Sprint[]) => {
    const newIds = new Set(newSprints.map(sprint => sprint.id));
    sprints.filter(sprint => !newIds.has(sprint.id)).forEach(sprint => deleteSprintFromDb(sprint.id));
    newSprints.forEach(sprint => {
      const previous = sprints.find(item => item.id === sprint.id);
      if (!previous || previous.name !== sprint.name || previous.startDate !== sprint.startDate
        || previous.endDate !== sprint.endDate || previous.status !== sprint.status) {
        saveSprintToDb(sprint);
      }
    });
    setSprints(newSprints);
  };

  const handleUpdateTasks = (newTasks: Task[]) => {
    newTasks.forEach(task => {
      const previous = tasks.find(current => current.id === task.id);
      if (!previous || previous.sprintId !== task.sprintId) saveTaskToDb(task);
    });
    setTasks(newTasks);
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Top Controls & Search Bar */}
      <header className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Gestion des Tâches</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Données synchronisées en temps réel dans la base de données</p>
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
          deleteTask={handleDeleteTask}
          duplicateTask={duplicateTask}
          updateTaskStatus={updateTaskStatus}
          updateTaskPriority={updateTaskPriority}
          updateTaskAssignee={updateTaskAssignee}
          teamMembers={teamMembers}
          teamProfiles={teamProfiles}
          projectsList={projectsList}
        />
      )}
      
      {viewMode === 'calendar' && (
        <CalendarView 
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          filteredTasks={filteredTasks}
          openEditModal={openEditModal}
          teamProfiles={teamProfiles}
        />
      )}

      {viewMode === 'planning' && (
        <PlanningView 
          tasks={tasks}
          setTasks={handleUpdateTasks}
          sprints={sprints}
          setSprints={handleUpdateSprints}
          openEditModal={openEditModal}
          teamProfiles={teamProfiles}
        />
      )}

      {viewMode === 'timeline' && (
        <TimelineView 
          filteredTasks={filteredTasks}
          teamProfiles={teamProfiles}
        />
      )}

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
