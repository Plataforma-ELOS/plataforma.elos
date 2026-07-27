import { describe, it, expect } from 'vitest';
import { mapDependentRow, mapJournalEntryRow, type DependentRow, type JournalEntryRow } from './caregiver';

describe('mapDependentRow', () => {
  it('calcula a idade a partir do ano de nascimento', () => {
    const row: DependentRow = { id: '1', first_name: 'João', birth_year: new Date().getFullYear() - 10, relationship: 'filho', notes: null };
    const dep = mapDependentRow(row);
    expect(dep.age).toBe(10);
    expect(dep.firstName).toBe('João');
    expect(dep.relationship).toBe('filho');
    expect(dep.notes).toBe('');
  });

  it('idade nula quando não há ano de nascimento', () => {
    const row: DependentRow = { id: '1', first_name: 'João', birth_year: null, relationship: null, notes: null };
    expect(mapDependentRow(row).age).toBeNull();
  });
});

describe('mapJournalEntryRow', () => {
  it('formata entry_date sem deslocar o dia por fuso horário', () => {
    // entry_date é "date" puro (sem hora) — 2024-08-25 tem que continuar
    // sendo 25 de agosto, não 24, mesmo com o formatador convertendo para
    // America/Sao_Paulo (UTC-3).
    const row: JournalEntryRow = { id: '1', entry_date: '2024-08-25', mood: 'Feliz', content: 'Um bom dia.' };
    const entry = mapJournalEntryRow(row);
    expect(entry.date).toBe('25 de Agosto de 2024');
    expect(entry.entryDate).toBe('2024-08-25');
    expect(entry.mood).toBe('Feliz');
  });

  it('usa string vazia quando não há humor registrado', () => {
    const row: JournalEntryRow = { id: '1', entry_date: '2024-01-01', mood: null, content: 'Texto' };
    expect(mapJournalEntryRow(row).mood).toBe('');
  });
});
