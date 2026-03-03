import React from 'react';
import { TriangleAlert, TrendingUp, Clock, Target } from 'lucide-react';
import { clsx } from 'clsx';

export function KpiCards() {
  const kpis = [
    {
      title: "Projets en risque",
      value: "3",
      subtext: "Sur 24 projets actifs",
      icon: TriangleAlert,
      trend: "+1 depuis hier",
      trendColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-500/10",
      iconColor: "text-red-600 dark:text-red-400"
    },
    {
      title: "Respect des délais",
      value: "87%",
      subtext: "Moyenne globale",
      icon: Clock,
      trend: "+2.4% ce mois",
      trendColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Budget consommé",
      value: "64%",
      subtext: "Enveloppe Q1",
      icon: Target,
      trend: "Dans les clous",
      trendColor: "text-gray-500 dark:text-gray-400",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Vélocité moyenne",
      value: "42 pts",
      subtext: "Par sprint / équipe",
      icon: TrendingUp,
      trend: "+5 pts vs S-1",
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
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
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
