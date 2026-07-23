'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export type Resultado = { ok: boolean; erro?: string; groupId?: string };
const PRECISA_LOGIN = 'Entre na sua conta para continuar.';

async function contexto() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function entrarNoGrupo(groupId: string): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const { error } = await supabase.from('group_members').insert({ group_id: groupId, profile_id: user.id });
  if (error) return { ok: false, erro: 'Não foi possível entrar no grupo agora.' };

  revalidatePath('/comunidade/explorar-grupos');
  revalidatePath('/comunidade/meus-grupos');
  return { ok: true };
}

export async function sairDoGrupo(groupId: string): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const { error } = await supabase.from('group_members').delete().eq('group_id', groupId).eq('profile_id', user.id);
  if (error) return { ok: false, erro: 'Não foi possível sair do grupo agora.' };

  revalidatePath('/comunidade/explorar-grupos');
  revalidatePath('/comunidade/meus-grupos');
  return { ok: true };
}

export async function criarGrupo(nome: string, descricao: string): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const name = nome.trim();
  const description = descricao.trim();
  if (!name || !description) return { ok: false, erro: 'Preencha o nome e a descrição do grupo.' };

  const { data, error } = await supabase
    .from('groups')
    .insert({ name, description, created_by: user.id })
    .select('id')
    .single();

  if (error || !data) return { ok: false, erro: 'Não foi possível criar o grupo agora.' };

  const { error: joinError } = await supabase.from('group_members').insert({ group_id: data.id, profile_id: user.id });
  if (joinError) console.error('[criarGrupo] falha ao entrar automaticamente no grupo criado:', joinError.message);

  revalidatePath('/comunidade/explorar-grupos');
  revalidatePath('/comunidade/meus-grupos');
  return { ok: true, groupId: data.id };
}
