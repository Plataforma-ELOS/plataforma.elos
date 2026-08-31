import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { consultarComRetry, emBuild, falharSeRuntime } from './consulta';

// Espera instantânea: os testes não devem depender de timers reais.
const semEspera = async () => {};

describe('consultarComRetry', () => {
  it('devolve o resultado na primeira tentativa quando não há erro', async () => {
    const executar = vi.fn().mockResolvedValue({ data: ['ok'], error: null });

    const resultado = await consultarComRetry(executar, 3, semEspera);

    expect(resultado).toEqual({ data: ['ok'], error: null });
    expect(executar).toHaveBeenCalledTimes(1);
  });

  it('tenta de novo após falhas transitórias e devolve o sucesso', async () => {
    const executar = vi
      .fn()
      .mockResolvedValueOnce({ data: null, error: { message: 'fetch failed' } })
      .mockResolvedValueOnce({ data: null, error: { message: 'fetch failed' } })
      .mockResolvedValue({ data: ['ok'], error: null });

    const resultado = await consultarComRetry(executar, 3, semEspera);

    expect(resultado.data).toEqual(['ok']);
    expect(resultado.error).toBeNull();
    expect(executar).toHaveBeenCalledTimes(3);
  });

  it('esgota as tentativas e devolve o último erro', async () => {
    const executar = vi.fn().mockResolvedValue({ data: null, error: { message: 'fetch failed' } });

    const resultado = await consultarComRetry(executar, 3, semEspera);

    expect(resultado.data).toBeNull();
    expect(resultado.error?.message).toBe('fetch failed');
    expect(executar).toHaveBeenCalledTimes(3);
  });
});

// falharSeRuntime é o que impede o Next de cachear uma página vazia (ou um
// 404) quando a consulta ao Supabase falha: em runtime ele lança, e o Next
// preserva a última renderização boa. Em `next build` ele só loga, porque o
// CI builda de propósito com credenciais dummy — um throw ali deixaria o
// pipeline vermelho sem nenhum problema real.
describe('falharSeRuntime', () => {
  const NEXT_PHASE_ORIGINAL = process.env.NEXT_PHASE;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (NEXT_PHASE_ORIGINAL === undefined) delete process.env.NEXT_PHASE;
    else process.env.NEXT_PHASE = NEXT_PHASE_ORIGINAL;
  });

  it('lança em runtime, com contexto e mensagem', () => {
    delete process.env.NEXT_PHASE;

    expect(emBuild()).toBe(false);
    expect(() => falharSeRuntime('profissional-detalhe', 'fetch failed')).toThrow(
      '[profissional-detalhe] fetch failed',
    );
    expect(console.error).toHaveBeenCalledWith('[profissional-detalhe] fetch failed');
  });

  it('apenas loga durante next build, sem lançar', () => {
    process.env.NEXT_PHASE = 'phase-production-build';

    expect(emBuild()).toBe(true);
    expect(() => falharSeRuntime('profissional-detalhe', 'fetch failed')).not.toThrow();
    expect(console.error).toHaveBeenCalledWith('[profissional-detalhe] fetch failed');
  });
});
