
"use client";

import { useState, useContext } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Plus, BookOpen, LogIn } from 'lucide-react';
import PostCard, { Post } from '@/components/community/post-card';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/components/providers';

const initialPosts: Post[] = [
  {
    id: 'post-1',
    author: {
      name: 'Carlos Souza',
      avatarUrl: 'https://placehold.co/40x40.png',
      hint: 'man portrait',
      email: 'carlos.souza@example.com',
    },
    time: '5h',
    content: 'Queria compartilhar uma vitória! 🎉 Hoje conseguimos fazer um passeio no parque sem nenhuma crise de sobrecarga sensorial. Usamos os fones de ouvido com cancelamento de ruído e foi um sucesso. Pequenos passos que significam muito!',
    likes: 35,
    commentCount: 2,
    isSaved: false,
     comments: [
      { id: 'c1-1', author: { name: 'Mariana', avatarUrl: 'https://placehold.co/40x40.png', hint: 'woman portrait' }, time: '4h', content: 'Que demais, Carlos! Fico muito feliz por vocês! 🎉' },
      { id: 'c1-2', author: { name: 'Admin Elos', avatarUrl: 'https://placehold.co/40x40.png', hint: 'logo' }, time: '4h', content: 'Incrível! Compartilhar essas vitórias inspira toda a comunidade. Obrigado!' },
    ],
  },
  {
    id: 'post-2',
    author: {
      name: 'Ana Silva',
      avatarUrl: 'https://placehold.co/40x40.png',
      hint: 'woman portrait',
      email: 'ana.silva@example.com',
    },
    time: '2h',
    content: 'Olá pessoal! Alguém tem dicas de como lidar com a seletividade alimentar? Meu filho só quer comer as mesmas 3 coisas e estou ficando sem ideias. Qualquer ajuda é bem-vinda! 🙏',
    likes: 12,
    commentCount: 5,
    isSaved: true,
    comments: [
       { id: 'c2-1', author: { name: 'Pedro', avatarUrl: 'https://placehold.co/40x40.png', hint: 'man portrait' }, time: '1h', content: 'Estou passando pelo mesmo, Ana. Muita paciência e tentando apresentar os alimentos de formas diferentes.' },
       { id: 'c2-2', author: { name: 'Juliana', avatarUrl: 'https://placehold.co/40x40.png', hint: 'woman portrait' }, time: '1h', content: 'Uma dica que funcionou foi envolver meu filho no preparo da comida. Ele ficou mais curioso para provar!' },
    ],
  },
   {
    id: 'post-3',
    author: {
      name: 'Admin Elos',
      avatarUrl: 'https://placehold.co/40x40.png',
      hint: 'woman portrait',
      email: 'admin@elos.com.br'
    },
    time: '1d',
    content: 'Alguém aqui já passou pelo processo de solicitação do BPC? Comecei a juntar os papéis e parece uma montanha de coisas. Se alguém tiver um checklist ou alguma dica, agradeceria muito!',
    likes: 48,
    commentCount: 15,
    isSaved: false,
     comments: [],
  },
];

const allCommunityEvents = [
  {
    title: 'Workshop Online: Introdução à Comunicação Alternativa',
    date: '25 de Agosto de 2024 - 19:00',
    description: 'Aprenda os conceitos básicos e as primeiras estratégias para implementar a comunicação alternativa e aumentativa (CAA) no dia a dia. Evento gratuito e aberto a todos.',
    type: 'Online',
  },
  {
    title: 'Roda de Conversa: Lidando com a Seletividade Alimentar',
    date: '02 de Setembro de 2024 - 18:00',
    description: 'Um encontro para troca de experiências e dicas práticas sobre como ampliar o repertório alimentar das crianças com TEA, com mediação de uma nutricionista convidada.',
    type: 'Online',
  },
  {
    title: 'Encontro no Parque: Piquenique Inclusivo em São Paulo',
    date: '14 de Setembro de 2024 - 10:00',
    description: 'Vamos nos encontrar para uma manhã de socialização e diversão ao ar livre no Parque Ibirapuera. Traga sua toalha, um lanche e venha fazer parte!',
    type: 'Presencial',
  },
  {
    title: 'Palestra: Direitos da Pessoa com TEA no Mercado de Trabalho',
    date: '20 de Setembro de 2024 - 20:00',
    description: 'Conheça a legislação e tire suas dúvidas sobre a inclusão de pessoas com autismo no ambiente profissional.',
    type: 'Online',
  },
];

function LoginRequiredDialog({ children, onConfirm }: { children: React.ReactNode, onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
            <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <LogIn className="h-10 w-10 text-primary" />
                </div>
            </div>
          <AlertDialogTitle className="text-center">Acesso Restrito</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Para acessar esta funcionalidade e interagir com a comunidade, você precisa fazer login ou criar uma conta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel>Agora não</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Fazer Login
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const handleToggleSave = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };
  
  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleProtectedAction = () => {
    router.push('/login');
  };

  const renderContent = () => {
    const featuredPosts = [...posts].sort((a, b) => b.likes - a.likes);
    return (
      <div className="space-y-6 animate-in fade-in-0 duration-500">
        <h2 className="text-2xl font-bold">Posts em Destaque</h2>
        <p className="text-muted-foreground">As conversas mais populares da comunidade no momento.</p>
        {featuredPosts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onToggleSave={handleToggleSave} 
            onDelete={handleDeletePost}
            currentUser={user}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <HeaderSecondary />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Coluna Principal do Feed */}
                <div className="lg:col-span-2">
                  {renderContent()}
                </div>

                {/* Barra Lateral */}
                <div className="space-y-8 lg:sticky top-24">
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Próximos Eventos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {(showAllEvents ? allCommunityEvents : allCommunityEvents.slice(0, 2)).map((event, index) => (
                                <div key={index}>
                                    <h4 className="font-semibold text-sm">{event.title}</h4>
                                    <p className="text-xs text-muted-foreground">{event.date}</p>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setShowAllEvents(!showAllEvents)}>
                                {showAllEvents ? 'Ver menos eventos' : 'Ver todos os eventos'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Meus Grupos</CardTitle>
                             <CardDescription>Participe de conversas focadas em seus interesses.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {user ? (
                                <Button className="w-full" asChild>
                                    <Link href="/comunidade/meus-grupos">Ver meus grupos</Link>
                                </Button>
                            ) : (
                                <LoginRequiredDialog onConfirm={handleProtectedAction}>
                                    <Button className="w-full">
                                        Ver meus grupos
                                    </Button>
                                </LoginRequiredDialog>
                            )}
                            
                            {user ? (
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/comunidade/criar-grupo">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Criar um Grupo
                                    </Link>
                                </Button>
                            ) : (
                                <LoginRequiredDialog onConfirm={handleProtectedAction}>
                                    <Button variant="outline" className="w-full">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Criar um Grupo
                                    </Button>
                                </LoginRequiredDialog>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
