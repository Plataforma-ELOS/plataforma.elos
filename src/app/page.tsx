import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import Community from '@/components/sections/community';
import Professionals from '@/components/sections/professionals';
import DigitalCollection from '@/components/sections/digital-collection';
import Footer from '@/components/layout/footer';
import AiSupportHome from '@/components/sections/ai-support-home';
import NewsCarousel from '@/components/sections/news-carousel';
import NewCommunity from '@/components/sections/new-community';
import NewDigitalCollection from '@/components/sections/new-digital-collection';
import NewProfessionals from '@/components/sections/new-professionals';

const SeparatorSection = () => (
    <div className="py-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Nova tentativa</h2>
    </div>
);

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <AiSupportHome />
        <NewDigitalCollection />
        <NewCommunity />
        <NewsCarousel />
        <NewProfessionals />
        
        <SeparatorSection />

        <Community />
        <Professionals />
        <DigitalCollection />
      </main>
      <Footer />
    </div>
  );
}
