// src/app/comunidade/page.tsx
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import type { Post } from '@/components/features/community/post-card';
import { mapEventRow, type EventData, type EventRow } from '@/lib/data/events';
import CommunityPageClient from './client-page';

type PostRow = {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  author: { full_name: string | null; avatar_url: string | null } | null;
  post_likes: { profile_id: string }[] | null;
  post_saves: { profile_id: string }[] | null;
  comments: {
    id: string;
    content: string;
    created_at: string;
    author: { full_name: string | null; avatar_url: string | null } | null;
  }[] | null;
};

function tempoRelativo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

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
      .order('created_at', { ascending: false }),
    supabase
      .from('events')
      .select('id, title, description, starts_at, type, location')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true }),
  ]);

  if (postsError) console.error('[comunidade] erro ao buscar posts:', postsError.message);
  if (eventsError) console.error('[comunidade] erro ao buscar eventos:', eventsError.message);

  const postsIniciais: Post[] = ((postRows ?? []) as unknown as PostRow[]).map((p) => {
    const likes = p.post_likes ?? [];
    const saves = p.post_saves ?? [];
    const comentarios = (p.comments ?? [])
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map((c) => ({
        id: c.id,
        content: c.content,
        time: tempoRelativo(c.created_at),
        author: {
          name: c.author?.full_name ?? 'Usuário',
          avatarUrl: c.author?.avatar_url ?? 'https://placehold.co/40x40.png',
          hint: 'user avatar',
        },
      }));

    return {
      id: p.id,
      author: {
        name: p.author?.full_name ?? 'Usuário',
        avatarUrl: p.author?.avatar_url ?? 'https://placehold.co/48x48.png',
        hint: 'user avatar',
        // O e-mail não fica em "profiles" (fica em auth.users, que não é
        // consultável do client). PostCard usa "email" só para saber se
        // o post é do usuário logado — troco por comparação de id aqui.
        email: p.author_id === usuarioAtual?.id ? (usuarioAtual?.email ?? '') : `__${p.author_id}`,
      },
      time: tempoRelativo(p.created_at),
      content: p.content,
      likes: likes.length,
      commentCount: comentarios.length,
      isSaved: !!usuarioAtual && saves.some((s) => s.profile_id === usuarioAtual.id),
      likedByMe: !!usuarioAtual && likes.some((l) => l.profile_id === usuarioAtual.id),
      comments: comentarios,
    };
  });

  const eventosIniciais: EventData[] = ((eventRows ?? []) as unknown as EventRow[]).map(mapEventRow);

  return <CommunityPageClient postsIniciais={postsIniciais} eventosIniciais={eventosIniciais} />;
}
