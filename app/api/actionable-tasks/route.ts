import { NextRequest, NextResponse } from 'next/server';

interface ActionableTask {
  id: string;
  title: string;
  project: string;
  assignee: string;
  status: 'blocked' | 'delayed' | 'warning' | 'completed';
  reason: string;
  impact: string;
}

let actionableTasksStore: ActionableTask[] = [
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

export async function GET() {
  return NextResponse.json(actionableTasksStore);
}

export async function POST(req: NextRequest) {
  try {
    const task = await req.json();
    const existingIndex = actionableTasksStore.findIndex(t => t.id === task.id);
    if (existingIndex >= 0) {
      actionableTasksStore[existingIndex] = { ...actionableTasksStore[existingIndex], ...task };
    } else {
      actionableTasksStore.unshift(task);
    }
    return NextResponse.json({ success: true, data: actionableTasksStore });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
