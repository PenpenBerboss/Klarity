"use client";

import React, { useState } from 'react';
import { X, UserPlus, Send, Mail, Copy, Check, ExternalLink, Link2 } from 'lucide-react';
import { clsx } from 'clsx';

export function TeamModal({
  isModalOpen,
  setIsModalOpen,
  modalMode,
  setModalMode,
  manualUser,
  setManualUser,
  inviteUser,
  setInviteUser,
  handleManualCreate,
  handleInvite,
  editingMember
}: {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  modalMode: 'manual' | 'invite';
  setModalMode: (m: 'manual' | 'invite') => void;
  manualUser: any;
  setManualUser: (u: any) => void;
  inviteUser: any;
  setInviteUser: (u: any) => void;
  handleManualCreate: (e: React.FormEvent) => void;
  handleInvite: (e: React.FormEvent) => void;
  editingMember: any | null;
}) {
  const [copied, setCopied] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  if (!isModalOpen) return null;

  const handleGenerateAndInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://klarity.cm';
    const token = `INV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const link = `${origin}/join?token=${token}&email=${encodeURIComponent(inviteUser.email)}`;
    
    setGeneratedLink(link);
    handleInvite(e);
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const mailtoUrl = generatedLink && inviteUser.email ? 
    `mailto:${inviteUser.email}?subject=${encodeURIComponent("Invitation à rejoindre l'équipe Klarity")}&body=${encodeURIComponent(`Bonjour,\n\nVous avez été invité(e) à rejoindre notre espace d'équipe sur Klarity avec le rôle de ${inviteUser.role || 'Membre'}.\n\nCliquez sur le lien suivant pour accepter l'invitation et finaliser votre inscription :\n${generatedLink}\n\nÀ très vite !`)}`
    : '#';

  return (
    <div 
      className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={() => setIsModalOpen(false)}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingMember ? 'Modifier le profil' : 'Ajouter un membre'}
          </h2>
          <button 
            onClick={() => {
              setIsModalOpen(false);
              setGeneratedLink(null);
            }} 
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Tabs - Only show if not editing */}
          {!editingMember && (
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
              <button 
                type="button"
                onClick={() => {
                  setModalMode('manual');
                  setGeneratedLink(null);
                }}
                className={clsx(
                  "flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer",
                  modalMode === 'manual' ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                <UserPlus size={16} /> Créer manuellement
              </button>
              <button 
                type="button"
                onClick={() => setModalMode('invite')}
                className={clsx(
                  "flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer",
                  modalMode === 'invite' ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                <Send size={16} /> Inviter par email
              </button>
            </div>
          )}

          {(modalMode === 'manual' || editingMember) ? (
            <form onSubmit={handleManualCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Nom complet</label>
                <input 
                  type="text" required
                  value={manualUser.name} onChange={e => setManualUser({...manualUser, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white dark:placeholder-gray-500" 
                  placeholder="Ex: Samuel Mbarga"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input 
                  type="email" required
                  value={manualUser.email} onChange={e => setManualUser({...manualUser, email: e.target.value})}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white dark:placeholder-gray-500" 
                  placeholder="samuel@klarity.cm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Rôle</label>
                  <input 
                    type="text" required
                    value={manualUser.role} onChange={e => setManualUser({...manualUser, role: e.target.value})}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white dark:placeholder-gray-500" 
                    placeholder="Ex: Lead Développeur"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Département</label>
                  <input 
                    type="text" required
                    value={manualUser.department} onChange={e => setManualUser({...manualUser, department: e.target.value})}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white dark:placeholder-gray-500" 
                    placeholder="Ex: Ingénierie"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer">
                  {editingMember ? 'Enregistrer' : 'Créer le membre'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleGenerateAndInvite} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Adresse Email du collaborateur</label>
                  <input 
                    type="email" required
                    value={inviteUser.email} onChange={e => setInviteUser({...inviteUser, email: e.target.value})}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white dark:placeholder-gray-500" 
                    placeholder="collaborateur@entreprise.cm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Rôle attribué (Optionnel)</label>
                  <input 
                    type="text"
                    value={inviteUser.role} onChange={e => setInviteUser({...inviteUser, role: e.target.value})}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white dark:placeholder-gray-500" 
                    placeholder="Ex: Product Manager"
                  />
                </div>

                <div className="bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 p-3 rounded-xl text-xs flex items-start gap-2 border border-indigo-100 dark:border-indigo-900/50">
                  <Mail size={16} className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  <p>Un lien d&apos;accès sécurisé sera généré. Vous pourrez le copier directement ou l&apos;envoyer par email.</p>
                </div>

                {!generatedLink && (
                  <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 mt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                      Annuler
                    </button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
                      <Link2 size={16} /> Générer le lien d&apos;invitation
                    </button>
                  </div>
                )}
              </form>

              {/* Generated Link Panel */}
              {generatedLink && (
                <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-xs">
                    <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                    Invitation créée avec succès !
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-emerald-900 dark:text-emerald-200">Lien d&apos;invitation unique :</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={generatedLink}
                        className="flex-1 px-2.5 py-1.5 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800/80 rounded-lg text-xs font-mono text-gray-700 dark:text-gray-300 truncate focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copié !' : 'Copier'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-emerald-200/60 dark:border-emerald-800/40">
                    <a
                      href={mailtoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send size={13} /> Envoyer directement par Email <ExternalLink size={12} />
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setGeneratedLink(null);
                      }}
                      className="px-3 py-1 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100/50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      Terminer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
