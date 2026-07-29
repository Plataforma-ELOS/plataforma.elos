'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export type Resultado = { ok: boolean; erro?: string };
const PRECISA_LOGIN = 'Entre na sua conta para continuar.';

async function contexto() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function alternarPassoConcluido(trailId: string, stepId: string): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const { data: existente } = await supabase
    .from('trail_step_completions')
    .select('step_id')
    .eq('step_id', stepId)
    .eq('profile_id', user.id)
    .maybeSingle();

  const { error: erroToggle } = existente
    ? await supabase.from('trail_step_completions').delete().eq('step_id', stepId).eq('profile_id', user.id)
    : await supabase.from('trail_step_completions').insert({ step_id: stepId, trail_id: trailId, profile_id: user.id });

  if (erroToggle) return { ok: false, erro: 'Não foi possível atualizar o passo agora.' };

  const [{ count: concluidos }, { count: totalPassos }] = await Promise.all([
    supabase
      .from('trail_step_completions')
      .select('step_id', { count: 'exact', head: true })
      .eq('trail_id', trailId)
      .eq('profile_id', user.id),
    supabase
      .from('knowledge_trail_steps')
      .select('id', { count: 'exact', head: true })
      .eq('trail_id', trailId),
  ]);

  const progresso = totalPassos ? Math.round(((concluidos ?? 0) / totalPassos) * 100) : 0;

  const { error: erroProgresso } = await supabase
    .from('trail_progress')
    .upsert({ trail_id: trailId, profile_id: user.id, progress: progresso }, { onConflict: 'trail_id,profile_id' });

  if (erroProgresso) return { ok: false, erro: 'Não foi possível atualizar seu progresso agora.' };

  revalidatePath('/noticias-gamificadas');
  revalidatePath(`/noticias-gamificadas/trilhas/${trailId}`);
  return { ok: true };
}
