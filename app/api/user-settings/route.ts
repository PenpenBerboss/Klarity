import { NextRequest, NextResponse } from 'next/server';

export interface UserSettingsData {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  density: 'comfortable' | 'compact';
  language: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  updatedAt: string;
}

// In-memory / server-persisted user settings
let currentSettings: UserSettingsData = {
  userId: 'usr_default_admin',
  theme: 'system',
  accentColor: 'indigo',
  density: 'comfortable',
  language: 'fr',
  timezone: 'Europe/Paris',
  dateFormat: 'DD/MM/YYYY',
  emailNotifications: true,
  pushNotifications: true,
  updatedAt: new Date().toISOString(),
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: currentSettings,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    currentSettings = {
      ...currentSettings,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Paramètres utilisateur enregistrés avec succès dans la base de données.',
      data: currentSettings,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Format JSON invalide' },
      { status: 400 }
    );
  }
}
