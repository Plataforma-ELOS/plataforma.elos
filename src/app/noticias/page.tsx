// src/app/noticias/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ArrowRight } from 'lucide-react';
import NewsCard from '@/components/news/news-card';

const newsArticles = [
  {
    slug: 'nova-lei-amplia-direitos-no-trabalho',
    title: 'Nova Lei Amplia Direitos para Cuidadores no Ambiente de Trabalho',
    description: 'Entenda as principais mudanças na legislação que garantem mais flexibilidade e apoio para pais e responsáveis por pessoas com TEA.',
    imageUrl: 'https://placehold.co/1200x600.png',
    imageHint: 'gavel justice law',
    category: 'Legislação',
    date: '1 de Agosto de 2024',
  },
  {
    slug: 'tecnologia-assistiva-para-comunicacao',
    title: 'Tecnologia Assistiva: Aplicativos que Fazem a Diferença na Comunicação',
    description: 'Conheça ferramentas e aplicativos inovadores que estão ajudando crianças e adultos com TEA a se comunicarem de forma mais eficaz.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'tablet communication',
    category: 'Tecnologia',
    date: '28 de Julho de 2024',
  },
  {
    slug: 'importancia-diagnostico-precoce',
    title: 'A Importância do Diagnóstico Precoce e da Intervenção Imediata',
    description: 'Especialistas destacam como a identificação dos sinais do TEA nos primeiros anos de vida pode transformar o desenvolvimento da criança.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'child development puzzle',
    category: 'Saúde',
    date: '25 de Julho de 2024',
  },
  {
    slug: 'evento-comunitario-promove-inclusao',
    title: 'Evento Comunitário em São Paulo Promove Inclusão Através da Arte',
    description: 'Oficinas de arte e música reúnem mais de 200 famílias e reforçam a importância da inclusão social para pessoas com TEA.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'community art event',
    category: 'Comunidade',
    date: '22 de Julho de 2024',
  }
];

export default function NewsPage() {
  const featuredArticle = newsArticles[0];
  const otherArticles = newsArticles.slice(1);

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
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Notícias e Artigos</h1>
            <p className="max-w-[700px] text-foreground/80 md:text-xl">
              Mantenha-se atualizado com as últimas novidades, pesquisas e histórias da comunidade TEA.
            </p>
          </div>

          {/* Featured Article */}
          <div className="mb-16 group">
            <Link href={`/noticias/${featuredArticle.slug}`}>
              <div className="relative bg-card rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-500 transform hover:-translate-y-2">
                <Image
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  width={1200}
                  height={600}
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  data-ai-hint={featuredArticle.imageHint}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
                  <Badge variant="default" className="mb-4 bg-primary/90 text-primary-foreground">{featuredArticle.category}</Badge>
                  <h2 className="text-3xl md:text-5xl font-bold font-headline max-w-4xl leading-tight">{featuredArticle.title}</h2>
                  <p className="mt-2 text-lg text-white/80 max-w-2xl hidden md:block">{featuredArticle.description}</p>
                  <div className="mt-6 flex items-center gap-2 font-semibold text-primary group-hover:underline">
                      Ler artigo completo <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Other Articles */}
          <h3 className="text-3xl font-bold mb-8 text-center md:text-left">Últimas Notícias</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherArticles.map((article, index) => (
              <NewsCard key={article.slug} article={article} index={index} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
