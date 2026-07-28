import { describe, expect, it } from 'vitest';
import { mapPostRow, tempoRelativo, type PostRow } from './community';

const baseRow: PostRow = {
  id: 'post-1',
  content: 'Olá, comunidade!',
  created_at: new Date().toISOString(),
  author_id: 'user-1',
  image_url: null,
  author: { full_name: 'Ana', avatar_url: null },
  post_likes: [{ profile_id: 'user-2' }],
  post_saves: [{ profile_id: 'user-1' }],
  comments: [
    {
      id: 'c1',
      content: 'Comentário 1',
      created_at: new Date(Date.now() - 60000).toISOString(),
      author: { full_name: 'Bia', avatar_url: null },
    },
  ],
};

describe('tempoRelativo', () => {
  it('retorna "agora" para instantes muito recentes', () => {
    expect(tempoRelativo(new Date().toISOString())).toBe('agora');
  });
});

describe('mapPostRow', () => {
  it('marca isSaved/likedByMe conforme o usuário atual', () => {
    const post = mapPostRow(baseRow, { id: 'user-1', email: 'ana@example.com' });
    expect(post.isSaved).toBe(true);
    expect(post.likedByMe).toBe(false);
    expect(post.likes).toBe(1);
    expect(post.commentCount).toBe(1);
  });

  it('usa fallback de avatar e id ofuscado quando não é o autor', () => {
    const post = mapPostRow(baseRow, { id: 'user-2', email: 'bia@example.com' });
    expect(post.author.avatarUrl).toBe('https://placehold.co/48x48.png');
    expect(post.author.email).toBe('__user-1');
  });

  it('funciona sem usuário logado (deslogado)', () => {
    const post = mapPostRow(baseRow, null);
    expect(post.isSaved).toBe(false);
    expect(post.likedByMe).toBe(false);
    expect(post.author.email).toBe('__user-1');
  });

  it('popula imageUrl quando presente e deixa undefined quando null', () => {
    const semImagem = mapPostRow(baseRow, null);
    expect(semImagem.imageUrl).toBeUndefined();

    const comImagem = mapPostRow({ ...baseRow, image_url: 'https://example.com/post.png' }, null);
    expect(comImagem.imageUrl).toBe('https://example.com/post.png');
  });
});
