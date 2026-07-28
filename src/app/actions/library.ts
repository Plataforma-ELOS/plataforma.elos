'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export type Resultado = { ok: boolean; erro?: string };
const PRECISA_LOGIN = 'Entre na sua conta para continuar.';

/** Alterna o favorito do usuário logado em um item do acervo (library_favorites). */
export async function alternarFavorito(itemId: string): Promise<Resultado> {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const { data: existe } = await supabase
    .from('library_favorites')
    .select('item_id')
    .eq('item_id', itemId)
    .eq('profile_id', user.id)
    .maybeSingle();

  const { error } = existe
    ? await supabase.from('library_favorites').delete().eq('item_id', itemId).eq('profile_id', user.id)
    : await supabase.from('library_favorites').insert({ item_id: itemId, profile_id: user.id });

  if (error) return { ok: false, erro: 'Não foi possível atualizar seus favoritos.' };

  revalidatePath('/acervo-digital');
  return { ok: true };
}

/** Sugere um novo item para o acervo (fica pendente até um admin aprovar em /admin). */
export async function sugerirItemAcervo(
  title: string,
  authorName: string,
  type: 'video' | 'document' | 'game' | 'other',
  tagsTexto: string,
  actionUrl: string
): Promise<Resultado> {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const tituloLimpo = title.trim();
  const autorLimpo = authorName.trim();
  const linkLimpo = actionUrl.trim();
  if (!tituloLimpo) return { ok: false, erro: 'Informe o título do material.' };
  if (!autorLimpo) return { ok: false, erro: 'Informe o autor do material.' };
  if (!linkLimpo) return { ok: false, erro: 'Informe o link do material.' };

  const tags = tagsTexto
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const { error } = await supabase.from('library_items').insert({
    title: tituloLimpo,
    author_name: autorLimpo,
    type,
    tags,
    action_url: linkLimpo,
    suggested_by: user.id,
  });

  if (error) return { ok: false, erro: 'Não foi possível enviar sua sugestão agora.' };

  revalidatePath('/admin');
  return { ok: true };
}
