// src/lib/data/caregiver.ts
import { formatarDataPtBr } from '../format';

export type DependentData = {
  id: string;
  firstName: string;
  age: number | null;
  relationship: string;
  notes: string;
};

export type DependentRow = {
  id: string;
  first_name: string;
  birth_year: number | null;
  relationship: string | null;
  notes: string | null;
};

export function mapDependentRow(row: DependentRow): DependentData {
  return {
    id: row.id,
    firstName: row.first_name,
    age: row.birth_year ? new Date().getFullYear() - row.birth_year : null,
    relationship: row.relationship ?? '',
    notes: row.notes ?? '',
  };
}

export type JournalEntryData = {
  id: string;
  entryDate: string;
  date: string;
  mood: string;
  content: string;
};

export type JournalEntryRow = {
  id: string;
  entry_date: string;
  mood: string | null;
  content: string;
};

export function mapJournalEntryRow(row: JournalEntryRow): JournalEntryData {
  return {
    id: row.id,
    entryDate: row.entry_date,
    // entry_date é "date" (sem hora) — ancora em meio-dia antes de formatar
    // para não cruzar fuso e mostrar o dia errado (ver format.ts, timeZone America/Sao_Paulo).
    date: formatarDataPtBr(`${row.entry_date}T12:00:00`),
    mood: row.mood ?? '',
    content: row.content,
  };
}
