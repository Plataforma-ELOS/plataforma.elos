import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import AiSupport from '@/components/sections/ai-support';

export default function AiSupportPage() {
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