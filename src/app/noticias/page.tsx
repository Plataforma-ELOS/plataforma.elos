
// src/app/noticias/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper } from 'lucide-react';

const newsArticles = [
  {
    slug: 'nova-lei-amplia-direitos-no-trabalho',
    title: 'Nova Lei Amplia Direitos para Cuidadores no Ambiente de Trabalho',
    description: 'Entenda as principais mudanças na legislação que garantem mais flexibilidade e apoio para pais e responsáveis por pessoas com TEA.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'gavel justice',
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.map((article) => (
              <Link key={article.slug} href={`/noticias/${article.slug}`} className="group">
                <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                  <div className="relative">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      width={600}
                      height={400}
                      className="w-full h-56 object-cover"
                      data-ai-hint={article.imageHint}
                    />
                     <div className="absolute top-0 left-0 w-full h-full bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <Badge variant="default" className="mb-2 self-start bg-primary/80 text-primary-foreground">{article.category}</Badge>
                    <h3 className="text-xl font-bold mb-2 flex-grow">{article.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{article.description}</p>
                    <p className="text-xs text-muted-foreground mt-auto">{article.date}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
