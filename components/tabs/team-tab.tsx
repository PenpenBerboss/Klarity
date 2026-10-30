"use client";

import React, { useState } from 'react';
import { Mail, MoreHorizontal, Plus, User } from 'lucide-react';
import { clsx } from 'clsx';
import { TeamModal } from './team/team-modal';

const initialTeam = [
  { id: 1, name: 'Samuel Mbarga', role: 'Lead Developer', department: 'Ingénierie', capacity: 95, status: 'surchargé', email: 'samuel@klarity.cm' },
  { id: 2, name: 'Chantal Abena', role: 'Product Manager', department: 'Produit', capacity: 80, status: 'optimal', email: 'chantal@klarity.cm' },
  { id: 3, name: 'Emmanuel Nguema', role: 'DevOps Engineer', department: 'Infrastructure', capacity: 60, status: 'optimal', email: 'emmanuel@klarity.cm' },
  { id: 4, name: 'Nathalie Ekotto', role: 'UX/UI Designer', department: 'Design', capacity: 110, status: 'critique', email: 'nathalie@klarity.cm' },
  { id: 5, name: 'Dieudonné Tchato', role: 'Développeur Frontend', department: 'Ingénierie', capacity: 40, status: 'disponible', email: 'dieudonne@klarity.cm' },
];

export function TeamTab() {
  const [team, setTeam] = useState(initialTeam);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'manual' | 'invite'>('manual');
  const [editingMember, setEditingMember] = useState<any | null>(null);
  
  // Manual creation state
  const [manualUser, setManualUser] = useState({ name: '', email: '', role: '', department: '' });
  
  // Invite state
  const [inviteUser, setInviteUser] = useState({ email: '', role: '' });

  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const deleteMember = (id: number) => {
    setTeam(team.filter(m => m.id !== id));
    setActiveMenuId(null);
  };

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setTeam(team.map(m => m.id === editingMember.id ? { ...m, ...manualUser } : m));
      setEditingMember(null);
    } else {
      const newUser = {
        id: team.length + 1,
        name: manualUser.name,
        email: manualUser.email,
        role: manualUser.role,
        department: manualUser.department,
        capacity: 0,
        status: 'disponible'
      };
      setTeam([...team, newUser]);
    }
    setIsModalOpen(false);
    setManualUser({ name: '', email: '', role: '', department: '' });
  };

  const openEditModal = (member: any) => {
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

  const reassignTasks = (member: any) => {
    alert(`Réassignation des tâches de ${member.name}. Choisissez un nouveau collaborateur.`);
    setActiveMenuId(null);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: team.length + 1,
      name: 'En attente...',
      email: inviteUser.email,
      role: inviteUser.role,
      department: '-',
      capacity: 0,
      status: 'invité'
    };
    setTeam([...team, newUser]);
    setIsModalOpen(false);
    setInviteUser({ email: '', role: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative">
      <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Équipe</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez les membres de votre équipe et leur charge de travail.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-2xs shrink-0 cursor-pointer"
        >
          <Plus size={16} /> Ajouter un membre
        </button>
      </header>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
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
                        "w-10 h-10 rounded-full border border-white dark:border-gray-900 shadow-sm flex items-center justify-center text-sm font-medium shrink-0",
                        member.status === 'invité' ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500" : "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300"
                      )}>
                        {member.status === 'invité' ? <Mail size={16} /> : <User size={18} />}
                      </div>
                      <div>
                        <div className={clsx("font-medium text-sm", member.status === 'invité' ? "text-gray-400 dark:text-gray-500 italic" : "text-gray-900 dark:text-white")}>{member.name}</div>
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
                        className="absolute right-6 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 text-left"
                      >
                        <button 
                          onClick={() => openEditModal(member)}
                          className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          Modifier le profil
                        </button>
                        <button 
                          onClick={() => reassignTasks(member)}
                          className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          Réassigner les tâches
                        </button>
                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                        <button 
                          onClick={() => deleteMember(member.id)}
                          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          Retirer de l&apos;équipe
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
    </div>
  );
}
