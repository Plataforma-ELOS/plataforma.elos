// src/components/features/search/search-filters.tsx
"use client";

import { ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SortOrder } from '@/hooks/use-search';

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchFiltersProps {
  /** Opções do select de categoria/tipo (inclua a opção "todos"). */
  filterOptions: FilterOption[];
  filterValue: string;
  onFilterChange: (value: string) => void;
  sortOrder: SortOrder;
  onToggleSort: () => void;
  sortLabels?: { recent: string; oldest: string };
  /** Alternador grid/lista — só renderiza se `view` e `onViewChange` forem passados. */
  view?: 'grid' | 'list';
  onViewChange?: (view: 'grid' | 'list') => void;
}

/** Barra de filtros reutilizável: ordenação + select de categoria + (opcional) toggle de visualização. */
export default function SearchFilters({
  filterOptions,
  filterValue,
  onFilterChange,
  sortOrder,
  onToggleSort,
  sortLabels = { recent: 'Mais Recentes', oldest: 'Mais Antigos' },
  view,
  onViewChange,
}: SearchFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" className="h-11" onClick={onToggleSort}>
        <ArrowUpDown className="mr-2 h-4 w-4" />
        Ordenar: {sortOrder === 'recent' ? sortLabels.recent : sortLabels.oldest}
      </Button>

      <Select value={filterValue} onValueChange={onFilterChange}>
        <SelectTrigger className="w-full md:w-[180px] h-11">
          <SelectValue placeholder="Filtrar" />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {view && onViewChange && (
        <div className="bg-muted p-1 rounded-md hidden md:flex">
          <Button variant={view === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => onViewChange('grid')}>
            <LayoutGrid />
          </Button>
          <Button variant={view === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => onViewChange('list')}>
            <List />
          </Button>
        </div>
      )}
    </div>
  );
}
