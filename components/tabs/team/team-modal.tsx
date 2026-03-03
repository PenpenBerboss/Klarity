import React from 'react';
import { X, UserPlus, Send, Mail } from 'lucide-react';
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
  handleInvite
}: {
  isModalOpen: boolean,
  setIsModalOpen: (v: boolean) => void,
  modalMode: 'manual' | 'invite',
  setModalMode: (m: 'manual' | 'invite') => void,
  manualUser: any,
  setManualUser: (u: any) => void,
  inviteUser: any,
  setInviteUser: (u: any) => void,
  handleManualCreate: (e: React.FormEvent) => void,
  handleInvite: (e: React.FormEvent) => void
}) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-transparent dark:border-gray-800">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ajouter un membre</h2>
          <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
            <button 
              onClick={() => setModalMode('manual')}
              className={clsx(
                "flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
                modalMode === 'manual' ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <UserPlus size={16} /> Créer manuellement
            </button>
            <button 
              onClick={() => setModalMode('invite')}
              className={clsx(
                "flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
                modalMode === 'invite' ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <Send size={16} /> Inviter par email
            </button>
          </div>

          {modalMode === 'manual' ? (
            <form onSubmit={handleManualCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom complet</label>
                <input 
                  type="text" required
                  value={manualUser.name} onChange={e => setManualUser({...manualUser, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white dark:placeholder-gray-500" 
                  placeholder="Ex: Jean Dupont"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input 
                  type="email" required
                  value={manualUser.email} onChange={e => setManualUser({...manualUser, email: e.target.value})}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white dark:placeholder-gray-500" 
                  placeholder="jean@klarity.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rôle</label>
                  <input 
                    type="text" required
                    value={manualUser.role} onChange={e => setManualUser({...manualUser, role: e.target.value})}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white dark:placeholder-gray-500" 
                    placeholder="Ex: Développeur"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Département</label>
                  <input 
                    type="text" required
                    value={manualUser.department} onChange={e => setManualUser({...manualUser, department: e.target.value})}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white dark:placeholder-gray-500" 
                    placeholder="Ex: Ingénierie"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                  Créer l&apos;utilisateur
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Adresse Email</label>
                <input 
                  type="email" required
                  value={inviteUser.email} onChange={e => setInviteUser({...inviteUser, email: e.target.value})}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white dark:placeholder-gray-500" 
                  placeholder="collegue@entreprise.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rôle (Optionnel)</label>
                <input 
                  type="text"
                  value={inviteUser.role} onChange={e => setInviteUser({...inviteUser, role: e.target.value})}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white dark:placeholder-gray-500" 
                  placeholder="Ex: Product Manager"
                />
              </div>
              <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 p-3 rounded-lg text-sm flex items-start gap-2 mt-4">
                <Mail size={16} className="mt-0.5 shrink-0" />
                <p>Un email d&apos;invitation contenant un lien d&apos;accès sécurisé sera envoyé à cette adresse.</p>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
                  <Send size={16} /> Envoyer l&apos;invitation
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
