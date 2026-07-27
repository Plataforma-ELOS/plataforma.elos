// src/lib/data/notifications.ts
import { formatarDataHoraPtBr } from '../format';

export type NotificationData = {
  id: string;
  type: 'post_like' | 'post_comment';
  message: string;
  date: string;
  createdAt: string;
  isRead: boolean;
};

export type NotificationRow = {
  id: string;
  type: string;
  created_at: string;
  read_at: string | null;
  actor: { full_name: string | null } | null;
  post: { content: string } | null;
};

function snippet(content: string | null | undefined, max = 60): string {
  if (!content) return '';
  const texto = content.trim();
  return texto.length > max ? `${texto.slice(0, max)}…` : texto;
}

export function mapNotificationRow(row: NotificationRow): NotificationData {
  const nome = row.actor?.full_name ?? 'Alguém';
  const trecho = snippet(row.post?.content);

  const message =
    row.type === 'post_comment'
      ? `${nome} comentou no seu post${trecho ? `: "${trecho}"` : ''}.`
      : `${nome} curtiu seu post${trecho ? `: "${trecho}"` : ''}.`;

  return {
    id: row.id,
    type: row.type === 'post_comment' ? 'post_comment' : 'post_like',
    message,
    date: formatarDataHoraPtBr(row.created_at),
    createdAt: row.created_at,
    isRead: !!row.read_at,
  };
}
