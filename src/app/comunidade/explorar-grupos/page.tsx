// src/app/comunidade/explorar-grupos/page.tsx
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { mapGroupCard, type GroupRow } from '@/lib/data/groups';
import ExploreGroupsPageClient from './client-page';

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

  const gruposIniciais = ((groupRows ?? []) as unknown as GroupRow[]).map((g) =>
    mapGroupCard(g, meusGrupos.has(g.id))
  );

  return <ExploreGroupsPageClient gruposIniciais={gruposIniciais} />;
}
