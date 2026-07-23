// src/app/acervo-digital/page.tsx
"use client";

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, ArrowUpDown, LayoutGrid, List, Plus, Bookmark, CheckCircle } from 'lucide-react';
import DigitalLibraryCard from '@/components/sections/digital-library-card';
import DigitalLibraryListItem from '@/components/sections/digital-library-list-item';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { createClient } from '@/utils/supabase/client';
import { mapLibraryRow, type LibraryItemData } from '@/lib/data/library';

function AddToLibraryDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate form submission
    setOpen(false);
    setShowSuccess(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar ao Acervo</DialogTitle>
            <DialogDescription>
              Contribua com a comunidade compartilhando um material relevante. Ele será analisado pela nossa equipe antes de ser publicado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Título
                </Label>
                <Input id="title" required className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="author" className="text-right">
                  Autor
                </Label>
                <Input id="author" required className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Tipo
                </Label>
                 <Select required>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o tipo de material" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="video">Vídeo</SelectItem>
                        <SelectItem value="document">Documento</SelectItem>
                        <SelectItem value="game">Jogo</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <Input id="tags" placeholder="Separe por vírgulas" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="link" className="text-right">
                  Link
                </Label>
                <Input id="link" type="url" required placeholder="https://..." className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Enviar para análise</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">Material Enviado com Sucesso!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-muted-foreground">
              Obrigado por sua contribuição! Nossa equipe irá analisar o material e, se aprovado, ele aparecerá no acervo em breve.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccess(false)} className="w-full">
              Ok, entendi!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


function DigitalLibraryContent() {
  const searchParams = useSearchParams();
  const [view, setView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  const [libraryItems, setLibraryItems] = useState<LibraryItemData[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('library_items')
      .select('type, title, author_name, image_url, action_url, downloadable, tags, created_at')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('[acervo-digital] erro ao buscar itens:', error.message);
        } else {
          setLibraryItems((data ?? []).map(mapLibraryRow));
        }
        setCarregando(false);
      });
  }, []);

  const filteredItems = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();

    let results = libraryItems.filter(item => {
      const typeMatch = filterType === 'all' || item.type === filterType;
      if (!typeMatch) return false;

      if (!lowercasedQuery) return true;
      const titleMatch = item.title.toLowerCase().includes(lowercasedQuery);
      const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery));
      return titleMatch || tagMatch;
    });

    results.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sortOrder === 'recent') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return results;
  }, [libraryItems, searchQuery, filterType, sortOrder]);

  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl === 'video' || typeFromUrl === 'document') {
      setFilterType(typeFromUrl);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-primary/10 dark:from-background dark:to-primary/20">
      <HeaderSecondary />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold text-primary dark:text-foreground font-headline">Acervo Digital</h1>
              <p className="text-muted-foreground">A plataforma definitiva para encontrar, compartilhar e colaborar com materiais sobre o TEA.</p>
            </div>
            <AddToLibraryDialog>
              <Button size="lg">
                <Plus className="mr-2" />
                Adicionar ao Acervo
              </Button>
            </AddToLibraryDialog>
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
                <Button 
                  variant="outline" 
                  className="h-11"
                  onClick={() => setSortOrder(sortOrder === 'recent' ? 'oldest' : 'recent')}
                >
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Ordenar: {sortOrder === 'recent' ? 'Mais Recentes' : 'Mais Antigos'}
                </Button>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-[180px] h-11">
                    <SelectValue placeholder="Filtrar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Filtrar: Todos</SelectItem>
                    <SelectItem value="video">Vídeos</SelectItem>
                    <SelectItem value="document">Documentos</SelectItem>
                  </SelectContent>
                </Select>
                <div className="bg-muted p-1 rounded-md hidden md:flex">
                  <Button variant={view === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setView('grid')}>
                    <LayoutGrid />
                  </Button>
                  <Button variant={view === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => setView('list')}>
                    <List />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {carregando ? (
            <div className="text-center py-16 text-muted-foreground">Carregando acervo...</div>
          ) : (
            <>
              {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in-0 duration-500">
                  {filteredItems.map((item, index) => (
                    <DigitalLibraryCard key={index} item={item} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in-0 duration-500">
                  {filteredItems.map((item, index) => (
                    <DigitalLibraryListItem key={index} item={item} />
                  ))}
                </div>
              )}

              {filteredItems.length === 0 && (
                <div className="text-center py-16 animate-in fade-in-0 duration-500">
                  <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold">Nenhum resultado encontrado</h3>
                  <p className="text-muted-foreground mt-2">Tente buscar por outras palavras-chave ou ajuste seus filtros.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function DigitalLibraryPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DigitalLibraryContent />
    </Suspense>
  );
}
