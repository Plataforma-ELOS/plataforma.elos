// src/app/acervo-digital/page.tsx
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { mapLibraryRow } from '@/lib/data/library';
import { consultarComRetry } from '@/lib/data/consulta';
import { mapFeedContentRow, type FeedContent, type FeedContentRow } from '@/lib/data/feed-contents';
import DigitalLibraryPageClient from './client-page';

export default async function DigitalLibraryPage() {
  const supabase = createClient(await cookies());

  const [{ data, error }, { data: conteudoRows, error: conteudosError }] = await Promise.all([
    consultarComRetry(() =>
      supabase
        .from('library_items')
        .select('id, type, title, author_name, image_url, action_url, downloadable, tags, created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false })
    ),
    // Conteúdos com fonte (profissionais, clínicas, cuidadores) — ver
    // src/lib/data/feed-contents.ts.
    consultarComRetry(() =>
      supabase
        .from('feed_contents')
        .select('slug, kind, title, author_label, body, tip, sources, image_url, image_alt, is_demo, published_at')
        .order('published_at', { ascending: false })
    ),
  ]);

  if (error) console.error('[acervo-digital] erro ao buscar itens:', error.message);
  if (conteudosError) console.error('[acervo-digital] erro ao buscar conteúdos:', conteudosError.message);

  const conteudos: FeedContent[] = ((conteudoRows ?? []) as FeedContentRow[])
    .map(mapFeedContentRow)
    .filter((c): c is FeedContent => c !== null);

  const { data: { user } } = await supabase.auth.getUser();
  let favoritos = new Set<string>();
  if (user) {
    const { data: favs } = await supabase
      .from('library_favorites')
      .select('item_id')
      .eq('profile_id', user.id);
    favoritos = new Set((favs ?? []).map((f) => f.item_id));
  }

  const itensIniciais = (data ?? []).map((row) => ({ ...mapLibraryRow(row), isFavorited: favoritos.has(row.id) }));

  return <DigitalLibraryPageClient itensIniciais={itensIniciais} conteudos={conteudos} />;
}
