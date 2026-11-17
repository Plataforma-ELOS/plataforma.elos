// src/app/salvos/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { mapSavedConteudos, mapSavedPost, type ConteudoSaveRow, type PostSaveRow, type SavedItem } from '@/lib/data/saved';
import { consultarComRetry } from '@/lib/data/consulta';
import SavedPageClient from './client-page';

export default async function SavedPage() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: postSaves, error: postSavesError }, { data: conteudoSaves, error: conteudosError }] =
    await Promise.all([
      consultarComRetry(() =>
        supabase
          .from('post_saves')
          .select('post:posts(id, content, created_at, author:profiles!posts_author_id_fkey(full_name, avatar_url))')
          .eq('profile_id', user.id)
      ),
      consultarComRetry(() =>
        supabase
          .from('feed_content_saves')
          .select(
            'created_at, conteudo:feed_contents(id, slug, kind, title, author_label, body, tip, sources, image_url, image_alt, is_demo, published_at)'
          )
          .eq('profile_id', user.id)
      ),
    ]);

  if (postSavesError) console.error('[salvos] erro ao buscar posts salvos:', postSavesError.message);
  if (conteudosError) console.error('[salvos] erro ao buscar conteúdos salvos do acervo:', conteudosError.message);

  const posts: SavedItem[] = ((postSaves ?? []) as unknown as { post: PostSaveRow | null }[])
    .filter((row) => row.post)
    .map((row) => mapSavedPost(row.post!));

  const conteudos: SavedItem[] = mapSavedConteudos((conteudoSaves ?? []) as unknown as ConteudoSaveRow[]);

  const itens = [...posts, ...conteudos].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return <SavedPageClient itens={itens} />;
}
