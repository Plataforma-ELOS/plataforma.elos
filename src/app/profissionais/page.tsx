// src/app/profissionais/page.tsx
import { createStaticClient } from '@/lib/supabase/server';
import {
  mapProfessionalCard,
  mapClinicCard,
  PROFISSIONAIS_POR_PAGINA,
  CLINICAS_POR_PAGINA,
} from '@/lib/data/professionals';
import { consultarComRetry, falharSeRuntime } from '@/lib/data/consulta';
import ProfessionalsPageClient from './client-page';

// ISR: listagem pública, sem personalização por usuário logado — pode ser
// cacheada e revalidada a cada 5 min em vez de renderizar sob demanda.
export const revalidate = 300;

export default async function ProfessionalsPage() {
  const supabase = createStaticClient();

  const [{ data: professionalRows, error: professionalsError }, { data: clinicRows, error: clinicsError }] =
    await Promise.all([
      consultarComRetry(() =>
        supabase
          .from('professionals')
          .select('id, display_name, specialty, description, image_url, registration_number, phone, email, instagram, verification_status')
          .in('kind', ['liberal', 'clinic_professional'])
          .order('created_at', { ascending: false })
          .range(0, PROFISSIONAIS_POR_PAGINA - 1),
      ),
      consultarComRetry(() =>
        supabase
          .from('clinics')
          .select('id, name, specialty, description, image_url, cnpj, phone, email, verification_status')
          .order('created_at', { ascending: false })
          .range(0, CLINICAS_POR_PAGINA - 1),
      ),
    ]);

  // Lança em runtime para o Next preservar a última página boa em cache, em
  // vez de cachear uma listagem vazia (ver src/lib/data/consulta.ts).
  if (professionalsError) falharSeRuntime('profissionais', `erro ao buscar profissionais: ${professionalsError.message}`);
  if (clinicsError) falharSeRuntime('profissionais', `erro ao buscar clinicas: ${clinicsError.message}`);

  return (
    <ProfessionalsPageClient
      professionaisIniciais={(professionalRows ?? []).map(mapProfessionalCard)}
      clinicasIniciais={(clinicRows ?? []).map(mapClinicCard)}
      hasMoreProfissionaisInicial={(professionalRows ?? []).length === PROFISSIONAIS_POR_PAGINA}
      hasMoreClinicasInicial={(clinicRows ?? []).length === CLINICAS_POR_PAGINA}
    />
  );
}
