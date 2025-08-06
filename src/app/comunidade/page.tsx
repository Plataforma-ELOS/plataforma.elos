import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Bell, CalendarDays, MessageSquare, Plus, Search, Send, MapPin, Bookmark, Star, Home, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


const sidebarNav = [
    { name: 'Início', icon: <Home className="h-5 w-5" /> },
    { name: 'Buscar', icon: <Search className="h-5 w-5" /> },
    { name: 'Destaques', icon: <Star className="h-5 w-5" /> },
    { name: 'Eventos', icon: <CalendarDays className="h-5 w-5" /> },
];

const userNav = [
    { name: 'Salvos', icon: <Bookmark className="h-5 w-5" /> },
    { name: 'Conversas', icon: <MessageSquare className="h-5 w-5" /> },
    { name: 'Postagens', icon: <Send className="h-5 w-5" /> },
    { name: 'Perto de mim', icon: <MapPin className="h-5 w-5" /> },
]

const conversations = [
    {
        title: "Mães umas pelas outras, sempre.",
        created: "Criado desde julho 2023",
        activity: "Última atividade: 6h",
        avatar: "https://placehold.co/40x40.png",
        hint: "group avatar",
    },
    {
        title: "Dicas de terapias alternativas",
        created: "Criado desde maio 2023",
        activity: "Última atividade: 12h",
        avatar: "https://placehold.co/40x40.png",
        hint: "group icon",
    },
    {
        title: "Grupo de pais de adolescentes com TEA",
        created: "Criado desde janeiro 2023",
        activity: "Última atividade: 1d",
        avatar: "https://placehold.co/40x40.png",
        hint: "community logo",
    }
];


export default function CommunityPage() {
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-card lg:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link href="/" className="flex items-center gap-3 font-semibold">
                            <Image src="https://placehold.co/32x32.png" alt="Logo Elos" width={32} height={32} data-ai-hint="logo" />
                            <span className="text-xl font-bold text-primary">E.L.O.S</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-4">
                        <nav className="grid items-start px-4 text-sm font-medium gap-1 mb-4">
                            {sidebarNav.map((item) => (
                                <Link key={item.name} href="#" className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${item.name === 'Início' ? 'text-primary bg-muted' : 'text-muted-foreground'}`}>
                                    {item.icon}
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                        <Separator className="my-4" />
                         <div className="px-4 mb-2">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase">Sobre mim</h3>
                        </div>
                         <nav className="grid items-start px-4 text-sm font-medium gap-1">
                            {userNav.map((item) => (
                                <Link key={item.name} href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                    {item.icon}
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-auto p-4">
                         <Button size="lg" className="w-full">
                            Criar Grupo
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col relative">
                <header className="flex h-14 lg:h-[60px] items-center justify-end gap-4 border-b bg-card px-6">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notificações</span>
                    </Button>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="user avatar" />
                        <AvatarFallback>L</AvatarFallback>
                    </Avatar>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="grid gap-6">
                        <Card className="h-[200px] bg-muted/40 flex items-center justify-center">
                            <p className="text-muted-foreground">Card de Destaque</p>
                        </Card>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <Card className="h-[100px] bg-muted/40 flex items-center justify-center"><p className="text-muted-foreground text-sm">Grupo 1</p></Card>
                            <Card className="h-[100px] bg-muted/40 flex items-center justify-center"><p className="text-muted-foreground text-sm">Grupo 2</p></Card>
                            <Card className="h-[100px] bg-muted/40 flex items-center justify-center"><p className="text-muted-foreground text-sm">Grupo 3</p></Card>
                            <Card className="h-[100px] bg-muted/40 flex items-center justify-center"><p className="text-muted-foreground text-sm">Grupo 4</p></Card>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold">Minhas Conversas</h2>
                                    <Button variant="outline" size="sm">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filtros
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                {conversations.map((convo, index) => (
                                    <Card key={index} className="p-4">
                                        <div className="flex items-center gap-4">
                                             <Avatar className="h-10 w-10">
                                                <AvatarImage src={convo.avatar} alt="Avatar do grupo" data-ai-hint={convo.hint} />
                                                <AvatarFallback>{convo.title.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="w-full">
                                                <Link href="#" className="font-semibold hover:underline">{convo.title}</Link>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                                    <span>{convo.created}</span>
                                                    <span>{convo.activity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                                </div>
                            </div>
                            <div className="md:col-span-1">
                                 <Card className="h-full">
                                    <CardHeader>
                                        <CardTitle>Eventos Planejados</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-center h-48">
                                        <p className="text-muted-foreground">Nenhum evento planejado</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
                <Button className="absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-lg">
                    <Plus className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
}
