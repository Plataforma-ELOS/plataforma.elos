'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export type Resultado = { ok: boolean; erro?: string };
const PRECISA_LOGIN = 'Entre na sua conta para continuar.';

export async function atualizarPerfil(fullName: string, bio: string): Promise<Resultado> {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const name = fullName.trim();
  const bioTexto = bio.trim();
  if (name.length < 2) return { ok: false, erro: 'Informe seu nome.' };
  if (name.length > 120) return { ok: false, erro: 'Nome muito longo (máximo 120 caracteres).' };
  if (bioTexto.length > 500) return { ok: false, erro: 'Bio muito longa (máximo 500 caracteres).' };

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: name, bio: bioTexto })
    .eq('id', user.id);

  if (error) return { ok: false, erro: 'Não foi possível atualizar seu perfil agora.' };

  revalidatePath('/perfil');
  return { ok: true };
}

export async function atualizarPreferencias(
  notifyEmail: boolean,
  notifyPush: boolean,
  profilePublic: boolean
): Promise<Resultado> {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const { error } = await supabase
    .from('profiles')
    .update({
      notify_email: notifyEmail,
      notify_push: notifyPush,
      profile_public: profilePublic,
    })
    .eq('id', user.id);

  if (error) return { ok: false, erro: 'Não foi possível salvar suas preferências agora.' };

  revalidatePath('/configuracoes');
  return { ok: true };
}
