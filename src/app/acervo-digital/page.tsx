// src/app/acervo-digital/page.tsx
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { mapLibraryRow } from '@/lib/data/library';
import DigitalLibraryPageClient from './client-page';

export default async function DigitalLibraryPage() {
  const supabase = createClient(await cookies());

  const { data, error } = await supabase
    .from('library_items')
    .select('id, type, title, author_name, image_url, action_url, downloadable, tags, created_at')
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error) console.error('[acervo-digital] erro ao buscar itens:', error.message);

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

  return <DigitalLibraryPageClient itensIniciais={itensIniciais} />;
}
