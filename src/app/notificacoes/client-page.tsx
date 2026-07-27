// src/app/notificacoes/client-page.tsx
"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Heart, MessageCircle, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { marcarComoLida, marcarTodasComoLidas, limparNotificacoes } from '@/app/actions/notifications';
import type { NotificationData } from '@/lib/data/notifications';

export default function NotificationsPageClient({
  notificacoesIniciais,
  userId,
}: {
  notificacoesIniciais: NotificationData[];
  userId: string;
}) {
  const router = useRouter();
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais);

  useEffect(() => {
    setNotificacoes(notificacoesIniciais);
  }, [notificacoesIniciais]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications-page-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `profile_id=eq.${userId}` },
        () => router.refresh()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, router]);

  const handleMarcarLida = useCallback((id: string) => {
    setNotificacoes((atual) => atual.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    marcarComoLida(id);
  }, []);

  const handleMarcarTodas = useCallback(() => {
    setNotificacoes((atual) => atual.map((n) => ({ ...n, isRead: true })));
    marcarTodasComoLidas();
  }, []);

  const handleLimpar = useCallback(() => {
    setNotificacoes([]);
    limparNotificacoes();
  }, []);

  const naoLidas = notificacoes.filter((n) => !n.isRead).length;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <HeaderSecondary />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Bell className="h-6 w-6 text-primary-strong" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-headline">Notificações</h1>
                  {naoLidas > 0 && (
                    <p className="text-sm text-muted-foreground">{naoLidas} não lida{naoLidas > 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
              {notificacoes.length > 0 && (
                <div className="flex gap-2">
                  {naoLidas > 0 && (
                    <Button variant="outline" size="sm" onClick={handleMarcarTodas}>
                      <Check className="mr-2 h-4 w-4" />
                      Marcar todas como lidas
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleLimpar}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Limpar
                  </Button>
                </div>
              )}
            </div>

            {notificacoes.length === 0 ? (
              <p className="text-muted-foreground text-center py-16">
                Você ainda não tem notificações. Curtidas e comentários nos seus posts aparecem aqui.
              </p>
            ) : (
              <div className="space-y-3">
                {notificacoes.map((n) => (
                  <Card
                    key={n.id}
                    className={cn('cursor-pointer transition-colors', !n.isRead && 'border-primary bg-primary/5')}
                    onClick={() => !n.isRead && handleMarcarLida(n.id)}
                  >
                    <CardContent className="flex items-start gap-3 p-4">
                      {n.type === 'post_comment' ? (
                        <MessageCircle className="h-5 w-5 text-primary-strong shrink-0 mt-0.5" />
                      ) : (
                        <Heart className="h-5 w-5 text-primary-strong shrink-0 mt-0.5" />
                      )}
                      <div className="flex-grow">
                        <p className={cn('text-sm', !n.isRead && 'font-medium')}>{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.date}</p>
                      </div>
                      {!n.isRead && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
