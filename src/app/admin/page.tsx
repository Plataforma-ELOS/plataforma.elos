// src/app/admin/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminClient from './client-page';

export default async function AdminPage() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/home');

  const { data: perfil } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (perfil?.role !== 'admin') redirect('/home');

  const [{ data: professionals, error: professionalsError }, { data: clinics, error: clinicsError }, { data: libraryItems, error: libraryError }] =
    await Promise.all([
      supabase
        .from('professionals')
        .select('id, display_name, specialty, kind, verification_status, created_at')
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: true }),
      supabase
        .from('clinics')
        .select('id, name, specialty, verification_status, created_at')
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: true }),
      supabase
        .from('library_items')
        .select('id, title, type, author_name, action_url, tags, created_at')
        .eq('approved', false)
        .order('created_at', { ascending: true }),
    ]);

  if (professionalsError) console.error('[admin] erro ao buscar profissionais:', professionalsError.message);
  if (clinicsError) console.error('[admin] erro ao buscar clínicas:', clinicsError.message);
  if (libraryError) console.error('[admin] erro ao buscar itens do acervo:', libraryError.message);

  return (
    <AdminClient
      professionaisIniciais={professionals ?? []}
      clinicasIniciais={clinics ?? []}
      itensAcervoIniciais={libraryItems ?? []}
    />
  );
}
