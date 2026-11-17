// src/lib/data/feed-contents.ts
// Conteúdos editoriais do feed (tabela feed_contents): orientações de
// profissionais e clínicas e relatos de cuidadores. Os atuais são de perfis
// DEMONSTRATIVOS (is_demo) — a tela sempre mostra o selo.
//
// Mapper e parser são puros (sem next/headers), para serem testáveis e
// usáveis por client components.
import { formatarDataPtBr } from '../format';

export type FeedKind = 'profissional' | 'clinica' | 'cuidador';

export const FEED_KINDS: FeedKind[] = ['profissional', 'clinica', 'cuidador'];

export const FEED_KIND_LABEL: Record<FeedKind, string> = {
  profissional: 'Profissional',
  clinica: 'Clínica',
  cuidador: 'Cuidador',
};

/** Rótulo do filtro (plural), na ordem em que aparece na tela. */
export const FEED_KIND_FILTRO: Record<FeedKind, string> = {
  profissional: 'Profissionais',
  clinica: 'Clínicas',
  cuidador: 'Cuidadores e familiares',
};

export type BlocoTexto =
  | { tipo: 'paragrafo'; texto: string }
  | { tipo: 'lista'; ordenada: boolean; itens: string[] };

export type FonteConteudo = { titulo: string; descricao: string; url: string | null };

export type FeedContent = {
  slug: string;
  kind: FeedKind;
  kindLabel: string;
  title: string;
  authorLabel: string;
  blocos: BlocoTexto[];
  /** Primeiro parágrafo, para o card (o texto inteiro fica no "Ler mais"). */
  resumo: string;
  tip: string | null;
  sources: FonteConteudo[];
  imageUrl: string | null;
  imageAlt: string;
  isDemo: boolean;
  date: string;
};

export type FeedContentRow = {
  slug: string;
  kind: string;
  title: string;
  author_label: string;
  body: string;
  tip: string | null;
  sources: unknown;
  image_url: string | null;
  image_alt: string | null;
  is_demo: boolean;
  published_at: string;
};

const ITEM_NAO_ORDENADO = /^-\s+/;
const ITEM_ORDENADO = /^\d+\.\s+/;

/**
 * Texto simples -> blocos. Parágrafos são separados por linha em branco; um
 * bloco em que todas as linhas começam com "- " (ou "1. ") vira lista. Sem
 * HTML: o React escapa o texto, então não há o que sanitizar.
 */
export function parseCorpo(texto: string): BlocoTexto[] {
  return texto
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((bloco) => bloco.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((linhas) => linhas.length > 0)
    .map((linhas): BlocoTexto => {
      if (linhas.every((l) => ITEM_NAO_ORDENADO.test(l))) {
        return { tipo: 'lista', ordenada: false, itens: linhas.map((l) => l.replace(ITEM_NAO_ORDENADO, '')) };
      }
      if (linhas.every((l) => ITEM_ORDENADO.test(l))) {
        return { tipo: 'lista', ordenada: true, itens: linhas.map((l) => l.replace(ITEM_ORDENADO, '')) };
      }
      return { tipo: 'paragrafo', texto: linhas.join(' ') };
    });
}

/** Só aceita link https — a URL vira <a href> na tela. */
function urlSegura(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  try {
    return new URL(url).protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
}

export function parseFontes(valor: unknown): FonteConteudo[] {
  if (!Array.isArray(valor)) return [];
  return valor
    .filter((f): f is Record<string, unknown> => typeof f === 'object' && f !== null)
    .map((f) => ({
      titulo: typeof f.titulo === 'string' ? f.titulo : '',
      descricao: typeof f.descricao === 'string' ? f.descricao : '',
      url: urlSegura(f.url),
    }))
    .filter((f) => f.titulo || f.descricao);
}

function isFeedKind(valor: string): valor is FeedKind {
  return (FEED_KINDS as string[]).includes(valor);
}

/** Linhas com `kind` desconhecido são descartadas (devolve null). */
export function mapFeedContentRow(row: FeedContentRow): FeedContent | null {
  if (!isFeedKind(row.kind)) return null;
  const blocos = parseCorpo(row.body);
  const primeiroParagrafo = blocos.find((b) => b.tipo === 'paragrafo');
  return {
    slug: row.slug,
    kind: row.kind,
    kindLabel: FEED_KIND_LABEL[row.kind],
    title: row.title,
    authorLabel: row.author_label,
    blocos,
    resumo: primeiroParagrafo?.tipo === 'paragrafo' ? primeiroParagrafo.texto : '',
    tip: row.tip,
    sources: parseFontes(row.sources),
    // Caminho local (/comunidade/...) ou https; qualquer outra coisa cai na
    // ilustração padrão do card.
    imageUrl: row.image_url && (row.image_url.startsWith('/') || urlSegura(row.image_url)) ? row.image_url : null,
    imageAlt: row.image_alt ?? '',
    isDemo: row.is_demo,
    date: formatarDataPtBr(row.published_at),
  };
}
