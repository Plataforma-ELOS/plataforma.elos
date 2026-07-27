'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export type Resultado = { ok: boolean; erro?: string };
const PRECISA_LOGIN = 'Entre na sua conta para continuar.';

export async function marcarComoLida(notificationId: string): Promise<Resultado> {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('profile_id', user.id);

  if (error) return { ok: false, erro: 'Não foi possível marcar como lida.' };

  revalidatePath('/notificacoes');
  return { ok: true };
}

export async function marcarTodasComoLidas(): Promise<Resultado> {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('profile_id', user.id)
    .is('read_at', null);

  if (error) return { ok: false, erro: 'Não foi possível marcar as notificações como lidas.' };

  revalidatePath('/notificacoes');
  return { ok: true };
}

export async function limparNotificacoes(): Promise<Resultado> {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('profile_id', user.id);

  if (error) return { ok: false, erro: 'Não foi possível limpar as notificações.' };

  revalidatePath('/notificacoes');
  return { ok: true };
}
