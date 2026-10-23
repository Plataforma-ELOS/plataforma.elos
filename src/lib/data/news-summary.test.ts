import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getNewsSummary } from '@/ai/flows/news-flow';
import { unstable_cache } from 'next/cache';
import { gerarResumoValido, obterResumoDoDia, UM_DIA_EM_SEGUNDOS } from './news-summary';

vi.mock('@/ai/flows/news-flow', () => ({ getNewsSummary: vi.fn() }));
// unstable_cache precisa do runtime do Next; aqui só interessa a configuração
// com que ele é chamado e a função que ele embrulha.
vi.mock('next/cache', () => ({ unstable_cache: vi.fn((fn: unknown) => fn) }));

const resumoMock = vi.mocked(getNewsSummary);

describe('resumo de notícias com IA', () => {
  beforeEach(() => {
    resumoMock.mockReset();
  });

  it('devolve o resumo gerado pelo modelo', async () => {
    resumoMock.mockResolvedValue('Hoje falamos de direitos e inclusão.');

    await expect(gerarResumoValido(['A', 'B'])).resolves.toBe('Hoje falamos de direitos e inclusão.');
    expect(resumoMock).toHaveBeenCalledWith(['A', 'B']);
  });

  it('lança com resposta vazia, para ela não ser cacheada como válida', async () => {
    resumoMock.mockResolvedValue('   ');

    await expect(gerarResumoValido(['A'])).rejects.toThrow('Resumo de notícias vazio');
  });

  it('propaga a falha do Gemini em vez de engoli-la (a página mostra o fallback)', async () => {
    resumoMock.mockRejectedValue(new Error('quota exceeded'));

    await expect(gerarResumoValido(['A'])).rejects.toThrow('quota exceeded');
  });

  it('cacheia por um dia, com a chave do resumo', () => {
    expect(obterResumoDoDia).toBe(gerarResumoValido);
    expect(vi.mocked(unstable_cache)).toHaveBeenCalledWith(gerarResumoValido, ['resumo-noticias-ia'], {
      revalidate: UM_DIA_EM_SEGUNDOS,
    });
    expect(UM_DIA_EM_SEGUNDOS).toBe(86400);
  });
});
