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
import { atualizarVerificacao, aprovarItemAcervo, rejeitarItemAcervo } from '@/app/actions/admin';

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

type ItemAcervoPendente = {
  id: string;
  title: string;
  type: string;
  author_name: string | null;
  action_url: string | null;
  tags: string[];
  created_at: string;
};

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

function AcervoTab({ itensIniciais }: { itensIniciais: ItemAcervoPendente[] }) {
  const { toast } = useToast();
  const [itens, setItens] = useState(itensIniciais);

  const handleAprovar = async (id: string) => {
    setItens((atual) => atual.filter((i) => i.id !== id));
    const resultado = await aprovarItemAcervo(id);
    if (!resultado.ok) {
      toast({ variant: 'destructive', title: 'Não foi possível aprovar', description: resultado.erro });
    }
  };

  const handleRejeitar = async (id: string) => {
    setItens((atual) => atual.filter((i) => i.id !== id));
    const resultado = await rejeitarItemAcervo(id);
    if (!resultado.ok) {
      toast({ variant: 'destructive', title: 'Não foi possível rejeitar', description: resultado.erro });
    }
  };

  if (itens.length === 0) {
    return <p className="text-muted-foreground text-center py-12">Nenhum item sugerido pendente no momento.</p>;
  }

  return (
    <div className="space-y-3">
      {itens.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{item.title}</p>
                  <Badge variant="secondary">{item.type}</Badge>
                </div>
                {item.author_name && <p className="text-sm text-muted-foreground">Autor: {item.author_name}</p>}
                {item.action_url && (
                  <a
                    href={item.action_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-strong hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    {item.action_url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleAprovar(item.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Aprovar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleRejeitar(item.id)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Rejeitar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminClient({
  professionaisIniciais,
  clinicasIniciais,
  itensAcervoIniciais,
}: {
  professionaisIniciais: ProfissionalPendente[];
  clinicasIniciais: ClinicaPendente[];
  itensAcervoIniciais: ItemAcervoPendente[];
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
                <p className="text-muted-foreground">Verificações e itens do acervo pendentes de aprovação.</p>
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
                <AcervoTab itensIniciais={itensAcervoIniciais} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
