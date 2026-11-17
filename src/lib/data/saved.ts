// src/lib/data/saved.ts
// Une os dois tipos de "item salvo" que existem hoje (posts da comunidade
// via post_saves, conteúdos do Acervo via feed_content_saves) num único
// formato para a tela /salvos.
import { formatarDataPtBr } from '../format';
import { mapFeedContentRow, type FeedContent, type FeedContentRow } from './feed-contents';

export type SavedPost = {
  kind: 'post';
  id: string;
  content: string;
  date: string;
  createdAt: string;
  author: { name: string; avatarUrl: string };
};

/**
 * Conteúdo do Acervo salvo. O conteúdo vai num campo próprio porque ele já tem
 * um `kind` (profissional/clínica/cuidador). `createdAt` é quando foi salvo.
 */
export type SavedConteudo = { kind: 'conteudo'; id: string; createdAt: string; conteudo: FeedContent };

export type SavedItem = SavedPost | SavedConteudo;

export type ConteudoSaveRow = { created_at: string; conteudo: FeedContentRow | null };

/** Linhas de feed_content_saves (com o conteúdo junto) -> itens salvos; ignora conteúdo apagado ou inválido. */
export function mapSavedConteudos(linhas: ConteudoSaveRow[]): SavedConteudo[] {
  return linhas.flatMap((linha) => {
    const c = linha.conteudo ? mapFeedContentRow(linha.conteudo) : null;
    return c ? [{ kind: 'conteudo' as const, id: c.id, createdAt: linha.created_at, conteudo: c }] : [];
  });
}

export type PostSaveRow = {
  id: string;
  content: string;
  created_at: string;
  author: { full_name: string | null; avatar_url: string | null } | null;
};

export function mapSavedPost(row: PostSaveRow): SavedPost {
  return {
    kind: 'post',
    id: row.id,
    content: row.content,
    date: formatarDataPtBr(row.created_at),
    createdAt: row.created_at,
    author: {
      name: row.author?.full_name ?? 'Usuário',
      avatarUrl: row.author?.avatar_url ?? 'https://placehold.co/48x48.png',
    },
  };
}
