
// src/app/noticias-gamificadas/page.tsx
import Link from 'next/link';
import { cookies } from 'next/headers';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Puzzle, Lightbulb, Newspaper, CheckCircle, Sparkles } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

// Nao ha coluna de icone no banco — mapeamos pela categoria (texto livre,
// mas hoje limitada a estas 3 no seed). Categoria nao mapeada cai no icone
// padrao.
const ICONE_POR_CATEGORIA: Record<string, React.ReactNode> = {
  'Direitos': <Award className="h-6 w-6 text-yellow-500" />,
  'Bem-estar': <Lightbulb className="h-6 w-6 text-green-500" />,
  'Saúde': <CheckCircle className="h-6 w-6 text-blue-500" />,
};
const ICONE_PADRAO = <Sparkles className="h-6 w-6 text-primary" />;

export default async function NewsGamifiedPage() {
  const supabase = createClient(await cookies());

  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: pillRows }, { data: trailRows }, { data: progressRows }] = await Promise.all([
    supabase.from('knowledge_pills').select('title, content, category'),
    supabase.from('knowledge_trails').select('id, title, description'),
    user
      ? supabase.from('trail_progress').select('trail_id, progress').eq('profile_id', user.id)
      : Promise.resolve({ data: [] as { trail_id: string; progress: number }[] }),
  ]);

  const knowledgePills = (pillRows ?? []).map((p) => ({
    title: p.title,
    content: p.content,
    category: p.category ?? '',
    icon: ICONE_POR_CATEGORIA[p.category ?? ''] ?? ICONE_PADRAO,
  }));

  const progressByTrail = new Map((progressRows ?? []).map((p) => [p.trail_id, p.progress]));
  const knowledgeTrails = (trailRows ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description ?? '',
    progress: progressByTrail.get(t.id) ?? 0,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderSecondary />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Newspaper className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Pílulas de Conhecimento</h1>
            <p className="max-w-[700px] text-foreground/80 md:text-xl">
              Aprenda de forma rápida e divertida com nossos cards de informação e trilhas de conhecimento.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Pílulas de Conhecimento */}
            <h2 className="text-2xl font-bold mb-4">Destaques da Semana</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {knowledgePills.map((pill, index) => (
                <Card key={index} className="flex flex-col justify-between p-6 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      {pill.icon}
                      <CardTitle className="text-lg font-semibold">{pill.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{pill.content}</p>
                  </div>
                  <div className="mt-4">
                     <Link href="/noticias" className="text-sm font-semibold text-primary hover:underline">
                        Saber mais
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {/* Trilhas de Conhecimento */}
            <h2 className="text-2xl font-bold mb-4">Suas Trilhas de Conhecimento</h2>
            <div className="space-y-4 mb-12">
              {knowledgeTrails.map((trail) => (
                <Card key={trail.id} className="p-6 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle>{trail.title}</CardTitle>
                        <CardDescription>{trail.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="flex items-center gap-4">
                            <div className="w-full bg-muted rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${trail.progress}%` }}></div>
                            </div>
                            <span className="text-sm font-semibold text-primary">{trail.progress}%</span>
                        </div>
                        <Button className="mt-4">Continuar Trilha</Button>
                    </CardContent>
                </Card>
              ))}
            </div>

            {/* Quiz Semanal */}
            <h2 className="text-2xl font-bold mb-4">Teste seus Conhecimentos</h2>
            <Card className="p-6 rounded-2xl text-center bg-primary/10 border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
              <Puzzle className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">Quiz da Semana!</CardTitle>
              <p className="text-muted-foreground mb-4">Acerte as perguntas sobre as notícias da semana e ganhe pontos.</p>
              <Button>Começar Quiz</Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

    