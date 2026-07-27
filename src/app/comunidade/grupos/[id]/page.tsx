// src/app/comunidade/grupos/[id]/page.tsx
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import GroupDetailClient from './client-page';

export type GroupMember = {
  profileId: string;
  name: string;
  avatarUrl: string;
};

export default async function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient(await cookies());

  const { data: group } = await supabase
    .from('groups')
    .select('id, name, description, tags, created_at')
    .eq('id', id)
    .maybeSingle();

  if (!group) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: memberRows } = await supabase
    .from('group_members')
    .select('profile_id, joined_at, profile:profiles(full_name, avatar_url)')
    .eq('group_id', id)
    .order('joined_at', { ascending: true });

  const rows = (memberRows ?? []) as unknown as {
    profile_id: string;
    profile: { full_name: string | null; avatar_url: string | null } | null;
  }[];

  const members: GroupMember[] = rows.map((r) => ({
    profileId: r.profile_id,
    name: r.profile?.full_name ?? 'Membro',
    avatarUrl: r.profile?.avatar_url ?? 'https://placehold.co/40x40.png',
  }));

  const isMember = !!user && members.some((m) => m.profileId === user.id);

  return (
    <GroupDetailClient
      group={{
        id: group.id,
        name: group.name,
        description: group.description ?? '',
        tags: group.tags ?? [],
      }}
      members={members}
      isMember={isMember}
      isLoggedIn={!!user}
    />
  );
}
