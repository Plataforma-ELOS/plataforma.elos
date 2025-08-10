"use client";

import { useState } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, Zap, Calendar, Bookmark, MessageSquare, Send, Globe, Filter, Plus } from 'lucide-react';
import FeatureInProgress from '@/components/feature-in-progress';
import Link from 'next/link';
import CreatePost from '@/components/community/create-post';
import PostCard from '@/components/community/post-card';

const mainNav = [
  { icon: <Home className="h-5 w-5" />, name: 'Início', href: '#' },
  { icon: <Search className="h-5 w-5" />, name: 'Buscar', href: '#' },
  { icon: <Zap className="h-5 w-5" />, name: 'Destaques', href: '#' },
  { icon: <Calendar className="h-5 w-5" />, name: 'Eventos', href: '#' },
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

const posts = [
  {
    author: {
      name: 'Ana Silva',
      avatarUrl: 'https://placehold.co/40x40.png',
      hint: 'woman portrait',
    },
    time: '2h',
    content: 'Olá pessoal! Alguém tem dicas de como lidar com a seletividade alimentar? Meu filho só quer comer as mesmas 3 coisas e estou ficando sem ideias. Qualquer ajuda é bem-vinda! 🙏',
    likes: 12,
    comments: 5,
  },
  {
    author: {
      name: 'Carlos Souza',
      avatarUrl: 'https://placehold.co/40x40.png',
      hint: 'man portrait',
    },
    time: '5h',
    content: 'Queria compartilhar uma vitória! 🎉 Hoje conseguimos fazer um passeio no parque sem nenhuma crise de sobrecarga sensorial. Usamos os fones de ouvido com cancelamento de ruído e foi um sucesso. Pequenos passos que significam muito!',
    likes: 35,
    comments: 10,
  }
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('Início');

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderSecondary />
      <main>
        <div className="border-b">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center py-2 h-16">
                    <nav className="flex items-center gap-2 relative">
                        {mainNav.map((item) => (
                          <FeatureInProgress key={item.name}>
                            <button
                              onClick={() => setActiveTab(item.name)}
                              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-foreground z-10 ${activeTab === item.name ? 'text-foreground' : 'text-foreground/60'}`}
                            >
                              {item.icon}
                              <span className="hidden md:inline">{item.name}</span>
                            </button>
                          </FeatureInProgress>
                        ))}
                         <div
                            className="absolute bg-primary/10 rounded-md transition-all duration-300 ease-out"
                            style={{
                                height: '40px',
                                width: activeTab === 'Início' ? '87px' : activeTab === 'Buscar' ? '92px' : activeTab === 'Destaques' ? '110px' : activeTab === 'Eventos' ? '98px' : '0',
                                left: activeTab === 'Início' ? '0px' : activeTab === 'Buscar' ? '95px' : activeTab === 'Destaques' ? '195px' : '313px',
                            }}
                        />
                    </nav>
                    <div className="flex items-center gap-2">
                        <FeatureInProgress>
                            <Button variant="ghost" size="icon">
                                <Bookmark className="h-5 w-5" />
                                <span className="sr-only">Salvos</span>
                            </Button>
                        </FeatureInProgress>
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
                        <FeatureInProgress>
                          <Button size="sm">
                              <Plus className="mr-2 h-4 w-4" />
                              Criar Grupo
                          </Button>
                        </FeatureInProgress>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna Principal do Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <CreatePost />
                    {posts.map((post, index) => (
                        <PostCard key={index} post={post} />
                    ))}
                </div>

                {/* Barra Lateral */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Minhas Conversas</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ul className="divide-y">
                                {myConversations.map((convo, index) => (
                                    <li key={index} className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer">
                                        <div className="h-12 w-12 rounded-full bg-muted flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-sm">{convo.name}</h3>
                                            <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                                                <span>{convo.activity}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Próximos Eventos</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground p-4">
                            <p>Nenhum evento planejado</p>
                            <FeatureInProgress>
                              <Button variant="outline" size="sm" className="mt-4">Ver todos os eventos</Button>
                            </FeatureInProgress>
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
