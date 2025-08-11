
"use client";

import { useState, useRef, useEffect } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home, Search, Zap, Calendar, Bookmark, MessageSquare, Send, Plus, Construction, Users } from 'lucide-react';
import FeatureInProgress from '@/components/feature-in-progress';
import Link from 'next/link';
import CreatePost from '@/components/community/create-post';
import PostCard, { Post, Comment } from '@/components/community/post-card';
import { Input } from '@/components/ui/input';

const mainNav = [
  { icon: <Home className="h-5 w-5" />, name: 'Início', href: '#' },
  { icon: <Search className="h-5 w-5" />, name: 'Buscar', href: '#' },
  { icon: <Zap className="h-5 w-5" />, name: 'Destaques', href: '#' },
  { icon: <Calendar className="h-5 w-5" />, name: 'Eventos', href: '#' },
];

const initialPosts: Post[] = [
  {
    id: 'post-1',
    author: {
      name: 'Carlos Souza',
      avatarUrl: 'https://placehold.co/40x40.png',
      hint: 'man portrait',
    },
    time: '5h',
    content: 'Queria compartilhar uma vitória! 🎉 Hoje conseguimos fazer um passeio no parque sem nenhuma crise de sobrecarga sensorial. Usamos os fones de ouvido com cancelamento de ruído e foi um sucesso. Pequenos passos que significam muito!',
    likes: 35,
    comments: [
        {
            id: 'comment-1-1',
            author: { name: 'Mariana Costa', avatarUrl: 'https://placehold.co/40x40.png', hint: 'woman portrait' },
            content: 'Que demais, Carlos! Fico muito feliz por vocês! É uma inspiração.',
            time: '4h'
        }
    ],
    isSaved: false,
  },
  {
    id: 'post-2',
    author: {
      name: 'Ana Silva',
      avatarUrl: 'https://placehold.co/40x40.png',
      hint: 'woman portrait',
    },
    time: '2h',
    content: 'Olá pessoal! Alguém tem dicas de como lidar com a seletividade alimentar? Meu filho só quer comer as mesmas 3 coisas e estou ficando sem ideias. Qualquer ajuda é bem-vinda! 🙏',
    likes: 12,
    comments: [],
    isSaved: true,
  },
   {
    id: 'post-3',
    author: {
      name: 'Juliana Pereira',
      avatarUrl: 'https://placehold.co/40x40.png',
      hint: 'woman portrait',
    },
    time: '1d',
    content: 'Alguém aqui já passou pelo processo de solicitação do BPC? Comecei a juntar os papéis e parece uma montanha de coisas. Se alguém tiver um checklist ou alguma dica, agradeceria muito!',
    likes: 48,
    comments: [],
    isSaved: false,
  },
];

const communityEvents = [
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
];


