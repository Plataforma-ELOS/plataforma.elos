// src/app/suporte-ia/page.tsx
"use client";

import { Suspense } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import AiSupport from '@/components/sections/ai-support';

function AiSupportPageContent() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderSecondary />
      <main className="flex-1">
        <AiSupport />
      </main>
      <Footer />
    </div>
  );
}

export default function AiSupportPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AiSupportPageContent />
    </Suspense>
  );
}
