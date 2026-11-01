import Image from 'next/image';
import { UserMember } from '@/lib/api';

function normalizeName(name: string): string {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').trim();
}

export function TaskAssigneeAvatar({
  assignee,
  teamMembers,
  size,
}: {
  assignee: string;
  teamMembers: UserMember[];
  size: number;
}) {
  const normalizedAssignee = normalizeName(assignee);
  const member = teamMembers.find(candidate => normalizeName(candidate.name) === normalizedAssignee);
  const avatarUrl = member?.avatarUrl;

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 font-semibold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
      style={{ width: size, height: size, fontSize: Math.max(9, Math.round(size * 0.55)) }}
      title={assignee || 'Non assignée'}
      aria-label={assignee ? `Avatar de ${assignee}` : 'Aucune personne assignée'}
    >
      {avatarUrl
        ? <Image src={avatarUrl} alt="" width={size} height={size} unoptimized className="h-full w-full object-cover" />
        : assignee ? assignee.trim().charAt(0).toLocaleUpperCase('fr') : <UserIcon size={Math.max(10, Math.round(size * 0.65))} />}
    </span>
  );
}

function UserIcon({ size }: { size: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}
