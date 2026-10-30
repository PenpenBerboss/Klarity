"use client";

import React, { useState } from 'react';
import { X, ArrowRight, UserCheck, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface ReassignModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: any;
  teamMembers: Array<{ id: number | string; name: string; email: string; role: string; status?: string }>;
  tasks: any[];
  onConfirmReassign: (reassignments: Array<{ taskId: string; newAssignee: string }>) => void;
}

export function ReassignModal({
  isOpen,
  onClose,
  member,
  teamMembers,
  tasks,
  onConfirmReassign
}: ReassignModalProps) {
  const [targetMember, setTargetMember] = useState<string>('');
  const [individualAssignments, setIndividualAssignments] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<'global' | 'individual'>('global');

  if (!isOpen || !member) return null;

  // Filter tasks belonging to this member
  const memberTasks = tasks.filter(t => t.assignee === member.name);
  const otherMembers = teamMembers.filter(m => m.name !== member.name && m.status !== 'invité');

  // Initialize target member to the first available team member
  const defaultTarget = otherMembers[0]?.name || '';

  const handleGlobalChange = (newAssignee: string) => {
    setTargetMember(newAssignee);
    const updated: Record<string, string> = {};
    memberTasks.forEach(t => {
      updated[t.id] = newAssignee;
    });
    setIndividualAssignments(updated);
  };

  const handleIndividualChange = (taskId: string, newAssignee: string) => {
    setIndividualAssignments(prev => ({
      ...prev,
      [taskId]: newAssignee
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTarget = targetMember || defaultTarget;
    
    const reassignments = memberTasks.map(task => ({
      taskId: task.id,
      newAssignee: mode === 'global' ? finalTarget : (individualAssignments[task.id] || finalTarget)
    }));

    onConfirmReassign(reassignments);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <RefreshCw size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Réassigner les tâches
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Membre source: <span className="font-medium text-gray-900 dark:text-gray-200">{member.name}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {memberTasks.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-950/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <AlertCircle size={32} className="mx-auto text-indigo-500/80 mb-2" />
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Aucune tâche à réassigner
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                {member.name} n&apos;a actuellement aucune tâche en cours attribuée.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Summary box */}
              <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {memberTasks.length} {memberTasks.length === 1 ? 'tâche trouvée' : 'tâches trouvées'}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                    Sélectionnez le nouveau responsable pour tout ou partie des livrables.
                  </p>
                </div>

                {/* Mode toggle */}
                <div className="flex p-1 bg-white dark:bg-gray-900 rounded-lg border border-indigo-100 dark:border-indigo-900">
                  <button
                    type="button"
                    onClick={() => setMode('global')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      mode === 'global'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Globale
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('individual')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      mode === 'individual'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Par tâche
                  </button>
                </div>
              </div>

              {/* Global Reassignment Option */}
              {mode === 'global' && (
                <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                    Réassigner toutes les tâches à:
                  </label>
                  <div className="flex items-center gap-3">
                    <select
                      value={targetMember || defaultTarget}
                      onChange={(e) => handleGlobalChange(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white cursor-pointer"
                    >
                      {otherMembers.map(m => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Task list preview */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Détail des tâches impactées ({memberTasks.length})
                </h3>

                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  {memberTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="p-3 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                            {task.id}
                          </span>
                          <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                            {task.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                          <span>Projet: {task.project || 'Général'}</span>
                          <span>•</span>
                          <span className="capitalize">Priorité: {task.priority}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <ArrowRight size={14} className="text-gray-400" />
                        
                        {mode === 'individual' ? (
                          <select
                            value={individualAssignments[task.id] || targetMember || defaultTarget}
                            onChange={(e) => handleIndividualChange(task.id, e.target.value)}
                            className="px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs dark:text-white cursor-pointer"
                          >
                            {otherMembers.map(m => (
                              <option key={m.id} value={m.name}>{m.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-lg">
                            {targetMember || defaultTarget}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <UserCheck size={16} /> Confirmer la réassignation
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
