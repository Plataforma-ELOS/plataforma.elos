"use client";

import { useState, useContext, useEffect, useCallback } from 'react';
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
import { createClient } from '@/utils/supabase/client';
import { alternarCurtida, alternarSalvo, comentar, excluirPost } from '@/app/actions/community';

// Eventos ainda não têm tela de cadastro própria — mantidos como conteúdo
// fixo por enquanto. A tabela "events" já existe no banco para quando
// alguém quiser ligar isso de verdade.
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

function tempoRelativo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const carregarPosts = useCallback(async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('posts')
      .select(`
        id, content, created_at, author_id,
        author:profiles!posts_author_id_fkey ( full_name, avatar_url ),
        post_likes ( profile_id ),
        post_saves ( profile_id ),
        comments (
          id, content, created_at,
          author:profiles!comments_author_id_fkey ( full_name, avatar_url )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[comunidade] erro ao buscar posts:', error.message);
      setCarregando(false);
      return;
    }

    const { data: { user: usuarioAtual } } = await supabase.auth.getUser();

    const postsFormatados: Post[] = (data ?? []).map((p: any) => {
      const likes = p.post_likes ?? [];
      const saves = p.post_saves ?? [];
      const comentarios = (p.comments ?? [])
        .sort((a: any, b: any) => a.created_at.localeCompare(b.created_at))
        .map((c: any) => ({
          id: c.id,
          content: c.content,
          time: tempoRelativo(c.created_at),
          author: {
            name: c.author?.full_name ?? 'Usuário',
            avatarUrl: c.author?.avatar_url ?? 'https://placehold.co/40x40.png',
            hint: 'user avatar',
          },
        }));

      return {
        id: p.id,
        author: {
          name: p.author?.full_name ?? 'Usuário',
          avatarUrl: p.author?.avatar_url ?? 'https://placehold.co/48x48.png',
          hint: 'user avatar',
          // O e-mail não fica em "profiles" (fica em auth.users, que não é
          // consultável do client). PostCard usa "email" só para saber se
          // o post é do usuário logado — troco por comparação de id aqui.
          email: p.author_id === usuarioAtual?.id ? (usuarioAtual?.email ?? '') : `__${p.author_id}`,
        },
        time: tempoRelativo(p.created_at),
        content: p.content,
        likes: likes.length,
        commentCount: comentarios.length,
        isSaved: !!usuarioAtual && saves.some((s: any) => s.profile_id === usuarioAtual.id),
        likedByMe: !!usuarioAtual && likes.some((l: any) => l.profile_id === usuarioAtual.id),
        comments: comentarios,
      };
    });

    setPosts(postsFormatados);
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregarPosts();
  }, [carregarPosts]);

  const handleToggleSave = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, isSaved: !post.isSaved } : post
    ));
    alternarSalvo(postId);
  };

  const handleToggleLike = (postId: string) => {
    alternarCurtida(postId);
  };

  const handleAddComment = (postId: string, content: string) => {
    comentar(postId, content);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
    excluirPost(postId);
  };

  const handleProtectedAction = () => {
    router.push('/login');
  };

  const renderContent = () => {
    if (carregando) {
      return <p className="text-muted-foreground text-center py-8">Carregando posts...</p>;
    }
    if (posts.length === 0) {
      return <p className="text-muted-foreground text-center py-8">Ainda não há posts. Seja o primeiro a compartilhar algo!</p>;
    }
    const featuredPosts = [...posts].sort((a, b) => b.likes - a.likes);
    return (
      <div className="space-y-6 animate-in fade-in-0 duration-500">
        {featuredPosts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onToggleSave={handleToggleSave} 
            onDelete={handleDeletePost}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
            currentUser={user}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <HeaderSecondary />
      <main className="flex-1 pt-8 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Cabeçalho alinhado à esquerda */}
          <div className="text-left space-y-2 mb-8">
            <h1 className="text-4xl font-bold text-primary dark:text-foreground font-headline">
              Posts em Destaque
            </h1>
            <p  className="text-muted-foreground">
              As conversas mais populares da comunidade no momento.
            </p>
          </div>

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
