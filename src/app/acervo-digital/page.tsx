// src/app/acervo-digital/page.tsx
"use client";

import { useState, useEffect, useContext, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Bookmark, CheckCircle } from 'lucide-react';
import DigitalLibraryCard from '@/components/features/acervo/digital-library-card';
import DigitalLibraryListItem from '@/components/features/acervo/digital-library-list-item';
import SearchBar from '@/components/features/search/search-bar';
import SearchFilters from '@/components/features/search/search-filters';
import { useSearch } from '@/hooks/use-search';
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
import { createClient } from '@/lib/supabase/client';
import { mapLibraryRow, type LibraryItemData } from '@/lib/data/library';
import { AuthContext } from '@/components/common/providers';
import { alternarFavorito } from '@/app/actions/library';

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


// Config de busca do acervo — definida fora do componente para manter as
// referências estáveis (evita recomputar o memo do useSearch a cada render).
const LIBRARY_FILTER_OPTIONS = [
  { value: 'all', label: 'Filtrar: Todos' },
  { value: 'video', label: 'Vídeos' },
  { value: 'document', label: 'Documentos' },
];
const searchLibraryText = (item: LibraryItemData) => [item.title, ...item.tags];
const matchesLibraryType = (item: LibraryItemData, filter: string) => filter === 'all' || item.type === filter;
const libraryDate = (item: LibraryItemData) => new Date(item.createdAt).getTime();

function DigitalLibraryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [libraryItems, setLibraryItems] = useState<LibraryItemData[]>([]);
  const [carregando, setCarregando] = useState(true);

  const {
    query,
    setQuery,
    filter: filterType,
    setFilter: setFilterType,
    sortOrder,
    toggleSort,
    results: filteredItems,
  } = useSearch<LibraryItemData>({
    items: libraryItems,
    searchableText: searchLibraryText,
    matchesFilter: matchesLibraryType,
    sortBy: libraryDate,
  });

  useEffect(() => {
    const supabase = createClient();

    (async () => {
      const { data, error } = await supabase
        .from('library_items')
        .select('id, type, title, author_name, image_url, action_url, downloadable, tags, created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[acervo-digital] erro ao buscar itens:', error.message);
        setCarregando(false);
        return;
      }

      // Favoritos do usuário logado (RLS libera só as próprias linhas).
      const { data: { user: usuarioAtual } } = await supabase.auth.getUser();
      let favoritos = new Set<string>();
      if (usuarioAtual) {
        const { data: favs } = await supabase
          .from('library_favorites')
          .select('item_id')
          .eq('profile_id', usuarioAtual.id);
        favoritos = new Set((favs ?? []).map((f) => f.item_id));
      }

      setLibraryItems(
        (data ?? []).map((row) => ({ ...mapLibraryRow(row), isFavorited: favoritos.has(row.id) }))
      );
      setCarregando(false);
    })();
  }, []);

  const handleToggleFavorite = async (itemId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    // Atualização otimista.
    setLibraryItems((items) =>
      items.map((it) => (it.id === itemId ? { ...it, isFavorited: !it.isFavorited } : it))
    );
    const { ok } = await alternarFavorito(itemId);
    if (!ok) {
      // Reverte se falhou.
      setLibraryItems((items) =>
        items.map((it) => (it.id === itemId ? { ...it, isFavorited: !it.isFavorited } : it))
      );
    }
  };

  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl === 'video' || typeFromUrl === 'document') {
      setFilterType(typeFromUrl);
    }
  }, [searchParams, setFilterType]);

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
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder="Buscar por título, tag, etc..."
              />
              <SearchFilters
                filterOptions={LIBRARY_FILTER_OPTIONS}
                filterValue={filterType}
                onFilterChange={setFilterType}
                sortOrder={sortOrder}
                onToggleSort={toggleSort}
                view={view}
                onViewChange={setView}
              />
            </div>
          </div>
          
          {carregando ? (
            <div className="text-center py-16 text-muted-foreground">Carregando acervo...</div>
          ) : (
            <>
              {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in-0 duration-500">
                  {filteredItems.map((item) => (
                    <DigitalLibraryCard
                      key={item.id}
                      item={item}
                      isFavorited={item.isFavorited}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in-0 duration-500">
                  {filteredItems.map((item) => (
                    <DigitalLibraryListItem
                      key={item.id}
                      item={item}
                      isFavorited={item.isFavorited}
                      onToggleFavorite={handleToggleFavorite}
                    />
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
