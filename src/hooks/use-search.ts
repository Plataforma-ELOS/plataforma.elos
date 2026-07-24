// src/hooks/use-search.ts
// Hook genérico de busca/filtro/ordenação em listas em memória. Sem UI —
// só a regra de negócio (query + filtro por categoria + ordenação), para
// ser reaproveitado por qualquer tela com listagem pesquisável.
import { useMemo, useState } from 'react';

export type SortOrder = 'recent' | 'oldest';

export interface UseSearchParams<T> {
  items: T[];
  /** Campos textuais de cada item onde a query é procurada (case-insensitive). */
  searchableText: (item: T) => string[];
  /** Predicado de filtro por categoria/tipo; recebe o valor de filtro atual. */
  matchesFilter?: (item: T, filterValue: string) => boolean;
  /** Chave numérica para ordenar (ex.: timestamp). 'recent' = desc, 'oldest' = asc. */
  sortBy?: (item: T) => number;
  initialFilter?: string;
  initialSort?: SortOrder;
}

export interface UseSearchResult<T> {
  query: string;
  setQuery: (q: string) => void;
  filter: string;
  setFilter: (f: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (o: SortOrder) => void;
  toggleSort: () => void;
  results: T[];
}

/**
 * Passe `searchableText`/`matchesFilter`/`sortBy` como referências estáveis
 * (definidas fora do componente ou via useCallback) para não recomputar o
 * memo a cada render.
 */
export function useSearch<T>({
  items,
  searchableText,
  matchesFilter,
  sortBy,
  initialFilter = 'all',
  initialSort = 'recent',
}: UseSearchParams<T>): UseSearchResult<T> {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(initialFilter);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSort);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    let out = items.filter((item) => {
      if (matchesFilter && !matchesFilter(item, filter)) return false;
      if (!q) return true;
      return searchableText(item).some((text) => text.toLowerCase().includes(q));
    });

    if (sortBy) {
      out = [...out].sort((a, b) =>
        sortOrder === 'recent' ? sortBy(b) - sortBy(a) : sortBy(a) - sortBy(b)
      );
    }

    return out;
  }, [items, query, filter, sortOrder, matchesFilter, searchableText, sortBy]);

  const toggleSort = () => setSortOrder((s) => (s === 'recent' ? 'oldest' : 'recent'));

  return { query, setQuery, filter, setFilter, sortOrder, setSortOrder, toggleSort, results };
}
