'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export type Resultado = { ok: boolean; erro?: string };
const PRECISA_LOGIN = 'Entre na sua conta para continuar.';

async function contexto() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function criarPost(conteudo: string): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const texto = conteudo.trim();
  if (texto.length < 2) return { ok: false, erro: 'Escreva alguma coisa antes de publicar.' };
  if (texto.length > 5000) return { ok: false, erro: 'Texto muito longo (máximo 5000 caracteres).' };

  const { error } = await supabase.from('posts').insert({ author_id: user.id, content: texto });
  if (error) return { ok: false, erro: 'Não foi possível publicar agora.' };

  revalidatePath('/comunidade');
  return { ok: true };
}

export async function excluirPost(postId: string): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) return { ok: false, erro: 'Não foi possível excluir.' };

  revalidatePath('/comunidade');
  return { ok: true };
}

export async function alternarCurtida(postId: string): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const { data: existe } = await supabase
    .from('post_likes')
    .select('post_id')
    .eq('post_id', postId)
    .eq('profile_id', user.id)
    .maybeSingle();

  const { error } = existe
    ? await supabase.from('post_likes').delete().eq('post_id', postId).eq('profile_id', user.id)
    : await supabase.from('post_likes').insert({ post_id: postId, profile_id: user.id });

  if (error) return { ok: false, erro: 'Não foi possível registrar a curtida.' };

  revalidatePath('/comunidade');
  return { ok: true };
}

export async function alternarSalvo(postId: string): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const { data: existe } = await supabase
    .from('post_saves')
    .select('post_id')
    .eq('post_id', postId)
    .eq('profile_id', user.id)
    .maybeSingle();

  const { error } = existe
    ? await supabase.from('post_saves').delete().eq('post_id', postId).eq('profile_id', user.id)
    : await supabase.from('post_saves').insert({ post_id: postId, profile_id: user.id });

  if (error) return { ok: false, erro: 'Não foi possível salvar.' };

  revalidatePath('/comunidade');
  return { ok: true };
}

export async function comentar(postId: string, conteudo: string): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const texto = conteudo.trim();
  if (!texto) return { ok: false, erro: 'Escreva o comentário.' };
  if (texto.length > 2000) return { ok: false, erro: 'Comentário muito longo.' };

  const { error } = await supabase
    .from('comments')
    .insert({ post_id: postId, author_id: user.id, content: texto });

  if (error) return { ok: false, erro: 'Não foi possível comentar.' };

  revalidatePath('/comunidade');
  return { ok: true };
}
