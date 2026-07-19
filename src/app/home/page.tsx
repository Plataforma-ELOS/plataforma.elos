// src/app/home/page.tsx
"use client";

import dynamic from 'next/dynamic';
import HeaderSecondary from '@/components/layout/header-secondary';
import Hero from '@/components/sections/hero';
import Footer from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic imports for components below the fold
const AiSupportHome = dynamic(() => import('@/components/sections/ai-support-home'), {
  loading: () => <Skeleton className="h-96 w-full" />,
});

const NewDigitalCollection = dynamic(() => import('@/components/sections/new-digital-collection'), {
    loading: () => <Skeleton className="h-96 w-full" />,
});

const NewCommunity = dynamic(() => import('@/components/sections/new-community'), {
    loading: () => <Skeleton className="h-96 w-full" />,
});

const NewsCarousel = dynamic(() => import('@/components/sections/news-carousel'), {
    loading: () => <Skeleton className="h-96 w-full" />,
});

const NewProfessionals = dynamic(() => import('@/components/sections/new-professionals'), {
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
