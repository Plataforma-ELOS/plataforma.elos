// src/app/acervo-digital/page.tsx
// O Acervo Digital lista os conteúdos com fonte (feed_contents): orientações
// de profissionais e clínicas e relatos de cuidadores. Só os aprovados — a
// RLS também deixa quem sugeriu ver a própria sugestão pendente, e ela não
// pode aparecer aqui como se já estivesse publicada.
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { consultarComRetry } from '@/lib/data/consulta';
import { mapFeedContentRow, type FeedContent, type FeedContentRow } from '@/lib/data/feed-contents';
import DigitalLibraryPageClient from './client-page';

export default async function DigitalLibraryPage() {
  const supabase = createClient(await cookies());

  const { data, error } = await consultarComRetry(() =>
    supabase
      .from('feed_contents')
      .select('id, slug, kind, title, author_label, body, tip, sources, image_url, image_alt, is_demo, published_at')
      .eq('approved', true)
      .order('published_at', { ascending: false })
  );

  if (error) console.error('[acervo-digital] erro ao buscar conteúdos:', error.message);

  // Quais destes a pessoa logada já salvou (botão de salvar marcado).
  const { data: { user } } = await supabase.auth.getUser();
  let salvos: string[] = [];
  if (user) {
    const { data: linhas, error: erroSalvos } = await supabase
      .from('feed_content_saves')
      .select('content_id')
      .eq('profile_id', user.id);
    if (erroSalvos) console.error('[acervo-digital] erro ao buscar salvos:', erroSalvos.message);
    salvos = (linhas ?? []).map((l) => l.content_id);
  }

  const conteudos: FeedContent[] = ((data ?? []) as FeedContentRow[])
    .map(mapFeedContentRow)
    .filter((c): c is FeedContent => c !== null);

  return <DigitalLibraryPageClient conteudos={conteudos} salvosIniciais={salvos} />;
}
