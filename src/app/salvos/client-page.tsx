// src/app/salvos/client-page.tsx
"use client";

import { useCallback, useState } from 'react';
import Link from 'next/link';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookmark, X } from 'lucide-react';
import DigitalLibraryCard from '@/components/features/acervo/digital-library-card';
import SearchBar from '@/components/features/search/search-bar';
import { useSearch } from '@/hooks/use-search';
import { alternarSalvo } from '@/app/actions/community';
import { alternarFavorito } from '@/app/actions/library';
import type { SavedItem } from '@/lib/data/saved';

export default function SavedPageClient({ itens }: { itens: SavedItem[] }) {
  const [lista, setLista] = useState(itens);

  const { query, setQuery, filter, setFilter, results } = useSearch({
    items: lista,
    searchableText: (item) => (item.kind === 'post' ? [item.content, item.author.name] : [item.title, item.author]),
    matchesFilter: (item, filterValue) => filterValue === 'all' || item.kind === filterValue,
    sortBy: (item) => new Date(item.createdAt).getTime(),
  });

  const remover = useCallback((item: SavedItem) => {
    setLista((atual) => atual.filter((i) => !(i.kind === item.kind && i.id === item.id)));
    if (item.kind === 'post') {
      alternarSalvo(item.id);
    } else {
      alternarFavorito(item.id);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <HeaderSecondary />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6 space-y-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-primary/10 p-4 rounded-full">
              <Bookmark className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Itens Salvos</h1>
            <p className="max-w-[700px] text-foreground/80 md:text-xl">
              Posts e materiais do acervo que você guardou para ver depois.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBar value={query} onChange={setQuery} placeholder="Buscar nos itens salvos..." />
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList>
                  <TabsTrigger value="all">Tudo</TabsTrigger>
                  <TabsTrigger value="post">Posts</TabsTrigger>
                  <TabsTrigger value="library">Acervo</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {results.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                {lista.length === 0
                  ? 'Você ainda não salvou nada. Favorite posts na Comunidade ou materiais no Acervo Digital.'
                  : 'Nenhum item encontrado para essa busca.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((item) =>
                  item.kind === 'post' ? (
                    <Card key={`post-${item.id}`} className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => remover(item)}
                        aria-label="Remover dos salvos"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <CardContent className="p-6 space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={item.author.avatarUrl} alt={item.author.name} />
                            <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">{item.author.name}</p>
                            <p className="text-xs text-muted-foreground">{item.date}</p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground/90 line-clamp-4">{item.content}</p>
                        <Link href="/comunidade" className="text-sm text-primary hover:underline">
                          Ver na Comunidade
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    <DigitalLibraryCard
                      key={`library-${item.id}`}
                      item={item}
                      isFavorited
                      onToggleFavorite={() => remover(item)}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
