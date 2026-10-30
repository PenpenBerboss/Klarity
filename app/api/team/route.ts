import { NextRequest, NextResponse } from 'next/server';

interface UserMember {
  id: number | string;
  name: string;
  email: string;
  role: string;
  department: string;
  capacity: number;
  status: 'disponible' | 'optimal' | 'surchargé' | 'critique' | 'invité';
}

let teamStore: UserMember[] = [
  { id: 1, name: 'Samuel Mbarga', role: 'Lead Developer', department: 'Ingénierie', capacity: 95, status: 'surchargé', email: 'samuel@klarity.cm' },
  { id: 2, name: 'Chantal Abena', role: 'Product Manager', department: 'Produit', capacity: 80, status: 'optimal', email: 'chantal@klarity.cm' },
  { id: 3, name: 'Emmanuel Nguema', role: 'DevOps Engineer', department: 'Infrastructure', capacity: 60, status: 'optimal', email: 'emmanuel@klarity.cm' },
  { id: 4, name: 'Nathalie Ekotto', role: 'UX/UI Designer', department: 'Design', capacity: 110, status: 'critique', email: 'nathalie@klarity.cm' },
  { id: 5, name: 'Dieudonné Tchato', role: 'Développeur Frontend', department: 'Ingénierie', capacity: 40, status: 'disponible', email: 'dieudonne@klarity.cm' },
];

export async function GET() {
  return NextResponse.json(teamStore);
}

export async function POST(req: NextRequest) {
  try {
    const member = await req.json();
    const existingIndex = teamStore.findIndex(m => String(m.id) === String(member.id));
    if (existingIndex >= 0) {
      teamStore[existingIndex] = { ...teamStore[existingIndex], ...member };
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
      teamStore.push(newMember);
    }
    return NextResponse.json({ success: true, data: teamStore });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      teamStore = teamStore.filter(m => String(m.id) !== String(id));
    }
    return NextResponse.json({ success: true, data: teamStore });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
