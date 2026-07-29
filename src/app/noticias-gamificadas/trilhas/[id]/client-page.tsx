// src/app/noticias-gamificadas/trilhas/[id]/client-page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { alternarPassoConcluido } from '@/app/actions/knowledge';
import type { KnowledgeTrailStep } from '@/lib/data/knowledge';

export default function TrailDetailClient({
  trail,
  stepsIniciais,
}: {
  trail: { id: string; title: string; description: string };
  stepsIniciais: KnowledgeTrailStep[];
}) {
  const { toast } = useToast();
  const [steps, setSteps] = useState(stepsIniciais);

  const concluidos = steps.filter((s) => s.completed).length;
  const progresso = steps.length ? Math.round((concluidos / steps.length) * 100) : 0;

  const handleToggle = async (stepId: string) => {
    setSteps((atual) => atual.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s)));

    const resultado = await alternarPassoConcluido(trail.id, stepId);
    if (!resultado.ok) {
      setSteps((atual) => atual.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s)));
      toast({ variant: 'destructive', title: 'Não foi possível salvar', description: resultado.erro });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderSecondary />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/noticias-gamificadas" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="w-4 h-4" />
              Voltar para Trilhas
            </Link>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-3xl">{trail.title}</CardTitle>
                <CardDescription>{trail.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Progress value={progresso} className="flex-1" />
                  <span className="text-sm font-semibold text-primary-strong shrink-0">{progresso}%</span>
                </div>
              </CardContent>
            </Card>

            {steps.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Esta trilha ainda não tem passos cadastrados.</p>
            ) : (
              <Accordion type="multiple" className="bg-card rounded-2xl shadow-lg px-6">
                {steps.map((step, index) => (
                  <AccordionItem key={step.id} value={step.id}>
                    <AccordionTrigger className="text-left">
                      <span className="flex items-center gap-3">
                        {step.completed && <CheckCircle2 className="h-5 w-5 text-primary-strong shrink-0" />}
                        <span>{index + 1}. {step.title}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-4">{step.content}</p>
                      <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <Checkbox checked={step.completed} onCheckedChange={() => handleToggle(step.id)} />
                        Concluí esta etapa
                      </label>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
