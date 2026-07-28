// src/app/comunidade/meus-grupos/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { mapGroupCard, type GroupRow } from '@/lib/data/groups';
import MyGroupsPageClient from './client-page';

type GroupMemberRow = { group: GroupRow | null };

export default async function MyGroupsPage() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data, error } = await supabase
    .from('group_members')
    .select('group:groups!group_members_group_id_fkey ( id, name, description, tags, group_members(count) )')
    .eq('profile_id', user.id);

  if (error) console.error('[meus-grupos] erro ao buscar grupos:', error.message);

  const gruposIniciais = ((data ?? []) as unknown as GroupMemberRow[])
    .map((row) => row.group)
    .filter((g): g is GroupRow => g !== null)
    .map((g) => mapGroupCard(g, true));

  return <MyGroupsPageClient gruposIniciais={gruposIniciais} />;
}
