import { test, expect } from '@playwright/test';

// Regressão dos bugs de UI/mobile corrigidos no PR #51. Só cobre
// comportamento de estado síncrono do client (não depende de resposta real
// do Supabase) — por isso é confiável mesmo sem rede para supabase.co.
test.use({ viewport: { width: 375, height: 812 } });

// Nota de ambiente: rodando contra `npm run dev` (Fast Refresh/Turbopack),
// este teste pode falhar de forma intermitente em sandboxes com rede
// bloqueada para hosts externos (ex. i.ibb.co) — os erros de recurso
// disparam um rebuild do HMR que reseta a navegação client-side em
// andamento. Validado manualmente contra build de produção
// (`next build && next start`), onde passa de forma consistente e rápida
// — não é uma falha do app. CI (quando E2E for habilitado) deve rodar
// contra produção para evitar esse ruído.
test('menu mobile fecha ao navegar para outra página', async ({ page }) => {
  await page.goto('/home');

  await page.getByRole('button', { name: 'Abrir menu' }).click();
  // Escopado ao diálogo do menu (Radix Sheet usa role="dialog") — o rodapé
  // também tem um link "Fale Conosco", o seletor sem escopo seria ambíguo.
  const menu = page.getByRole('dialog');
  const linkFaleConosco = menu.getByRole('link', { name: 'Fale Conosco' });
  await expect(linkFaleConosco).toBeVisible();

  await linkFaleConosco.click();
  await expect(page).toHaveURL('/fale-conosco');
  await expect(menu).not.toBeVisible();
});

test('botão de login desabilita imediatamente ao enviar o formulário', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill('teste@example.com');
  await page.getByLabel('Senha').fill('senha123');

  const botaoEntrar = page.getByRole('button', { name: 'Entrar' });
  await botaoEntrar.click();
  await expect(botaoEntrar).toBeDisabled();
});

test('botão de cadastro desabilita imediatamente ao enviar o formulário', async ({ page }) => {
  await page.goto('/cadastro');

  await page.getByLabel('Nome').fill('Usuário Teste');
  await page.getByLabel('Email').fill('teste@example.com');
  await page.getByLabel('Senha').fill('senha123');

  const botaoCriarConta = page.getByRole('button', { name: 'Criar Conta' });
  await botaoCriarConta.click();
  await expect(botaoCriarConta).toBeDisabled();
});
