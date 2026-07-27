// src/app/meu-espaco/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { mapDependentRow, mapJournalEntryRow, type DependentRow, type JournalEntryRow } from '@/lib/data/caregiver';
import MeuEspacoClient from './client-page';

export default async function MeuEspacoPage() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: dependentRows, error: dependentsError }, { data: journalRows, error: journalError }] =
    await Promise.all([
      supabase
        .from('dependents')
        .select('id, first_name, birth_year, relationship, notes')
        .eq('caregiver_id', user.id)
        .order('first_name', { ascending: true }),
      supabase
        .from('caregiver_journal')
        .select('id, entry_date, mood, content')
        .eq('caregiver_id', user.id)
        .order('entry_date', { ascending: false }),
    ]);

  if (dependentsError) console.error('[meu-espaco] erro ao buscar dependentes:', dependentsError.message);
  if (journalError) console.error('[meu-espaco] erro ao buscar diário:', journalError.message);

  const dependentes = ((dependentRows ?? []) as unknown as DependentRow[]).map(mapDependentRow);
  const entradas = ((journalRows ?? []) as unknown as JournalEntryRow[]).map(mapJournalEntryRow);

  return <MeuEspacoClient dependentesIniciais={dependentes} entradasIniciais={entradas} />;
}
