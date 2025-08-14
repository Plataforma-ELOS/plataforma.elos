
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import FeatureInProgress from '@/components/feature-in-progress';

const navItems = [
  { name: 'Notícias', href: '/noticias', isFeature: false },
  { name: 'Acervo Digital', href: '/acervo-digital', isFeature: false },
  { name: 'Comunidade', href: '/comunidade', isFeature: false },
  { name: 'Suporte IA', href: '/suporte-ia', isFeature: false },
  { name: 'Perfis Profissionais', href: '#', isFeature: true },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const renderNavItem = (item: typeof navItems[0]) => {
    if (item.isFeature) {
      return (
        <FeatureInProgress key={item.name}>
          <span className="text-foreground/80 hover:text-foreground transition-colors cursor-pointer">
            {item.name}
          </span>
        </FeatureInProgress>
      );
    }
    return (
      <Link href={item.href} key={item.name} className="text-foreground/80 hover:text-foreground transition-colors">
        {item.name}
      </Link>
    );
  };
  
  const renderMobileNavItem = (item: typeof navItems[0]) => {
    if (item.isFeature) {
      return (
        <FeatureInProgress key={item.name}>
          <span className="text-foreground/80 hover:text-foreground transition-colors cursor-pointer">
            {item.name}
          </span>
        </FeatureInProgress>
      );
    }
    return (
      <Link href={item.href} key={item.name} className="text-foreground/80 hover:text-foreground transition-colors">
        {item.name}
      </Link>
    );
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-sm shadow-sm' : 'bg-background'}`}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">ELOS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => renderNavItem(item))}
        </nav>
        <div className="flex items-center gap-4">
          <FeatureInProgress>
            <Button asChild className="hidden md:inline-flex rounded-full transition-transform duration-300 ease-out hover:scale-105">
              <span className="cursor-pointer">Login</span>
            </Button>
          </FeatureInProgress>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background p-0">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                   <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">ELOS</span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-6 p-6 text-lg font-medium flex-1">
                  {navItems.map((item) => renderMobileNavItem(item))}
                </nav>
                 <div className="p-6 border-t">
                  <FeatureInProgress>
                    <Button asChild className="w-full rounded-full">
                      <span className="cursor-pointer">Login</span>
                    </Button>
                  </FeatureInProgress>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
