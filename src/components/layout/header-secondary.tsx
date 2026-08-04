
"use client";

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Bell, UserCircle, Bookmark, Settings, Sun, LogOut, HelpCircle, User, Moon, CaseLower, CaseUpper, CaseSensitive, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '../ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { AuthContext, FontSizeContext } from '@/components/common/providers';
import { useUnreadNotificationsCount } from '@/hooks/use-unread-notifications';
import Image from 'next/image';
import imagesData from '@/lib/data/placeholder-images.json';

function NotificationBell() {
  const { user } = useContext(AuthContext);
  const naoLidas = useUnreadNotificationsCount(user?.id ?? null);

  if (!user) return null;

  return (
    <Button variant="ghost" size="icon" className="relative group" asChild>
      <Link href="/notificacoes">
        <Bell className="h-6 w-6 group-hover:animate-ring" />
        {naoLidas > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
            {naoLidas > 9 ? '9+' : naoLidas}
          </span>
        )}
        <span className="sr-only">Notificações</span>
      </Link>
    </Button>
  );
}


const navItems = [
  { name: 'Notícias', href: '/noticias' },
  { name: 'Acervo Digital', href: '/acervo-digital' },
  { name: 'Comunidade', href: '/comunidade' },
  { name: 'Suporte IA', href: '/suporte-ia' },
  { name: 'Perfis Profissionais', href: '/profissionais' },
  { name: 'Fale Conosco', href: '/fale-conosco' },
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
                                 <DropdownMenuRadioGroup value={fontSize} onValueChange={(value) => setFontSize(value as 'sm' | 'base' | 'lg')}>
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
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage src="https://placehold.co/48x48.png" alt="Avatar" data-ai-hint="user-generic-avatar" />
                    <AvatarFallback>
                        {user.name.charAt(0)}
                    </AvatarFallback>
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
                    <DropdownMenuItem asChild>
                        <Link href="/perfil">
                            <Edit className="mr-2" />
                            <span>Editar Perfil</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/salvos">
                            <Bookmark className="mr-2" />
                            <span>Itens Salvos</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/configuracoes">
                            <Settings className="mr-2" />
                            <span>Configurações</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/faq">
                            <HelpCircle className="mr-2" />
                            <span>Ajuda</span>
                        </Link>
                    </DropdownMenuItem>
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
                             <DropdownMenuRadioGroup value={fontSize} onValueChange={(value) => setFontSize(value as 'sm' | 'base' | 'lg')}>
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
    );
}


export default function HeaderSecondary() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isCurrentPage = (href: string) => pathname === href;

  const renderNavItem = (item: typeof navItems[0], onNavigate?: () => void) => {
    const classNames = `text-foreground/80 hover:text-foreground transition-colors ${isCurrentPage(item.href) ? 'font-bold text-foreground' : ''}`;
    return (
      <Link href={item.href} key={item.name} className={classNames} onClick={onNavigate}>
        {item.name}
      </Link>
    );
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-sm shadow-sm' : 'bg-background'}`}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                    <Image src={imagesData.logo.url} alt="Logo Elos" width={40} height={40} className="rounded-full" data-ai-hint={imagesData.logo.hint} />
                    <span className="text-foreground">Plataforma</span>
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">E.L.O.S</span>
                </Link>
            </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => renderNavItem(item))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden md:inline-flex">
            <NotificationBell />
          </div>
          <div className="hidden md:inline-flex">
            <UserProfileDropdown />
          </div>
          <Sheet open={menuAberto} onOpenChange={setMenuAberto}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background p-0">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                   <Link href="/" className="flex items-center gap-2 text-2xl font-bold" onClick={() => setMenuAberto(false)}>
                        <Image src={imagesData.logo.url} alt="Logo Elos" width={40} height={40} className="rounded-full" data-ai-hint={imagesData.logo.hint} />
                        <span className="text-foreground">Plataforma</span>
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">E.L.O.S</span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-6 p-6 text-lg font-medium flex-1">
                  {navItems.map((item) => renderNavItem(item, () => setMenuAberto(false)))}
                </nav>
                 <div className="p-6 border-t flex items-center justify-center gap-4">
                    <NotificationBell />
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
