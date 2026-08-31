// src/lib/data/consulta.ts
//
// Utilitários para consultas do Supabase em rotas com ISR.
//
// Contexto: rotas com `export const revalidate` são pré-renderizadas e o
// resultado fica em cache. Se a consulta falhar e a página mesmo assim
// renderizar "com sucesso" (lista vazia), o Next.js cacheia essa página
// vazia e passa a servi-la — foi exatamente o que aconteceu em produção com
// /profissionais e /noticias. O correto é lançar o erro em runtime: o Next
// preserva a última versão boa do cache e tenta revalidar de novo depois.

type ResultadoConsulta<T> = { data: T | null; error: { message: string } | null };

/**
 * Reexecuta a consulta enquanto ela retornar erro, com backoff curto.
 * Cobre falhas transitórias de rede entre a função serverless e o Supabase.
 */
export async function consultarComRetry<T>(
  executar: () => PromiseLike<ResultadoConsulta<T>>,
  tentativas = 3,
  esperarMs: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms)),
): Promise<ResultadoConsulta<T>> {
  let resultado: ResultadoConsulta<T> = {
    data: null,
    error: { message: 'consulta não executada' },
  };

  for (let tentativa = 0; tentativa < tentativas; tentativa++) {
    resultado = await executar();
    if (!resultado.error) return resultado;
    if (tentativa < tentativas - 1) await esperarMs(200 * (tentativa + 1));
  }

  return resultado;
}

/** `true` durante `next build` (prerender), `false` em runtime. */
export function emBuild(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

/**
 * Sempre loga o erro. Em runtime, lança — assim o Next.js não cacheia uma
 * página vazia e mantém a última versão boa. Em build, degrada para o
 * comportamento anterior (renderiza vazio), porque o build do CI roda com
 * credenciais dummy e não alcança o Supabase de propósito.
 */
export function falharSeRuntime(contexto: string, mensagem: string): void {
  console.error(`[${contexto}] ${mensagem}`);
  if (!emBuild()) {
    throw new Error(`[${contexto}] ${mensagem}`);
  }
}
