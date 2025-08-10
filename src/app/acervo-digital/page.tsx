// src/app/acervo-digital/page.tsx
"use client";

import { useState, useEffect } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowUpDown, LayoutGrid, List, Plus } from 'lucide-react';
import DigitalLibraryCard from '@/components/sections/digital-library-card';
import FeatureInProgress from '@/components/feature-in-progress';

const libraryItems = [
  {
    type: 'video',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'child behavior',
    title: 'Entendendo o Comportamento no TEA',
    author: 'Dr. Ana Silva',
    avatarUrl: 'https://placehold.co/32x32.png',
    avatarHint: 'woman doctor portrait',
    date: '14 de julho de 2024',
    tags: ['Comportamento', 'TEA', 'Palestra'],
    actionText: 'Assistir Agora',
    downloadable: true,
  },
  {
    type: 'document',
    icon: 'document',
    title: 'Guia de Atividades Sensoriais',
    author: 'Carlos Mendes',
    avatarUrl: 'https://placehold.co/32x32.png',
    avatarHint: 'man portrait',
    date: '11 de julho de 2024',
    tags: ['Atividades', 'Sensorial', 'PDF'],
    actionText: 'Fazer Download',
    downloadable: true,
  },
  {
    type: 'document',
    icon: 'document',
    title: 'Modelo de Plano de Ensino Individualizado (PEI)',
    author: 'Mariana Costa',
    avatarUrl: 'https://placehold.co/32x32.png',
    avatarHint: 'woman teacher portrait',
    date: '09 de julho de 2024',
    tags: ['Educação', 'PEI', 'Documento'],
    actionText: 'Fazer Download',
    downloadable: true,
  },
  {
    type: 'video',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'communication signals',
    title: 'Comunicação Alternativa: Primeiros Passos',
    author: 'Juliana Pereira',
    avatarUrl: 'https://placehold.co/32x32.png',
    avatarHint: 'woman speech therapist',
    date: '07 de julho de 2024',
    tags: ['Comunicação', 'CAA', 'Workshop'],
    actionText: 'Assistir Agora',
    downloadable: true,
  },
];

export default function DigitalLibraryPage() {
  const [view, setView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(libraryItems);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const results = libraryItems.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(lowercasedQuery);
      const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery));
      return titleMatch || tagMatch;
    });
    setFilteredItems(results);
  }, [searchQuery]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderSecondary />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold text-primary font-headline">Acervo Digital</h1>
              <p className="text-muted-foreground">A plataforma definitiva para encontrar, compartilhar e colaborar com materiais sobre o TEA.</p>
            </div>
            <FeatureInProgress>
              <Button size="lg">
                <Plus className="mr-2" />
                Adicionar ao Acervo
              </Button>
            </FeatureInProgress>
          </div>

          <div className="bg-card p-4 rounded-xl border mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por título, tag, etc..." 
                  className="pl-10 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <FeatureInProgress>
                  <Button variant="outline" className="h-11">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Ordenar: Mais Recentes
                  </Button>
                </FeatureInProgress>
                <FeatureInProgress>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full md:w-[180px] h-11">
                      <SelectValue placeholder="Filtrar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Filtrar: All</SelectItem>
                      <SelectItem value="video">Vídeos</SelectItem>
                      <SelectItem value="document">Documentos</SelectItem>
                      <SelectItem value="game">Jogos</SelectItem>
                    </SelectContent>
                  </Select>
                </FeatureInProgress>
                <div className="bg-muted p-1 rounded-md hidden md:flex">
                   <FeatureInProgress>
                      <Button variant={view === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setView('grid')}>
                        <LayoutGrid />
                      </Button>
                    </FeatureInProgress>
                    <FeatureInProgress>
                      <Button variant={view === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => setView('list')}>
                        <List />
                      </Button>
                    </FeatureInProgress>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <DigitalLibraryCard key={index} item={item} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground mt-2">Tente buscar por outras palavras-chave ou ajuste seus filtros.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
