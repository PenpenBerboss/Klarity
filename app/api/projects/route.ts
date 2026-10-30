import { NextRequest, NextResponse } from 'next/server';

interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

interface Project {
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

let projectsStore: Project[] = [
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

export async function GET() {
  return NextResponse.json(projectsStore);
}

export async function POST(req: NextRequest) {
  try {
    const project = await req.json();
    const existingIndex = projectsStore.findIndex(p => p.id === project.id);
    if (existingIndex >= 0) {
      projectsStore[existingIndex] = { ...projectsStore[existingIndex], ...project };
    } else {
      const newProject: Project = {
        id: project.id || `PRJ-${projectsStore.length + 1}`,
        name: project.name,
        status: project.status || 'on_track',
        progress: project.progress || 0,
        budget: project.budget || 0,
        totalBudget: project.totalBudget || 50,
        dueDate: project.dueDate || new Date().toISOString().split('T')[0],
        manager: project.manager || 'Samuel Mbarga',
        description: project.description || '',
        milestones: project.milestones || []
      };
      projectsStore.push(newProject);
    }
    return NextResponse.json({ success: true, data: projectsStore });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      projectsStore = projectsStore.filter(p => p.id !== id);
    }
    return NextResponse.json({ success: true, data: projectsStore });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
