// src/components/features/search/search-bar.tsx
"use client";

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** Campo de busca reutilizável (input controlado com ícone de lupa). */
export default function SearchBar({ value, onChange, placeholder = 'Buscar...', className }: SearchBarProps) {
  return (
    <div className={cn('relative flex-1', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10 h-11"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
