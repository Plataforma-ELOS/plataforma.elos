
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UserCircle, Settings, Bookmark, Sun, LogOut, HelpCircle, User } from 'lucide-react';
import FeatureInProgress from '@/components/feature-in-progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Switch } from '../ui/switch';

const navItems = [
  { name: 'Notícias', href: '/noticias', isFeature: false },
  { name: 'Acervo Digital', href: '/acervo-digital', isFeature: false },
  { name: 'Comunidade', href: '/comunidade', isFeature: false },
  { name: 'Suporte IA', href: '/suporte-ia', isFeature: false },
  { name: 'Perfis Profissionais', href: '/profissionais', isFeature: false },
];

function UserProfileDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>
                        <UserCircle className="h-9 w-9 text-muted-foreground" />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                            <p className="font-semibold">Maria Silva</p>
                            <p className="text-xs text-muted-foreground font-normal">maria.silva@example.com</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <FeatureInProgress>
                        <DropdownMenuItem>
                            <User className="mr-2" />
                            <span>Meu Perfil</span>
                        </DropdownMenuItem>
                    </FeatureInProgress>
                     <FeatureInProgress>
                        <DropdownMenuItem>
                            <Bookmark className="mr-2" />
                            <span>Itens Salvos</span>
                        </DropdownMenuItem>
                    </FeatureInProgress>
                    <FeatureInProgress>
                        <DropdownMenuItem>
                            <Settings className="mr-2" />
                            <span>Configurações</span>
                        </DropdownMenuItem>
                    </FeatureInProgress>
                     <FeatureInProgress>
                        <DropdownMenuItem>
                            <HelpCircle className="mr-2" />
                            <span>Ajuda</span>
                        </DropdownMenuItem>
                    </FeatureInProgress>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                 <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                       <div className="flex justify-between items-center w-full">
                           <div className="flex items-center">
                             <Sun className="mr-2" />
                             <span>Alto Contraste</span>
                           </div>
                           <Switch id="accessibility-switch" />
                       </div>
                    </DropdownMenuItem>
                 </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <FeatureInProgress>
                    <DropdownMenuItem>
                        <LogOut className="mr-2" />
                        <span>Sair</span>
                    </DropdownMenuItem>
                </FeatureInProgress>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


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
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-foreground">Plataforma</span>
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              E.L.O.S
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => renderNavItem(item))}
        </nav>
        <div className="flex items-center gap-4">
            <div className="hidden md:inline-flex">
                 <UserProfileDropdown />
            </div>
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
                   <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
                    <span className="text-foreground">Plataforma</span>
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">E.L.O.S</span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-6 p-6 text-lg font-medium flex-1">
                  {navItems.map((item) => renderMobileNavItem(item))}
                </nav>
                 <div className="p-6 border-t">
                    <UserProfileDropdown />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
