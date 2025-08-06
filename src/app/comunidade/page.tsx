
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell, CalendarDays, MessageSquare, Plus, Search, Send, MapPin, Bookmark, Star, Home, Filter, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const sidebarNav = [
    { name: 'Painel', icon: <Home className="h-5 w-5" /> },
    { name: 'Fóruns', icon: <MessageSquare className="h-5 w-5" /> },
    { name: 'Mensagens', icon: <Send className="h-5 w-5" /> },
    { name: 'Configurações', icon: <Star className="h-5 w-5" /> },
];

const conversations = [
    {
        title: "Mães umas pelas outras, sempre.",
        activity: "Última atividade: 6h",
        avatar: "https://placehold.co/40x40.png",
        hint: "group avatar",
    },
    {
        title: "Dicas de terapias alternativas",
        activity: "Última atividade: 12h",
        avatar: "https://placehold.co/40x40.png",
        hint: "group icon",
    },
    {
        title: "Grupo de pais de adolescentes com TEA",
        activity: "Última atividade: 1d",
        avatar: "https://placehold.co/40x40.png",
        hint: "community logo",
    }
];


function CommunityDashboard() {
    const isMobile = useIsMobile();
    return (
        <div className="flex flex-col h-full w-full bg-background">
             <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                 {isMobile && (
                    <SidebarTrigger>
                        <Menu />
                    </SidebarTrigger>
                )}
                <h1 className="text-xl font-semibold">Comunidade</h1>
                <div className="relative ml-auto flex-1 md:grow-0">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input type="search" placeholder="Buscar..." className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px] h-9" />
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notificações</span>
                </Button>
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>L</AvatarFallback>
                </Avatar>
            </header>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                <Card className="h-48 bg-cover bg-center flex items-end p-6" style={{backgroundImage: "url('https://placehold.co/800x200.png')"}}>
                    <div className="bg-black/50 p-4 rounded-lg">
                        <h2 className="text-2xl font-bold text-white">Bem-vinda de volta, L.</h2>
                        <p className="text-white/90">Sua comunidade sentiu sua falta.</p>
                    </div>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Membros Online</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">12</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Novos Posts Hoje</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">45</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Suas Conexões</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">8</p>
                        </CardContent>
                    </Card>
                </div>
                
                <div>
                    <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
                     <div className="space-y-4">
                        {conversations.map((convo, index) => (
                            <Card key={index} className="p-4 bg-card">
                                <div className="flex items-center gap-4">
                                     <Avatar className="h-10 w-10">
                                        <AvatarImage src={convo.avatar} alt="Avatar do grupo" data-ai-hint={convo.hint} />
                                        <AvatarFallback>{convo.title.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="w-full">
                                        <div className="flex justify-between items-center">
                                            <Link href="#" className="font-semibold hover:underline">{convo.title}</Link>
                                            <span className="text-xs text-muted-foreground">{convo.activity}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    )
}


export default function CommunityPage() {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="https://placehold.co/32x32.png" alt="Logo Elos" width={32} height={32} data-ai-hint="logo" />
                        <span className="text-xl font-bold text-primary">E.L.O.S</span>
                    </Link>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                         <SidebarMenuItem>
                            <Button className="w-full justify-start">
                                <Plus className="mr-2 h-4 w-4" />
                                Criar novo post
                            </Button>
                        </SidebarMenuItem>
                        <SidebarGroup>
                            <SidebarMenu>
                                {sidebarNav.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton isActive={item.name === 'Painel'}>
                                         {item.icon}
                                        <span>{item.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                     <Separator className="my-2" />
                     <div className="flex items-center gap-3 p-2">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="user avatar" />
                            <AvatarFallback>L</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">L.</p>
                            <p className="text-xs text-muted-foreground">Ver perfil</p>
                        </div>
                    </div>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <CommunityDashboard />
            </SidebarInset>
        </SidebarProvider>
    );
}
