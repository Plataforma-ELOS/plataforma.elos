// src/app/home/page.tsx
"use client";

import dynamic from 'next/dynamic';
import HeaderSecondary from '@/components/layout/header-secondary';
import Hero from '@/components/features/home/hero';
import Footer from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic imports for components below the fold
const AiSupportHome = dynamic(() => import('@/components/features/home/ai-support-home'), {
  loading: () => <Skeleton className="h-96 w-full" />,
});

const NewDigitalCollection = dynamic(() => import('@/components/features/home/new-digital-collection'), {
    loading: () => <Skeleton className="h-96 w-full" />,
});

const NewCommunity = dynamic(() => import('@/components/features/home/new-community'), {
    loading: () => <Skeleton className="h-96 w-full" />,
});

const NewsCarousel = dynamic(() => import('@/components/features/news/news-carousel'), {
    loading: () => <Skeleton className="h-96 w-full" />,
});

const NewProfessionals = dynamic(() => import('@/components/features/home/new-professionals'), {
    loading: () => <Skeleton className="h-96 w-full" />,
});


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderSecondary />
      <main className="flex-1">
        <Hero />
        <AiSupportHome />
        <NewDigitalCollection />
        <NewCommunity />
        <NewsCarousel />
        <NewProfessionals />
      </main>
      <Footer />
    </div>
  );
}
