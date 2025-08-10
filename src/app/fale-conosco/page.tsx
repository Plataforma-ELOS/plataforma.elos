
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderSecondary />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
             <div className="flex justify-center mb-6">
                <div className="bg-primary/10 p-4 rounded-full">
                    <Mail className="h-10 w-10 text-primary" />
                </div>
            </div>
            <h1 className="text-4xl font-bold font-headline mb-4">Fale Conosco</h1>
            <p className="text-xl text-muted-foreground">Esta seção está em desenvolvimento. Volte em breve para conferir as novidades!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
