import { describe, it, expect } from 'vitest';
import { mapSavedConteudos, mapSavedPost, type PostSaveRow } from './saved';

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

describe('mapSavedConteudos', () => {
  const conteudo = {
    id: 'c1',
    slug: 'crises-nao-sao-birras',
    kind: 'clinica',
    title: 'Crises não são birras',
    author_label: 'Clínica — perfil demonstrativo',
    body: 'Texto.',
    tip: null,
    sources: [],
    image_url: null,
    image_alt: null,
    is_demo: true,
    published_at: '2026-11-15T15:00:00Z',
  };

  it('usa a data em que foi salvo e marca o tipo', () => {
    const [salvo] = mapSavedConteudos([{ created_at: '2026-11-17T12:00:00Z', conteudo }]);
    expect(salvo.kind).toBe('conteudo');
    expect(salvo.id).toBe('c1');
    expect(salvo.createdAt).toBe('2026-11-17T12:00:00Z');
    expect(salvo.conteudo.title).toBe('Crises não são birras');
    expect(salvo.conteudo.kind).toBe('clinica');
  });

  it('ignora salvo cujo conteúdo não veio (apagado ou sem permissão)', () => {
    expect(mapSavedConteudos([{ created_at: '2026-11-17T12:00:00Z', conteudo: null }])).toEqual([]);
  });
});
