// src/lib/data/professionals.ts
// Tipos e mapeadores puros (sem next/headers) para profissionais/clinicas,
// reaproveitados tanto pela listagem (Client Component, browser client)
// quanto pelo detalhe (Server Component, server client).

export type ProfessionalCardData = {
  id: string;
  name: string;
  specialty: string;
  description: string;
  imageUrl: string;
  hint: string;
};

export type ProfessionalDetailData = {
  id: string;
  name: string;
  imageUrl: string;
  hint: string;
  specialty: string;
  crm: string;
  description: string;
  contact: {
    phone: string;
    email: string;
    instagram: string;
  };
  experiences: string[];
  skills: string[];
};

export type ReviewData = {
  id: string;
  author: string;
  date: string;
  rating: number;
  content: string;
  likes: number;
};

export type ReviewSummary = {
  average: number;
  total: number;
  distribution: { stars: number; percentage: number }[];
  criteria: { name: string; score: number }[];
};

type ProfessionalRow = {
  id: string;
  display_name: string;
  specialty: string | null;
  description: string | null;
  image_url: string | null;
  registration_number: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
};

type ClinicRow = {
  id: string;
  name: string;
  specialty: string | null;
  description: string | null;
  image_url: string | null;
  cnpj: string | null;
  phone: string | null;
  email: string | null;
};

export function mapProfessionalCard(row: ProfessionalRow): ProfessionalCardData {
  return {
    id: row.id,
    name: row.display_name,
    specialty: row.specialty ?? '',
    description: row.description ?? '',
    imageUrl: row.image_url ?? 'https://placehold.co/400x400.png',
    hint: 'profissional',
  };
}

export function mapClinicCard(row: ClinicRow): ProfessionalCardData {
  return {
    id: row.id,
    name: row.name,
    specialty: row.specialty ?? '',
    description: row.description ?? '',
    imageUrl: row.image_url ?? 'https://placehold.co/800x450.png',
    hint: 'clinica',
  };
}

export function mapProfessionalDetail(
  row: ProfessionalRow,
  skills: string[],
  experiences: string[]
): ProfessionalDetailData {
  return {
    id: row.id,
    name: row.display_name,
    imageUrl: row.image_url ?? 'https://placehold.co/400x400.png',
    hint: 'profissional',
    specialty: row.specialty ?? '',
    crm: row.registration_number ?? '',
    description: row.description ?? '',
    contact: {
      phone: row.phone ?? '',
      email: row.email ?? '',
      instagram: row.instagram ?? '',
    },
    experiences,
    skills,
  };
}

export function mapClinicDetail(row: ClinicRow): ProfessionalDetailData {
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.image_url ?? 'https://placehold.co/800x450.png',
    hint: 'clinica',
    specialty: row.specialty ?? '',
    crm: row.cnpj ? `CNPJ: ${row.cnpj}` : '',
    description: row.description ?? '',
    contact: {
      phone: row.phone ?? '',
      email: row.email ?? '',
      instagram: '',
    },
    experiences: [],
    skills: [],
  };
}

export function computeReviewSummary(
  reviews: {
    rating: number;
    score_atendimento: number | null;
    score_empatia: number | null;
    score_clareza: number | null;
    score_organizacao: number | null;
  }[]
): ReviewSummary {
  const total = reviews.length;

  if (total === 0) {
    return {
      average: 0,
      total: 0,
      distribution: [5, 4, 3, 2, 1].map((stars) => ({ stars, percentage: 0 })),
      criteria: [
        { name: 'Atendimento', score: 0 },
        { name: 'Empatia', score: 0 },
        { name: 'Clareza', score: 0 },
        { name: 'Organização', score: 0 },
      ],
    };
  }

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / total;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return { stars, percentage: Math.round((count / total) * 100) };
  });

  const mediaCriterio = (valores: (number | null)[]) => {
    const validos = valores.filter((v): v is number => v !== null);
    if (validos.length === 0) return 0;
    return validos.reduce((sum, v) => sum + v, 0) / validos.length;
  };

  const criteria = [
    { name: 'Atendimento', score: mediaCriterio(reviews.map((r) => r.score_atendimento)) },
    { name: 'Empatia', score: mediaCriterio(reviews.map((r) => r.score_empatia)) },
    { name: 'Clareza', score: mediaCriterio(reviews.map((r) => r.score_clareza)) },
    { name: 'Organização', score: mediaCriterio(reviews.map((r) => r.score_organizacao)) },
  ];

  return { average: Math.round(average * 10) / 10, total, distribution, criteria };
}
