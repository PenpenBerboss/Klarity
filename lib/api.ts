// Client and Server Persistent Storage Engine & API for Klarity Platform

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '/api';

// Database Schema Models
export interface UserMember {
  id: number | string;
  name: string;
  email: string;
  role: string;
  department: string;
  capacity: number;
  status: 'disponible' | 'optimal' | 'surchargé' | 'critique' | 'invité';
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  status: 'on_track' | 'delayed' | 'at_risk' | 'completed' | 'archived';
  progress: number;
  budget: number;
  totalBudget: number;
  dueDate: string;
  manager: string;
  description?: string;
  milestones: Milestone[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  author: string;
  text: string;
  timestamp: string | Date;
}

export interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  dependencies?: string[];
  sprintId?: string | null;
  subtasks?: Subtask[];
  comments?: TaskComment[];
}

export interface ActionableTask {
  id: string;
  title: string;
  project: string;
  assignee: string;
  status: 'blocked' | 'delayed' | 'warning' | 'completed';
  reason: string;
  impact: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'planned' | 'completed';
}

export interface NotificationItem {
  id: string;
  type: 'task_assigned' | 'due_date' | 'comment' | 'status_change' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

// Default Seed Data (Injected into Database Storage if Empty)
const seedTeam: UserMember[] = [
  { id: 1, name: 'Samuel Mbarga', role: 'Lead Developer', department: 'Ingénierie', capacity: 95, status: 'surchargé', email: 'samuel@klarity.cm' },
  { id: 2, name: 'Chantal Abena', role: 'Product Manager', department: 'Produit', capacity: 80, status: 'optimal', email: 'chantal@klarity.cm' },
  { id: 3, name: 'Emmanuel Nguema', role: 'DevOps Engineer', department: 'Infrastructure', capacity: 60, status: 'optimal', email: 'emmanuel@klarity.cm' },
  { id: 4, name: 'Nathalie Ekotto', role: 'UX/UI Designer', department: 'Design', capacity: 110, status: 'critique', email: 'nathalie@klarity.cm' },
  { id: 5, name: 'Dieudonné Tchato', role: 'Développeur Frontend', department: 'Ingénierie', capacity: 40, status: 'disponible', email: 'dieudonne@klarity.cm' },
];

const seedProjects: Project[] = [
  { 
    id: 'PRJ-1', 
    name: 'Refonte ERP', 
    status: 'at_risk', 
    progress: 65, 
    budget: 135, 
    totalBudget: 120, 
    dueDate: '2026-10-15', 
    manager: 'Samuel Mbarga',
    description: 'Refonte complète du système ERP pour la gestion financière et logistique.',
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
    description: 'Application mobile iOS et Android pour les clients.',
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
    description: 'Migration des serveurs physiques vers l\'infrastructure cloud hybride.',
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
    description: 'Nouveau site web vitrine et portail client.',
    milestones: [
      { id: 'M8', title: 'Livraison finale', date: '2026-09-01', completed: true }
    ]
  },
  { 
    id: 'PRJ-5', 
    name: 'CRM V2', 
    status: 'on_track', 
    progress: 20, 
    budget: 30, 
    totalBudget: 90, 
    dueDate: '2026-12-15', 
    manager: 'Dieudonné Tchato',
    description: 'Module CRM centralisé pour l\'équipe commerciale.',
    milestones: [
      { id: 'M9', title: 'Spécifications fonctionnelles', date: '2026-10-01', completed: false }
    ]
  }
];

const seedTasks: Task[] = [
  { id: 'TSK-1', title: 'Maquette page accueil', project: 'Site Web', assignee: 'Nathalie Ekotto', status: 'todo', priority: 'high', dueDate: '2026-03-05', dependencies: [], sprintId: 'SPR-1', subtasks: [{ id: 's1', title: 'Zoning wireframe', completed: true }, { id: 's2', title: 'Prototypage Figma', completed: false }] },
  { id: 'TSK-2', title: 'API Authentification Mobile Money', project: 'App Mobile', assignee: 'Samuel Mbarga', status: 'in_progress', priority: 'critical', dueDate: '2026-03-01', dependencies: ['TSK-1'], sprintId: 'SPR-1', subtasks: [{ id: 's3', title: 'Connexion Orange Money', completed: true }, { id: 's4', title: 'Connexion MTN Mobile Money', completed: true }, { id: 's5', title: 'Gestion webhooks', completed: false }] },
  { id: 'TSK-3', title: 'Tests E2E & Validation', project: 'Refonte ERP', assignee: 'Chantal Abena', status: 'review', priority: 'medium', dueDate: '2026-03-15', dependencies: ['TSK-2'], sprintId: 'SPR-2', subtasks: [] },
  { id: 'TSK-4', title: 'Configuration CI/CD Kubernetes', project: 'Migration Cloud', assignee: 'Emmanuel Nguema', status: 'done', priority: 'high', dueDate: '2026-03-02', dependencies: [], sprintId: 'SPR-1', subtasks: [{ id: 's6', title: 'Script Helm charts', completed: true }] },
  { id: 'TSK-5', title: 'Design System & Composants', project: 'App Mobile', assignee: 'Nathalie Ekotto', status: 'in_progress', priority: 'medium', dueDate: '2026-03-20', dependencies: ['TSK-1'], sprintId: null, subtasks: [] },
  { id: 'TSK-6', title: 'Rédaction documentation technique', project: 'CRM V2', assignee: 'Dieudonné Tchato', status: 'todo', priority: 'medium', dueDate: '2026-03-25', dependencies: [], sprintId: null, subtasks: [] },
];

const seedActionableTasks: ActionableTask[] = [
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

const seedSprints: Sprint[] = [
  { id: 'SPR-1', name: 'Sprint 1 - MVP Core', startDate: '2026-03-01', endDate: '2026-03-14', status: 'active' },
  { id: 'SPR-2', name: 'Sprint 2 - UI Refinement', startDate: '2026-03-15', endDate: '2026-03-28', status: 'planned' },
];

const seedNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'system',
    title: 'Espace Klarity Initialisé',
    message: 'Votre base de données d\'entreprise a été configurée et synchronisée.',
    timestamp: '2026-03-01T08:00:00.000Z',
    read: false,
  }
];

