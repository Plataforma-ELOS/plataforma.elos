// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { criarFetchResiliente, TEMPO_LIMITE_CONSULTA_MS } from './fetch-resiliente';

const resposta = () => Promise.resolve(new Response('[]'));

describe('fetchResiliente', () => {
  it('sempre passa um signal — é o que tira a consulta da deduplicação de fetch do Next', async () => {
    const base = vi.fn(resposta);
    const fetchResiliente = criarFetchResiliente(base);

    await fetchResiliente('http://banco/rest/v1/posts');

    const init = base.mock.calls[0][1];
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it('cada chamada recebe um signal próprio (tempos-limite independentes)', async () => {
    const base = vi.fn(resposta);
    const fetchResiliente = criarFetchResiliente(base);

    await fetchResiliente('http://banco/a');
    await fetchResiliente('http://banco/a');

    expect(base.mock.calls[0][1]?.signal).not.toBe(base.mock.calls[1][1]?.signal);
  });

  it('respeita o signal de quem chamou, sem trocá-lo', async () => {
    const base = vi.fn(resposta);
    const fetchResiliente = criarFetchResiliente(base);
    const controlador = new AbortController();

    await fetchResiliente('http://banco/a', { signal: controlador.signal });

    expect(base.mock.calls[0][1]?.signal).toBe(controlador.signal);
  });

  it('preserva o restante das opções e o recurso', async () => {
    const base = vi.fn(resposta);
    const fetchResiliente = criarFetchResiliente(base);

    await fetchResiliente('http://banco/a', { method: 'GET', headers: { apikey: 'k' } });

    expect(base.mock.calls[0][0]).toBe('http://banco/a');
    expect(base.mock.calls[0][1]).toMatchObject({ method: 'GET', headers: { apikey: 'k' } });
  });

  it('aborta a consulta que passa do tempo-limite', async () => {
    // Banco "travado": a promise só termina quando o signal aborta.
    const travado = (_: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, rejeitar) => {
        init?.signal?.addEventListener('abort', () => rejeitar(init.signal?.reason));
      });
    const fetchResiliente = criarFetchResiliente(travado, 30);

    await expect(fetchResiliente('http://banco/a')).rejects.toMatchObject({ name: 'TimeoutError' });
  });

  it('o tempo-limite padrão é de 8 s', () => {
    expect(TEMPO_LIMITE_CONSULTA_MS).toBe(8000);
  });
});
