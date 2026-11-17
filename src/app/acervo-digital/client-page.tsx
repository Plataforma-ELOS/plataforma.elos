// src/app/acervo-digital/client-page.tsx
"use client";

import { useState, useEffect, useContext, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, CheckCircle, Trash2 } from 'lucide-react';
import GradeConteudos from '@/components/features/acervo/feed-conteudos';
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
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  FEED_KINDS,
  FEED_KIND_FILTRO,
  LIMITES_SUGESTAO,
  validarSugestaoConteudo,
  type FeedContent,
  type FeedKind,
} from '@/lib/data/feed-contents';
import { AuthContext } from '@/components/common/providers';
import { alternarConteudoSalvo, sugerirConteudo } from '@/app/actions/feed-contents';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';

const TAMANHO_MAXIMO_IMAGEM = 2 * 1024 * 1024;

/** Rótulo do tipo no formulário (singular, do ponto de vista de quem escreve). */
const TIPO_NO_FORMULARIO: Record<FeedKind, string> = {
  profissional: 'Profissional',
  clinica: 'Clínica',
  cuidador: 'Cuidador ou familiar',
};

type Fonte = { titulo: string; url: string };

function AddToLibraryDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tipo, setTipo] = useState<FeedKind | ''>('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [texto, setTexto] = useState('');
  const [dica, setDica] = useState('');
  const [fontes, setFontes] = useState<Fonte[]>([{ titulo: '', url: '' }]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [altImagem, setAltImagem] = useState('');
  const [enviando, setEnviando] = useState(false);

  const previewImage = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile]);
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const limpar = () => {
    setTipo('');
    setTitulo('');
    setTexto('');
    setDica('');
    setFontes([{ titulo: '', url: '' }]);
    setImageFile(null);
    setAltImagem('');
  };

  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
      toast({ variant: 'destructive', title: 'Imagem muito grande', description: 'Escolha uma imagem de até 2MB.' });
      return;
    }
    setImageFile(arquivo);
  };

  const handleOpenChange = (novoEstado: boolean) => {
    if (novoEstado && !user) {
      router.push('/login');
      return;
    }
    // Sugere o nome da pessoa como assinatura; ela pode trocar (ex.: "Mãe do Theo").
    if (novoEstado && user && !autor) setAutor(user.name);
    setOpen(novoEstado);
  };

  const atualizarFonte = (indice: number, campo: keyof Fonte, valor: string) =>
    setFontes((atual) => atual.map((f, i) => (i === indice ? { ...f, [campo]: valor } : f)));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    // Valida antes de enviar a imagem, para não deixar arquivo órfão no storage.
    const previa = validarSugestaoConteudo({
      kind: tipo,
      title: titulo,
      authorLabel: autor,
      body: texto,
      tip: dica,
      sources: fontes,
      imageUrl: imageFile ? 'https://pendente.invalid/imagem' : undefined,
      imageAlt: altImagem,
    });
    if (!previa.ok) {
      toast({ variant: 'destructive', title: 'Confira o formulário', description: previa.erro });
      return;
    }

    setEnviando(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const supabase = createClient();
        const extensao = imageFile.name.split('.').pop();
        const caminho = `${user.id}/${crypto.randomUUID()}.${extensao}`;
        const { error: erroUpload } = await supabase.storage.from('library').upload(caminho, imageFile);
        if (erroUpload) {
          toast({ variant: 'destructive', title: 'Não foi possível enviar a imagem', description: erroUpload.message });
          return;
        }
        imageUrl = supabase.storage.from('library').getPublicUrl(caminho).data.publicUrl;
      }

      const { ok, erro } = await sugerirConteudo({
        kind: tipo,
        title: titulo,
        authorLabel: autor,
        body: texto,
        tip: dica,
        sources: fontes,
        imageUrl,
        imageAlt: altImagem,
      });

      if (!ok) {
        toast({ variant: 'destructive', title: 'Não foi possível enviar', description: erro });
        return;
      }

      limpar();
      setOpen(false);
      setShowSuccess(true);
    } finally {
      setEnviando(false);
    }
  };

  const L = LIMITES_SUGESTAO;

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar ao Acervo</DialogTitle>
            <DialogDescription>
              Compartilhe uma orientação ou um relato. Ele será analisado pela nossa equipe antes de ser publicado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="conteudo-tipo">Você escreve como</Label>
              <Select required value={tipo} onValueChange={(v) => setTipo(v as FeedKind)}>
                <SelectTrigger id="conteudo-tipo">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {FEED_KINDS.map((k) => (
                    <SelectItem key={k} value={k}>
                      {TIPO_NO_FORMULARIO[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conteudo-titulo">Título</Label>
              <Input
                id="conteudo-titulo"
                required
                minLength={L.titulo.min}
                maxLength={L.titulo.max}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conteudo-autor">Assinatura</Label>
              <Input
                id="conteudo-autor"
                required
                maxLength={L.autor.max}
                placeholder="Ex.: Fonoaudióloga, Mãe do Theo"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conteudo-texto">Texto</Label>
              <Textarea
                id="conteudo-texto"
                required
                rows={7}
                minLength={L.corpo.min}
                maxLength={L.corpo.max}
                aria-describedby="conteudo-texto-ajuda"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <p id="conteudo-texto-ajuda" className="text-xs text-muted-foreground">
                Separe parágrafos com uma linha em branco. Para uma lista, comece cada linha com &quot;- &quot;.
                {' '}({texto.trim().length}/{L.corpo.max})
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conteudo-dica">Dica (opcional)</Label>
              <Input
                id="conteudo-dica"
                maxLength={L.dica.max}
                value={dica}
                onChange={(e) => setDica(e.target.value)}
              />
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Fontes (opcional)</legend>
              {fontes.map((fonte, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    aria-label={`Nome da fonte ${i + 1}`}
                    placeholder="Nome (ex.: NICE)"
                    value={fonte.titulo}
                    onChange={(e) => atualizarFonte(i, 'titulo', e.target.value)}
                  />
                  <Input
                    aria-label={`Link da fonte ${i + 1}`}
                    type="url"
                    placeholder="https://..."
                    value={fonte.url}
                    onChange={(e) => atualizarFonte(i, 'url', e.target.value)}
                  />
                  {fontes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remover fonte ${i + 1}`}
                      onClick={() => setFontes((atual) => atual.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {fontes.length < L.fontes && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFontes((atual) => [...atual, { titulo: '', url: '' }])}
                >
                  <Plus className="mr-1 h-4 w-4" /> Adicionar fonte
                </Button>
              )}
            </fieldset>

            <div className="space-y-2">
              <Label htmlFor="acervo-image-file">Imagem (opcional)</Label>
              <div className="flex items-center gap-3">
                {previewImage && (
                  <Image src={previewImage} alt="" width={48} height={48} className="h-12 w-12 rounded object-cover" unoptimized />
                )}
                <Label htmlFor="acervo-image-file" className="text-sm text-primary-strong cursor-pointer hover:underline">
                  {imageFile ? 'Trocar imagem' : 'Escolher imagem (até 2MB)'}
                </Label>
                <Input id="acervo-image-file" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleImageSelected} />
              </div>
              {imageFile && (
                <Input
                  aria-label="Descrição da imagem"
                  required
                  maxLength={L.altImagem.max}
                  placeholder="Descreva a imagem para quem usa leitor de tela"
                  value={altImagem}
                  onChange={(e) => setAltImagem(e.target.value)}
                />
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar para análise'}</Button>
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
            <AlertDialogTitle className="text-center text-2xl">Conteúdo enviado!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-muted-foreground">
              Obrigado por compartilhar. Nossa equipe vai analisar o conteúdo e, se aprovado, ele aparecerá no acervo.
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

// Config de busca do acervo — fora do componente para manter as referências
// estáveis (evita recomputar o memo do useSearch a cada render).
const FILTRO_OPCOES = [
  { value: 'all', label: 'Filtrar: Todos' },
  ...FEED_KINDS.map((k) => ({ value: k, label: FEED_KIND_FILTRO[k] })),
];
const textoPesquisavel = (c: FeedContent) => [
  c.title,
  c.authorLabel,
  c.kindLabel,
  c.tip ?? '',
  ...c.blocos.flatMap((b) => (b.tipo === 'paragrafo' ? [b.texto] : b.itens)),
  ...c.sources.map((f) => f.titulo),
];
const casaComTipo = (c: FeedContent, filtro: string) => filtro === 'all' || c.kind === filtro;
const dataDoConteudo = (c: FeedContent) => c.publishedAt;

function DigitalLibraryContent({ conteudos, salvosIniciais }: { conteudos: FeedContent[]; salvosIniciais: string[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [salvos, setSalvos] = useState<ReadonlySet<string>>(() => new Set(salvosIniciais));

  const inverter = (id: string) =>
    setSalvos((atual) => {
      const novo = new Set(atual);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });

  const handleAlternarSalvo = async (id: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    inverter(id); // otimista
    const { ok, erro } = await alternarConteudoSalvo(id);
    if (!ok) {
      inverter(id);
      toast({ variant: 'destructive', title: 'Não foi possível salvar', description: erro });
    }
  };

  const {
    query,
    setQuery,
    filter,
    setFilter,
    sortOrder,
    toggleSort,
    results,
  } = useSearch<FeedContent>({
    items: conteudos,
    searchableText: textoPesquisavel,
    matchesFilter: casaComTipo,
    sortBy: dataDoConteudo,
  });

  // /acervo-digital?tipo=cuidador abre já filtrado.
  useEffect(() => {
    const tipo = searchParams.get('tipo');
    if (tipo && (FEED_KINDS as string[]).includes(tipo)) setFilter(tipo);
  }, [searchParams, setFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-primary/10 dark:from-background dark:to-primary/20">
      <HeaderSecondary />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold text-primary-strong dark:text-foreground font-headline">Acervo Digital</h1>
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
                filterOptions={FILTRO_OPCOES}
                filterValue={filter}
                onFilterChange={setFilter}
                sortOrder={sortOrder}
                onToggleSort={toggleSort}
              />
            </div>
          </div>

          <GradeConteudos conteudos={results} salvos={salvos} onAlternarSalvo={handleAlternarSalvo} />

          {results.length === 0 && (
            <div className="text-center py-16 animate-in fade-in-0 duration-500">
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

export default function DigitalLibraryPageClient({
  conteudos,
  salvosIniciais,
}: {
  conteudos: FeedContent[];
  salvosIniciais: string[];
}) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DigitalLibraryContent conteudos={conteudos} salvosIniciais={salvosIniciais} />
    </Suspense>
  );
}
