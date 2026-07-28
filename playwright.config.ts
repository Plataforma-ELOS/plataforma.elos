import { defineConfig } from '@playwright/test';

// E2E das páginas 100% públicas (sem sessão) — ver e2e/public-pages.spec.ts.
// Fluxos autenticados (login, criar post) exigem uma conta de teste real e
// Supabase alcançável em CI; ficam fora deste config por enquanto (mesma
// natureza de dependência externa dos itens G1-G4 do guia mestre).
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:9002',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:9002',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://dummy.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'dummy-anon-key',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? 'dummy-key',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
