"use client";

import React, { useState, useEffect } from 'react';
import { Mail, MoreHorizontal, Plus, User, Link2, Check, RefreshCw, Trash2, Edit3 } from 'lucide-react';
import { clsx } from 'clsx';
import { TeamModal } from './team/team-modal';
import { ReassignModal } from './team/reassign-modal';
import { 
  getStoredTeam, 
  saveTeamMember, 
  deleteTeamMember, 
  getStoredTasks, 
  reassignTasksBulk, 
  UserMember, 
  Task 
} from '@/lib/api';

export function TeamTab() {
  const [team, setTeam] = useState<UserMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'manual' | 'invite'>('manual');
  const [editingMember, setEditingMember] = useState<UserMember | null>(null);
  
  // Reassign Modal State
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [reassignMemberTarget, setReassignMemberTarget] = useState<UserMember | null>(null);

  // Manual creation state
  const [manualUser, setManualUser] = useState({ name: '', email: '', role: '', department: '' });
  
  // Invite state
  const [inviteUser, setInviteUser] = useState({ email: '', role: '' });

  const [activeMenuId, setActiveMenuId] = useState<number | string | null>(null);
  const [copiedMemberId, setCopiedMemberId] = useState<number | string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Load from persistent database storage
  useEffect(() => {
    const loadFromDb = () => {
      setTeam(getStoredTeam());
      setTasks(getStoredTasks());
    };

    loadFromDb();

    const handleDbUpdate = () => loadFromDb();
    window.addEventListener('klarity_db_update', handleDbUpdate);
    return () => window.removeEventListener('klarity_db_update', handleDbUpdate);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteMember = (id: number | string) => {
    const updatedTeam = deleteTeamMember(id);
    setTeam(updatedTeam);
    setActiveMenuId(null);
  };

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      const updated = saveTeamMember({
        ...editingMember,
        name: manualUser.name,
        email: manualUser.email,
        role: manualUser.role,
        department: manualUser.department
      });
      setTeam(updated);
      setEditingMember(null);
    } else {
      const updated = saveTeamMember({
        name: manualUser.name,
        email: manualUser.email,
        role: manualUser.role,
        department: manualUser.department,
        capacity: 0,
        status: 'disponible'
      });
      setTeam(updated);
    }
    setIsModalOpen(false);
    setManualUser({ name: '', email: '', role: '', department: '' });
  };

  const openEditModal = (member: UserMember) => {
    setEditingMember(member);
    setManualUser({
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department
    });
    setModalMode('manual');
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const openCreateModal = () => {
    setEditingMember(null);
    setManualUser({ name: '', email: '', role: '', department: '' });
    setModalMode('manual');
    setIsModalOpen(true);
  };

  const openReassignModal = (member: UserMember) => {
    setReassignMemberTarget(member);
    setIsReassignModalOpen(true);
    setActiveMenuId(null);
  };

  const handleConfirmReassign = (reassignments: Array<{ taskId: string; newAssignee: string }>) => {
    if (!reassignMemberTarget) return;

    const updatedTasks = reassignTasksBulk(reassignments);
    setTasks(updatedTasks);
    setIsReassignModalOpen(false);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveTeamMember({
      name: 'En attente...',
      email: inviteUser.email,
      role: inviteUser.role || 'Invité',
      department: 'En attente',
      capacity: 0,
      status: 'invité'
    });

    setTeam(updated);
    setInviteUser({ email: '', role: '' });
  };

  const copyInviteLinkForMember = (member: UserMember) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://klarity.cm';
    const link = `${origin}/join?email=${encodeURIComponent(member.email)}`;
    navigator.clipboard.writeText(link);
    setCopiedMemberId(member.id);
    setTimeout(() => setCopiedMemberId(null), 2000);
    setActiveMenuId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative">
      <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Équipe</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez les membres de votre équipe et leur charge de travail en base de données.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-2xs shrink-0 cursor-pointer"
        >
          <Plus size={16} /> Ajouter un membre
        </button>
      </header>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4 font-medium">Collaborateur</th>
                <th className="px-6 py-4 font-medium">Rôle & Département</th>
                <th className="px-6 py-4 font-medium">Charge actuelle</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {team.map(member => (
                <tr key={member.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        "w-10 h-10 rounded-full border border-white dark:border-gray-900 shadow-xs flex items-center justify-center text-sm font-medium shrink-0",
                        member.status === 'invité' ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500" : "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300"
                      )}>
                        {member.status === 'invité' ? <Mail size={16} /> : <User size={18} />}
                      </div>
                      <div>
                        <div className={clsx("font-medium text-sm", member.status === 'invité' ? "text-gray-400 dark:text-gray-500 italic" : "text-gray-900 dark:text-white")}>
                          {member.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <Mail size={12} /> {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-200">{member.role}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{member.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    {member.status !== 'invité' ? (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full w-24">
                          <div 
                            className={clsx("h-2 rounded-full", member.capacity > 100 ? 'bg-red-500' : member.capacity > 85 ? 'bg-amber-500' : 'bg-emerald-500')} 
                            style={{ width: `${Math.min(member.capacity, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{member.capacity}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500 italic">En attente d&apos;inscription</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "px-2.5 py-1 rounded-full text-xs font-medium inline-block",
                      member.status === 'critique' ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400' :
                      member.status === 'surchargé' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' :
                      member.status === 'disponible' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' :
                      member.status === 'invité' ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700' :
                      'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    )}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    
                    {activeMenuId === member.id && (
                      <div 
                        ref={menuRef}
                        className="absolute right-6 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 text-left animate-in fade-in zoom-in-95"
                      >
                        {member.status === 'invité' ? (
                          <button 
                            onClick={() => copyInviteLinkForMember(member)}
                            className="w-full px-4 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2 cursor-pointer"
                          >
                            {copiedMemberId === member.id ? <Check size={14} /> : <Link2 size={14} />}
                            {copiedMemberId === member.id ? 'Lien copié !' : 'Copier le lien d\'invitation'}
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => openEditModal(member)}
                              className="w-full px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                            >
                              <Edit3 size={14} /> Modifier le profil
                            </button>
                            <button 
                              onClick={() => openReassignModal(member)}
                              className="w-full px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                            >
                              <RefreshCw size={14} /> Réassigner les tâches
                            </button>
                          </>
                        )}
                        
                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                        <button 
                          onClick={() => handleDeleteMember(member.id)}
                          className="w-full px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 size={14} /> Retirer de l&apos;équipe
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TeamModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalMode={modalMode}
        setModalMode={setModalMode}
        manualUser={manualUser}
        setManualUser={setManualUser}
        inviteUser={inviteUser}
        setInviteUser={setInviteUser}
        handleManualCreate={handleManualCreate}
        handleInvite={handleInvite}
        editingMember={editingMember}
      />

      <ReassignModal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        member={reassignMemberTarget}
        teamMembers={team}
        tasks={tasks}
        onConfirmReassign={handleConfirmReassign}
      />
    </div>
  );
}
