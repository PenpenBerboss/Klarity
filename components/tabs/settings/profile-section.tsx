"use client";

import React, { useState } from 'react';
import { ImagePlus, User } from 'lucide-react';
import Image from 'next/image';
import { getStoredUserProfile, saveUserProfile } from '@/lib/api';
import { showToast } from '@/lib/toast';

function getInitialProfile() {
  const member = getStoredUserProfile();
  const [firstName = '', ...lastName] = (member?.name || '').trim().split(/\s+/);
  return {
    firstName,
    lastName: lastName.join(' '),
    email: member?.email || '',
    bio: member?.bio || '',
    avatarUrl: member?.avatarUrl || '',
  };
}

export function ProfileSection() {
  const [profile, setProfile] = useState(getInitialProfile);
  const [saving, setSaving] = useState(false);

  const updateField = (field: keyof typeof profile, value: string) => {
    setProfile(current => ({ ...current, [field]: value }));
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      showToast('error', 'Format non pris en charge', 'Choisissez une image JPG, PNG, GIF ou WebP.');
      event.target.value = '';
      return;
    }
    if (file.size > 1024 * 1024) {
      showToast('error', 'Image trop volumineuse', 'La photo doit faire 1 Mo maximum.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') updateField('avatarUrl', reader.result);
    };
    reader.onerror = () => showToast('error', 'Lecture impossible', 'La photo sélectionnée n’a pas pu être lue.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await saveUserProfile({
        name: `${profile.firstName.trim()} ${profile.lastName.trim()}`.trim(),
        email: profile.email.trim(),
        bio: profile.bio.trim(),
        avatarUrl: profile.avatarUrl,
      });
    } catch (error) {
      console.error('Unable to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">Informations personnelles</h3>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Mettez à jour votre photo et vos informations personnelles.</p>
      </div>

      <div className="flex items-center gap-6 border-b border-gray-100 pb-6 dark:border-gray-800">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-indigo-200 bg-indigo-100 text-3xl font-bold text-indigo-600 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-400">
          {profile.avatarUrl
            ? <Image src={profile.avatarUrl} alt="Photo de profil" width={80} height={80} unoptimized className="h-full w-full object-cover" />
            : <User size={36} />}
        </div>
        <div>
          <label className="mb-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
            <ImagePlus size={16} />
            Changer la photo
            <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={handlePhotoChange} className="sr-only" />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">JPG, GIF, PNG ou WebP. 1 Mo maximum.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="profile-first-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Prénom</label>
          <input id="profile-first-name" required value={profile.firstName} onChange={event => updateField('firstName', event.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="profile-last-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom</label>
          <input id="profile-last-name" required value={profile.lastName} onChange={event => updateField('lastName', event.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white" />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="profile-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input id="profile-email" type="email" required value={profile.email} onChange={event => updateField('email', event.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white" />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="profile-bio" className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <textarea id="profile-bio" rows={4} value={profile.bio} onChange={event => updateField('bio', event.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white" />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
}
