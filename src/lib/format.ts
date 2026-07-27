// src/lib/format.ts
// Formatadores compartilhados entre server e client components — sem
// dependências de servidor, para poder ser importado por qualquer um dos dois.
export function formatarDataPtBr(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).replace(/^(\d+) de (\w)/, (_, d, m) => `${d} de ${m.toUpperCase()}`);
}

export function formatarDataHoraPtBr(iso: string | null): string {
  if (!iso) return '';
  const data = formatarDataPtBr(iso);
  const hora = new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
  return `${data} - ${hora}`;
}
