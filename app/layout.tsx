import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AppearanceProvider } from '@/components/appearance-provider';
import { NotificationProvider } from '@/components/notification-provider';
import { DatabaseProvider } from '@/components/database-provider';
import { ToastProvider } from '@/components/toast-provider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Klarity - Plateforme de Gestion de Projets & Équipe',
  description: 'Solution SaaS de suivi de projets, gestion des tâches, indicateurs KPIs et pilotage d\'équipe.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning data-accent="indigo" data-density="comfortable" className={inter.variable}>
      <body suppressHydrationWarning className={`${inter.className} antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <DatabaseProvider>
            <ToastProvider>
              <AppearanceProvider>
                <NotificationProvider>
                  {children}
                </NotificationProvider>
              </AppearanceProvider>
            </ToastProvider>
          </DatabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
