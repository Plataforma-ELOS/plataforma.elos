import { describe, expect, it, vi } from 'vitest';
import { consultarComRetry } from './consulta';

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
