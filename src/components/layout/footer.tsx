
"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Footer({ className }: { className?: string}) {
  return (
    <footer className={cn("w-full bg-primary/20 border-t border-border/50", className)}>
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:col-span-3">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Plataforma E.L.O.S</h4>
              <ul className="space-y-2">
                <li><Link href="/noticias" className="text-sm text-foreground/80 hover:text-foreground">Notícias</Link></li>
                <li><Link href="/acervo-digital" className="text-sm text-foreground/80 hover:text-foreground">Acervo Digital</Link></li>
                <li><Link href="/comunidade" className="text-sm text-foreground/80 hover:text-foreground">Comunidade</Link></li>
                <li><Link href="/suporte-ia" className="text-sm text-foreground/80 hover:text-foreground">Suporte IA</Link></li>
              </ul>
            </div>
             <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Suporte</h4>
              <ul className="space-y-2">
                <li><Link href="/fale-conosco" className="text-sm text-foreground/80 hover:text-foreground">Fale Conosco</Link></li>
                <li><Link href="/faq" className="text-sm text-foreground/80 hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>
             <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/termos-de-servico" className="text-sm text-foreground/80 hover:text-foreground">Termos de Serviço</Link></li>
                <li><Link href="/politica-de-privacidade" className="text-sm text-foreground/80 hover:text-foreground">Política de Privacidade</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} Plataforma E.L.O.S. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
