// src/app/perfil/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProfilePageClient from './client-page';

export default async function ProfilePage() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bio, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <ProfilePageClient
      email={user.email ?? ''}
      fullName={profile?.full_name ?? ''}
      bio={profile?.bio ?? ''}
      avatarUrl={profile?.avatar_url ?? undefined}
    />
  );
}
