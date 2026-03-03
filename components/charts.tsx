"use client";

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  LineChart, Line, AreaChart, Area, ComposedChart 
} from 'recharts';
import { useTheme } from 'next-themes';

const projectData = [
  { name: 'Refonte ERP', budget: 120, reel: 135, prevu: 120 },
  { name: 'App Mobile', budget: 80, reel: 65, prevu: 70 },
  { name: 'Migration Cloud', budget: 200, reel: 180, prevu: 190 },
  { name: 'Site Web', budget: 40, reel: 40, prevu: 40 },
  { name: 'CRM V2', budget: 90, reel: 45, prevu: 50 },
];

export function ProjectHealthChart() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#374151' : '#f0f0f0';
  const textColor = isDark ? '#9ca3af' : '#888';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
  const tooltipText = isDark ? '#f3f4f6' : '#111827';
  const cursorFill = isDark ? '#374151' : '#f9fafb';

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={projectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={16}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: textColor }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: textColor }} />
          <Tooltip 
            cursor={{ fill: cursorFill }}
            contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            itemStyle={{ color: tooltipText }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: textColor }} />
          <Bar dataKey="budget" name="Budget Alloué (M FCFA)" fill={isDark ? '#4b5563' : '#e2e8f0'} radius={[4, 4, 0, 0]} />
          <Bar dataKey="reel" name="Coût Réel (M FCFA)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const workloadData = [
  { name: 'Lun', dev: 85, design: 60, pm: 40 },
  { name: 'Mar', dev: 90, design: 75, pm: 50 },
  { name: 'Mer', dev: 110, design: 80, pm: 60 },
  { name: 'Jeu', dev: 95, design: 65, pm: 55 },
  { name: 'Ven', dev: 70, design: 50, pm: 45 },
];

export function TeamWorkloadChart() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#374151' : '#f0f0f0';
  const textColor = isDark ? '#9ca3af' : '#888';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
  const tooltipText = isDark ? '#f3f4f6' : '#111827';

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: textColor }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: textColor }} />
          <Tooltip 
            contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            itemStyle={{ color: tooltipText }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: textColor }} />
          <Line type="monotone" dataKey="dev" name="Développeurs" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="design" name="Designers" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const velocityData = [
  { sprint: 'Sprint 1', completed: 35, planned: 40 },
  { sprint: 'Sprint 2', completed: 42, planned: 40 },
  { sprint: 'Sprint 3', completed: 38, planned: 45 },
  { sprint: 'Sprint 4', completed: 48, planned: 45 },
  { sprint: 'Sprint 5', completed: 50, planned: 50 },
];

export function SprintVelocityChart() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#374151' : '#f0f0f0';
  const textColor = isDark ? '#9ca3af' : '#888';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
  const tooltipText = isDark ? '#f3f4f6' : '#111827';
  const cursorFill = isDark ? '#374151' : '#f9fafb';

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis dataKey="sprint" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: textColor }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: textColor }} />
          <Tooltip 
            cursor={{ fill: cursorFill }}
            contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            itemStyle={{ color: tooltipText }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: textColor }} />
          <Bar dataKey="completed" name="Points Complétés" fill="#10b981" barSize={24} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="planned" name="Points Planifiés" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

const flowData = [
  { day: 'J1', todo: 40, inProgress: 10, review: 0, done: 0 },
  { day: 'J2', todo: 35, inProgress: 12, review: 3, done: 0 },
  { day: 'J3', todo: 25, inProgress: 15, review: 5, done: 5 },
  { day: 'J4', todo: 15, inProgress: 18, review: 7, done: 10 },
  { day: 'J5', todo: 10, inProgress: 12, review: 8, done: 20 },
  { day: 'J6', todo: 5, inProgress: 10, review: 5, done: 30 },
  { day: 'J7', todo: 0, inProgress: 5, review: 2, done: 43 },
];

export function CumulativeFlowChart() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#374151' : '#f0f0f0';
  const textColor = isDark ? '#9ca3af' : '#888';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
  const tooltipText = isDark ? '#f3f4f6' : '#111827';

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={flowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: textColor }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: textColor }} />
          <Tooltip 
            contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            itemStyle={{ color: tooltipText }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: textColor }} />
          <Area type="monotone" dataKey="done" name="Terminé" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
          <Area type="monotone" dataKey="review" name="En revue" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.8} />
          <Area type="monotone" dataKey="inProgress" name="En cours" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} />
          <Area type="monotone" dataKey="todo" name="À faire" stackId="1" stroke={isDark ? '#4b5563' : '#e2e8f0'} fill={isDark ? '#4b5563' : '#e2e8f0'} fillOpacity={0.8} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
