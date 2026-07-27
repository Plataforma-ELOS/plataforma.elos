// src/app/comunidade/explorar-grupos/page.tsx
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import ExploreGroupsPageClient, { type GroupCardData } from './client-page';

type GroupRow = {
  id: string;
  name: string;
  description: string | null;
  tags: string[] | null;
  group_members: { count: number }[] | null;
};

export default async function ExploreGroupsPage() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: groupRows, error }, { data: membershipRows }] = await Promise.all([
    supabase.from('groups').select('id, name, description, tags, group_members(count)'),
    user
      ? supabase.from('group_members').select('group_id').eq('profile_id', user.id)
      : Promise.resolve({ data: [] as { group_id: string }[] }),
  ]);

  if (error) console.error('[explorar-grupos] erro ao buscar grupos:', error.message);

  const meusGrupos = new Set((membershipRows ?? []).map((m) => m.group_id));

  const gruposIniciais: GroupCardData[] = ((groupRows ?? []) as unknown as GroupRow[]).map((g) => ({
    id: g.id,
    name: g.name,
    description: g.description ?? '',
    members: g.group_members?.[0]?.count ?? 0,
    isMember: meusGrupos.has(g.id),
    tags: g.tags ?? [],
  }));

  return <ExploreGroupsPageClient gruposIniciais={gruposIniciais} />;
}
