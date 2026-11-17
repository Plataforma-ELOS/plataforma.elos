'use server';

// "Adicionar ao Acervo": a pessoa logada sugere um conteúdo (profissional,
// clínica ou cuidador). Ele entra pendente (approved = false) e só aparece no
// Acervo depois que um admin aprovar em /admin. A RLS de feed_contents
// garante o mesmo do lado do banco: não dá para se autoaprovar.
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { gerarSlug, validarSugestaoConteudo, type SugestaoConteudo } from '@/lib/data/feed-contents';

export type Resultado = { ok: boolean; erro?: string };

export async function sugerirConteudo(sugestao: SugestaoConteudo): Promise<Resultado> {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: 'Entre na sua conta para continuar.' };

  const validacao = validarSugestaoConteudo(sugestao);
  if (!validacao.ok) return { ok: false, erro: validacao.erro };

  const { error } = await supabase.from('feed_contents').insert({
    ...validacao.dados,
    slug: gerarSlug(validacao.dados.title, crypto.randomUUID().slice(0, 8)),
    suggested_by: user.id,
    approved: false,
    is_demo: false,
  });

  if (error) {
    if (error.message.includes('rate_limit_exceeded')) {
      return { ok: false, erro: 'Você já enviou várias sugestões na última hora. Tente de novo mais tarde.' };
    }
    console.error('[sugerirConteudo]', error.message);
    return { ok: false, erro: 'Não foi possível enviar sua sugestão agora.' };
  }

  revalidatePath('/admin');
  return { ok: true };
}
