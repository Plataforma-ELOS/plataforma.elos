
"use client";

import { useState } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home, Search, Zap, Calendar, Bookmark, Construction, Users, Plus } from 'lucide-react';
import FeatureInProgress from '@/components/feature-in-progress';
import PostCard, { Post } from '@/components/community/post-card';
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
    commentCount: 2,
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
    commentCount: 5,
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
    commentCount: 15,
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
             <Card className="flex flex-col items-center justify-center p-10 text-center rounded-2xl border-dashed">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Bem-vindo(a) à Comunidade!</h3>
                <p className="text-muted-foreground mt-2 mb-4">A interação agora acontece dentro dos grupos. Explore, conecte-se e participe das conversas.</p>
                <FeatureInProgress>
                  <Button size="lg">Explorar Grupos</Button>
                </FeatureInProgress>
            </Card>
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onToggleSave={handleToggleSave} />
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
                            <PostCard key={post.id} post={post} onToggleSave={handleToggleSave} />
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
                        <PostCard key={post.id} post={post} onToggleSave={handleToggleSave} />
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
              <PostCard key={post.id} post={post} onToggleSave={handleToggleSave} />
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
    <div className="flex flex-col min-h-screen bg-muted/30">
      <HeaderSecondary />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {mainNav.map(item => (
                    <Button 
                        key={item.name}
                        variant={activeTab === item.name ? 'default' : 'outline'}
                        className="h-16 text-base justify-start p-4 gap-3 bg-card hover:bg-card/90 border"
                        onClick={() => setActiveTab(item.name)}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Coluna Principal do Feed */}
                <div className="lg:col-span-2">
                  {renderContent()}
                </div>

                {/* Barra Lateral */}
                <div className="space-y-8 sticky top-24">
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

    