'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export type Resultado = { ok: boolean; erro?: string };
const PRECISA_LOGIN = 'Entre na sua conta para continuar.';
const SEM_PERMISSAO = 'Você não tem permissão para fazer isso.';

async function contextoAdmin() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, admin: false };

  const { data: perfil } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  return { supabase, user, admin: perfil?.role === 'admin' };
}

export async function atualizarVerificacao(
  tipo: 'professional' | 'clinic',
  id: string,
  status: 'verified' | 'rejected'
): Promise<Resultado> {
  const { supabase, user, admin } = await contextoAdmin();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };
  if (!admin) return { ok: false, erro: SEM_PERMISSAO };

  const tabela = tipo === 'professional' ? 'professionals' : 'clinics';
  const { error } = await supabase.from(tabela).update({ verification_status: status }).eq('id', id);
  if (error) return { ok: false, erro: 'Não foi possível atualizar a verificação agora.' };

  revalidatePath('/admin');
  return { ok: true };
}

export async function aprovarItemAcervo(id: string): Promise<Resultado> {
  const { supabase, user, admin } = await contextoAdmin();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };
  if (!admin) return { ok: false, erro: SEM_PERMISSAO };

  const { error } = await supabase.from('library_items').update({ approved: true }).eq('id', id);
  if (error) return { ok: false, erro: 'Não foi possível aprovar o item agora.' };

  revalidatePath('/admin');
  revalidatePath('/acervo-digital');
  return { ok: true };
}

export async function rejeitarItemAcervo(id: string): Promise<Resultado> {
  const { supabase, user, admin } = await contextoAdmin();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };
  if (!admin) return { ok: false, erro: SEM_PERMISSAO };

  const { error } = await supabase.from('library_items').delete().eq('id', id);
  if (error) return { ok: false, erro: 'Não foi possível rejeitar o item agora.' };

  revalidatePath('/admin');
  return { ok: true };
}
