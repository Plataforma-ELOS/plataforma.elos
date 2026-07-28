// src/lib/data/specialties.ts
// Lista canônica de especialidades — fonte única usada tanto pelo Select de
// especialidade no cadastro profissional quanto pelos chips de filtro em
// /profissionais, para os dois lados casarem por igualdade exata.
export const ESPECIALIDADES = [
  'Psicólogo(a)',
  'Fonoaudiólogo(a)',
  'Terapeuta Ocupacional',
  'Neurologista ou Psiquiatra',
  'Psicopedagogo(a)',
  'Acompanhante Terapêutico(a)',
] as const;

export type Especialidade = (typeof ESPECIALIDADES)[number];
