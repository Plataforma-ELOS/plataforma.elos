import { describe, it, expect } from 'vitest';
import { formatarDataPtBr } from '@/lib/format';

describe('formatarDataPtBr', () => {
  it('formata um ISO em data pt-BR com mês capitalizado', () => {
    // Meio-dia UTC evita virada de dia no fuso America/Sao_Paulo (-03).
    expect(formatarDataPtBr('2024-08-01T12:00:00Z')).toBe('1 de Agosto de 2024');
  });

  it('capitaliza a primeira letra do mês', () => {
    const out = formatarDataPtBr('2024-12-25T12:00:00Z');
    expect(out).toBe('25 de Dezembro de 2024');
  });

  it('retorna string vazia para null', () => {
    expect(formatarDataPtBr(null)).toBe('');
  });

  it('retorna string vazia para string vazia', () => {
    expect(formatarDataPtBr('')).toBe('');
  });
});
