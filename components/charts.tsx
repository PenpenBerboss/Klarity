"use client";

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, AreaChart, Area, ComposedChart,
} from 'recharts';
import { useTheme } from 'next-themes';
import { getStoredProjects, getStoredSprints, getStoredTasks, getStoredTeam, Project, Sprint, Task, UserMember } from '@/lib/api';

function useDatabaseData() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<UserMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);

  useEffect(() => {
    const refresh = () => {
      setProjects(getStoredProjects());
      setTeam(getStoredTeam());
      setTasks(getStoredTasks());
      setSprints(getStoredSprints());
    };
    refresh();
    window.addEventListener('klarity_db_update', refresh);
    return () => window.removeEventListener('klarity_db_update', refresh);
  }, []);

  return { projects, team, tasks, sprints };
}

function useChartColors() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';
  return {
    isDark,
    gridColor: isDark ? '#374151' : '#f0f0f0',
    textColor: isDark ? '#9ca3af' : '#6b7280',
    tooltipBg: isDark ? '#1f2937' : '#ffffff',
    tooltipBorder: isDark ? '#374151' : '#e5e7eb',
    tooltipText: isDark ? '#f3f4f6' : '#111827',
    cursorFill: isDark ? '#374151' : '#f9fafb',
  };
}

function ChartTooltip({ colors }: { colors: ReturnType<typeof useChartColors> }) {
  return (
    <Tooltip
      contentStyle={{
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        color: colors.tooltipText,
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
      itemStyle={{ color: colors.tooltipText }}
    />
  );
}

export function ProjectHealthChart() {
  const colors = useChartColors();
  const { projects } = useDatabaseData();
  const data = projects.map(project => ({
    name: project.name,
    budget: project.totalBudget / 1_000_000,
    reel: project.budget / 1_000_000,
  }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={16}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.gridColor} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: colors.textColor }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: colors.textColor }} />
          <ChartTooltip colors={colors} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: colors.textColor }} />
          <Bar dataKey="budget" name="Budget alloué (M FCFA)" fill={colors.isDark ? '#4b5563' : '#e2e8f0'} radius={[4, 4, 0, 0]} />
          <Bar dataKey="reel" name="Dépenses (M FCFA)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TeamWorkloadChart() {
  const colors = useChartColors();
  const { team } = useDatabaseData();
  const data = team.map(member => ({ name: member.name, charge: member.capacity }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.gridColor} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: colors.textColor }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: colors.textColor }} unit="%" />
          <ChartTooltip colors={colors} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: colors.textColor }} />
          <Line type="monotone" dataKey="charge" name="Charge (%)" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SprintVelocityChart() {
  const colors = useChartColors();
  const { sprints, tasks } = useDatabaseData();
  const data = sprints.map(sprint => {
    const sprintTasks = tasks.filter(task => task.sprintId === sprint.id);
    return {
      sprint: sprint.name,
      completed: sprintTasks.filter(task => task.status === 'done').length,
      planned: sprintTasks.length,
    };
  });
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.gridColor} />
          <XAxis dataKey="sprint" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: colors.textColor }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: colors.textColor }} />
          <Tooltip cursor={{ fill: colors.cursorFill }} contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, color: colors.tooltipText, borderRadius: '12px' }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: colors.textColor }} />
          <Bar dataKey="completed" name="Tâches terminées" fill="#10b981" barSize={24} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="planned" name="Tâches planifiées" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CumulativeFlowChart() {
  const colors = useChartColors();
  const { tasks } = useDatabaseData();
  const data = [{
    day: 'Actuel',
    todo: tasks.filter(task => task.status === 'todo').length,
    inProgress: tasks.filter(task => task.status === 'in_progress').length,
    review: tasks.filter(task => task.status === 'review').length,
    done: tasks.filter(task => task.status === 'done').length,
  }];
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.gridColor} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: colors.textColor }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: colors.textColor }} />
          <ChartTooltip colors={colors} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: colors.textColor }} />
          <Area type="monotone" dataKey="done" name="Terminées" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
          <Area type="monotone" dataKey="review" name="En revue" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.8} />
          <Area type="monotone" dataKey="inProgress" name="En cours" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.8} />
          <Area type="monotone" dataKey="todo" name="À faire" stackId="1" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.8} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
