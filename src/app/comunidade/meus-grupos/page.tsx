// src/app/comunidade/meus-grupos/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MyGroupsPageClient, { type UserGroup } from './client-page';

type GroupMemberRow = {
  group: {
    id: string;
    name: string;
    description: string | null;
    tags: string[] | null;
    group_members: { count: number }[] | null;
  } | null;
};

export default async function MyGroupsPage() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data, error } = await supabase
    .from('group_members')
    .select('group:groups!group_members_group_id_fkey ( id, name, description, tags, group_members(count) )')
    .eq('profile_id', user.id);

  if (error) console.error('[meus-grupos] erro ao buscar grupos:', error.message);

  const gruposIniciais: UserGroup[] = ((data ?? []) as unknown as GroupMemberRow[])
    .map((row) => row.group)
    .filter((g): g is NonNullable<GroupMemberRow['group']> => g !== null)
    .map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description ?? '',
      members: g.group_members?.[0]?.count ?? 0,
      tags: g.tags ?? [],
    }));

  return <MyGroupsPageClient gruposIniciais={gruposIniciais} />;
}
