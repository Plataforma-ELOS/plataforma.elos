"use client";

import { useState, useContext, useEffect, useCallback } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Plus, BookOpen, LogIn, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PostCard, { Post } from '@/components/features/community/post-card';
import CreatePost from '@/components/features/community/create-post';
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
import { AuthContext } from '@/components/common/providers';
import { createClient } from '@/lib/supabase/client';
import { alternarCurtida, alternarSalvo, comentar, criarPost, editarPost, excluirPost } from '@/app/actions/community';
import { criarEvento } from '@/app/actions/events';
import { mapEventRow, type EventData, type EventRow } from '@/lib/data/events';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type PostRow = {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  author: { full_name: string | null; avatar_url: string | null } | null;
  post_likes: { profile_id: string }[] | null;
  post_saves: { profile_id: string }[] | null;
  comments: {
    id: string;
    content: string;
    created_at: string;
    author: { full_name: string | null; avatar_url: string | null } | null;
  }[] | null;
};

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

function CreateEventDialog({ onCreated }: { onCreated: () => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [type, setType] = useState<'online' | 'presencial'>('online');
  const [location, setLocation] = useState('');
  const [criando, setCriando] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCriando(true);
    const { ok, erro } = await criarEvento(title, description, startsAt, type, location);
    setCriando(false);

    if (!ok) {
      toast({ variant: 'destructive', title: 'Não foi possível criar o evento', description: erro });
      return;
    }

    toast({ title: 'Evento criado com sucesso!' });
    setTitle('');
    setDescription('');
    setStartsAt('');
    setLocation('');
    setOpen(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Criar Evento
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Evento</DialogTitle>
          <DialogDescription>Divulgue um evento para a comunidade.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Título</Label>
              <Input id="event-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">Descrição</Label>
              <Textarea id="event-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-starts-at">Data e hora</Label>
              <Input id="event-starts-at" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-type">Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as 'online' | 'presencial')}>
                <SelectTrigger id="event-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {type === 'presencial' && (
              <div className="space-y-2">
                <Label htmlFor="event-location">Local</Label>
                <Input id="event-location" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={criando}>{criando ? 'Criando...' : 'Criar Evento'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<EventData | null>(null);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const carregarEventos = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('events')
      .select('id, title, description, starts_at, type, location')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true });

    if (error) {
      console.error('[comunidade] erro ao buscar eventos:', error.message);
      return;
    }

    setEvents(((data ?? []) as unknown as EventRow[]).map(mapEventRow));
  }, []);

  useEffect(() => {
    carregarEventos();
  }, [carregarEventos]);

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

    const postsFormatados: Post[] = ((data ?? []) as unknown as PostRow[]).map((p) => {
      const likes = p.post_likes ?? [];
      const saves = p.post_saves ?? [];
      const comentarios = (p.comments ?? [])
        .sort((a, b) => a.created_at.localeCompare(b.created_at))
        .map((c) => ({
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
        isSaved: !!usuarioAtual && saves.some((s) => s.profile_id === usuarioAtual.id),
        likedByMe: !!usuarioAtual && likes.some((l) => l.profile_id === usuarioAtual.id),
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

  const handleEditPost = async (postId: string, content: string) => {
    const resultado = await editarPost(postId, content);
    if (resultado.ok) {
      setPosts((atual) => atual.map((post) => (post.id === postId ? { ...post, content } : post)));
    }
    return resultado;
  };

  const handleCreatePost = async (content: string) => {
    const texto = content.trim();
    if (!texto) return;
    const { ok, erro } = await criarPost(texto);
    if (!ok) {
      console.error('[comunidade] erro ao criar post:', erro);
      return;
    }
    // Recarrega para exibir o post recém-criado já com id/autor reais.
    await carregarPosts();
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
            onEditPost={handleEditPost}
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
            <div className="lg:col-span-2 space-y-6">
              {user ? (
                <CreatePost onCreatePost={handleCreatePost} />
              ) : (
                <LoginRequiredDialog onConfirm={handleProtectedAction}>
                  <button
                    type="button"
                    className="w-full text-left bg-card p-4 rounded-2xl shadow-lg border text-muted-foreground hover:border-primary transition-colors"
                  >
                    Entre para compartilhar algo com a comunidade…
                  </button>
                </LoginRequiredDialog>
              )}
              {renderContent()}
            </div>

            {/* Barra Lateral */}
            <div className="space-y-8 lg:sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Próximos Eventos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {events.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum evento agendado no momento.</p>
                  ) : (
                    (showAllEvents ? events : events.slice(0, 2)).map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        className="block w-full text-left rounded-md -mx-2 px-2 py-1 hover:bg-muted transition-colors"
                        onClick={() => setEventoSelecionado(event)}
                      >
                        <h4 className="font-semibold text-sm">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </button>
                    ))
                  )}
                  {events.length > 2 && (
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setShowAllEvents(!showAllEvents)}>
                      {showAllEvents ? 'Ver menos eventos' : 'Ver todos os eventos'}
                    </Button>
                  )}
                  {user ? (
                    <CreateEventDialog onCreated={carregarEventos} />
                  ) : (
                    <LoginRequiredDialog onConfirm={handleProtectedAction}>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Evento
                      </Button>
                    </LoginRequiredDialog>
                  )}
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

      <Dialog open={!!eventoSelecionado} onOpenChange={(open) => !open && setEventoSelecionado(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{eventoSelecionado?.title}</DialogTitle>
            <DialogDescription className="sr-only">Detalhes do evento</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Badge variant="secondary">{eventoSelecionado?.type}</Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{eventoSelecionado?.date}</span>
            </div>
            {eventoSelecionado?.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{eventoSelecionado.location}</span>
              </div>
            )}
            <p className="text-sm text-foreground/90 whitespace-pre-wrap">{eventoSelecionado?.description}</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
