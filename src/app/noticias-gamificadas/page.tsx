
// src/app/noticias-gamificadas/page.tsx
import Link from 'next/link';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Puzzle, Lightbulb, Newspaper, CheckCircle } from 'lucide-react';

const knowledgePills = [
  {
    title: 'Você sabia?',
    content: 'A Lei Berenice Piana (nº 12.764/2012) garante o direito a um acompanhante especializado na escola para alunos com TEA.',
    category: 'Direitos',
    icon: <Award className="h-6 w-6 text-yellow-500" />,
  },
  {
    title: 'Dica Rápida',
    content: 'Crie um "cantinho da calma" em casa. Um espaço seguro e tranquilo pode ajudar a regular crises sensoriais.',
    category: 'Bem-estar',
    icon: <Lightbulb className="h-6 w-6 text-green-500" />,
  },
  {
    title: 'Fato Importante',
    content: 'O diagnóstico precoce do TEA, idealmente antes dos 3 anos, é crucial para o desenvolvimento de intervenções eficazes.',
    category: 'Saúde',
    icon: <CheckCircle className="h-6 w-6 text-blue-500" />,
  },
];

const knowledgeTrails = [
  {
    title: 'Trilha: Entendendo o Laudo de TEA',
    description: 'Aprenda o passo a passo para obter o laudo, sua importância e como utilizá-lo para garantir direitos.',
    progress: 33,
    steps: 3,
  },
  {
    title: 'Trilha: Primeiros Passos na Escola',
    description: 'Descubra os direitos do seu filho no ambiente escolar, o que é o PEI e como dialogar com a equipe pedagógica.',
    progress: 0,
    steps: 5,
  },
];

export default function NewsGamifiedPage() {
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
              {knowledgeTrails.map((trail, index) => (
                <Card key={index} className="p-6 rounded-2xl">
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
            <Card className="p-6 rounded-2xl text-center bg-primary/10 border-primary/20">
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
