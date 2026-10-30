import { NextRequest, NextResponse } from 'next/server';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskComment {
  id: string;
  author: string;
  text: string;
  timestamp: string | Date;
}

interface Task {
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

let tasksStore: Task[] = [
  { id: 'TSK-1', title: 'Maquette page accueil', project: 'Site Web', assignee: 'Nathalie Ekotto', status: 'todo', priority: 'high', dueDate: '2026-03-05', dependencies: [], sprintId: 'SPR-1', subtasks: [{ id: 's1', title: 'Zoning wireframe', completed: true }, { id: 's2', title: 'Prototypage Figma', completed: false }] },
  { id: 'TSK-2', title: 'API Authentification Mobile Money', project: 'App Mobile', assignee: 'Samuel Mbarga', status: 'in_progress', priority: 'critical', dueDate: '2026-03-01', dependencies: ['TSK-1'], sprintId: 'SPR-1', subtasks: [{ id: 's3', title: 'Connexion Orange Money', completed: true }, { id: 's4', title: 'Connexion MTN Mobile Money', completed: true }, { id: 's5', title: 'Gestion webhooks', completed: false }] },
  { id: 'TSK-3', title: 'Tests E2E & Validation', project: 'Refonte ERP', assignee: 'Chantal Abena', status: 'review', priority: 'medium', dueDate: '2026-03-15', dependencies: ['TSK-2'], sprintId: 'SPR-2', subtasks: [] },
  { id: 'TSK-4', title: 'Configuration CI/CD Kubernetes', project: 'Migration Cloud', assignee: 'Emmanuel Nguema', status: 'done', priority: 'high', dueDate: '2026-03-02', dependencies: [], sprintId: 'SPR-1', subtasks: [{ id: 's6', title: 'Script Helm charts', completed: true }] },
  { id: 'TSK-5', title: 'Design System & Composants', project: 'App Mobile', assignee: 'Nathalie Ekotto', status: 'in_progress', priority: 'medium', dueDate: '2026-03-20', dependencies: ['TSK-1'], sprintId: null, subtasks: [] },
  { id: 'TSK-6', title: 'Rédaction documentation technique', project: 'CRM V2', assignee: 'Dieudonné Tchato', status: 'todo', priority: 'medium', dueDate: '2026-03-25', dependencies: [], sprintId: null, subtasks: [] },
];

export async function GET() {
  return NextResponse.json(tasksStore);
}

export async function POST(req: NextRequest) {
  try {
    const task = await req.json();
    const existingIndex = tasksStore.findIndex(t => t.id === task.id);
    if (existingIndex >= 0) {
      tasksStore[existingIndex] = { ...tasksStore[existingIndex], ...task };
    } else {
      const newTask: Task = {
        id: task.id || `TSK-${tasksStore.length + 1}`,
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
      tasksStore.push(newTask);
    }
    return NextResponse.json({ success: true, data: tasksStore });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      tasksStore = tasksStore.filter(t => t.id !== id);
    }
    return NextResponse.json({ success: true, data: tasksStore });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
