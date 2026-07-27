// src/app/meu-espaco/client-page.tsx
"use client";

import { useState } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { HeartHandshake, Plus, Pencil, Trash2, Users, BookHeart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  criarDependente,
  atualizarDependente,
  excluirDependente,
  criarEntradaDiario,
  atualizarEntradaDiario,
  excluirEntradaDiario,
} from '@/app/actions/caregiver';
import type { DependentData, JournalEntryData } from '@/lib/data/caregiver';

const MOODS = ['Tranquilo(a)', 'Feliz', 'Cansado(a)', 'Sobrecarregado(a)', 'Preocupado(a)'];

function DependentDialog({
  open,
  onOpenChange,
  dependente,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dependente: DependentData | null;
  onSaved: (dep: DependentData) => void;
}) {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState(dependente?.firstName ?? '');
  const [birthYear, setBirthYear] = useState(dependente?.age ? String(new Date().getFullYear() - dependente.age) : '');
  const [relationship, setRelationship] = useState(dependente?.relationship ?? '');
  const [notes, setNotes] = useState(dependente?.notes ?? '');
  const [salvando, setSalvando] = useState(false);

  const handleOpenChange = (novoEstado: boolean) => {
    if (novoEstado) {
      setFirstName(dependente?.firstName ?? '');
      setBirthYear(dependente?.age ? String(new Date().getFullYear() - dependente.age) : '');
      setRelationship(dependente?.relationship ?? '');
      setNotes(dependente?.notes ?? '');
    }
    onOpenChange(novoEstado);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSalvando(true);
    const ano = birthYear.trim() ? Number(birthYear) : null;
    const resultado = dependente
      ? await atualizarDependente(dependente.id, firstName, ano, relationship, notes)
      : await criarDependente(firstName, ano, relationship, notes);
    setSalvando(false);

    if (!resultado.ok) {
      toast({ variant: 'destructive', title: 'Não foi possível salvar', description: resultado.erro });
      return;
    }

    toast({ title: dependente ? 'Dependente atualizado!' : 'Dependente adicionado!' });
    onSaved({
      id: dependente?.id ?? '',
      firstName: firstName.trim(),
      age: ano ? new Date().getFullYear() - ano : null,
      relationship: relationship.trim(),
      notes: notes.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dependente ? 'Editar Dependente' : 'Adicionar Dependente'}</DialogTitle>
          <DialogDescription>Só você tem acesso a essas informações.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dep-name">Nome</Label>
              <Input id="dep-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dep-birth-year">Ano de nascimento (opcional)</Label>
              <Input
                id="dep-birth-year"
                type="number"
                min={1900}
                max={2100}
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dep-relationship">Parentesco (opcional)</Label>
              <Input id="dep-relationship" placeholder="Ex: filho(a), neto(a)..." value={relationship} onChange={(e) => setRelationship(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dep-notes">Anotações (opcional)</Label>
              <Textarea id="dep-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={salvando || firstName.trim().length < 2}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DependentsTab({ dependentesIniciais }: { dependentesIniciais: DependentData[] }) {
  const { toast } = useToast();
  const [dependentes, setDependentes] = useState(dependentesIniciais);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [editando, setEditando] = useState<DependentData | null>(null);
  const [paraExcluir, setParaExcluir] = useState<DependentData | null>(null);

  const handleSaved = (dep: DependentData) => {
    if (editando) {
      setDependentes((atual) => atual.map((d) => (d.id === editando.id ? { ...dep, id: editando.id } : d)));
    } else {
      // Sem o id real ainda (a action não retorna); recarrega a lista via navegação simples não é ideal,
      // então mostramos com um id temporário até a próxima navegação trazer o real.
      setDependentes((atual) => [...atual, { ...dep, id: `temp-${Date.now()}` }]);
    }
    setEditando(null);
  };

  const handleExcluir = async () => {
    if (!paraExcluir) return;
    setDependentes((atual) => atual.filter((d) => d.id !== paraExcluir.id));
    const resultado = await excluirDependente(paraExcluir.id);
    if (!resultado.ok) {
      toast({ variant: 'destructive', title: 'Não foi possível excluir', description: resultado.erro });
    }
    setParaExcluir(null);
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => { setEditando(null); setDialogAberto(true); }}>
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Dependente
      </Button>

      {dependentes.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          Você ainda não cadastrou nenhum dependente.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dependentes.map((dep) => (
            <Card key={dep.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{dep.firstName}</p>
                    <p className="text-sm text-muted-foreground">
                      {[dep.relationship, dep.age ? `${dep.age} anos` : null].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditando(dep); setDialogAberto(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setParaExcluir(dep)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {dep.notes && <p className="text-sm text-foreground/80 whitespace-pre-wrap">{dep.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DependentDialog
        open={dialogAberto}
        onOpenChange={setDialogAberto}
        dependente={editando}
        onSaved={handleSaved}
      />

      <AlertDialog open={!!paraExcluir} onOpenChange={(open) => !open && setParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {paraExcluir?.firstName}?</AlertDialogTitle>
            <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluir} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function JournalDialog({
  open,
  onOpenChange,
  entrada,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entrada: JournalEntryData | null;
  onSaved: (entry: JournalEntryData) => void;
}) {
  const { toast } = useToast();
  const hoje = new Date().toISOString().slice(0, 10);
  const [entryDate, setEntryDate] = useState(entrada?.entryDate ?? hoje);
  const [mood, setMood] = useState(entrada?.mood ?? MOODS[0]);
  const [content, setContent] = useState(entrada?.content ?? '');
  const [salvando, setSalvando] = useState(false);

  const handleOpenChange = (novoEstado: boolean) => {
    if (novoEstado) {
      setEntryDate(entrada?.entryDate ?? hoje);
      setMood(entrada?.mood ?? MOODS[0]);
      setContent(entrada?.content ?? '');
    }
    onOpenChange(novoEstado);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSalvando(true);
    const resultado = entrada
      ? await atualizarEntradaDiario(entrada.id, mood, content)
      : await criarEntradaDiario(entryDate, mood, content);
    setSalvando(false);

    if (!resultado.ok) {
      toast({ variant: 'destructive', title: 'Não foi possível salvar', description: resultado.erro });
      return;
    }

    toast({ title: entrada ? 'Entrada atualizada!' : 'Entrada salva!' });
    onSaved({
      id: entrada?.id ?? `temp-${Date.now()}`,
      entryDate,
      date: entrada?.date ?? entryDate,
      mood,
      content: content.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{entrada ? 'Editar Entrada' : 'Nova Entrada no Diário'}</DialogTitle>
          <DialogDescription>Um espaço só seu para registrar como você está.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!entrada && (
              <div className="space-y-2">
                <Label htmlFor="entry-date">Data</Label>
                <Input id="entry-date" type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="entry-mood">Como você está?</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger id="entry-mood">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOODS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="entry-content">O que aconteceu?</Label>
              <Textarea id="entry-content" rows={5} value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={salvando || content.trim().length < 2}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function JournalTab({ entradasIniciais }: { entradasIniciais: JournalEntryData[] }) {
  const { toast } = useToast();
  const [entradas, setEntradas] = useState(entradasIniciais);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [editando, setEditando] = useState<JournalEntryData | null>(null);
  const [paraExcluir, setParaExcluir] = useState<JournalEntryData | null>(null);

  const handleSaved = (entry: JournalEntryData) => {
    if (editando) {
      setEntradas((atual) => atual.map((e) => (e.id === editando.id ? { ...entry, id: editando.id, date: editando.date } : e)));
    } else {
      setEntradas((atual) => [entry, ...atual]);
    }
    setEditando(null);
  };

  const handleExcluir = async () => {
    if (!paraExcluir) return;
    setEntradas((atual) => atual.filter((e) => e.id !== paraExcluir.id));
    const resultado = await excluirEntradaDiario(paraExcluir.id);
    if (!resultado.ok) {
      toast({ variant: 'destructive', title: 'Não foi possível excluir', description: resultado.erro });
    }
    setParaExcluir(null);
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => { setEditando(null); setDialogAberto(true); }}>
        <Plus className="mr-2 h-4 w-4" />
        Nova Entrada
      </Button>

      {entradas.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          Seu diário está vazio. Registre como você está se sentindo hoje.
        </p>
      ) : (
        <div className="space-y-3">
          {entradas.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{entry.date}</span>
                    {entry.mood && <Badge variant="secondary">{entry.mood}</Badge>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditando(entry); setDialogAberto(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setParaExcluir(entry)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{entry.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <JournalDialog
        open={dialogAberto}
        onOpenChange={setDialogAberto}
        entrada={editando}
        onSaved={handleSaved}
      />

      <AlertDialog open={!!paraExcluir} onOpenChange={(open) => !open && setParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir esta entrada?</AlertDialogTitle>
            <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluir} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function MeuEspacoClient({
  dependentesIniciais,
  entradasIniciais,
}: {
  dependentesIniciais: DependentData[];
  entradasIniciais: JournalEntryData[];
}) {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <HeaderSecondary />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <HeartHandshake className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-headline">Meu Espaço</h1>
                <p className="text-muted-foreground">Cuidar de alguém começa por cuidar de si.</p>
              </div>
            </div>

            <Tabs defaultValue="dependentes">
              <TabsList>
                <TabsTrigger value="dependentes">
                  <Users className="mr-2 h-4 w-4" />
                  Dependentes
                </TabsTrigger>
                <TabsTrigger value="diario">
                  <BookHeart className="mr-2 h-4 w-4" />
                  Diário
                </TabsTrigger>
              </TabsList>
              <TabsContent value="dependentes" className="mt-6">
                <DependentsTab dependentesIniciais={dependentesIniciais} />
              </TabsContent>
              <TabsContent value="diario" className="mt-6">
                <JournalTab entradasIniciais={entradasIniciais} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