export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('Início');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    if (navRef.current) {
        const activeButton = navRef.current.querySelector(`button[data-tab-name="${activeTab}"]`) as HTMLElement;
        if (activeButton) {
            setIndicatorStyle({
                left: activeButton.offsetLeft,
                width: activeButton.offsetWidth,
            });
        }
    }
  }, [activeTab]);

  const handleCreatePost = (content: string) => {
    if (!content.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: {
        name: 'Usuário Atual',
        avatarUrl: 'https://placehold.co/48x48.png',
        hint: 'user avatar',
      },
      time: 'Agora',
      content,
      likes: 0,
      comments: [],
      isSaved: false,
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
  };
  
  const handleAddComment = (postId: string, commentContent: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: {
        name: 'Usuário Atual',
        avatarUrl: 'https://placehold.co/48x48.png',
        hint: 'user avatar',
      },
      content: commentContent,
      time: 'Agora',
    };

    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));
  };
  
  const handleToggleSave = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
    }
    const results = posts.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  }


  const renderContent = () => {
    switch (activeTab) {
      case 'Início':
        return (
          <div className="animate-in fade-in-0 duration-500 space-y-6">
            <CreatePost onCreatePost={handleCreatePost} />
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onComment={handleAddComment} onToggleSave={handleToggleSave} />
              ))}
            </div>
          </div>
        );
       case 'Buscar':
        return (
            <div className="space-y-6 animate-in fade-in-0 duration-500">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input 
                        placeholder="Buscar na comunidade..." 
                        className="h-11"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" size="lg">
                        <Search className="mr-2 h-4 w-4" />
                        Buscar
                    </Button>
                </form>
                {hasSearched ? (
                    searchResults.length > 0 ? (
                      <div className="space-y-6">
                        {searchResults.map((post) => (
                            <PostCard key={post.id} post={post} onComment={handleAddComment} onToggleSave={handleToggleSave} />
                        ))}
                      </div>
                    ) : (
                        <Card className="flex flex-col items-center justify-center p-10 text-center rounded-2xl border-dashed">
                            <Search className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold">Nenhum resultado encontrado</h3>
                            <p className="text-muted-foreground mt-2">Tente buscar por outras palavras-chave.</p>
                        </Card>
                    )
                ) : (
                     <Card className="flex flex-col items-center justify-center p-10 text-center rounded-2xl border-dashed">
                        <Search className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">Busque na Comunidade</h3>
                        <p className="text-muted-foreground mt-2">Encontre posts, tópicos e conversas sobre os assuntos que te interessam.</p>
                    </Card>
                )}
            </div>
        );
      case 'Salvos':
        const savedPosts = posts.filter(post => post.isSaved);
        return (
            <div className="space-y-6 animate-in fade-in-0 duration-500">
                <h2 className="text-2xl font-bold">Itens Salvos</h2>
                {savedPosts.length > 0 ? (
                    savedPosts.map((post) => (
                        <PostCard key={post.id} post={post} onComment={handleAddComment} onToggleSave={handleToggleSave} />
                    ))
                ) : (
                    <Card className="flex flex-col items-center justify-center p-10 text-center rounded-2xl border-dashed">
                        <Bookmark className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">Nenhum item salvo</h3>
                        <p className="text-muted-foreground mt-2">Use o ícone de marcador para salvar posts e encontrá-los aqui.</p>
                    </Card>
                )}
            </div>
        );
       case 'Destaques':
        const featuredPosts = [...posts].sort((a, b) => b.likes - a.likes);
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-500">
            <h2 className="text-2xl font-bold">Posts em Destaque</h2>
            <p className="text-muted-foreground">As conversas mais populares da comunidade no momento.</p>
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} onComment={handleAddComment} onToggleSave={handleToggleSave} />
            ))}
          </div>
        );
      case 'Eventos':
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-500">
            <h2 className="text-2xl font-bold">Agenda de Eventos</h2>
            <p className="text-muted-foreground">Participe de workshops, palestras e encontros da comunidade.</p>
            <div className="space-y-4">
              {communityEvents.map((event, index) => (
                <Card key={index} className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms`}}>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <p className="text-muted-foreground flex-1">{event.description}</p>
                    <FeatureInProgress>
                      <Button>
                        Ver Detalhes
                      </Button>
                    </FeatureInProgress>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <Card className="flex flex-col items-center justify-center p-10 text-center rounded-2xl border-dashed animate-in fade-in-0 duration-500">
            <Construction className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Seção em Construção</h3>
            <p className="text-muted-foreground mt-2">A área de "{activeTab}" ainda está em desenvolvimento. Volte em breve!</p>
          </Card>
        );
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderSecondary />
      <main>
        <div className="border-b">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center py-2 h-16">
                    <nav ref={navRef} className="relative">
                        <div className="flex items-center gap-2">
                            {mainNav.map((item) => (
                              <button
                                key={item.name}
                                data-tab-name={item.name}
                                onClick={() => setActiveTab(item.name)}
                                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-foreground z-10 ${activeTab === item.name ? 'text-foreground' : 'text-foreground/60'}`}
                              >
                                {item.icon}
                                <span className="hidden md:inline">{item.name}</span>
                              </button>
                            ))}
                        </div>
                         <div
                            className="absolute bg-primary/10 rounded-md transition-all duration-300 ease-out"
                            style={{
                                height: '40px',
                                top: 0,
                                ...indicatorStyle
                            }}
                        />
                    </nav>
                    <div className="flex items-center gap-2">
                        <FeatureInProgress>
                            <Button variant="ghost" size="icon">
                                <MessageSquare className="h-5 w-5" />
                                <span className="sr-only">Mensagens</span>
                            </Button>
                        </FeatureInProgress>
                        <FeatureInProgress>
                            <Button variant="ghost" size="icon">
                                <Send className="h-5 w-5" />
                                <span className="sr-only">Notificações</span>
                            </Button>
                        </FeatureInProgress>
                        <Button variant="ghost" size="icon" onClick={() => setActiveTab('Salvos')}>
                            <Bookmark className={`h-5 w-5 transition-colors ${activeTab === 'Salvos' ? 'text-primary fill-primary' : 'text-foreground/60'}`} />
                            <span className="sr-only">Salvos</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna Principal do Feed */}
                <div className="lg:col-span-2">
                  {renderContent()}
                </div>

                {/* Barra Lateral */}
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Próximos Eventos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {communityEvents.slice(0, 2).map((event, index) => (
                                <div key={index}>
                                    <h4 className="font-semibold text-sm">{event.title}</h4>
                                    <p className="text-xs text-muted-foreground">{event.date}</p>
                                </div>
                            ))}
                             <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setActiveTab('Eventos')}>
                              Ver todos os eventos
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Meus Grupos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-muted-foreground p-4">
                              <Users className="mx-auto h-12 w-12 mb-4" />
                              <h3 className="font-semibold mb-1">Junte-se ou crie um grupo</h3>
                              <p className="text-sm mb-4">A funcionalidade de grupos será implementada em breve.</p>
                              <FeatureInProgress>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Criar Grupo
                                </Button>
                              </FeatureInProgress>
                            </div>
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

    

    