"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Bell, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { name: 'Notícias', href: '#' },
  { name: 'Acervo digital', href: '#' },
  { name: 'Comunidade', href: '#' },
  { name: 'Suporte A.I', href: '/suporte-ia' },
];

export default function HeaderSecondary() {
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

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-sm shadow-sm' : 'bg-background'}`}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground/80">Suporte IA</Link>
            <div className="hidden md:flex items-center gap-2">
                <span className="text-sm font-medium text-foreground/80">Plataforma</span>
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary">E.L.O.S</span>
                </Link>
            </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className={`text-foreground/80 hover:text-foreground transition-colors ${item.name === 'Suporte A.I' ? 'font-bold text-foreground' : ''}`}>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                <Bell className="h-6 w-6" />
                <span className="sr-only">Notificações</span>
            </Button>
            <Avatar className="hidden md:inline-flex h-9 w-9">
                <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="user avatar" />
                <AvatarFallback>
                    <UserCircle className="h-9 w-9 text-muted-foreground" />
                </AvatarFallback>
            </Avatar>
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
                    <span className="text-2xl font-bold text-primary">E.L.O.S</span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-6 p-6 text-lg font-medium flex-1">
                  {navItems.map((item) => (
                    <Link key={item.name} href={item.href} className={`text-foreground/80 hover:text-foreground transition-colors ${item.name === 'Suporte A.I' ? 'font-bold text-foreground' : ''}`}>
                      {item.name}
                    </Link>
                  ))}
                </nav>
                 <div className="p-6 border-t flex items-center justify-center gap-4">
                    <Button variant="ghost" size="icon">
                        <Bell className="h-6 w-6" />
                        <span className="sr-only">Notificações</span>
                    </Button>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="user avatar" />
                        <AvatarFallback>
                            <UserCircle className="h-10 w-10 text-muted-foreground" />
                        </AvatarFallback>
                    </Avatar>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}