// src/lib/share.ts
// Compartilhamento com Web Share API (mobile/nativo) e fallback para
// copiar o link — usado em post-card.tsx e profissionais/[id].
export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed';

export async function compartilhar(url: string, titulo: string): Promise<ShareResult> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: titulo, url });
      return 'shared';
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return 'cancelled';
      // outros erros (ex.: navegador sem suporte real apesar de expor a API) caem no fallback abaixo
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  return 'failed';
}
