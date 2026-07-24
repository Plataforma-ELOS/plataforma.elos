import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useSearch } from '@/hooks/use-search';

type Item = { name: string; tag: string; date: number; type: string };

const items: Item[] = [
  { name: 'Ana', tag: 'psicologa', date: 3, type: 'a' },
  { name: 'Bruno', tag: 'fono', date: 1, type: 'b' },
  { name: 'Carla', tag: 'psicopedagoga', date: 2, type: 'a' },
];

function setup() {
  return renderHook(() =>
    useSearch<Item>({
      items,
      searchableText: (i) => [i.name, i.tag],
      matchesFilter: (i, f) => f === 'all' || i.type === f,
      sortBy: (i) => i.date,
    })
  );
}

describe('useSearch', () => {
  it('sem query, retorna tudo ordenado por recent (date desc)', () => {
    const { result } = setup();
    expect(result.current.results.map((r) => r.name)).toEqual(['Ana', 'Carla', 'Bruno']);
  });

  it('filtra por query em qualquer campo de searchableText', () => {
    const { result } = setup();
    act(() => result.current.setQuery('bruno'));
    expect(result.current.results.map((r) => r.name)).toEqual(['Bruno']);
  });

  it('busca é case-insensitive e casa por substring', () => {
    const { result } = setup();
    act(() => result.current.setQuery('PSICO'));
    // Ana(psicologa) e Carla(psicopedagoga), ordenadas por recent.
    expect(result.current.results.map((r) => r.name)).toEqual(['Ana', 'Carla']);
  });

  it('aplica matchesFilter por categoria', () => {
    const { result } = setup();
    act(() => result.current.setFilter('b'));
    expect(result.current.results.map((r) => r.name)).toEqual(['Bruno']);
  });

  it('combina filtro + query', () => {
    const { result } = setup();
    act(() => {
      result.current.setFilter('a');
      result.current.setQuery('carla');
    });
    expect(result.current.results.map((r) => r.name)).toEqual(['Carla']);
  });

  it('toggleSort alterna para oldest (date asc)', () => {
    const { result } = setup();
    act(() => result.current.toggleSort());
    expect(result.current.sortOrder).toBe('oldest');
    expect(result.current.results.map((r) => r.name)).toEqual(['Bruno', 'Carla', 'Ana']);
  });

  it('limpar a query restaura todos os itens', () => {
    const { result } = setup();
    act(() => result.current.setQuery('bruno'));
    expect(result.current.results).toHaveLength(1);
    act(() => result.current.setQuery(''));
    expect(result.current.results).toHaveLength(3);
  });
});
