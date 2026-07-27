// src/app/loading.tsx
// Fallback global do App Router — aparece durante o carregamento de
// qualquer rota que ainda não tenha seu próprio loading.tsx (a maioria
// das telas que buscam dados em Server Components).
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-20 border-b flex items-center px-6">
        <Skeleton className="h-8 w-32" />
      </div>
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
