import Link from 'next/link';
import FeatureInProgress from '@/components/feature-in-progress';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-border/50">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">ELOS</span>
            </Link>
            <p className="text-foreground/80">Cuidar de alguém começa por cuidar de si.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:col-span-2">
            <div className="space-y-4">
              <h4 className="font-semibold">Plataforma</h4>
              <ul className="space-y-2">
                <li><FeatureInProgress><span className="text-sm text-foreground/80 hover:text-foreground cursor-pointer">Notícias</span></FeatureInProgress></li>
                <li><FeatureInProgress><span className="text-sm text-foreground/80 hover:text-foreground cursor-pointer">Biblioteca Digital</span></FeatureInProgress></li>
                <li><Link href="/comunidade" className="text-sm text-foreground/80 hover:text-foreground">Comunidade</Link></li>
              </ul>
            </div>
             <div className="space-y-4">
              <h4 className="font-semibold">Suporte</h4>
              <ul className="space-y-2">
                <li><Link href="/suporte-ia" className="text-sm text-foreground/80 hover:text-foreground">Suporte IA</Link></li>
                <li><FeatureInProgress><span className="text-sm text-foreground/80 hover:text-foreground cursor-pointer">Fale Conosco</span></FeatureInProgress></li>
                <li><FeatureInProgress><span className="text-sm text-foreground/80 hover:text-foreground cursor-pointer">FAQ</span></FeatureInProgress></li>
              </ul>
            </div>
             <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2">
                <li><FeatureInProgress><span className="text-sm text-foreground/80 hover:text-foreground cursor-pointer">Termos de Serviço</span></FeatureInProgress></li>
                <li><FeatureInProgress><span className="text-sm text-foreground/80 hover:text-foreground cursor-pointer">Política de Privacidade</span></FeatureInProgress></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} Elos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}