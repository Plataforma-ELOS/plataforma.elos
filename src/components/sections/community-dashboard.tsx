import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, Zap, Calendar, Bookmark, MessageSquare, Send, Globe, Filter, Plus } from 'lucide-react';

const mainNav = [
  { icon: <Home className="h-5 w-5" />, name: 'Início', href: '#' },
  { icon: <Search className="h-5 w-5" />, name: 'Buscar', href: '#' },
  { icon: <Zap className="h-5 w-5" />, name: 'Destaques', href: '#' },
  { icon: <Calendar className="h-5 w-5" />, name: 'Eventos', href: '#' },
];

const userNav = [
    { icon: <Bookmark className="h-5 w-5" />, name: 'Salvos', href: '#' },
    { icon: <MessageSquare className="h-5 w-5" />, name: 'Conversas', href: '#' },
    { icon: <Send className="h-5 w-5" />, name: 'Postagens', href: '#' },
    { icon: <Globe className="h-5 w-5" />, name: 'Perto de mim', href: '#' },
];

const myConversations = [
  { 
    name: 'Mães umas pelas outras, sempre.', 
    created: 'Criado desde julho 2023',
    activity: 'Última atividade: 6h'
  },
    { 
    name: 'Mães umas pelas outras, sempre.', 
    created: 'Criado desde julho 2023',
    activity: 'Última atividade: 6h'
  },
    { 
    name: 'Mães umas pelas outras, sempre.', 
    created: 'Criado desde julho 2023',
    activity: 'Última atividade: 6h'
  },
];

export default function CommunityDashboard() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="w-64 flex-shrink-0 border-r bg-background p-4 flex flex-col justify-between">
        <div>
            <nav className="flex flex-col gap-2 mb-8">
              {mainNav.map((item) => (
                <Link key={item.name} href={item.href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-all hover:text-foreground hover:bg-primary/10 ${item.name === 'Início' ? 'bg-primary/10 text-foreground font-semibold' : ''}`}>
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            
            <div className="space-y-2">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase">Sobre mim</h3>
                 <nav className="flex flex-col gap-2">
                    {userNav.map((item) => (
                        <Link key={item.name} href={item.href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-all hover:text-foreground hover:bg-primary/10`}>
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                 </nav>
            </div>
        </div>
        <Button size="lg">Criar Grupo</Button>
      </aside>

      <main className="flex-1 p-8 relative">
        <div className="space-y-8">
            <div className="h-48 w-full rounded-2xl border bg-card"></div>
            <div className="grid grid-cols-4 gap-6">
                <div className="h-24 rounded-2xl border bg-card"></div>
                <div className="h-24 rounded-2xl border bg-card"></div>
                <div className="h-24 rounded-2xl border bg-card"></div>
                <div className="h-24 rounded-2xl border bg-card"></div>
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Minhas Conversas</h2>
                        <Button variant="ghost" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filtros
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <ul className="divide-y">
                                {myConversations.map((convo, index) => (
                                    <li key={index} className="flex items-center gap-4 p-4">
                                        <div className="h-12 w-12 rounded-full bg-muted"></div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{convo.name}</h3>
                                            <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                                                <span><Calendar className="inline-block mr-1 h-3 w-3" />{convo.created}</span>
                                                <span>{convo.activity}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-1">
                     <Card className="h-full flex items-center justify-center">
                        <CardContent className="text-center text-muted-foreground p-4">
                            <p>No planned events</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

        <Button className="absolute bottom-8 right-8 rounded-full h-16 w-16 shadow-lg" style={{backgroundColor: '#333333'}}>
            <span className="text-white font-bold text-2xl" style={{color: '#A892EA'}}>L</span>
        </Button>
      </main>
    </div>
  );
}
