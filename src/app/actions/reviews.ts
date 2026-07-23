'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export type Resultado = { ok: boolean; erro?: string };
const PRECISA_LOGIN = 'Entre na sua conta para continuar.';

export async function criarAvaliacao(
  alvo: { professionalId?: string; clinicId?: string },
  rating: number,
  content: string
): Promise<Resultado> {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  if (rating < 1 || rating > 5) return { ok: false, erro: 'Selecione uma nota de 1 a 5 estrelas.' };

  const texto = content.trim();
  if (!texto) return { ok: false, erro: 'Escreva sua avaliação.' };

  const { error } = await supabase.from('reviews').insert({
    professional_id: alvo.professionalId ?? null,
    clinic_id: alvo.clinicId ?? null,
    author_id: user.id,
    rating,
    content: texto,
  });

  if (error) return { ok: false, erro: 'Não foi possível enviar sua avaliação agora.' };

  revalidatePath('/profissionais/[id]', 'page');
  return { ok: true };
}
