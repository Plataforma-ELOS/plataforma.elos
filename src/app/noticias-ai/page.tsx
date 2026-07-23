
// src/app/noticias-ai/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Terminal, Newspaper, Tags, Search } from 'lucide-react';
import { getNewsSummary } from '@/ai/flows/news-flow';
import { getNews } from '@/lib/data/news';

// Renderiza no momento da requisição (não no build) para não depender da IA
// durante o "next build" e evitar falhas por cota/rede da API do Gemini.
export const dynamic = 'force-dynamic';

async function AiSummaryCard({ newsArticles }: { newsArticles: { title: string }[] }) {
    let summary: string;
    try {
        summary = await getNewsSummary(newsArticles.map(a => a.title));
    } catch (error) {
        console.error('Falha ao gerar o resumo de notícias com IA:', error);
        summary = 'O resumo inteligente das notícias está temporariamente indisponível. Explore os destaques abaixo.';
    }
    return (
        <Card className="mb-8 bg-primary/10 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <Terminal className="h-6 w-6" />
                    Resumo do Dia com IA
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-foreground/80">{summary}</p>
            </CardContent>
        </Card>
    );
}


export default async function NewsAiPage() {
  const newsArticles = await getNews();
  const allTags = [...new Set(newsArticles.flatMap((a) => a.tags))];

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
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Feed de Notícias Inteligente</h1>
            <p className="max-w-[700px] text-foreground/80 md:text-xl">
              Seu feed personalizado com as últimas novidades, resumidas e analisadas por IA.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <AiSummaryCard newsArticles={newsArticles} />

            <div className="flex flex-col gap-4 mb-8">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Tags className="h-5 w-5 text-primary"/> Filtrar por tags</h3>
                <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                        <Button key={tag} variant="outline" className="rounded-full">{tag}</Button>
                    ))}
                </div>
            </div>

            <div className="space-y-8">
                 {newsArticles.map((article, index) => (
                    <Card key={article.slug} className="overflow-hidden rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col md:flex-row animate-in fade-in-0 slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms`}}>
                        <div className="relative md:w-1/3">
                            <Image
                            src={article.imageUrl}
                            alt={article.title}
                            width={400}
                            height={400}
                            className="w-full h-56 md:h-full object-cover"
                            data-ai-hint={article.imageHint}
                            />
                        </div>
                        <div className="md:w-2/3">
                            <CardContent className="p-6 flex flex-col flex-grow h-full">
                                <Badge variant="default" className="mb-2 self-start bg-primary/80 text-primary-foreground">{article.category}</Badge>
                                <h3 className="text-xl font-bold mb-2 flex-grow">{article.title}</h3>
                                <p className="text-muted-foreground text-sm mb-4">{article.description}</p>
                                <div className="flex justify-between items-center mt-auto">
                                    <p className="text-xs text-muted-foreground mt-auto">{article.date}</p>
                                    <Button asChild>
                                        <Link href={`/noticias-ai/${article.slug}`}>Ler e Interagir com IA</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

