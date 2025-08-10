
// src/app/noticias-ai/[slug]/page.tsx
"use client";

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, Search, Terminal } from 'lucide-react';
import { askAboutArticle } from '@/ai/flows/news-flow';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';


const newsArticles = [
  {
    slug: 'nova-lei-amplia-direitos-no-trabalho',
    title: 'Nova Lei Amplia Direitos para Cuidadores no Ambiente de Trabalho',
    description: 'Entenda as principais mudanças na legislação que garantem mais flexibilidade e apoio para pais e responsáveis por pessoas com TEA.',
    imageUrl: 'https://placehold.co/1200x600.png',
    imageHint: 'gavel justice',
    category: 'Legislação',
    author: 'Redação Elos',
    date: '1 de Agosto de 2024',
    content: `
<p>Uma nova legislação, sancionada na última semana, representa um marco significativo para os direitos dos cuidadores de pessoas com Transtorno do Espectro Autista (TEA) no Brasil. A lei, que entra em vigor imediatamente, visa oferecer maior suporte e flexibilidade no ambiente de trabalho, reconhecendo os desafios diários enfrentados por essas famílias.</p>
<h3 class="text-2xl font-bold mt-8 mb-4">Principais Pontos da Nova Lei:</h3>
<ul class="list-disc list-inside space-y-2 mb-6">
  <li><strong>Jornada de Trabalho Flexível:</strong> Cuidadores em regime CLT poderão solicitar a flexibilização de horários, incluindo a possibilidade de reduzir a jornada sem prejuízo salarial, mediante acordo com o empregador.</li>
  <li><strong>Faltas Justificadas:</strong> A lei agora permite que o cuidador se ausente do trabalho para acompanhar a pessoa com TEA em consultas médicas, terapias e reuniões escolares, sem que isso seja descontado de seu salário.</li>
  <li><strong>Proibição de Discriminação:</strong> Fica expressamente proibida qualquer forma de discriminação contra cuidadores no processo de contratação, promoção ou demissão.</li>
</ul>
<p>Especialistas em direito trabalhista e ativistas da causa celebram a mudança como um avanço essencial para a inclusão e o bem-estar. "Esta lei não beneficia apenas o cuidador, mas toda a família. Ao oferecer segurança e estabilidade no emprego, garantimos que a pessoa com TEA também receba o suporte necessário", afirma a advogada Maria Fernanda, especialista em direitos da pessoa com deficiência.</p>
<p>A equipe da Elos continuará acompanhando a implementação da lei e oferecendo suporte informativo através de nossa plataforma. Para mais detalhes, consulte a seção de 'Direitos' no nosso Suporte IA.</p>
`
  },
  {
    slug: 'tecnologia-assistiva-para-comunicacao',
    title: 'Tecnologia Assistiva: Aplicativos que Fazem a Diferença na Comunicação',
    description: 'Conheça ferramentas e aplicativos inovadores que estão ajudando crianças e adultos com TEA a se comunicarem de forma mais eficaz.',
    imageUrl: 'https://placehold.co/1200x600.png',
    imageHint: 'tablet communication',
    category: 'Tecnologia',
    author: 'Equipe Elos',
    date: '28 de Julho de 2024',
    content: '<p>O conteúdo para este artigo ainda está sendo preparado. Volte em breve!</p>'
  },
  {
    slug: 'importancia-diagnostico-precoce',
    title: 'A Importância do Diagnóstico Precoce e da Intervenção Imediata',
    description: 'Especialistas destacam como a identificação dos sinais do TEA nos primeiros anos de vida pode transformar o desenvolvimento da criança.',
    imageUrl: 'https://placehold.co/1200x600.png',
    imageHint: 'child development puzzle',
    category: 'Saúde',
    author: 'Equipe Elos',
    date: '25 de Julho de 2024',
    content: '<p>O conteúdo para este artigo ainda está sendo preparado. Volte em breve!</p>'
  },
  {
    slug: 'evento-comunitario-promove-inclusao',
    title: 'Evento Comunitário em São Paulo Promove Inclusão Através da Arte',
    description: 'Oficinas de arte e música reúnem mais de 200 famílias e reforçam a importância da inclusão social para pessoas com TEA.',
    imageUrl: 'https://placehold.co/1200x600.png',
    imageHint: 'community art event',
    category: 'Comunidade',
    author: 'Equipe Elos',
    date: '22 de Julho de 2024',
    content: '<p>O conteúdo para este artigo ainda está sendo preparado. Volte em breve!</p>'
  }
];

function AiChat({ articleContent }: { articleContent: string }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAiResponse(null);
    
    try {
      const response = await askAboutArticle({ article: articleContent, question: query });
      setAiResponse(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description: "Não foi possível processar sua pergunta. Tente novamente.",
      });
      setAiResponse(null);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  return (
    <Card className="mt-12 bg-muted/40">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
                <Terminal className="h-6 w-6" />
                Pergunte à IA sobre esta notícia
            </CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <Input
                    placeholder="Ex: 'Quais os principais pontos da lei?'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                />
                <Button type="submit" disabled={loading}>
                    <Search className="h-4 w-4 mr-2" />
                    Perguntar
                </Button>
            </form>
            {loading && (
                <div className="space-y-2 pt-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            )}
            {aiResponse && (
                <div className="pt-4 prose prose-sm max-w-none text-foreground">
                    <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </div>
            )}
        </CardContent>
    </Card>
  );
}


export default function NewsArticleAiPage({ params }: { params: { slug: string } }) {
  const article = newsArticles.find(a => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderSecondary />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/noticias-ai" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
                <ArrowLeft className="w-4 h-4" />
                Voltar para o feed de notícias
            </Link>

            <article>
              <header className="mb-8">
                <Badge variant="default" className="mb-4 bg-primary/80 text-primary-foreground">{article.category}</Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight font-headline mb-4">{article.title}</h1>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{article.date}</span>
                    </div>
                </div>
              </header>

              <Image
                src={article.imageUrl}
                alt={article.title}
                width={1200}
                height={600}
                className="w-full h-auto object-cover rounded-2xl mb-8"
                data-ai-hint={article.imageHint}
                priority
              />

              <div 
                className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </article>

            <AiChat articleContent={article.title + '\n\n' + article.content} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Function to generate static paths
export async function generateStaticParams() {
  return newsArticles.map((article) => ({
    slug: article.slug,
  }));
}
