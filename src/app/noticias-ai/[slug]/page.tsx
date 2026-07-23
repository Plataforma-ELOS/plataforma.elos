
// src/app/noticias-ai/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { AiChat } from './ai-chat';
import { getNewsBySlug, getAllNewsSlugs } from '@/lib/data/news';

export default async function NewsArticleAiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const conteudoSeguro = DOMPurify.sanitize(article.content);

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
                        <span>{article.authorName || 'Equipe Elos'}</span>
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
                dangerouslySetInnerHTML={{ __html: conteudoSeguro }}
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
  const slugs = await getAllNewsSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}
