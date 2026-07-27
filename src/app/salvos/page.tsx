// src/app/salvos/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { mapLibraryRow, type LibraryRow } from '@/lib/data/library';
import { mapSavedPost, type PostSaveRow, type SavedItem } from '@/lib/data/saved';
import SavedPageClient from './client-page';

export default async function SavedPage() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: postSaves, error: postSavesError }, { data: libraryFavorites, error: libraryError }] =
    await Promise.all([
      supabase
        .from('post_saves')
        .select('post:posts(id, content, created_at, author:profiles!posts_author_id_fkey(full_name, avatar_url))')
        .eq('profile_id', user.id),
      supabase
        .from('library_favorites')
        .select('item:library_items(id, type, title, author_name, image_url, action_url, downloadable, tags, created_at)')
        .eq('profile_id', user.id),
    ]);

  if (postSavesError) console.error('[salvos] erro ao buscar posts salvos:', postSavesError.message);
  if (libraryError) console.error('[salvos] erro ao buscar favoritos do acervo:', libraryError.message);

  const posts: SavedItem[] = ((postSaves ?? []) as unknown as { post: PostSaveRow | null }[])
    .filter((row) => row.post)
    .map((row) => mapSavedPost(row.post!));

  const libraryItems: SavedItem[] = ((libraryFavorites ?? []) as unknown as { item: LibraryRow | null }[])
    .filter((row) => row.item)
    .map((row) => ({ ...mapLibraryRow(row.item!), kind: 'library' as const }));

  const itens = [...posts, ...libraryItems].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return <SavedPageClient itens={itens} />;
}
