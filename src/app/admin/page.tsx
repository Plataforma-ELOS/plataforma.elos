// src/app/admin/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { consultarComRetry } from '@/lib/data/consulta';
import { mapFeedContentRow, type FeedContentRow } from '@/lib/data/feed-contents';
import AdminClient, { type ConteudoPendente } from './client-page';

export default async function AdminPage() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/home');

  const { data: perfil } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (perfil?.role !== 'admin') redirect('/home');

  const [{ data: professionals, error: professionalsError }, { data: clinics, error: clinicsError }, { data: conteudoRows, error: conteudosError }] =
    await Promise.all([
      consultarComRetry(() =>
        supabase
          .from('professionals')
          .select('id, display_name, specialty, kind, verification_status, created_at')
          .eq('verification_status', 'pending')
          .order('created_at', { ascending: true })
      ),
      consultarComRetry(() =>
        supabase
          .from('clinics')
          .select('id, name, specialty, verification_status, created_at')
          .eq('verification_status', 'pending')
          .order('created_at', { ascending: true })
      ),
      consultarComRetry(() =>
        supabase
          .from('feed_contents')
          .select('id, slug, kind, title, author_label, body, tip, sources, image_url, image_alt, is_demo, published_at')
          .eq('approved', false)
          .order('created_at', { ascending: true })
      ),
    ]);

  if (professionalsError) console.error('[admin] erro ao buscar profissionais:', professionalsError.message);
  if (clinicsError) console.error('[admin] erro ao buscar clínicas:', clinicsError.message);
  if (conteudosError) console.error('[admin] erro ao buscar conteúdos do acervo:', conteudosError.message);

  const conteudosPendentes: ConteudoPendente[] = ((conteudoRows ?? []) as FeedContentRow[])
    .map(mapFeedContentRow)
    .filter((c): c is ConteudoPendente => c !== null);

  return (
    <AdminClient
      professionaisIniciais={professionals ?? []}
      clinicasIniciais={clinics ?? []}
      conteudosPendentes={conteudosPendentes}
    />
  );
}
