"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Plus, CalendarDays, Columns } from 'lucide-react';
import { clsx } from 'clsx';
import { TaskModal } from './tasks/task-modal';
import { CalendarView } from './tasks/calendar-view';
import { KanbanBoard } from './tasks/kanban-board';

const initialColumns = [
  { id: 'todo', title: 'À faire' },
  { id: 'in_progress', title: 'En cours' },
  { id: 'review', title: 'En revue' },
  { id: 'done', title: 'Terminé' },
];

const initialTasks = [
  { id: 'TSK-1', title: 'Maquette page accueil', project: 'Site Web', assignee: 'Marie D.', status: 'todo', priority: 'high', dueDate: '2026-03-05', dependencies: [] },
  { id: 'TSK-2', title: 'API Authentification', project: 'App Mobile', assignee: 'Alex M.', status: 'in_progress', priority: 'critical', dueDate: '2026-03-12', dependencies: ['TSK-1'] },
  { id: 'TSK-3', title: 'Tests E2E', project: 'Refonte ERP', assignee: 'Sarah K.', status: 'review', priority: 'medium', dueDate: '2026-03-15', dependencies: ['TSK-2'] },
  { id: 'TSK-4', title: 'Configuration CI/CD', project: 'Migration Cloud', assignee: 'Thomas L.', status: 'done', priority: 'high', dueDate: '2026-03-02', dependencies: [] },
  { id: 'TSK-5', title: 'Design System', project: 'App Mobile', assignee: 'Marie D.', status: 'in_progress', priority: 'medium', dueDate: '2026-03-20', dependencies: ['TSK-1'] },
  { id: 'TSK-6', title: 'Rédaction documentation', project: 'CRM V2', assignee: 'Jean P.', status: 'todo', priority: 'medium', dueDate: '2026-03-25', dependencies: [] },
];

const teamMembers = ["Alex M.", "Sarah K.", "Thomas L.", "Marie D.", "Jean P."];
const projectsList = ["Refonte ERP", "App Mobile", "Migration Cloud", "Site Web", "CRM V2"];

export function TasksTab() {
  const [tasks, setTasks] = useState(initialTasks);
  const [viewMode, setViewMode] = useState<'kanban' | 'calendar'>('kanban');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // Mars 2026 par défaut
  const [selectedProject, setSelectedProject] = useState<string>('Tous les projets');
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<any | null>(null);
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

  const filteredTasks = tasks.filter(task => 
    selectedProject === 'Tous les projets' || task.project === selectedProject
  );

  // --- Drag & Drop Logic (Kanban) ---
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => setDraggedTaskId(taskId), 0);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setActiveColumnId(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeColumnId !== columnId) {
      setActiveColumnId(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, columnId: string) => {
    if (activeColumnId === columnId) {
      setActiveColumnId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: columnId } : t));
    }
    setDraggedTaskId(null);
    setActiveColumnId(null);
  };

  // --- Task Actions ---
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    setActiveMenuId(null);
  };

  const openEditModal = (task: any) => {
    setEditingTask({ ...task, dependencies: task.dependencies || [] });
    setActiveMenuId(null);
  };

  const saveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
      setEditingTask(null);
    }
  };

  return (
    <div className="min-h-full flex flex-col max-w-[1800px] mx-auto relative">
      <header className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Tâches</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gérez le flux de travail et les échéances de votre équipe.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200/60 dark:border-gray-700/60">
            <button 
              onClick={() => setViewMode('kanban')}
              className={clsx(
                "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                viewMode === 'kanban' ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <Columns size={16} /> Kanban
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={clsx(
                "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                viewMode === 'calendar' ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <CalendarDays size={16} /> Calendrier
            </button>
          </div>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

          <select 
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
          >
            <option value="Tous les projets">Tous les projets</option>
            {projectsList.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
            <Plus size={16} /> Nouvelle Tâche
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {viewMode === 'kanban' ? (
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
        />
      ) : (
        <CalendarView 
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          filteredTasks={filteredTasks}
          openEditModal={openEditModal}
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
      />
    </div>
  );
}
