import { describe, it, expect } from 'vitest';
import { mapEventRow, type EventRow } from './events';

const baseRow: EventRow = {
  id: '1',
  title: 'Workshop de CAA',
  description: 'Aprenda o básico.',
  starts_at: '2024-08-25T22:00:00Z',
  type: 'online',
  location: null,
};

describe('mapEventRow', () => {
  it('mapeia um evento online', () => {
    const evento = mapEventRow(baseRow);
    expect(evento.id).toBe('1');
    expect(evento.title).toBe('Workshop de CAA');
    expect(evento.type).toBe('Online');
    expect(evento.date).toBe('25 de Agosto de 2024 - 19:00');
    expect(evento.location).toBeNull();
  });

  it('mapeia um evento presencial', () => {
    const evento = mapEventRow({ ...baseRow, type: 'presencial', location: 'Parque Ibirapuera' });
    expect(evento.type).toBe('Presencial');
    expect(evento.location).toBe('Parque Ibirapuera');
  });

  it('usa string vazia quando não há descrição', () => {
    const evento = mapEventRow({ ...baseRow, description: null });
    expect(evento.description).toBe('');
  });
});
