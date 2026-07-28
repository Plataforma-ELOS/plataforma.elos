// src/app/comunidade/page.tsx
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import type { Post } from '@/components/features/community/post-card';
import { mapEventRow, type EventData, type EventRow } from '@/lib/data/events';
import { mapPostRow, POSTS_POR_PAGINA, type PostRow } from '@/lib/data/community';
import CommunityPageClient from './client-page';

export default async function CommunityPage() {
  const supabase = createClient(await cookies());
  const { data: { user: usuarioAtual } } = await supabase.auth.getUser();

  const [{ data: postRows, error: postsError }, { data: eventRows, error: eventsError }] = await Promise.all([
    supabase
      .from('posts')
      .select(`
        id, content, created_at, author_id,
        author:profiles!posts_author_id_fkey ( full_name, avatar_url ),
        post_likes ( profile_id ),
        post_saves ( profile_id ),
        comments (
          id, content, created_at,
          author:profiles!comments_author_id_fkey ( full_name, avatar_url )
        )
      `)
      .order('created_at', { ascending: false })
      .range(0, POSTS_POR_PAGINA - 1),
    supabase
      .from('events')
      .select('id, title, description, starts_at, type, location')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true }),
  ]);

  if (postsError) console.error('[comunidade] erro ao buscar posts:', postsError.message);
  if (eventsError) console.error('[comunidade] erro ao buscar eventos:', eventsError.message);

  const postsIniciais: Post[] = ((postRows ?? []) as unknown as PostRow[]).map((p) => mapPostRow(p, usuarioAtual));
  const eventosIniciais: EventData[] = ((eventRows ?? []) as unknown as EventRow[]).map(mapEventRow);
  const hasMoreIniciais = (postRows ?? []).length === POSTS_POR_PAGINA;

  return (
    <CommunityPageClient
      postsIniciais={postsIniciais}
      eventosIniciais={eventosIniciais}
      hasMoreIniciais={hasMoreIniciais}
    />
  );
}