// Helper to access Local Storage safely
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = window.localStorage.getItem(`klarity_db_${key}`);
    if (!data) {
      window.localStorage.setItem(`klarity_db_${key}`, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`klarity_db_${key}`, JSON.stringify(value));
    // Trigger cross-tab/component sync event
    window.dispatchEvent(new CustomEvent('klarity_db_update', { detail: { key, value } }));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

// API Fetch wrapper for Express Backend
export async function fetchFromBackend(endpoint: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Backend sync notice for ${endpoint}: using database storage fallback.`, err);
    return null;
  }
}

// ========================================================
// NOTIFICATIONS PERSISTENCE & AUTO-CREATION
// ========================================================
export function getStoredNotifications(): NotificationItem[] {
  return getItem<NotificationItem[]>('notifications', seedNotifications);
}

export function createSystemNotification(notification: {
  type: 'task_assigned' | 'due_date' | 'comment' | 'status_change' | 'system';
  title: string;
  message: string;
  link?: string;
}): NotificationItem {
  const current = getStoredNotifications();
  const newItem: NotificationItem = {
    id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...notification,
    timestamp: new Date().toISOString(),
    read: false
  };

  const updated = [newItem, ...current];
  setItem('notifications', updated);

  // Send to backend DB
  fetchFromBackend('/notifications', {
    method: 'POST',
    body: JSON.stringify(newItem)
  });

  return newItem;
}

export function markNotificationRead(id: string): NotificationItem[] {
  const current = getStoredNotifications();
  const updated = current.map(n => n.id === id ? { ...n, read: true } : n);
  setItem('notifications', updated);
  return updated;
}

export function clearAllNotifications(): void {
  setItem('notifications', []);
}

// ========================================================
// TEAM / MEMBERS PERSISTENCE
// ========================================================
export function getStoredTeam(): UserMember[] {
  return getItem<UserMember[]>('team', seedTeam);
}

export function saveTeamMember(member: Partial<UserMember> & { name: string; email: string; role: string }): UserMember[] {
  const current = getStoredTeam();
  const existingIndex = current.findIndex(m => m.id === member.id);
  
  let updated: UserMember[];
  if (existingIndex >= 0) {
    updated = current.map((m, idx) => idx === existingIndex ? { ...m, ...member } as UserMember : m);
    createSystemNotification({
      type: 'system',
      title: 'Profil membre mis à jour',
      message: `Le profil de ${member.name} (${member.role}) a été mis à jour dans la base de données.`
    });
  } else {
    const newMember: UserMember = {
      id: member.id || Date.now(),
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department || 'Général',
      capacity: member.capacity || 0,
      status: member.status || 'disponible'
    };
    updated = [...current, newMember];

    createSystemNotification({
      type: 'system',
      title: member.status === 'invité' ? 'Invitation créée' : 'Nouveau membre ajouté',
      message: `${member.name} (${member.email}) a été enregistré comme ${member.role}.`
    });
  }

  setItem('team', updated);
  fetchFromBackend('/team', { method: 'POST', body: JSON.stringify(member) });
  return updated;
}

export function deleteTeamMember(id: string | number): UserMember[] {
  const current = getStoredTeam();
  const target = current.find(m => m.id === id);
  const updated = current.filter(m => m.id !== id);
  setItem('team', updated);

  if (target) {
    createSystemNotification({
      type: 'system',
      title: 'Membre retiré',
      message: `${target.name} a été retiré de la base de données de l'équipe.`
    });
  }

  fetchFromBackend(`/team/${id}`, { method: 'DELETE' });
  return updated;
}

