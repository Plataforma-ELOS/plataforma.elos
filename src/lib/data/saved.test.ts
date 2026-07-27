import { describe, it, expect } from 'vitest';
import { mapSavedPost, type PostSaveRow } from './saved';

const baseRow: PostSaveRow = {
  id: '1',
  content: 'Conteúdo do post salvo.',
  created_at: '2024-08-25T22:00:00Z',
  author: { full_name: 'Letícia de Santana', avatar_url: 'https://example.com/avatar.png' },
};

describe('mapSavedPost', () => {
  it('mapeia um post salvo com autor', () => {
    const salvo = mapSavedPost(baseRow);
    expect(salvo.kind).toBe('post');
    expect(salvo.id).toBe('1');
    expect(salvo.content).toBe('Conteúdo do post salvo.');
    expect(salvo.author).toEqual({ name: 'Letícia de Santana', avatarUrl: 'https://example.com/avatar.png' });
    expect(salvo.date).toBe('25 de Agosto de 2024');
  });

  it('usa valores padrão quando não há autor', () => {
    const salvo = mapSavedPost({ ...baseRow, author: null });
    expect(salvo.author.name).toBe('Usuário');
    expect(salvo.author.avatarUrl).toBe('https://placehold.co/48x48.png');
  });
});
