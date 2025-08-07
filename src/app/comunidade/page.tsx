"use client";

import { useState } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, Zap, Calendar, Bookmark, MessageSquare, Send, Globe, Filter, Plus } from 'lucide-react';
import FeatureInProgress from '@/components/feature-in-progress';
import Link from 'next/link';

const mainNav = [
  { icon: <Home className="h-5 w-5" />, name: 'Início', href: '#' },
  { icon: <Search className="h-5 w-5" />, name: 'Buscar', href: '#' },
  { icon: <Zap className="h-5 w-5" />, name: 'Destaques', href: '#' },
  { icon: <Calendar className="h-5 w-5" />, name: 'Eventos', href: '/comunidade/eventos' },
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


export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('Início');

  const renderNavItem = (item: typeof mainNav[0]) => {
    const isLink = item.href.startsWith('/');
    const content = (
        <button
          onClick={() => !isLink && setActiveTab(item.name)}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-foreground z-10 ${activeTab === item.name ? 'text-foreground' : 'text-foreground/60'}`}
        >
          {item.icon}
          <span className="hidden md:inline">{item.name}</span>
        </button>
      );

    if (isLink) {
        return <Link href={item.href}>{content}</Link>
    }

    return (
        <FeatureInProgress>
            {content}
        </FeatureInProgress>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderSecondary />
      <div className="flex-1 bg-background py-8">
        <div className="border-b">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center py-2">
                    <nav className="flex items-center gap-2 relative">
                        {mainNav.map((item) => (
                          <div key={item.name}>{renderNavItem(item)}</div>
                        ))}
                         <div
                            className="absolute bg-primary/10 rounded-md transition-all duration-300 ease-out"
                            style={{
                                height: '40px',
                                width: activeTab === 'Início' ? '87px' : activeTab === 'Buscar' ? '92px' : activeTab === 'Destaques' ? '110px' : activeTab === 'Eventos' ? '98px' : '0',
                                left: activeTab === 'Início' ? '0px' : activeTab === 'Buscar' ? '95px' : activeTab === 'Destaques' ? '195px' : '313px',
                                opacity: activeTab === 'Eventos' ? 0 : 1,
                            }}
                        />
                    </nav>
                    <div className="flex items-center gap-4">
                        <nav className="hidden md:flex items-center gap-2">
                           {userNav.map((item) => (
                                <FeatureInProgress key={item.name}>
                                    <span className={`flex items-center gap-2 rounded-lg p-2 text-sm text-foreground/80 transition-all hover:text-foreground hover:bg-primary/10 cursor-pointer`}>
                                        {item.icon}
                                    </span>
                                </FeatureInProgress>
                            ))}
                        </nav>
                        <FeatureInProgress>
                          <Button size="sm" className="hidden md:inline-flex">
                              <Plus className="mr-2 h-4 w-4" />
                              Criar Grupo
                          </Button>
                        </FeatureInProgress>
                    </div>
                </div>
            </div>
        </div>
        
        <main className="p-8 relative container mx-auto flex-1">
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
                        <FeatureInProgress>
                          <Button variant="ghost" size="sm">
                              <Filter className="mr-2 h-4 w-4" />
                              Filtros
                          </Button>
                        </FeatureInProgress>
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
        </main>
        
    </div>
      <Footer />
    </div>
  );
}
