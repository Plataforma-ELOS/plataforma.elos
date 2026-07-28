import { describe, expect, it } from 'vitest';
import { ESPECIALIDADES } from './specialties';

describe('ESPECIALIDADES', () => {
  it('contém as 6 categorias canônicas, sem duplicatas', () => {
    expect(ESPECIALIDADES).toEqual([
      'Psicólogo(a)',
      'Fonoaudiólogo(a)',
      'Terapeuta Ocupacional',
      'Neurologista ou Psiquiatra',
      'Psicopedagogo(a)',
      'Acompanhante Terapêutico(a)',
    ]);
    expect(new Set(ESPECIALIDADES).size).toBe(ESPECIALIDADES.length);
  });
});
