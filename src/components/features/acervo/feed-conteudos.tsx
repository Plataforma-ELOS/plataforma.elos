"use client";

// Cards do Acervo Digital: orientações de profissionais e clínicas e relatos
// de cuidadores (tabela feed_contents), com leitura completa num Dialog.
// Conteúdos de perfis demonstrativos (is_demo) sempre levam o selo — não são
// depoimentos reais.
import { useState } from 'react';
import Image from 'next/image';
import { Bookmark, Building2, ExternalLink, HeartHandshake, Lightbulb, Stethoscope, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { type BlocoTexto, type FeedContent, type FeedKind } from '@/lib/data/feed-contents';

// Classes completas (o Tailwind só gera o que aparece literal no código).
const ESTILO: Record<FeedKind, { badge: string; fundo: string; icone: LucideIcon; borda: string }> = {
  profissional: {
    badge: 'bg-tipo-profissional-suave text-tipo-profissional',
    fundo: 'bg-tipo-profissional-suave text-tipo-profissional',
    borda: 'border-t-tipo-profissional',
    icone: Stethoscope,
  },
  clinica: {
    badge: 'bg-tipo-clinica-suave text-tipo-clinica',
    fundo: 'bg-tipo-clinica-suave text-tipo-clinica',
    borda: 'border-t-tipo-clinica',
    icone: Building2,
  },
  cuidador: {
    badge: 'bg-tipo-cuidador-suave text-tipo-cuidador',
    fundo: 'bg-tipo-cuidador-suave text-tipo-cuidador',
    borda: 'border-t-tipo-cuidador',
    icone: HeartHandshake,
  },
};

function avisoDemonstrativo(conteudo: FeedContent): string {
  return conteudo.kind === 'cuidador'
    ? 'Relato demonstrativo, inspirado em estratégias descritas em materiais de orientação familiar e pesquisas. Não é um depoimento real.'
    : 'Perfil demonstrativo: conteúdo de exemplo, baseado nas fontes técnicas citadas abaixo.';
}

function Ilustracao({ conteudo, className }: { conteudo: FeedContent; className?: string }) {
  const { fundo, icone: Icone } = ESTILO[conteudo.kind];
  if (conteudo.imageUrl) {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        <Image
          src={conteudo.imageUrl}
          alt={conteudo.imageAlt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }
  // Sem foto: bloco na cor do tipo, decorativo (o título já diz o assunto).
  return (
    <div className={cn('flex items-center justify-center', fundo, className)} aria-hidden="true">
      <Icone className="h-12 w-12 opacity-80" />
    </div>
  );
}

function Blocos({ blocos }: { blocos: BlocoTexto[] }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
      {blocos.map((bloco, i) =>
        bloco.tipo === 'paragrafo' ? (
          <p key={i}>{bloco.texto}</p>
        ) : bloco.ordenada ? (
          <ol key={i} className="list-decimal space-y-1 pl-5">
            {bloco.itens.map((item, j) => <li key={j}>{item}</li>)}
          </ol>
        ) : (
          <ul key={i} className="list-disc space-y-1 pl-5">
            {bloco.itens.map((item, j) => <li key={j}>{item}</li>)}
          </ul>
        ),
      )}
    </div>
  );
}

function SeloTipo({ conteudo }: { conteudo: FeedContent }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge className={cn('border-transparent hover:bg-inherit', ESTILO[conteudo.kind].badge)}>{conteudo.kindLabel}</Badge>
      {conteudo.isDemo && (
        <Badge variant="outline" className="font-normal text-muted-foreground">
          Perfil demonstrativo
        </Badge>
      )}
    </div>
  );
}

