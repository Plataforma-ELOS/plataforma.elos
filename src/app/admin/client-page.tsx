// src/app/admin/client-page.tsx
"use client";

import { useState } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Check, X, BadgeCheck, Library, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { atualizarVerificacao, aprovarConteudo, rejeitarConteudo } from '@/app/actions/admin';
import type { FeedContent } from '@/lib/data/feed-contents';

type ProfissionalPendente = {
  id: string;
  display_name: string;
  specialty: string | null;
  kind: string;
  verification_status: string;
  created_at: string;
};

type ClinicaPendente = {
  id: string;
  name: string;
  specialty: string | null;
  verification_status: string;
  created_at: string;
};

/** Conteúdo sugerido em "Adicionar ao Acervo", aguardando aprovação. */
export type ConteudoPendente = FeedContent;

function VerificacoesTab({
  profissionaisIniciais,
  clinicasIniciais,
}: {
  profissionaisIniciais: ProfissionalPendente[];
  clinicasIniciais: ClinicaPendente[];
}) {
  const { toast } = useToast();
  const [profissionais, setProfissionais] = useState(profissionaisIniciais);
  const [clinicas, setClinicas] = useState(clinicasIniciais);

  const handleVerificar = async (tipo: 'professional' | 'clinic', id: string, status: 'verified' | 'rejected') => {
    if (tipo === 'professional') {
      setProfissionais((atual) => atual.filter((p) => p.id !== id));
    } else {
      setClinicas((atual) => atual.filter((c) => c.id !== id));
    }
    const resultado = await atualizarVerificacao(tipo, id, status);
    if (!resultado.ok) {
      toast({ variant: 'destructive', title: 'Não foi possível atualizar', description: resultado.erro });
    }
  };

  const pendentes = [
    ...profissionais.map((p) => ({ ...p, tipo: 'professional' as const, nome: p.display_name })),
    ...clinicas.map((c) => ({ ...c, tipo: 'clinic' as const, nome: c.name })),
  ];

  if (pendentes.length === 0) {
    return <p className="text-muted-foreground text-center py-12">Nenhuma verificação pendente no momento.</p>;
  }

  return (
    <div className="space-y-3">
      {pendentes.map((item) => (
        <Card key={`${item.tipo}-${item.id}`}>
          <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{item.nome}</p>
                <Badge variant="secondary">{item.tipo === 'professional' ? 'Profissional' : 'Clínica'}</Badge>
              </div>
              {item.specialty && <p className="text-sm text-muted-foreground">{item.specialty}</p>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleVerificar(item.tipo, item.id, 'verified')}>
                <Check className="mr-2 h-4 w-4" />
                Aprovar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => handleVerificar(item.tipo, item.id, 'rejected')}
              >
                <X className="mr-2 h-4 w-4" />
                Rejeitar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AcervoTab({ conteudosIniciais }: { conteudosIniciais: ConteudoPendente[] }) {
  const { toast } = useToast();
  const [conteudos, setConteudos] = useState(conteudosIniciais);

  const decidir = async (id: string, aprovar: boolean) => {
    setConteudos((atual) => atual.filter((c) => c.id !== id));
    const resultado = aprovar ? await aprovarConteudo(id) : await rejeitarConteudo(id);
    if (!resultado.ok) {
      toast({
        variant: 'destructive',
        title: aprovar ? 'Não foi possível aprovar' : 'Não foi possível rejeitar',
        description: resultado.erro,
      });
    }
  };

  if (conteudos.length === 0) {
    return <p className="text-muted-foreground text-center py-12">Nenhum conteúdo sugerido pendente no momento.</p>;
  }

  return (
    <div className="space-y-3">
      {conteudos.map((c) => (
        <Card key={c.id}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">{c.kindLabel}</Badge>
                  <p className="font-semibold">{c.title}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {c.authorLabel} · enviado em {c.date}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => decidir(c.id, true)}>
                  <Check className="mr-2 h-4 w-4" />
                  Aprovar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => decidir(c.id, false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Rejeitar
                </Button>
              </div>
            </div>

            {/* O admin precisa ler tudo antes de publicar. */}
            <details className="rounded-md border p-3 text-sm">
              <summary className="cursor-pointer font-medium">Ler o conteúdo completo</summary>
              <div className="mt-3 space-y-3">
                {c.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.imageUrl} alt={c.imageAlt} className="max-h-48 rounded-md object-cover" />
                )}
                {c.blocos.map((b, i) =>
                  b.tipo === 'paragrafo' ? (
                    <p key={i}>{b.texto}</p>
                  ) : (
                    <ul key={i} className={b.ordenada ? 'list-decimal pl-5' : 'list-disc pl-5'}>
                      {b.itens.map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
                  ),
                )}
                {c.tip && <p><strong>Dica:</strong> {c.tip}</p>}
                {c.sources.length > 0 && (
                  <ul className="space-y-1">
                    {c.sources.map((f, i) => (
                      <li key={i}>
                        {f.titulo}
                        {f.url && (
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-primary-strong hover:underline inline-flex items-center gap-1"
                          >
                            {f.url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminClient({
  professionaisIniciais,
  clinicasIniciais,
  conteudosPendentes,
}: {
  professionaisIniciais: ProfissionalPendente[];
  clinicasIniciais: ClinicaPendente[];
  conteudosPendentes: ConteudoPendente[];
}) {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <HeaderSecondary />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <ShieldCheck className="h-6 w-6 text-primary-strong" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-headline">Painel Administrativo</h1>
                <p className="text-muted-foreground">Verificações e conteúdos do acervo pendentes de aprovação.</p>
              </div>
            </div>

            <Tabs defaultValue="verificacoes">
              <TabsList>
                <TabsTrigger value="verificacoes">
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Verificações
                </TabsTrigger>
                <TabsTrigger value="acervo">
                  <Library className="mr-2 h-4 w-4" />
                  Acervo
                </TabsTrigger>
              </TabsList>
              <TabsContent value="verificacoes" className="mt-6">
                <VerificacoesTab profissionaisIniciais={professionaisIniciais} clinicasIniciais={clinicasIniciais} />
              </TabsContent>
              <TabsContent value="acervo" className="mt-6">
                <AcervoTab conteudosIniciais={conteudosPendentes} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
