// src/app/error.tsx
"use client";

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[error boundary]', error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center text-center px-4 gap-4">
      <div className="bg-destructive/10 p-4 rounded-full">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold font-headline">Algo deu errado</h1>
      <p className="text-muted-foreground max-w-md">
        Não conseguimos carregar esta página agora. Tente de novo em alguns instantes.
      </p>
      <Button onClick={() => reset()}>Tentar novamente</Button>
    </div>
  );
}
