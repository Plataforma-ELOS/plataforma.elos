// src/app/notificacoes/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { mapNotificationRow, type NotificationRow } from '@/lib/data/notifications';
import NotificationsPageClient from './client-page';

export default async function NotificationsPage() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, created_at, read_at, actor:profiles!notifications_actor_id_fkey(full_name), post:posts(content)')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false });

  if (error) console.error('[notificacoes] erro ao buscar notificações:', error.message);

  const notificacoes = ((data ?? []) as unknown as NotificationRow[]).map(mapNotificationRow);

  return <NotificationsPageClient notificacoesIniciais={notificacoes} userId={user.id} />;
}
