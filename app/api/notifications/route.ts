import { NextRequest, NextResponse } from 'next/server';

interface NotificationItem {
  id: string;
  type: 'task_assigned' | 'due_date' | 'comment' | 'status_change' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

let notificationsStore: NotificationItem[] = [
  {
    id: '1',
    type: 'system',
    title: 'Espace Klarity Initialisé',
    message: 'Votre base de données d\'entreprise a été configurée et synchronisée.',
    timestamp: new Date().toISOString(),
    read: false,
  }
];

export async function GET() {
  return NextResponse.json(notificationsStore);
}

export async function POST(req: NextRequest) {
  try {
    const item = await req.json();
    const existingIndex = notificationsStore.findIndex(n => n.id === item.id);
    if (existingIndex >= 0) {
      notificationsStore[existingIndex] = { ...notificationsStore[existingIndex], ...item };
    } else {
      notificationsStore.unshift({
        ...item,
        id: item.id || `NOTIF-${Date.now()}`,
        timestamp: item.timestamp || new Date().toISOString(),
        read: item.read || false
      });
    }
    return NextResponse.json({ success: true, data: notificationsStore });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE() {
  notificationsStore = [];
  return NextResponse.json({ success: true, data: [] });
}
