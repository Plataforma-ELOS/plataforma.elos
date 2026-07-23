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
