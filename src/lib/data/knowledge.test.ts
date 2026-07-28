import { describe, expect, it } from 'vitest';
import { mapKnowledgePill, mapKnowledgeTrail } from './knowledge';

describe('mapKnowledgePill', () => {
  it('mapeia os campos e usa string vazia quando category é null', () => {
    const pill = mapKnowledgePill({ title: 'Título', content: 'Conteúdo', category: null });
    expect(pill).toEqual({ title: 'Título', content: 'Conteúdo', category: '' });
  });

  it('preserva a category quando presente', () => {
    const pill = mapKnowledgePill({ title: 'T', content: 'C', category: 'Direitos' });
    expect(pill.category).toBe('Direitos');
  });
});

describe('mapKnowledgeTrail', () => {
  it('usa o progresso do mapa quando presente', () => {
    const progresso = new Map([['trail-1', 42]]);
    const trail = mapKnowledgeTrail({ id: 'trail-1', title: 'Trilha', description: 'Desc' }, progresso);
    expect(trail.progress).toBe(42);
  });

  it('usa 0 quando não há progresso registrado e "" quando description é null', () => {
    const trail = mapKnowledgeTrail({ id: 'trail-2', title: 'Trilha', description: null }, new Map());
    expect(trail.progress).toBe(0);
    expect(trail.description).toBe('');
  });
});
