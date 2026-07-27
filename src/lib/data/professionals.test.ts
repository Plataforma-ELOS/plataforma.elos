import { describe, expect, it } from 'vitest';
import {
  mapProfessionalCard,
  mapClinicCard,
  mapProfessionalDetail,
  mapClinicDetail,
  computeReviewSummary,
} from './professionals';

const professionalRow = {
  id: 'p1',
  display_name: 'Dra. Ana',
  specialty: 'Psicologia',
  description: 'Atendimento especializado.',
  image_url: null,
  registration_number: '1234567',
  phone: '11999999999',
  email: 'ana@example.com',
  instagram: '@ana',
  verification_status: 'verified',
};

const clinicRow = {
  id: 'c1',
  name: 'Clínica Elos',
  specialty: 'Terapias',
  description: 'Clínica especializada.',
  image_url: null,
  cnpj: '00000000000191',
  phone: '1133333333',
  email: 'contato@elos.com',
  verification_status: 'pending',
};

describe('mapProfessionalCard', () => {
  it('marca verified quando verification_status é verified', () => {
    expect(mapProfessionalCard(professionalRow).verified).toBe(true);
  });

  it('marca verified como false para outros status', () => {
    expect(mapProfessionalCard({ ...professionalRow, verification_status: 'pending' }).verified).toBe(false);
  });

  it('usa fallback de imagem quando image_url é nulo', () => {
    expect(mapProfessionalCard(professionalRow).imageUrl).toBe('https://placehold.co/400x400.png');
  });
});

describe('mapClinicCard', () => {
  it('marca verified como false para status pending', () => {
    expect(mapClinicCard(clinicRow).verified).toBe(false);
  });

  it('marca verified quando verification_status é verified', () => {
    expect(mapClinicCard({ ...clinicRow, verification_status: 'verified' }).verified).toBe(true);
  });
});

describe('mapProfessionalDetail', () => {
  it('propaga verified e monta o contato', () => {
    const detail = mapProfessionalDetail(professionalRow, ['TCC'], ['5 anos de experiência']);
    expect(detail.verified).toBe(true);
    expect(detail.contact.phone).toBe('11999999999');
    expect(detail.skills).toEqual(['TCC']);
  });
});

describe('mapClinicDetail', () => {
  it('monta o crm a partir do cnpj e propaga verified', () => {
    const detail = mapClinicDetail(clinicRow);
    expect(detail.verified).toBe(false);
    expect(detail.crm).toBe('CNPJ: 00000000000191');
  });
});

describe('computeReviewSummary', () => {
  it('retorna zeros quando não há avaliações', () => {
    const resumo = computeReviewSummary([]);
    expect(resumo.total).toBe(0);
    expect(resumo.average).toBe(0);
  });

  it('calcula média e distribuição', () => {
    const resumo = computeReviewSummary([
      { rating: 5, score_atendimento: 5, score_empatia: 5, score_clareza: 5, score_organizacao: 5 },
      { rating: 3, score_atendimento: 3, score_empatia: 3, score_clareza: 3, score_organizacao: 3 },
    ]);
    expect(resumo.total).toBe(2);
    expect(resumo.average).toBe(4);
  });
});
