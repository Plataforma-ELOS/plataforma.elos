// src/lib/data/library.ts
// Mapeamento de uma linha de library_items para o formato exato que
// DigitalLibraryCard/DigitalLibraryListItem esperam. Sem dependências de
// servidor (next/headers) porque a tela do acervo é um Client Component
// que busca os dados direto pelo browser client do Supabase.
import { formatarDataPtBr } from '../format';

export type LibraryItemData = {
  type: 'video' | 'document';
  imageUrl?: string;
  imageHint?: string;
  title: string;
  author: string;
  avatarUrl: string;
  avatarHint: string;
  date: string;
  createdAt: string;
  tags: string[];
  actionText: string;
  actionUrl: string;
  downloadable: boolean;
};

export type LibraryRow = {
  type: string | null;
  title: string;
  author_name: string | null;
  image_url: string | null;
  action_url: string | null;
  downloadable: boolean | null;
  tags: string[] | null;
  created_at: string;
};

export function mapLibraryRow(row: LibraryRow): LibraryItemData {
  const isVideo = row.type === 'video';
  const downloadable = row.downloadable ?? false;

  return {
    type: isVideo ? 'video' : 'document',
    imageUrl: isVideo ? row.image_url ?? undefined : undefined,
    imageHint: 'material educativo',
    title: row.title,
    author: row.author_name ?? 'Equipe Elos',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'autor',
    date: formatarDataPtBr(row.created_at),
    createdAt: row.created_at,
    tags: row.tags ?? [],
    actionText: isVideo ? 'Assistir Agora' : downloadable ? 'Fazer Download' : 'Acessar Material',
    actionUrl: row.action_url ?? '#',
    downloadable,
  };
}
