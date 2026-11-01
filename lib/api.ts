// Client and Server Persistent Storage Engine & API for Klarity Platform

const BACKEND_URL = '/api';

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

// Helper to access Local Storage safely
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const data = window.localStorage.getItem(`klarity_db_${key}`);
  if (!data) {
    setItem(key, defaultValue);
    return defaultValue;
  }
  return JSON.parse(data) as T;
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(`klarity_db_${key}`, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('klarity_db_update', { detail: { key, value } }));
}

// API Fetch wrapper for Express Backend
export async function fetchFromBackend(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    cache: 'no-store',
    ...options,
  });
  if (!res.ok) {
    const response = await res.json().catch(() => null);
    throw new Error(response?.error || `API ${res.status}: ${res.statusText}`);
  }
  return res.status === 204 ? null : res.json();
}

function persistBackendChange(endpoint: string, options: RequestInit): void {
  void fetchFromBackend(endpoint, options)
    .then(() => syncDatabaseStorage())
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Backend request failed (${endpoint}): ${message}`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('klarity_api_error', { detail: { message } }));
      }
    });
}

function dateOnly(value: string | Date | null | undefined): string {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function setServerItems<T>(key: string, value: T): void {
  setItem(key, value);
}

export async function syncDatabaseStorage(): Promise<void> {
  const [team, projects, tasks, sprints, notifications, settings, actionableTasks] = await Promise.all([
    fetchFromBackend('/team'),
    fetchFromBackend('/projects'),
    fetchFromBackend('/tasks'),
    fetchFromBackend('/sprints'),
    fetchFromBackend('/notifications'),
    fetchFromBackend('/settings'),
    fetchFromBackend('/actionable-tasks'),
  ]);

  setServerItems('team', (team as Array<Record<string, unknown>>).map(member => ({
    id: member.id as string,
    name: String(member.name || ''),
    email: String(member.email || ''),
    role: String(member.role || ''),
    department: String(member.department || 'Général'),
    capacity: Number(member.load_percentage ?? member.capacity ?? 0),
    status: member.status === 'invited' || member.status === 'invité' ? 'invité'
      : Number(member.load_percentage ?? member.capacity ?? 0) >= 100 ? 'critique'
      : Number(member.load_percentage ?? member.capacity ?? 0) >= 85 ? 'surchargé'
      : Number(member.load_percentage ?? member.capacity ?? 0) >= 50 ? 'optimal' : 'disponible',
  })));
  setServerItems('projects', (projects as Array<Record<string, unknown>>).map(project => ({
    id: String(project.id),
    name: String(project.name || ''),
    status: project.status as Project['status'],
    progress: Number(project.progress || 0),
    budget: Number(project.budget_spent ?? project.budget ?? 0),
    totalBudget: Number(project.budget || 0),
    dueDate: dateOnly(project.end_date as string | Date),
    manager: String(project.manager_name || project.manager || ''),
    description: String(project.description || ''),
    milestones: ((project.milestones || []) as Array<Record<string, unknown>>).map(milestone => ({
      id: String(milestone.id),
      title: String(milestone.title || ''),
      date: dateOnly((milestone.dueDate || milestone.due_date) as string | Date),
      completed: Boolean(milestone.completed),
    })),
  })));
  setServerItems('tasks', (tasks as Array<Record<string, unknown>>).map(task => ({
    id: String(task.id),
    title: String(task.title || ''),
    project: String(task.project || ''),
    assignee: String(task.assignee || ''),
    status: task.status as Task['status'],
    priority: task.priority as Task['priority'],
    dueDate: dateOnly(task.dueDate as string | Date),
    dependencies: (task.dependencies || []) as string[],
    sprintId: task.sprintId ? String(task.sprintId) : null,
    subtasks: (task.subtasks || []) as Subtask[],
    comments: (task.comments || []) as TaskComment[],
  })));
  setServerItems('sprints', (sprints as Array<Record<string, unknown>>).map(sprint => ({
    id: String(sprint.id),
    name: String(sprint.name || ''),
    startDate: dateOnly((sprint.startDate || sprint.start_date) as string | Date),
    endDate: dateOnly((sprint.endDate || sprint.end_date) as string | Date),
    status: sprint.status as Sprint['status'],
  })));
  setServerItems('notifications', (notifications as Array<Record<string, unknown>>).map(item => ({
    id: String(item.id),
    type: item.type as NotificationItem['type'],
    title: String(item.title || ''),
    message: String(item.message || ''),
    timestamp: String(item.timestamp || item.created_at || ''),
    read: Boolean(item.read ?? item.is_read),
    link: String(item.link || '#'),
  })));
  setServerItems('user_settings', {
    userId: 'USR-1',
    theme: (settings.theme || 'system') as UserSettings['theme'],
    accentColor: String(settings.accent_color || settings.accentColor || 'indigo'),
    density: (settings.density || 'comfortable') as UserSettings['density'],
    language: String(settings.language || 'fr'),
    timezone: String(settings.timezone || 'Europe/Paris'),
    dateFormat: String(settings.date_format || settings.dateFormat || 'DD/MM/YYYY'),
    emailNotifications: Boolean(settings.email_notifications ?? settings.emailNotifications ?? true),
    pushNotifications: Boolean(settings.push_notifications ?? settings.pushNotifications ?? true),
    updatedAt: String(settings.updated_at || settings.updatedAt || ''),
  });
  setServerItems('actionable_tasks', actionableTasks as ActionableTask[]);
}

// ========================================================
// NOTIFICATIONS PERSISTENCE & AUTO-CREATION
// ========================================================
export function getStoredNotifications(): NotificationItem[] {
  return getItem<NotificationItem[]>('notifications', []);
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
  persistBackendChange('/notifications', {
    method: 'POST',
    body: JSON.stringify(newItem)
  });

  return newItem;
}

export function markNotificationRead(id: string): NotificationItem[] {
  const current = getStoredNotifications();
  const updated = current.map(n => n.id === id ? { ...n, read: true } : n);
  setItem('notifications', updated);
  persistBackendChange(`/notifications/${id}/read`, { method: 'PATCH' });
  return updated;
}

export function markAllNotificationsRead(): NotificationItem[] {
  const updated = getStoredNotifications().map(item => ({ ...item, read: true }));
  setItem('notifications', updated);
  persistBackendChange('/notifications/read-all', {
    method: 'POST',
    body: JSON.stringify({ userId: 'USR-1' }),
  });
  return updated;
}

export function deleteNotification(id: string): NotificationItem[] {
  const updated = getStoredNotifications().filter(item => item.id !== id);
  setItem('notifications', updated);
  persistBackendChange(`/notifications/${id}`, { method: 'DELETE' });
  return updated;
}

export function clearAllNotifications(): void {
  setItem('notifications', []);
  persistBackendChange('/notifications/clear-all', { method: 'DELETE' });
}

// ========================================================
// TEAM / MEMBERS PERSISTENCE
// ========================================================
export function getStoredTeam(): UserMember[] {
  return getItem<UserMember[]>('team', []);
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
  persistBackendChange(
    existingIndex >= 0 ? `/team/${member.id}` : '/team',
    { method: existingIndex >= 0 ? 'PUT' : 'POST', body: JSON.stringify(member) }
  );
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

  persistBackendChange(`/team/${id}`, { method: 'DELETE' });
  return updated;
}

// ========================================================
// PROJECTS PERSISTENCE
// ========================================================
export function getStoredProjects(): Project[] {
  return getItem<Project[]>('projects', []);
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
      totalBudget: project.totalBudget ?? 0,
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
  persistBackendChange(
    existingIndex >= 0 ? `/projects/${project.id}` : '/projects',
    { method: existingIndex >= 0 ? 'PUT' : 'POST', body: JSON.stringify(project) }
  );
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

  persistBackendChange(`/projects/${id}`, { method: 'DELETE' });
  return updated;
}

// ========================================================
// TASKS PERSISTENCE
// ========================================================
export function getStoredTasks(): Task[] {
  return getItem<Task[]>('tasks', []);
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
      assignee: task.assignee || '',
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
  persistBackendChange(
    existingIndex >= 0 ? `/tasks/${task.id}` : '/tasks',
    { method: existingIndex >= 0 ? 'PUT' : 'POST', body: JSON.stringify(task) }
  );
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

  persistBackendChange(`/tasks/${id}`, { method: 'DELETE' });
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

  persistBackendChange('/team/reassign-tasks', { method: 'POST', body: JSON.stringify({ reassignments }) });
  return updated;
}

// ========================================================
// ACTIONABLE / BLOCKED TASKS PERSISTENCE
// ========================================================
export function getStoredActionableTasks(): ActionableTask[] {
  return getItem<ActionableTask[]>('actionable_tasks', []);
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
  persistBackendChange('/actionable-tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });

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
  return getItem<Sprint[]>('sprints', []);
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
  persistBackendChange(
    existing >= 0 ? `/sprints/${sprint.id}` : '/sprints',
    {
      method: existing >= 0 ? 'PUT' : 'POST',
      body: JSON.stringify(sprint),
    }
  );

  createSystemNotification({
    type: 'system',
    title: 'Sprint mis à jour',
    message: `Le sprint "${sprint.name}" a été enregistré.`
  });

  return updated;
}

export function deleteSprint(id: string): Sprint[] {
  const updated = getStoredSprints().filter(sprint => sprint.id !== id);
  setItem('sprints', updated);
  persistBackendChange(`/sprints/${id}`, { method: 'DELETE' });
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
    if (settings.density) {
      try {
        localStorage.setItem('klarity_density', settings.density);
      } catch {
        // Ignore
      }
    }

    createSystemNotification({
      type: 'system',
      title: "Couleur d'accentuation modifiée",
      message: `La couleur de l'interface est désormais configurée sur : ${settings.accentColor}.`
    });
  }

  persistBackendChange('/settings', {
    method: 'POST',
    body: JSON.stringify(updated),
  });

  return updated;
}
