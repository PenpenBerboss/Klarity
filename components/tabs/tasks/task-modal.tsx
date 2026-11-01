"use client";

import React, { useState } from 'react';
import { X, Send, MessageSquare, AtSign, CheckSquare, Plus, Trash2 } from 'lucide-react';
import { useNotifications } from '@/components/notification-provider';
import { getStoredTeam } from '@/lib/api';

export function TaskModal({ 
  editingTask, 
  setEditingTask, 
  saveTask, 
  projectsList, 
  teamMembers, 
  tasks,
  sprints 
}: { 
  editingTask: any, 
  setEditingTask: (task: any) => void, 
  saveTask: (e: React.FormEvent) => void,
  projectsList: string[],
  teamMembers: string[],
  tasks: any[],
  sprints: any[]
}) {
  const [newComment, setNewComment] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const { addNotification } = useNotifications();
  const currentUser = getStoredTeam().find(member => String(member.id) === 'USR-1') || getStoredTeam()[0];

  if (!editingTask) return null;

  const subtasks = editingTask.subtasks || [];

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSubtask = {
      id: 'sub-' + Date.now(),
      title: newSubtaskTitle.trim(),
      completed: false
    };

    setEditingTask({
      ...editingTask,
      subtasks: [...subtasks, newSubtask]
    });
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updated = subtasks.map((st: any) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    setEditingTask({ ...editingTask, subtasks: updated });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updated = subtasks.filter((st: any) => st.id !== subtaskId);
    setEditingTask({ ...editingTask, subtasks: updated });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      author: currentUser?.name || 'Utilisateur',
      text: newComment,
      timestamp: new Date()
    };

    // Check for mentions
    if (currentUser && newComment.includes(`@${currentUser.name}`)) {
      addNotification({
        type: 'comment',
        title: 'Mention dans un commentaire',
        message: `Vous avez été mentionné dans un commentaire sur la tâche "${editingTask.title}".`,
        link: '#'
      });
    }

    const updatedComments = [...(editingTask.comments || []), comment];
    setEditingTask({ ...editingTask, comments: updatedComments });
    setNewComment('');
  };

  return (
    <div 
      className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={() => setEditingTask(null)}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200/80 dark:border-gray-800 flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Task Details */}
        <div className="flex-1 overflow-y-auto custom-scrollbar border-r border-gray-100 dark:border-gray-800">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 sticky top-0 z-10">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {editingTask.id ? `Éditer la tâche ${editingTask.id}` : 'Nouvelle tâche'}
            </h2>
            <button onClick={() => setEditingTask(null)} className="md:hidden text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={saveTask} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Titre de la tâche</label>
              <input 
                type="text" 
                required
                value={editingTask.title || ''} 
                onChange={e => setEditingTask({...editingTask, title: e.target.value})} 
                placeholder="Ex: Refonte du module de paiement..."
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Projet</label>
                <select 
                  value={editingTask.project || projectsList[0]} 
                  onChange={e => setEditingTask({...editingTask, project: e.target.value})} 
                  className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
                >
                  {projectsList.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Assigné</label>
                <select 
                  value={editingTask.assignee || teamMembers[0]} 
                  onChange={e => setEditingTask({...editingTask, assignee: e.target.value})} 
                  className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
                >
                  {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Sprint / Planification</label>
              <select 
                value={editingTask.sprintId || ''} 
                onChange={e => setEditingTask({...editingTask, sprintId: e.target.value || null})} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
              >
                <option value="">Backlog général (Aucun sprint)</option>
                {sprints.map(sprint => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name} ({sprint.status === 'active' ? 'Actif' : sprint.status === 'completed' ? 'Terminé' : 'Planifié'})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Priorité</label>
                <select 
                  value={editingTask.priority || 'medium'} 
                  onChange={e => setEditingTask({...editingTask, priority: e.target.value})} 
                  className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
                >
                  <option value="medium">Moyenne (Bleu)</option>
                  <option value="high">Haute (Orange)</option>
                  <option value="critical">Critique (Rouge)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Échéance</label>
                <input 
                  type="date" 
                  value={editingTask.dueDate || ''} 
                  onChange={e => setEditingTask({...editingTask, dueDate: e.target.value})} 
                  className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
                />
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <CheckSquare size={14} className="text-indigo-600 dark:text-indigo-400" />
                  Sous-tâches ({subtasks.filter((s: any) => s.completed).length}/{subtasks.length})
                </label>
              </div>

              <div className="space-y-2">
                {subtasks.map((st: any) => (
                  <div key={st.id} className="flex items-center justify-between gap-2 p-2 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200/60 dark:border-gray-800">
                    <label className="flex items-center gap-2.5 flex-1 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => handleToggleSubtask(st.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${st.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                        {st.title}
                      </span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteSubtask(st.id)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Ajouter une sous-tâche..."
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                  />
                  <button 
                    type="button"
                    onClick={handleAddSubtask}
                    disabled={!newSubtaskTitle.trim()}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                  >
                    <Plus size={14} /> Ajouter
                  </button>
                </div>
              </div>
            </div>

            {/* Dependencies */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Dépendances (Bloqué par)</label>
              <div className="max-h-28 overflow-y-auto border border-gray-200 dark:border-gray-800 rounded-xl p-2 bg-gray-50/50 dark:bg-gray-950 space-y-1 custom-scrollbar">
                {tasks.filter(t => t.id !== editingTask.id).map(t => (
                  <label key={t.id} className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 cursor-pointer p-1.5 hover:bg-white dark:hover:bg-gray-900 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                    <input
                      type="checkbox"
                      checked={editingTask.dependencies?.includes(t.id) || false}
                      onChange={(e) => {
                        const deps = editingTask.dependencies || [];
                        if (e.target.checked) {
                          setEditingTask({ ...editingTask, dependencies: [...deps, t.id] });
                        } else {
                          setEditingTask({ ...editingTask, dependencies: deps.filter((id: string) => id !== t.id) });
                        }
                      }}
                      className="rounded border-gray-300 dark:border-gray-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className="font-mono text-[11px] text-gray-400 dark:text-gray-500 w-12">{t.id}</span>
                    <span className="truncate flex-1">{t.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
              <button 
                type="button" 
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Comments */}
        <div className="w-full md:w-80 flex flex-col bg-gray-50 dark:bg-gray-900/50">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 sticky top-0 z-10">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare size={14} className="text-indigo-500" /> Commentaires
            </h3>
            <button onClick={() => setEditingTask(null)} className="hidden md:flex text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-[200px]">
            {editingTask.comments?.length > 0 ? (
              editingTask.comments.map((comment: any) => (
                <div key={comment.id} className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-xs border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{comment.author}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {comment.text.split(' ').map((word: string, i: number) => 
                      word.startsWith('@') ? (
                        <span key={i} className="text-indigo-600 dark:text-indigo-400 font-semibold">{word} </span>
                      ) : word + ' '
                    )}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                  <MessageSquare size={18} className="text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Aucun commentaire. Réagissez ci-dessous !</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            <form onSubmit={handleAddComment} className="relative">
              <textarea 
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder={`Écrivez un commentaire...${currentUser ? ` (@${currentUser.name})` : ''}`}
                className="w-full px-3 py-2 pr-10 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white resize-none h-18 custom-scrollbar"
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <button 
                  type="button"
                  onClick={() => currentUser && setNewComment(prev => `${prev}@${currentUser.name} `)}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  title={currentUser ? `Mentionner ${currentUser.name}` : 'Mentionner'}
                >
                  <AtSign size={14} />
                </button>
                <button 
                  type="submit"
                  disabled={!newComment.trim()}
                  className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
