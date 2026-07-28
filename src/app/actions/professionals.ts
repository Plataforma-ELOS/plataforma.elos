'use server';

import { createStaticClient } from '@/lib/supabase/server';
import {
  mapProfessionalCard,
  mapClinicCard,
  PROFISSIONAIS_POR_PAGINA,
  CLINICAS_POR_PAGINA,
  type ProfessionalCardData,
  type ProfessionalRow,
  type ClinicRow,
} from '@/lib/data/professionals';

const PROFESSIONAL_SELECT =
  'id, display_name, specialty, description, image_url, registration_number, phone, email, instagram, verification_status';
const CLINIC_SELECT = 'id, name, specialty, description, image_url, cnpj, phone, email, verification_status';

export async function buscarMaisProfissionais(offset: number): Promise<{ professionais: ProfessionalCardData[]; hasMore: boolean }> {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from('professionals')
    .select(PROFESSIONAL_SELECT)
    .in('kind', ['liberal', 'clinic_professional'])
    .order('created_at', { ascending: false })
    .range(offset, offset + PROFISSIONAIS_POR_PAGINA - 1);

  if (error) {
    console.error('[buscarMaisProfissionais] erro ao buscar profissionais:', error.message);
    return { professionais: [], hasMore: false };
  }

  const rows = (data ?? []) as unknown as ProfessionalRow[];
  return { professionais: rows.map(mapProfessionalCard), hasMore: rows.length === PROFISSIONAIS_POR_PAGINA };
}

export async function buscarMaisClinicas(offset: number): Promise<{ clinicas: ProfessionalCardData[]; hasMore: boolean }> {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from('clinics')
    .select(CLINIC_SELECT)
    .order('created_at', { ascending: false })
    .range(offset, offset + CLINICAS_POR_PAGINA - 1);

  if (error) {
    console.error('[buscarMaisClinicas] erro ao buscar clinicas:', error.message);
    return { clinicas: [], hasMore: false };
  }

  const rows = (data ?? []) as unknown as ClinicRow[];
  return { clinicas: rows.map(mapClinicCard), hasMore: rows.length === CLINICAS_POR_PAGINA };
}

export async function filtrarProfissionais(
  especialidade?: string,
  query?: string
): Promise<{ professionais: ProfessionalCardData[]; clinicas: ProfessionalCardData[] }> {
  const supabase = createStaticClient();

  let professionalsQuery = supabase
    .from('professionals')
    .select(PROFESSIONAL_SELECT)
    .in('kind', ['liberal', 'clinic_professional']);
  let clinicsQuery = supabase.from('clinics').select(CLINIC_SELECT);

  if (especialidade) {
    professionalsQuery = professionalsQuery.eq('specialty', especialidade);
    clinicsQuery = clinicsQuery.eq('specialty', especialidade);
  }

  const texto = query?.trim();
  if (texto) {
    professionalsQuery = professionalsQuery.textSearch('search_vector', texto, { type: 'websearch', config: 'portuguese' });
    clinicsQuery = clinicsQuery.textSearch('search_vector', texto, { type: 'websearch', config: 'portuguese' });
  }

  const [{ data: professionalRows, error: professionalsError }, { data: clinicRows, error: clinicsError }] =
    await Promise.all([
      professionalsQuery.order('created_at', { ascending: false }),
      clinicsQuery.order('created_at', { ascending: false }),
    ]);

  if (professionalsError) console.error('[filtrarProfissionais] erro ao buscar profissionais:', professionalsError.message);
  if (clinicsError) console.error('[filtrarProfissionais] erro ao buscar clinicas:', clinicsError.message);

  return {
    professionais: ((professionalRows ?? []) as unknown as ProfessionalRow[]).map(mapProfessionalCard),
    clinicas: ((clinicRows ?? []) as unknown as ClinicRow[]).map(mapClinicCard),
  };
}
