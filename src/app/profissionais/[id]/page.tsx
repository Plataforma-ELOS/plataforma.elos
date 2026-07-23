
// src/app/profissionais/[id]/page.tsx
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  mapProfessionalDetail,
  mapClinicDetail,
  computeReviewSummary,
  type ReviewData,
} from '@/lib/data/professionals';
import ProfessionalProfileClient from './client-page';

export default async function ProfessionalProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient(await cookies());

  const { data: professionalRow } = await supabase
    .from('professionals')
    .select('id, display_name, specialty, description, image_url, registration_number, phone, email, instagram')
    .eq('id', id)
    .maybeSingle();

  let professional;
  let reviewsQuery = supabase
    .from('reviews')
    .select('id, rating, content, likes, created_at, score_atendimento, score_empatia, score_clareza, score_organizacao, author:profiles!reviews_author_id_fkey ( full_name )');

  if (professionalRow) {
    const [{ data: skillRows }, { data: expRows }] = await Promise.all([
      supabase.from('professional_skills').select('skill').eq('professional_id', id),
      supabase.from('professional_experiences').select('description').eq('professional_id', id).order('sort_order'),
    ]);

    professional = mapProfessionalDetail(
      professionalRow,
      (skillRows ?? []).map((s) => s.skill),
      (expRows ?? []).map((e) => e.description)
    );
    reviewsQuery = reviewsQuery.eq('professional_id', id);
  } else {
    const { data: clinicRow } = await supabase
      .from('clinics')
      .select('id, name, specialty, description, image_url, cnpj, phone, email')
      .eq('id', id)
      .maybeSingle();

    if (!clinicRow) {
      notFound();
    }

    professional = mapClinicDetail(clinicRow);
    reviewsQuery = reviewsQuery.eq('clinic_id', id);
  }

  const { data: reviewRows } = await reviewsQuery.order('created_at', { ascending: false });
  const rows = reviewRows ?? [];

  const reviewSummary = computeReviewSummary(rows);
  const reviews: ReviewData[] = rows.map((r: any) => ({
    id: r.id,
    author: r.author?.full_name ?? 'Membro da comunidade',
    date: new Date(r.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    rating: r.rating,
    content: r.content ?? '',
    likes: r.likes ?? 0,
  }));

  return (
    <ProfessionalProfileClient
      professional={professional}
      reviews={reviews}
      reviewSummary={reviewSummary}
      entityType={professionalRow ? 'professional' : 'clinic'}
    />
  );
}
