# Migrations já aplicadas em produção

O banco Supabase (projeto `Plataforma_ELOS`, id `azbfrxrqwuhbffofdrct`) já
está com o schema completo e testado:

- `0001`–`0003`: estrutura (22 tabelas), RLS (48 policies), seed de conteúdo
  público (notícias, acervo, pílulas de conhecimento).
- `0004`: hardening de segurança (search_path travado, contact_messages com
  validação real, profiles com leitura pública).
- `0005`: seed de demonstração — 5 profissionais + 2 clínicas fictícios
  (registration_number no formato `DEMO-xxx` de propósito, para não colidir
  com registro profissional real).
- `0006`: isolou a função `is_admin()` num schema não exposto pelo PostgREST.
- `0007`: performance — 25 policies pararam de reavaliar `auth.uid()` linha a
  linha, 11 tabelas com policy duplicada em SELECT foram divididas, 12
  índices de chave estrangeira criados.

**Resultado no Security/Performance Advisor: 0 avisos de segurança, 0
avisos de performance.**

Você não precisa rodar nada aqui — o banco já está pronto. Este arquivo é só
para registro. Se quiser puxar o schema real para cá como referência local,
rode (com a Supabase CLI instalada e logada):

```bash
supabase link --project-ref azbfrxrqwuhbffofdrct
supabase db pull
```
