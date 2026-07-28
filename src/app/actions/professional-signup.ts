'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export type Resultado = { ok: boolean; erro?: string };

type Inscricao = {
  fullName: string;
  email: string;
  registrationType: 'liberal' | 'clinic_professional' | 'clinic';
  cnpj: string;
  registrationNumber: string;
  specialty: string;
  experience: string;
  imageUrl?: string;
};

export async function inscreverProfissional(dados: Inscricao): Promise<Resultado> {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: 'Entre na sua conta para se inscrever.' };

  const fullName = dados.fullName.trim();
  if (!fullName) return { ok: false, erro: 'Informe seu nome ou o nome da clínica.' };

  const specialty = dados.specialty.trim();
  if (!specialty) return { ok: false, erro: 'Informe a especialidade.' };

  if (dados.registrationType === 'clinic') {
    if (!dados.cnpj.trim()) return { ok: false, erro: 'Informe o CNPJ da clínica.' };

    const { error } = await supabase.from('clinics').insert({
      owner_id: user.id,
      name: fullName,
      cnpj: dados.cnpj.trim(),
      specialty,
      description: dados.experience.trim(),
      email: dados.email.trim(),
      image_url: dados.imageUrl ?? null,
    });
    if (error) return { ok: false, erro: 'Não foi possível enviar sua inscrição agora.' };
    return { ok: true };
  }

  if (dados.registrationNumber.length !== 7) {
    return { ok: false, erro: 'O número do registro profissional deve ter exatamente 7 dígitos.' };
  }

  const { error } = await supabase.from('professionals').insert({
    owner_id: user.id,
    kind: dados.registrationType,
    display_name: fullName,
    registration_number: dados.registrationNumber,
    specialty,
    description: dados.experience.trim(),
    email: dados.email.trim(),
    image_url: dados.imageUrl ?? null,
  });
  if (error) return { ok: false, erro: 'Não foi possível enviar sua inscrição agora.' };

  return { ok: true };
}
