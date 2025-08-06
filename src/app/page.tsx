import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import Stats from '@/components/sections/stats';
import Features from '@/components/sections/features';
import Community from '@/components/sections/community';
import Professionals from '@/components/sections/professionals';
import DigitalCollection from '@/components/sections/digital-collection';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <Community />
        <Professionals />
        <DigitalCollection />
      </main>
      <Footer />
    </div>
  );
}
