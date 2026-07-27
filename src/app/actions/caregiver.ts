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

export async function criarDependente(
  firstName: string,
  birthYear: number | null,
  relationship: string,
  notes: string
): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const nome = firstName.trim();
  if (nome.length < 2) return { ok: false, erro: 'Informe o nome do dependente.' };
  if (birthYear !== null && (birthYear < 1900 || birthYear > 2100)) {
    return { ok: false, erro: 'Ano de nascimento inválido.' };
  }

  const { error } = await supabase.from('dependents').insert({
    caregiver_id: user.id,
    first_name: nome,
    birth_year: birthYear,
    relationship: relationship.trim() || null,
    notes: notes.trim() || null,
  });

  if (error) return { ok: false, erro: 'Não foi possível adicionar o dependente agora.' };

  revalidatePath('/meu-espaco');
  return { ok: true };
}

export async function atualizarDependente(
  id: string,
  firstName: string,
  birthYear: number | null,
  relationship: string,
  notes: string
): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const nome = firstName.trim();
  if (nome.length < 2) return { ok: false, erro: 'Informe o nome do dependente.' };
  if (birthYear !== null && (birthYear < 1900 || birthYear > 2100)) {
    return { ok: false, erro: 'Ano de nascimento inválido.' };
  }

  const { error } = await supabase
    .from('dependents')
    .update({
      first_name: nome,
      birth_year: birthYear,
      relationship: relationship.trim() || null,
      notes: notes.trim() || null,
    })
    .eq('id', id)
    .eq('caregiver_id', user.id);

  if (error) return { ok: false, erro: 'Não foi possível salvar as alterações.' };

  revalidatePath('/meu-espaco');
  return { ok: true };
}

export async function excluirDependente(id: string): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const { error } = await supabase.from('dependents').delete().eq('id', id).eq('caregiver_id', user.id);
  if (error) return { ok: false, erro: 'Não foi possível excluir.' };

  revalidatePath('/meu-espaco');
  return { ok: true };
}

export async function criarEntradaDiario(entryDate: string, mood: string, content: string): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const texto = content.trim();
  if (texto.length < 2) return { ok: false, erro: 'Escreva alguma coisa antes de salvar.' };
  if (texto.length > 5000) return { ok: false, erro: 'Texto muito longo (máximo 5000 caracteres).' };

  const { error } = await supabase.from('caregiver_journal').insert({
    caregiver_id: user.id,
    entry_date: entryDate,
    mood: mood.trim() || null,
    content: texto,
  });

  if (error) return { ok: false, erro: 'Não foi possível salvar a entrada agora.' };

  revalidatePath('/meu-espaco');
  return { ok: true };
}

export async function atualizarEntradaDiario(id: string, mood: string, content: string): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const texto = content.trim();
  if (texto.length < 2) return { ok: false, erro: 'Escreva alguma coisa antes de salvar.' };
  if (texto.length > 5000) return { ok: false, erro: 'Texto muito longo (máximo 5000 caracteres).' };

  const { error } = await supabase
    .from('caregiver_journal')
    .update({ mood: mood.trim() || null, content: texto })
    .eq('id', id)
    .eq('caregiver_id', user.id);

  if (error) return { ok: false, erro: 'Não foi possível salvar as alterações.' };

  revalidatePath('/meu-espaco');
  return { ok: true };
}

export async function excluirEntradaDiario(id: string): Promise<Resultado> {
  const { supabase, user } = await contexto();
  if (!user) return { ok: false, erro: PRECISA_LOGIN };

  const { error } = await supabase.from('caregiver_journal').delete().eq('id', id).eq('caregiver_id', user.id);
  if (error) return { ok: false, erro: 'Não foi possível excluir.' };

  revalidatePath('/meu-espaco');
  return { ok: true };
}
