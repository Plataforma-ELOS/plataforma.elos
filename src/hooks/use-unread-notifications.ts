// src/hooks/use-unread-notifications.ts
// Contagem de notificações não lidas do usuário logado, atualizada em
// tempo real via Supabase Realtime (nova notificação incrementa na hora).
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useUnreadNotificationsCount(userId: string | null): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setCount(0);
      return;
    }

    const supabase = createClient();
    let ativo = true;

    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', userId)
      .is('read_at', null)
      .then(({ count: total }) => {
        if (ativo) setCount(total ?? 0);
      });

    const channel = supabase
      .channel(`notifications-count-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `profile_id=eq.${userId}` },
        () => setCount((atual) => atual + 1)
      )
      .subscribe();

    return () => {
      ativo = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return count;
}
