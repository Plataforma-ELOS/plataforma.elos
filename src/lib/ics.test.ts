import { describe, expect, it } from 'vitest';
import { gerarIcs } from './ics';

describe('gerarIcs', () => {
  const evento = {
    title: 'Roda de conversa',
    description: 'Encontro mensal para trocar experiências.',
    location: 'Rua das Flores, 123',
    startsAt: '2026-08-15T18:00:00.000Z',
  };

  it('inclui os campos essenciais do VEVENT', () => {
    const ics = gerarIcs(evento);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('SUMMARY:Roda de conversa');
    expect(ics).toContain('DESCRIPTION:Encontro mensal para trocar experiências.');
    expect(ics).toContain('LOCATION:Rua das Flores\\, 123');
    expect(ics).toContain('DTSTART:20260815T180000Z');
    expect(ics).toContain('DTEND:20260815T190000Z');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('omite LOCATION quando o evento não tem local', () => {
    const ics = gerarIcs({ ...evento, location: null });
    expect(ics).not.toContain('LOCATION:');
  });

  it('escapa quebras de linha na descrição', () => {
    const ics = gerarIcs({ ...evento, description: 'Linha 1\nLinha 2' });
    expect(ics).toContain('DESCRIPTION:Linha 1\\nLinha 2');
  });
});
