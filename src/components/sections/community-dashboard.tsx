import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Users, Calendar, MessageSquare, PlusCircle, Settings, Search, Bell, ChevronRight, Star, Tag } from 'lucide-react';

const mainNav = [
  { icon: <Home className="h-5 w-5" />, name: 'Início', href: '#' },
  { icon: <Calendar className="h-5 w-5" />, name: 'Eventos', href: '#' },
  { icon: <Users className="h-5 w-5" />, name: 'Membros', href: '#' },
  { icon: <Settings className="h-5 w-5" />, name: 'Configurações', href: '#' },
];

const myCommunities = [
  { name: 'Dicas & Rotinas', newMessages: 5 },
  { name: 'Cuidando com Leveza', newMessages: 2 },
  { name: 'Desabafos sem Julgamentos' },
  { name: 'Pais de Primeira Viagem' },
];

const featuredGroups = [
    { 
        name: 'Grupo de Apoio a Pais de Adolescentes', 
        members: '1.2k membros', 
        image: 'https://placehold.co/400x200.png',
        hint: 'teenagers talking' 
    },
    { 
        name: 'Terapias Alternativas e Complementares', 
        members: '870 membros', 
        image: 'https://placehold.co/400x200.png',
        hint: 'yoga therapy'
    },
    { 
        name: 'Inclusão Escolar: Desafios e Vitórias', 
        members: '2.1k membros', 
        image: 'https://placehold.co/400x200.png',
        hint: 'children school'
    },
];

const recentConversations = [
    { 
        group: 'Dicas & Rotinas', 
        author: 'Ana P.', 
        text: 'Alguém tem alguma sugestão de app para organização de rotina visual?',
        avatar: 'https://placehold.co/40x40.png',
        hint: 'woman portrait',
        time: '5m atrás'
    },
    { 
        group: 'Desabafos sem Julgamentos', 
        author: 'Carlos M.', 
        text: 'Hoje foi um dia difícil. Me sentindo sobrecarregado...',
        avatar: 'https://placehold.co/40x40.png',
        hint: 'man portrait',
        time: '30m atrás'
    },
    { 
        group: 'Cuidando com Leveza', 
        author: 'Juliana S.', 
        text: 'Conseguimos nosso primeiro laudo! Uma vitória para comemorar!',
        avatar: 'https://placehold.co/40x40.png',
        hint: 'woman smiling',
        time: '1h atrás'
    },
]

export default function CommunityDashboard() {
  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 py-8 px-4 md:px-6">
      {/* Coluna da Esquerda - Navegação */}
      <aside className="lg:col-span-1 flex flex-col gap-8">
        <Card className="p-4">
          <CardHeader className="p-2 flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://placehold.co/100x100.png" alt="Avatar" data-ai-hint="user avatar" />
              <AvatarFallback>EU</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Bem-vindo(a)!</CardTitle>
              <CardDescription>Seu painel da comunidade</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <Button className="w-full" asChild>
              <Link href="#"><PlusCircle className="mr-2 h-4 w-4" /> Criar nova comunidade</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <nav className="flex flex-col gap-2">
              {mainNav.map((item) => (
                <Link key={item.name} href={item.href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-all hover:text-foreground hover:bg-primary/10 ${item.name === 'Início' ? 'bg-primary/10 text-foreground font-semibold' : ''}`}>
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-md">Minhas Comunidades</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <nav className="flex flex-col gap-2">
              {myCommunities.map((item) => (
                <Link key={item.name} href="#" className="flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-foreground/70 hover:bg-muted">
                  <span>{item.name}</span>
                  {item.newMessages && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{item.newMessages}</span>
                  )}
                </Link>
              ))}
            </nav>
          </CardContent>
        </Card>
      </aside>

      {/* Coluna da Direita - Conteúdo */}
      <div className="lg:col-span-3 flex flex-col gap-8">
        <Card className="bg-gradient-to-r from-primary/80 to-accent/80 text-white p-8 rounded-2xl flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold">Participe, conecte-se e cresça!</h2>
                <p className="max-w-lg mt-2">Sua jornada é única, mas você não precisa percorrê-la sozinho(a).</p>
            </div>
            <Button variant="secondary" className="rounded-full">Explore os grupos</Button>
        </Card>

        <div>
          <h3 className="text-2xl font-bold mb-4">Grupos em Destaque</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGroups.map((group, index) => (
              <Card key={index} className="overflow-hidden group">
                <Image src={group.image} alt={group.name} width={400} height={200} className="w-full h-32 object-cover" data-ai-hint={group.hint} />
                <CardContent className="p-4">
                  <h4 className="font-semibold text-md group-hover:text-primary transition-colors">{group.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{group.members}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold mb-4">Conversas Recentes</h3>
          <Card>
            <CardContent className="p-0">
                <ul className="divide-y">
                    {recentConversations.map((convo, index) => (
                         <li key={index} className="flex items-start gap-4 p-4 hover:bg-muted/50">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={convo.avatar} alt={convo.author} data-ai-hint={convo.hint} />
                                <AvatarFallback>{convo.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-baseline justify-between">
                                    <p>
                                        <span className="font-semibold">{convo.author}</span>
                                        <span className="text-sm text-muted-foreground"> postou em </span>
                                        <span className="font-semibold text-primary">{convo.group}</span>
                                    </p>
                                    <span className="text-xs text-muted-foreground">{convo.time}</span>
                                </div>
                                <p className="text-sm text-foreground/90 mt-1">{convo.text}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground">
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                         </li>
                    ))}
                </ul>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
