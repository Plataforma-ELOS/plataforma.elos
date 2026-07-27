// src/lib/data/saved.ts
// Une os dois tipos de "item salvo" que existem hoje (posts da comunidade
// via post_saves, materiais do acervo via library_favorites) num único
// formato para a tela /salvos.
import { formatarDataPtBr } from '../format';
import type { LibraryItemData } from './library';

export type SavedPost = {
  kind: 'post';
  id: string;
  content: string;
  date: string;
  createdAt: string;
  author: { name: string; avatarUrl: string };
};

export type SavedLibraryItem = LibraryItemData & { kind: 'library' };

export type SavedItem = SavedPost | SavedLibraryItem;

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