// ========================================================
// PROJECTS PERSISTENCE
// ========================================================
export function getStoredProjects(): Project[] {
  return getItem<Project[]>('projects', seedProjects);
}

export function saveProject(project: Partial<Project> & { name: string; manager: string }): Project[] {
  const current = getStoredProjects();
  const existingIndex = current.findIndex(p => p.id === project.id);

  let updated: Project[];
  if (existingIndex >= 0) {
    updated = current.map((p, idx) => idx === existingIndex ? { ...p, ...project } as Project : p);
    createSystemNotification({
      type: 'system',
      title: 'Projet mis à jour',
      message: `Le projet "${project.name}" a été modifié avec succès dans la base de données.`
    });
  } else {
    const newProject: Project = {
      id: project.id || `PRJ-${current.length + 1}`,
      name: project.name,
      status: project.status || 'on_track',
      progress: project.progress || 0,
      budget: project.budget || 0,
      totalBudget: project.totalBudget || 50,
      dueDate: project.dueDate || new Date().toISOString().split('T')[0],
      manager: project.manager,
      description: project.description || '',
      milestones: project.milestones || []
    };
    updated = [...current, newProject];

    createSystemNotification({
      type: 'system',
      title: 'Nouveau projet créé',
      message: `Le projet "${project.name}" a été créé sous la responsabilité de ${project.manager}.`
    });
  }

  setItem('projects', updated);
  fetchFromBackend('/projects', { method: 'POST', body: JSON.stringify(project) });
  return updated;
}

export function deleteProject(id: string): Project[] {
  const current = getStoredProjects();
  const target = current.find(p => p.id === id);
  const updated = current.filter(p => p.id !== id);
  setItem('projects', updated);

  if (target) {
    createSystemNotification({
      type: 'system',
      title: 'Projet archivé/supprimé',
      message: `Le projet "${target.name}" a été retiré de la base de données.`
    });
  }

  fetchFromBackend(`/projects/${id}`, { method: 'DELETE' });
  return updated;
}

// ========================================================
// TASKS PERSISTENCE
// ========================================================
export function getStoredTasks(): Task[] {
  return getItem<Task[]>('tasks', seedTasks);
}

