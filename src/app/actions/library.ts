'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export type Resultado = { ok: boolean; erro?: string };
const PRECISA_LOGIN = 'Entre na sua conta para continuar.';

/**
 * Alterna o favorito do usuário logado num material do formato antigo do
 * acervo (library_favorites). Hoje só a página /salvos usa — o Acervo
 * Digital passou a mostrar os conteúdos de feed_contents.
 */
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

  revalidatePath('/salvos');
  return { ok: true };
}
