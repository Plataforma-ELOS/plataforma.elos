import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Bell, FileEdit, FolderKanban, HeartHandshake, Home, MessageSquare, PlusCircle, Search, Settings, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const overviewItems = [
    { icon: <Users className="h-6 w-6 text-primary" />, value: "128", label: "Membros online" },
    { icon: <FileEdit className="h-6 w-6 text-primary" />, value: "42", label: "Novos posts hoje" },
    { icon: <HeartHandshake className="h-6 w-6 text-primary" />, value: "31", label: "Suas conexões" },
];

const recentActivity = [
    {
        category: "Dicas & Rotinas",
        title: "Estratégias para lidar com a seletividade alimentar.",
        author: "Ana P.",
        avatar: "https://placehold.co/32x32.png",
        hint: "woman face",
    },
    {
        category: "Desabafos sem julgamentos",
        title: "Como vocês lidam com o cansaço extremo no fim do dia?",
        author: "Carlos M.",
        avatar: "https://placehold.co/32x32.png",
        hint: "man face",
    },
    {
        category: "Cuidando com leveza",
        title: "Pequenas vitórias de hoje: conseguimos um novo avanço!",
        author: "Juliana S.",
        avatar: "https://placehold.co/32x32.png",
        hint: "woman portrait",
    }
];


export default function CommunityPage() {
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-card lg:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <span className="text-xl font-bold text-primary">E.L.O.S</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-sm font-medium">
                             <Button variant="default" className="flex items-center gap-3 rounded-lg px-3 py-2 mb-4">
                                <PlusCircle className="h-4 w-4"/>
                                Criar novo post
                            </Button>
                            <Link href="#" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary">
                                <Home className="h-4 w-4" />
                                Painel
                            </Link>
                            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <FolderKanban className="h-4 w-4" />
                                Fóruns
                            </Link>
                            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <MessageSquare className="h-4 w-4" />
                                Mensagens
                            </Link>
                             <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <Settings className="h-4 w-4" />
                                Configurações
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-card px-6">
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="search" placeholder="Buscar nos fóruns..." className="w-full bg-background shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3" />
                            </div>
                        </form>
                    </div>
                     <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notificações</span>
                    </Button>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="user avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <Card className="bg-primary/10 border-0 shadow-none">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <h2 className="text-3xl font-bold">Olá, cuidador(a)!</h2>
                                <p className="text-muted-foreground">Pronto(a) para se conectar com a comunidade?</p>
                            </div>
                            <Image src="https://placehold.co/200x150.png" width={200} height={150} alt="Ilustração da comunidade" data-ai-hint="community illustration" className="rounded-lg hidden sm:block" />
                        </CardContent>
                    </Card>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Visão Geral</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            {overviewItems.map((item, index) => (
                                <Card key={index}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                                        {item.icon}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{item.value}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <Card key={index} className="p-4">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarImage src={activity.avatar} alt={activity.author} data-ai-hint={activity.hint} />
                                            <AvatarFallback>{activity.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="w-full">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-primary">{activity.category}</p>
                                            </div>
                                            <Link href="#" className="text-base font-semibold hover:underline">{activity.title}</Link>
                                            <p className="text-xs text-muted-foreground">postado por {activity.author}</p>
                                        </div>
                                         <Button variant="outline" size="sm">Ver post</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}