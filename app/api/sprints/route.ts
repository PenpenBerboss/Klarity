import { NextRequest, NextResponse } from 'next/server';

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'planned' | 'completed';
}

let sprintsStore: Sprint[] = [
  { id: 'SPR-1', name: 'Sprint 1 - MVP Core', startDate: '2026-03-01', endDate: '2026-03-14', status: 'active' },
  { id: 'SPR-2', name: 'Sprint 2 - UI Refinement', startDate: '2026-03-15', endDate: '2026-03-28', status: 'planned' },
];

export async function GET() {
  return NextResponse.json(sprintsStore);
}

export async function POST(req: NextRequest) {
  try {
    const sprint = await req.json();
    const existingIndex = sprintsStore.findIndex(s => s.id === sprint.id);
    if (existingIndex >= 0) {
      sprintsStore[existingIndex] = { ...sprintsStore[existingIndex], ...sprint };
    } else {
      sprintsStore.push(sprint);
    }
    return NextResponse.json({ success: true, data: sprintsStore });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
