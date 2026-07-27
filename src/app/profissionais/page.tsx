// src/app/profissionais/page.tsx
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { mapProfessionalCard, mapClinicCard } from '@/lib/data/professionals';
import ProfessionalsPageClient from './client-page';

export default async function ProfessionalsPage() {
  const supabase = createClient(await cookies());

  const [{ data: professionalRows, error: professionalsError }, { data: clinicRows, error: clinicsError }] =
    await Promise.all([
      supabase
        .from('professionals')
        .select('id, display_name, specialty, description, image_url, registration_number, phone, email, instagram, verification_status')
        .in('kind', ['liberal', 'clinic_professional']),
      supabase
        .from('clinics')
        .select('id, name, specialty, description, image_url, cnpj, phone, email, verification_status'),
    ]);

  if (professionalsError) console.error('[profissionais] erro ao buscar profissionais:', professionalsError.message);
  if (clinicsError) console.error('[profissionais] erro ao buscar clinicas:', clinicsError.message);

  return (
    <ProfessionalsPageClient
      professionaisIniciais={(professionalRows ?? []).map(mapProfessionalCard)}
      clinicasIniciais={(clinicRows ?? []).map(mapClinicCard)}
    />
  );
}
