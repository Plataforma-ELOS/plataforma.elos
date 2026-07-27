// src/app/noticias/[slug]/loading.tsx
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewsArticleLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderSecondary />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-5 w-48 mb-8" />

            <Skeleton className="h-6 w-24 rounded-full mb-4" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-2/3 mb-4" />
            <div className="flex items-center gap-6 mb-8">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>

            <Skeleton className="w-full aspect-[2/1] rounded-2xl mb-8" />

            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
