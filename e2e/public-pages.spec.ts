import { test, expect } from '@playwright/test';

// Smoke test das páginas 100% públicas (sem sessão) — confirma que cada
// uma responde 200 e renderiza o heading esperado. Confiável em qualquer
// ambiente de rede depois do fix do middleware (H1): essas rotas não
// dependem mais de supabase.co estar alcançável para renderizar.
const paginasPublicas = [
  { path: '/home', heading: /Cuidar de alguém/ },
  { path: '/faq', heading: /Central de Ajuda/ },
  { path: '/login', heading: /Bem-vindo\(a\) de volta/ },
  { path: '/cadastro', heading: /Crie sua conta/ },
  { path: '/termos-de-servico', heading: /Termos de Serviço/ },
  { path: '/politica-de-privacidade', heading: /Política de Privacidade/ },
];

for (const { path, heading } of paginasPublicas) {
  test(`${path} renderiza 200 com o heading esperado`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
  });
}
