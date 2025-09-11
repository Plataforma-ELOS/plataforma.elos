
"use client";

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UserCircle, Settings, Bookmark, Sun, LogOut, HelpCircle, User, Moon, Laptop, CaseSensitive, CaseUpper, CaseLower, Edit } from 'lucide-react';
import FeatureInProgress from '@/components/feature-in-progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useTheme } from 'next-themes';
import { AuthContext, FontSizeContext } from '../providers';
import Image from 'next/image';

const navItems = [
  { name: 'Notícias', href: '/noticias', isFeature: false },
  { name: 'Acervo Digital', href: '/acervo-digital', isFeature: false },
  { name: 'Comunidade', href: '/comunidade', isFeature: false },
  { name: 'Suporte IA', href: '/suporte-ia', isFeature: false },
  { name: 'Perfis Profissionais', href: '/profissionais', isFeature: false },
  { name: 'Fale Conosco', href: '/fale-conosco', isFeature: false },
];

function UserProfileDropdown() {
    const { setTheme } = useTheme();
    const { fontSize, setFontSize } = useContext(FontSizeContext);
    const { user, logout } = useContext(AuthContext);

    if (!user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <UserCircle className="h-6 w-6 text-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuLabel>
                        <p className="font-semibold">Minha Conta</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/login">
                            <LogOut className="mr-2" />
                            <span>Fazer Login</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/cadastro">
                            <User className="mr-2" />
                            <span>Criar Conta</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span>Tema</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    <Sun className="mr-2" />
                                    Claro
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    <Moon className="mr-2" />
                                    Escuro
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <CaseSensitive className="mr-2" />
                                <span>Tamanho do Texto</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={fontSize} onValueChange={setFontSize}>
                                    <DropdownMenuRadioItem value="sm">
                                        <CaseLower className="mr-2"/>
                                        Pequeno
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="base">
                                        <CaseSensitive className="mr-2"/>
                                        Normal
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="lg">
                                        <CaseUpper className="mr-2"/>
                                        Grande
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    // Menu for logged-in user
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage src="https://i.ibb.co/GQytCWPj/ELOS-Projeto-Integrador-PI.jpg" alt="Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <FeatureInProgress>
                        <DropdownMenuItem>
                            <Edit className="mr-2" />
                            <span>Editar Perfil</span>
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
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span>Tema</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                <Sun className="mr-2" />
                                Claro
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <Moon className="mr-2" />
                                Escuro
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <CaseSensitive className="mr-2" />
                            <span>Tamanho do Texto</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                             <DropdownMenuRadioGroup value={fontSize} onValueChange={setFontSize}>
                                <DropdownMenuRadioItem value="sm">
                                    <CaseLower className="mr-2"/>
                                    Pequeno
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="base">
                                    <CaseSensitive className="mr-2"/>
                                    Normal
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="lg">
                                    <CaseUpper className="mr-2"/>
                                    Grande
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                 </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2" />
                    <span>Sair</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
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
        <Link href="/home" className="flex items-center gap-2 text-2xl font-bold">
          <Image src="https://i.ibb.co/GQytCWPj/ELOS-Projeto-Integrador-PI.jpg" width={40} height={40} alt="Logo" className="rounded-full" />
          <span className="text-foreground">Plataforma</span>
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              E.L.O.S
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => renderNavItem(item))}
        </nav>
        <div className="flex items-center gap-4">
            <div className="hidden md:flex">
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
                   <Link href="/home" className="flex items-center gap-2 text-2xl font-bold">
                    <Image src="https://i.ibb.co/GQytCWPj/ELOS-Projeto-Integrador-PI.jpg" width={40} height={40} alt="Logo" className="rounded-full" />
                    <span className="text-foreground">Plataforma</span>
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">E.L.O.S</span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-6 p-6 text-lg font-medium flex-1">
                  {navItems.map((item) => renderMobileNavItem(item))}
                </nav>
                 <div className="p-6 border-t flex items-center justify-center">
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

    
