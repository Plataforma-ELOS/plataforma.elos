// src/app/configuracoes/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SettingsPageClient from './client-page';

export default async function SettingsPage() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('notify_email, notify_push, profile_public')
    .eq('id', user.id)
    .single();

  return (
    <SettingsPageClient
      notifyEmail={profile?.notify_email ?? true}
      notifyPush={profile?.notify_push ?? true}
      profilePublic={profile?.profile_public ?? true}
    />
  );
}
