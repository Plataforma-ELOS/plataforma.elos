// src/lib/data/groups.ts
// Mapeamento de grupos da Comunidade — reaproveitado por explorar-grupos,
// meus-grupos e grupos/[id], que antes duplicavam a mesma lógica de
// coalescência (description/tags/contagem de membros) cada um no seu page.tsx.

export type GroupRow = {
  id: string;
  name: string;
  description: string | null;
  tags: string[] | null;
  group_members: { count: number }[] | null;
};

export type GroupCardData = {
  id: string;
  name: string;
  description: string;
  members: number;
  isMember: boolean;
  tags: string[];
};

export function mapGroupCard(row: GroupRow, isMember: boolean): GroupCardData {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    members: row.group_members?.[0]?.count ?? 0,
    isMember,
    tags: row.tags ?? [],
  };
}

export type GroupMemberRow = {
  profile_id: string;
  profile: { full_name: string | null; avatar_url: string | null } | null;
};

export type GroupMember = {
  profileId: string;
  name: string;
  avatarUrl: string;
};

export function mapGroupMember(row: GroupMemberRow): GroupMember {
  return {
    profileId: row.profile_id,
    name: row.profile?.full_name ?? 'Membro',
    avatarUrl: row.profile?.avatar_url ?? 'https://placehold.co/40x40.png',
  };
}
