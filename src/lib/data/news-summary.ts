// src/lib/data/news-summary.ts
// Cache do "Resumo do Dia com IA" de /noticias-ai.
//
// A rota é force-dynamic (renderiza a cada requisição), e antes cada visita
// disparava uma chamada ao Gemini — quem atualizasse a página repetidamente
// esgotava a cota da API sozinho, e o resumo sumia para todo mundo. Com o
// cache, a chamada acontece uma vez por dia para cada conjunto de títulos:
// os títulos fazem parte da chave, então uma notícia nova gera um resumo novo
// na hora, sem esperar o dia virar.
//
// Uma falha do Gemini não é cacheada: unstable_cache só guarda valores
// resolvidos, e o throw sobe para o try/catch da página, que mostra o texto de
// fallback e tenta de novo na próxima visita.
import { unstable_cache } from 'next/cache';
import { getNewsSummary } from '@/ai/flows/news-flow';

export const UM_DIA_EM_SEGUNDOS = 60 * 60 * 24;

export async function gerarResumoValido(titulos: string[]): Promise<string> {
  const resumo = await getNewsSummary(titulos);
  // Resposta vazia do modelo seria cacheada por um dia como se fosse válida.
  if (!resumo.trim()) throw new Error('Resumo de notícias vazio');
  return resumo;
}

export const obterResumoDoDia = unstable_cache(gerarResumoValido, ['resumo-noticias-ia'], {
  revalidate: UM_DIA_EM_SEGUNDOS,
});
