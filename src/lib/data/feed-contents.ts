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
  id: string;
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
  /** Timestamp (ms) de published_at, para ordenar. */
  publishedAt: number;
};

export type FeedContentRow = {
  id: string;
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
    id: row.id,
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
    publishedAt: new Date(row.published_at).getTime(),
  };
}

// ------------------------------------------------------------ sugestões
// "Adicionar ao Acervo" (src/app/acervo-digital/client-page.tsx) envia um
// conteúdo destes; ele fica pendente (approved = false) até um admin aprovar
// em /admin. A validação é pura para valer igual no cliente e na Server Action.

export const LIMITES_SUGESTAO = {
  titulo: { min: 5, max: 150 },
  autor: { min: 2, max: 80 },
  corpo: { min: 80, max: 5000 },
  dica: { max: 300 },
  fontes: 3,
  altImagem: { max: 200 },
} as const;

export type SugestaoConteudo = {
  kind: string;
  title: string;
  authorLabel: string;
  body: string;
  tip?: string;
  sources?: { titulo: string; url: string }[];
  imageUrl?: string;
  imageAlt?: string;
};

export type SugestaoValidada = {
  kind: FeedKind;
  title: string;
  author_label: string;
  body: string;
  tip: string | null;
  sources: { titulo: string; descricao: string; url: string }[];
  image_url: string | null;
  image_alt: string | null;
};

/** Devolve a sugestão normalizada, ou a primeira mensagem de erro para a tela. */
export function validarSugestaoConteudo(
  s: SugestaoConteudo,
): { ok: true; dados: SugestaoValidada } | { ok: false; erro: string } {
  const L = LIMITES_SUGESTAO;
  const titulo = s.title.trim();
  const autor = s.authorLabel.trim();
  const corpo = s.body.replace(/\r\n/g, '\n').trim();
  const dica = s.tip?.trim() ?? '';

  if (!isFeedKind(s.kind)) return { ok: false, erro: 'Escolha o tipo do conteúdo.' };
  if (titulo.length < L.titulo.min || titulo.length > L.titulo.max)
    return { ok: false, erro: `O título precisa ter entre ${L.titulo.min} e ${L.titulo.max} caracteres.` };
  if (autor.length < L.autor.min || autor.length > L.autor.max)
    return { ok: false, erro: `Diga como você quer se apresentar (${L.autor.min} a ${L.autor.max} caracteres).` };
  if (corpo.length < L.corpo.min || corpo.length > L.corpo.max)
    return { ok: false, erro: `O texto precisa ter entre ${L.corpo.min} e ${L.corpo.max} caracteres.` };
  if (dica.length > L.dica.max) return { ok: false, erro: `A dica pode ter até ${L.dica.max} caracteres.` };

  const fontes = (s.sources ?? [])
    .map((f) => ({ titulo: f.titulo.trim(), url: f.url.trim() }))
    .filter((f) => f.titulo || f.url);
  if (fontes.length > L.fontes) return { ok: false, erro: `Informe no máximo ${L.fontes} fontes.` };
  for (const f of fontes) {
    if (!f.titulo) return { ok: false, erro: 'Toda fonte precisa de um nome.' };
    if (f.url && !urlSegura(f.url)) return { ok: false, erro: `O link da fonte "${f.titulo}" precisa começar com https://.` };
  }

  const imagem = s.imageUrl?.trim() || null;
  const alt = s.imageAlt?.trim() || null;
  if (imagem && !urlSegura(imagem)) return { ok: false, erro: 'Imagem inválida.' };
  if (imagem && !alt) return { ok: false, erro: 'Descreva a imagem para quem usa leitor de tela.' };
  if (alt && alt.length > L.altImagem.max)
    return { ok: false, erro: `A descrição da imagem pode ter até ${L.altImagem.max} caracteres.` };

  return {
    ok: true,
    dados: {
      kind: s.kind,
      title: titulo,
      author_label: autor,
      body: corpo,
      tip: dica || null,
      sources: fontes.map((f) => ({ titulo: f.titulo, descricao: '', url: f.url })),
      image_url: imagem,
      image_alt: imagem ? alt : null,
    },
  };
}

/** "Rotina visual: pequenas mudanças!" -> "rotina-visual-pequenas-mudancas-<sufixo>" */
export function gerarSlug(titulo: string, sufixo: string): string {
  const base = titulo
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
  return `${base || 'conteudo'}-${sufixo}`;
}
