// src/lib/ics.ts
// Geração de arquivo .ics (formato iCalendar) para "Adicionar ao calendário"
// nos eventos da Comunidade — sem dependência de biblioteca externa.

type EventoParaIcs = {
  title: string;
  description: string;
  location: string | null;
  startsAt: string;
};

const UMA_HORA_EM_MS = 60 * 60 * 1000;

function formatarDataIcs(data: Date): string {
  return data.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escaparTextoIcs(texto: string): string {
  return texto.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

export function gerarIcs(evento: EventoParaIcs): string {
  const inicio = new Date(evento.startsAt);
  const fim = new Date(inicio.getTime() + UMA_HORA_EM_MS);

  const linhas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Plataforma E.L.O.S//Eventos//PT-BR',
    'BEGIN:VEVENT',
    `UID:${crypto.randomUUID()}@plataforma-elos`,
    `DTSTAMP:${formatarDataIcs(new Date())}`,
    `DTSTART:${formatarDataIcs(inicio)}`,
    `DTEND:${formatarDataIcs(fim)}`,
    `SUMMARY:${escaparTextoIcs(evento.title)}`,
    `DESCRIPTION:${escaparTextoIcs(evento.description)}`,
    evento.location ? `LOCATION:${escaparTextoIcs(evento.location)}` : null,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter((linha): linha is string => linha !== null);

  return linhas.join('\r\n');
}

export function baixarIcs(nomeArquivo: string, conteudo: string): void {
  const blob = new Blob([conteudo], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(url);
}
