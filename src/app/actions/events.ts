'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export type Resultado = { ok: boolean; erro?: string };
const PRECISA_LOGIN = 'Entre na sua conta para continuar.';

export async function criarEvento(
  title: string,
  description: string,
  startsAt: string,
  type: 'online' | 'presencial',
  location: string
): Promise<Resultado> {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const tituloTexto = title.trim();
  const descricaoTexto = description.trim();
  const localTexto = location.trim();

  if (tituloTexto.length < 3) return { ok: false, erro: 'Informe um título para o evento.' };
  if (!descricaoTexto) return { ok: false, erro: 'Descreva o evento.' };
  if (!startsAt || Number.isNaN(new Date(startsAt).getTime())) {
    return { ok: false, erro: 'Informe uma data/hora válida.' };
  }
  if (type === 'presencial' && !localTexto) {
    return { ok: false, erro: 'Informe o local do evento presencial.' };
  }

  const { error } = await supabase.from('events').insert({
    title: tituloTexto,
    description: descricaoTexto,
    starts_at: new Date(startsAt).toISOString(),
    type,
    location: type === 'presencial' ? localTexto : null,
    created_by: user.id,
  });

  if (error) return { ok: false, erro: 'Não foi possível criar o evento agora.' };

  revalidatePath('/comunidade');
  return { ok: true };
}