export function saveTask(task: Partial<Task> & { title: string; project: string }): Task[] {
  const current = getStoredTasks();
  const existingIndex = current.findIndex(t => t.id === task.id);

  let updated: Task[];
  if (existingIndex >= 0) {
    const previousTask = current[existingIndex];
    updated = current.map((t, idx) => idx === existingIndex ? { ...t, ...task } as Task : t);

    // Trigger specific notification depending on what changed
    if (previousTask.assignee !== task.assignee && task.assignee) {
      createSystemNotification({
        type: 'task_assigned',
        title: 'Attribution de tâche',
        message: `La tâche "${task.title}" a été réassignée à ${task.assignee}.`
      });
    } else if (previousTask.status !== task.status && task.status === 'done') {
      createSystemNotification({
        type: 'status_change',
        title: 'Tâche terminée',
        message: `La tâche "${task.title}" a été marquée comme terminée !`
      });
    } else {
      createSystemNotification({
        type: 'system',
        title: 'Tâche mise à jour',
        message: `Modifications enregistrées pour la tâche "${task.title}".`
      });
    }
  } else {
    const newTask: Task = {
      id: task.id || `TSK-${current.length + 1}`,
      title: task.title,
      project: task.project,
      assignee: task.assignee || 'Samuel Mbarga',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
      dependencies: task.dependencies || [],
      sprintId: task.sprintId || null,
      subtasks: task.subtasks || [],
      comments: task.comments || []
    };
    updated = [...current, newTask];

    createSystemNotification({
      type: 'task_assigned',
      title: 'Nouvelle tâche créée',
      message: `La tâche "${newTask.title}" a été créée et attribuée à ${newTask.assignee}.`
    });
  }

  setItem('tasks', updated);
  fetchFromBackend('/tasks', { method: 'POST', body: JSON.stringify(task) });
  return updated;
}

export function deleteTask(id: string): Task[] {
  const current = getStoredTasks();
  const target = current.find(t => t.id === id);
  const updated = current.filter(t => t.id !== id);
  setItem('tasks', updated);

  if (target) {
    createSystemNotification({
      type: 'system',
      title: 'Tâche supprimée',
      message: `La tâche "${target.title}" (${target.id}) a été supprimée de la base de données.`
    });
  }

  fetchFromBackend(`/tasks/${id}`, { method: 'DELETE' });
  return updated;
}

export function reassignTasksBulk(reassignments: Array<{ taskId: string; newAssignee: string }>): Task[] {
  const current = getStoredTasks();
  const map = new Map(reassignments.map(r => [r.taskId, r.newAssignee]));

  const updated = current.map(task => {
    if (map.has(task.id)) {
      return { ...task, assignee: map.get(task.id)! };
    }
    return task;
  });

  setItem('tasks', updated);

  createSystemNotification({
    type: 'task_assigned',
    title: 'Réassignation en masse effectuée',
    message: `${reassignments.length} tâches ont été réassignées avec succès dans la base de données.`
  });

  fetchFromBackend('/team/reassign-tasks', { method: 'POST', body: JSON.stringify({ reassignments }) });
  return updated;
}

// ========================================================
// ACTIONABLE / BLOCKED TASKS PERSISTENCE
// ========================================================
export function getStoredActionableTasks(): ActionableTask[] {
  return getItem<ActionableTask[]>('actionable_tasks', seedActionableTasks);
}

export function saveActionableTask(task: ActionableTask): ActionableTask[] {
  const current = getStoredActionableTasks();
  const existing = current.findIndex(t => t.id === task.id);
  let updated: ActionableTask[];

  if (existing >= 0) {
    updated = current.map((t, i) => i === existing ? task : t);
  } else {
    updated = [task, ...current];
  }

  setItem('actionable_tasks', updated);

  createSystemNotification({
    type: 'system',
    title: 'Point de blocage enregistré',
    message: `Alerte sur la tâche "${task.title}" : ${task.reason}`
  });

  return updated;
}

// ========================================================
// SPRINTS PERSISTENCE
// ========================================================
export function getStoredSprints(): Sprint[] {
  return getItem<Sprint[]>('sprints', seedSprints);
}

