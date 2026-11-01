"use client";

import React, { useEffect, useState } from 'react';
import { TriangleAlert, TrendingUp, Clock, Target } from 'lucide-react';
import { clsx } from 'clsx';
import { getStoredProjects, getStoredTasks, getStoredSprints } from '@/lib/api';

export function KpiCards() {
  const [stats, setStats] = useState({
    atRiskProjects: 0,
    totalProjects: 0,
    completionRate: 0,
    budgetConsumedPercent: 0,
    totalTasks: 0,
    completedTasks: 0,
    sprintVelocity: 0,
  });

  useEffect(() => {
    const computeStats = () => {
      const projects = getStoredProjects();
      const tasks = getStoredTasks();
      const sprints = getStoredSprints();

      const atRiskCount = projects.filter(p => p.status === 'at_risk' || p.status === 'delayed').length;
      const totalProj = projects.length;

      const totalBudgetSum = projects.reduce((acc, p) => acc + (p.totalBudget || 0), 0);
      const spentBudgetSum = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
      const budgetPercent = totalBudgetSum > 0 ? Math.round((spentBudgetSum / totalBudgetSum) * 100) : 0;

      const completedCount = tasks.filter(t => t.status === 'done').length;
      const totalT = tasks.length;
      const completionRate = totalT > 0 ? Math.round((completedCount / totalT) * 100) : 0;
      const completedSprints = sprints.filter(sprint => sprint.status === 'completed');
      const sprintVelocity = completedSprints.length > 0
        ? Math.round(completedSprints.reduce((total, sprint) =>
          total + tasks.filter(task => task.sprintId === sprint.id && task.status === 'done').length, 0) / completedSprints.length)
        : 0;

      setStats({
        atRiskProjects: atRiskCount,
        totalProjects: totalProj,
        completionRate,
        budgetConsumedPercent: budgetPercent,
        totalTasks: totalT,
        completedTasks: completedCount,
        sprintVelocity
      });
    };

    computeStats();

    const handleDbUpdate = () => computeStats();
    window.addEventListener('klarity_db_update', handleDbUpdate);
    return () => window.removeEventListener('klarity_db_update', handleDbUpdate);
  }, []);

  const kpis = [
    {
      title: "Projets à risque/retard",
      value: `${stats.atRiskProjects}`,
      subtext: `Sur ${stats.totalProjects} projets actifs`,
      icon: TriangleAlert,
      trend: stats.atRiskProjects > 0 ? `${stats.atRiskProjects} requièrent attention` : "Tous stables",
      trendColor: stats.atRiskProjects > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-red-50 dark:bg-red-500/10",
      iconColor: "text-red-600 dark:text-red-400"
    },
    {
      title: "Tâches terminées",
      value: `${stats.completionRate}%`,
      subtext: "Part des tâches au statut terminé",
      icon: Clock,
      trend: `${stats.completedTasks}/${stats.totalTasks} livrables finalisés`,
      trendColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Budget consommé",
      value: `${stats.budgetConsumedPercent}%`,
      subtext: "Enveloppe globale projets",
      icon: Target,
      trend: stats.budgetConsumedPercent > 100 ? "Dépassement détecté" : "Conforme aux prévisions",
      trendColor: stats.budgetConsumedPercent > 100 ? "text-amber-600 dark:text-amber-400" : "text-gray-500 dark:text-gray-400",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Vélocité moyenne",
      value: `${stats.sprintVelocity}`,
      subtext: "Tâches terminées par sprint clôturé",
      icon: TrendingUp,
      trend: "Moyenne des sprints terminés",
      trendColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-500/10",
      iconColor: "text-indigo-600 dark:text-indigo-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon;
        return (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={clsx("w-10 h-10 flex items-center justify-center rounded-xl", kpi.bgColor)}>
                <Icon size={20} className={kpi.iconColor} />
              </div>
              <span className={clsx("text-xs font-medium", kpi.trendColor)}>{kpi.trend}</span>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{kpi.title}</h3>
            <div className="text-3xl font-light tracking-tight text-gray-900 dark:text-white mb-1">{kpi.value}</div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-auto">{kpi.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
