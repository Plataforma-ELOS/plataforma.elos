'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export type Resultado = { ok: boolean; erro?: string };

const MENSAGEM_RATE_LIMIT = 'Você enviou muitas mensagens recentemente. Aguarde um pouco antes de tentar novamente.';

export async function enviarMensagemContato(name: string, email: string, message: string): Promise<Resultado> {
  const supabase = createClient(await cookies());

  const nome = name.trim();
  const mensagem = message.trim();
  if (!nome || !email.trim() || !mensagem) return { ok: false, erro: 'Preencha todos os campos.' };

  const { error } = await supabase.from('contact_messages').insert({ name: nome, email: email.trim(), message: mensagem });

  if (error) {
    if (error.message.includes('rate_limit_exceeded')) return { ok: false, erro: MENSAGEM_RATE_LIMIT };
    return { ok: false, erro: 'Não foi possível registrar sua mensagem agora.' };
  }

  return { ok: true };
}
