// src/lib/data/news.ts
// Leitura de notícias do Supabase, já no formato exato que NewsCard espera:
// { slug, title, description, imageUrl, imageHint, category, date }
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

// O banco guarda o enum em minúsculo sem acento (legislacao, tecnologia,
// saude, comunidade) — a tela usa o rótulo em português com acento e
// maiúscula. Esse mapeamento existe só por causa dessa diferença.
const CATEGORIA_LABEL: Record<string, string> = {
  legislacao: 'Legislação',
  tecnologia: 'Tecnologia',
  saude: 'Saúde',
  comunidade: 'Comunidade',
};

function formatarDataPtBr(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).replace(/^(\d+) de (\w)/, (_, d, m) => `${d} de ${m.toUpperCase()}`);
}

export type NewsCardData = {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  category: string;
  date: string;
  tags: string[];
};

export async function getNews(): Promise<NewsCardData[]> {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from('news_articles')
    .select('slug, title, description, image_url, image_hint, category, tags, published_at')
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('[getNews]', error.message);
    return [];
  }

  return (data ?? []).map((a) => ({
    slug: a.slug,
    title: a.title,
    description: a.description ?? '',
    imageUrl: a.image_url ?? 'https://placehold.co/800x600.png',
    imageHint: a.image_hint ?? 'noticia',
    category: CATEGORIA_LABEL[a.category ?? ''] ?? a.category ?? '',
    date: formatarDataPtBr(a.published_at),
    tags: a.tags ?? [],
  }));
}

export async function getNewsBySlug(slug: string) {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from('news_articles')
    .select('slug, title, description, content, image_url, image_hint, category, author_name, published_at')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('[getNewsBySlug]', error.message);
    return null;
  }

  return {
    slug: data.slug,
    title: data.title,
    description: data.description ?? '',
    content: data.content ?? '',
    imageUrl: data.image_url ?? 'https://placehold.co/1200x600.png',
    imageHint: data.image_hint ?? 'noticia',
    category: CATEGORIA_LABEL[data.category ?? ''] ?? data.category ?? '',
    authorName: data.author_name ?? '',
    date: formatarDataPtBr(data.published_at),
  };
}

export async function getAllNewsSlugs(): Promise<{ slug: string }[]> {
  const supabase = createClient(await cookies());
  const { data } = await supabase.from('news_articles').select('slug');
  return data ?? [];
}
