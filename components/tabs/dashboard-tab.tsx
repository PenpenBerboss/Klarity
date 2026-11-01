"use client";

import React, { useEffect, useState } from 'react';
import { KpiCards } from '@/components/kpi-cards';
import { ActionableTasks } from '@/components/actionable-tasks';
import { getStoredSprints, getStoredTasks, getStoredProjects, Milestone } from '@/lib/api';

export function DashboardTab() {
  const [activeSprint, setActiveSprint] = useState<any>(null);
  const [sprintProgress, setSprintProgress] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [totalTasksCount, setTotalTasksCount] = useState(0);
  const [upcomingMilestones, setUpcomingMilestones] = useState<Array<{ title: string; date: string; project: string }>>([]);

  useEffect(() => {
    const loadDashboardData = () => {
      const sprints = getStoredSprints();
      const tasks = getStoredTasks();
      const projects = getStoredProjects();

      const current = sprints.find(s => s.status === 'active') || sprints[0];
      setActiveSprint(current);

      if (current) {
        const sprintTasks = tasks.filter(t => t.sprintId === current.id);
        const completed = sprintTasks.filter(t => t.status === 'done').length;
        const total = sprintTasks.length;
        setCompletedTasksCount(completed);
        setTotalTasksCount(total);
        setSprintProgress(total > 0 ? Math.round((completed / total) * 100) : 0);
      }

      // Collect milestones
      const milestonesList: Array<{ title: string; date: string; project: string }> = [];
      projects.forEach(p => {
        p.milestones.forEach(m => {
          if (!m.completed) {
            milestonesList.push({
              title: m.title,
              date: m.date,
              project: p.name
            });
          }
        });
      });
      setUpcomingMilestones(milestonesList.slice(0, 4));
    };

    loadDashboardData();

    const handleDbUpdate = () => loadDashboardData();
    window.addEventListener('klarity_db_update', handleDbUpdate);
    return () => window.removeEventListener('klarity_db_update', handleDbUpdate);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <header className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Vue d&apos;ensemble</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Données en direct extraites de la base de données de l&apos;entreprise.</p>
      </header>

      <KpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">Points de blocage & Retards prévus</h2>
          </div>
          <ActionableTasks />
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">Sprint en cours</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    {activeSprint?.name || 'Aucun sprint actif'}
                  </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{sprintProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                  <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${sprintProgress}%` }}></div>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-2 flex justify-between">
                  <span>Période: {activeSprint?.startDate} au {activeSprint?.endDate}</span>
                  <span>{completedTasksCount}/{totalTasksCount} tâches terminées</span>
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Jalons imminents</h3>
                <div className="space-y-3">
                  {upcomingMilestones.length > 0 ? (
                    upcomingMilestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 font-bold text-xs">
                          M{i+1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{m.title}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">{m.project} • {m.date}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">Aucun jalon imminent.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