export function saveSprint(sprint: Sprint): Sprint[] {
  const current = getStoredSprints();
  const existing = current.findIndex(s => s.id === sprint.id);
  let updated: Sprint[];

  if (existing >= 0) {
    updated = current.map((s, i) => i === existing ? sprint : s);
  } else {
    updated = [...current, sprint];
  }

  setItem('sprints', updated);

  createSystemNotification({
    type: 'system',
    title: 'Sprint mis à jour',
    message: `Le sprint "${sprint.name}" a été enregistré.`
  });

  return updated;
}

// ========================================================
// USER SETTINGS & TIMEZONE PERSISTENCE
// ========================================================
export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  density: 'comfortable' | 'compact';
  language: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  updatedAt?: string;
}

export const COMMON_TIMEZONES = [
  { value: 'Africa/Douala', label: 'Douala / Yaoundé (Afrique Centrale)', offset: 'UTC+1' },
  { value: 'Africa/Dakar', label: 'Dakar / Abidjan (Afrique de l\'Ouest)', offset: 'UTC+0' },
  { value: 'Europe/Paris', label: 'Paris / Bruxelles (Europe Centrale)', offset: 'UTC+1' },
  { value: 'Europe/London', label: 'Londres (Royaume-Uni)', offset: 'UTC+0' },
  { value: 'America/New_York', label: 'New York / Montréal (Est USA/Canada)', offset: 'UTC-5' },
  { value: 'America/Chicago', label: 'Chicago / Houston (Centre USA)', offset: 'UTC-6' },
  { value: 'America/Los_Angeles', label: 'Los Angeles / San Francisco (Pacifique)', offset: 'UTC-8' },
  { value: 'Asia/Dubai', label: 'Dubaï (Moyen-Orient)', offset: 'UTC+4' },
  { value: 'Asia/Tokyo', label: 'Tokyo (Japon)', offset: 'UTC+9' },
  { value: 'Australia/Sydney', label: 'Sydney (Australie)', offset: 'UTC+11' },
  { value: 'UTC', label: 'UTC (Temps Universel Coordonné)', offset: 'UTC+0' },
];

const defaultUserSettings: UserSettings = {
  userId: 'usr_default_admin',
  theme: 'system',
  accentColor: 'indigo',
  density: 'comfortable',
  language: 'fr',
  timezone: 'Europe/Paris',
  dateFormat: 'DD/MM/YYYY',
  emailNotifications: true,
  pushNotifications: true,
};

export function getStoredUserSettings(): UserSettings {
  return getItem<UserSettings>('user_settings', defaultUserSettings);
}

export function saveUserSettings(settings: Partial<UserSettings>): UserSettings {
  const current = getStoredUserSettings();
  const updated: UserSettings = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  setItem('user_settings', updated);

  if (settings.timezone && settings.timezone !== current.timezone) {
    try {
      localStorage.setItem('klarity_timezone', settings.timezone);
      window.dispatchEvent(new CustomEvent('klarity_timezone_changed', {
        detail: { timezone: settings.timezone }
      }));
    } catch {
      // Ignore
    }

    createSystemNotification({
      type: 'system',
      title: 'Fuseau horaire actualisé',
      message: `Le fuseau horaire du système a été basculé sur ${settings.timezone}. L'horloge et les plannings sont synchronisés.`
    });
  }

  if (settings.accentColor && settings.accentColor !== current.accentColor) {
    try {
      localStorage.setItem('klarity_accent', settings.accentColor);
      document.documentElement.setAttribute('data-accent', settings.accentColor);
      window.dispatchEvent(new CustomEvent('klarity_accent_changed', {
        detail: { accent: settings.accentColor }
      }));
    } catch {
      // Ignore
    }

    createSystemNotification({
      type: 'system',
      title: "Couleur d'accentuation modifiée",
      message: `La couleur de l'interface est désormais configurée sur : ${settings.accentColor}.`
    });
  }

  fetchFromBackend('/user-settings', {
    method: 'POST',
    body: JSON.stringify(updated),
  });

  return updated;
}