function LeituraCompleta({ conteudo, aberto, onOpenChange }: { conteudo: FeedContent; aberto: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="space-y-3 text-left">
          <SeloTipo conteudo={conteudo} />
          <DialogTitle className="text-2xl leading-tight">{conteudo.title}</DialogTitle>
          <DialogDescription>
            {conteudo.authorLabel} · {conteudo.date}
          </DialogDescription>
        </DialogHeader>

        {conteudo.imageUrl && <Ilustracao conteudo={conteudo} className="aspect-video w-full rounded-xl" />}

        <Blocos blocos={conteudo.blocos} />

        {conteudo.tip && (
          <div className={cn('flex gap-3 rounded-xl p-4 text-sm', ESTILO[conteudo.kind].fundo)}>
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>
              <strong>Dica:</strong> {conteudo.tip}
            </p>
          </div>
        )}

        {conteudo.sources.length > 0 && (
          <section aria-labelledby={`fontes-${conteudo.slug}`} className="space-y-2">
            <h3 id={`fontes-${conteudo.slug}`} className="text-sm font-semibold">Fontes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {conteudo.sources.map((fonte, i) => (
                <li key={i}>
                  <span className="font-medium text-foreground">{fonte.titulo}</span>
                  {fonte.descricao && <> — {fonte.descricao}</>}
                  {fonte.url && (
                    <>
                      {' '}
                      <a
                        href={fonte.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-primary-strong underline-offset-2 hover:underline"
                      >
                        Consultar
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only">(abre em nova aba)</span>
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {conteudo.isDemo && (
          <p className="border-t pt-3 text-xs text-muted-foreground">{avisoDemonstrativo(conteudo)}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

type PropsSalvar = {
  /** Se o conteúdo está nos salvos de quem vê. Sem `onAlternarSalvo`, o botão não aparece. */
  salvo?: boolean;
  onAlternarSalvo?: (id: string) => void;
};

export function CardConteudo({ conteudo, salvo = false, onAlternarSalvo }: { conteudo: FeedContent } & PropsSalvar) {
  const [aberto, setAberto] = useState(false);
  return (
    <Card className={cn('flex h-full flex-col overflow-hidden border-t-4', ESTILO[conteudo.kind].borda)}>
      <Ilustracao conteudo={conteudo} className="aspect-video w-full" />
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <SeloTipo conteudo={conteudo} />
        <h3 className="text-lg font-bold leading-snug">{conteudo.title}</h3>
        <p className="text-xs text-muted-foreground">
          {conteudo.authorLabel} · {conteudo.date}
        </p>
        <p className="line-clamp-3 flex-1 text-sm text-foreground/80">{conteudo.resumo}</p>
        <div className="flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" onClick={() => setAberto(true)}>
            Ler mais<span className="sr-only">: {conteudo.title}</span>
          </Button>
          {onAlternarSalvo && (
            <Button
              variant="ghost"
              size="icon"
              aria-pressed={salvo}
              aria-label={salvo ? `Remover dos salvos: ${conteudo.title}` : `Salvar: ${conteudo.title}`}
              title={salvo ? 'Remover dos salvos' : 'Salvar para ver depois'}
              onClick={() => onAlternarSalvo(conteudo.id)}
            >
              <Bookmark className={cn('h-5 w-5', salvo && 'fill-current text-primary-strong')} />
            </Button>
          )}
        </div>
      </CardContent>
      <LeituraCompleta conteudo={conteudo} aberto={aberto} onOpenChange={setAberto} />
    </Card>
  );
}

/**
 * Grade de conteúdos do Acervo. Busca, filtro por tipo e ordenação ficam na
 * barra do topo da página (src/app/acervo-digital/client-page.tsx); aqui
 * chega a lista já filtrada.
 */
export default function GradeConteudos({
  conteudos,
  salvos,
  onAlternarSalvo,
}: {
  conteudos: FeedContent[];
  salvos?: ReadonlySet<string>;
  onAlternarSalvo?: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in-0 duration-500">
      {conteudos.map((c) => (
        <CardConteudo key={c.slug} conteudo={c} salvo={salvos?.has(c.id)} onAlternarSalvo={onAlternarSalvo} />
      ))}
    </div>
  );
}
