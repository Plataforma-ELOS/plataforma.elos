import { describe, it, expect } from 'vitest';
import { mapNotificationRow, type NotificationRow } from './notifications';

const baseRow: NotificationRow = {
  id: '1',
  type: 'post_like',
  created_at: '2024-08-25T22:00:00Z',
  read_at: null,
  actor: { full_name: 'Renato Alves' },
  post: { content: 'Um post qualquer sobre o dia a dia com o TEA.' },
};

describe('mapNotificationRow', () => {
  it('monta a mensagem de curtida com trecho do post', () => {
    const n = mapNotificationRow(baseRow);
    expect(n.type).toBe('post_like');
    expect(n.message).toBe('Renato Alves curtiu seu post: "Um post qualquer sobre o dia a dia com o TEA.".');
    expect(n.isRead).toBe(false);
  });

  it('monta a mensagem de comentário', () => {
    const n = mapNotificationRow({ ...baseRow, type: 'post_comment' });
    expect(n.type).toBe('post_comment');
    expect(n.message).toContain('comentou no seu post');
  });

  it('marca como lida quando read_at existe', () => {
    const n = mapNotificationRow({ ...baseRow, read_at: '2024-08-26T10:00:00Z' });
    expect(n.isRead).toBe(true);
  });

  it('usa "Alguém" quando o autor não tem nome, e omite o trecho quando não há post', () => {
    const n = mapNotificationRow({ ...baseRow, actor: null, post: null });
    expect(n.message).toBe('Alguém curtiu seu post.');
  });

  it('corta o trecho do post em até 60 caracteres', () => {
    const textoLongo = 'a'.repeat(100);
    const n = mapNotificationRow({ ...baseRow, post: { content: textoLongo } });
    expect(n.message).toContain('a'.repeat(60) + '…');
    expect(n.message).not.toContain('a'.repeat(61));
  });
});
