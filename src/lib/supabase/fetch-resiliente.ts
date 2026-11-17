// src/lib/supabase/fetch-resiliente.ts
//
// `fetch` usado pelos clients Supabase de servidor (src/lib/supabase/server.ts).
// Resolve dois problemas, os dois achados pelo teste de estresse
// (stress/cenarios/dependencia.js):
//
// 1. O retry de consultarComRetry não reconsultava o banco.
//    Dentro de um render, o Next.js deduplica `fetch` GET pela URL e guarda a
//    *promise* (next/dist/server/lib/dedupe-fetch.js) — inclusive se a
//    resposta foi uma falha. A segunda tentativa, com a mesma URL, recebia de
//    volta a mesma falha sem tocar a rede (a página ainda gastava o tempo de
//    espera). Medido com o banco fora do ar: /acervo-digital fazia 1 consulta
//    em vez de 3. O Next só pula a deduplicação quando o `fetch` recebe um
//    `signal`, então toda chamada sai daqui com um.
//
// 2. Nenhuma consulta tinha tempo-limite. Com o banco travado, cada requisição
//    ficava presa indefinidamente (esgotamento de threads e conexões). O
//    `signal` que usamos para o item 1 é um AbortSignal.timeout.

/** Tempo máximo de uma consulta ao Supabase, incluindo a leitura da resposta. */
export const TEMPO_LIMITE_CONSULTA_MS = 8_000;

type FetchBase = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

// Resolvido a cada chamada, não na importação: o Next.js substitui o
// `globalThis.fetch` por uma versão instrumentada, e guardar a referência
// cedo demais seguraria o original.
const fetchGlobal: FetchBase = (input, init) => globalThis.fetch(input, init);

export function criarFetchResiliente(
  base: FetchBase = fetchGlobal,
  tempoLimiteMs: number = TEMPO_LIMITE_CONSULTA_MS,
): FetchBase {
  return (input, init) => {
    // Um `signal` já informado por quem chamou é respeitado (e também tira a
    // consulta da deduplicação).
    const signal = init?.signal ?? AbortSignal.timeout(tempoLimiteMs);
    return base(input, { ...init, signal });
  };
}

export const fetchResiliente = criarFetchResiliente();
