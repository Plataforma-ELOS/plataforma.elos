
// src/app/profissionais/[id]/page.tsx
import { notFound } from 'next/navigation';
import { createStaticClient } from '@/lib/supabase/server';
import {
  mapProfessionalDetail,
  mapClinicDetail,
  computeReviewSummary,
  type ProfessionalRow,
  type ClinicRow,
  type ReviewData,
} from '@/lib/data/professionals';
import ProfessionalProfileClient from './client-page';

// ISR: detalhe público, sem personalização por usuário logado — pode ser
// cacheado e revalidado a cada 5 min em vez de renderizar sob demanda.
export const revalidate = 300;

type ReviewRow = {
  id: string;
  rating: number;
  content: string | null;
  likes: number | null;
  created_at: string;
  score_atendimento: number | null;
  score_empatia: number | null;
  score_clareza: number | null;
  score_organizacao: number | null;
  author: { full_name: string | null } | null;
};

const REVIEWS_SELECT =
  'id, rating, content, likes, created_at, score_atendimento, score_empatia, score_clareza, score_organizacao, author:profiles!reviews_author_id_fkey ( full_name )';

type ProfessionalDetailRow = ProfessionalRow & {
  professional_skills: { skill: string }[];
  professional_experiences: { description: string }[];
  reviews: ReviewRow[];
};

type ClinicDetailRow = ClinicRow & {
  reviews: ReviewRow[];
};

function mapReviews(rows: ReviewRow[]): ReviewData[] {
  return rows.map((r) => ({
    id: r.id,
    author: r.author?.full_name ?? 'Membro da comunidade',
    date: new Date(r.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    rating: r.rating,
    content: r.content ?? '',
    likes: r.likes ?? 0,
  }));
}

export default async function ProfessionalProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createStaticClient();

  // Uma única query por entidade (profissional OU clínica), com skills,
  // experiências e reviews embutidos via relação aninhada do PostgREST —
  // substitui as até 4-5 idas separadas ao Supabase que este arquivo fazia.
  const { data: professionalRow } = await supabase
    .from('professionals')
    .select(`
      id, display_name, specialty, description, image_url, registration_number, phone, email, instagram, verification_status,
      professional_skills ( skill ),
      professional_experiences ( description, sort_order ),
      reviews ( ${REVIEWS_SELECT} )
    `)
    .eq('id', id)
    .order('sort_order', { foreignTable: 'professional_experiences' })
    .order('created_at', { foreignTable: 'reviews', ascending: false })
    .maybeSingle();

  let professional;
  let reviewRows: ReviewRow[];
  let entityType: 'professional' | 'clinic';

  if (professionalRow) {
    const row = professionalRow as unknown as ProfessionalDetailRow;
    professional = mapProfessionalDetail(
      row,
      row.professional_skills.map((s) => s.skill),
      row.professional_experiences.map((e) => e.description)
    );
    reviewRows = row.reviews;
    entityType = 'professional';
  } else {
    const { data: clinicRow } = await supabase
      .from('clinics')
      .select(`
        id, name, specialty, description, image_url, cnpj, phone, email, verification_status,
        reviews ( ${REVIEWS_SELECT} )
      `)
      .eq('id', id)
      .order('created_at', { foreignTable: 'reviews', ascending: false })
      .maybeSingle();

    if (!clinicRow) {
      notFound();
    }

    const row = clinicRow as unknown as ClinicDetailRow;
    professional = mapClinicDetail(row);
    reviewRows = row.reviews;
    entityType = 'clinic';
  }

  const reviewSummary = computeReviewSummary(reviewRows);
  const reviews = mapReviews(reviewRows);

  return (
    <ProfessionalProfileClient
      professional={professional}
      reviews={reviews}
      reviewSummary={reviewSummary}
      entityType={entityType}
    />
  );
}
