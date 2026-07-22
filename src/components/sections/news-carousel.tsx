// src/components/sections/news-carousel.tsx
"use client";
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Link from 'next/link';
import { Badge } from '../ui/badge';

const newsArticles = [
  {
    slug: 'nova-lei-amplia-direitos-no-trabalho',
    title: 'Nova Lei Amplia Direitos para Cuidadores no Trabalho',
    category: 'Legislação',
    src: '/noticias/noticia-1.jpg',
    alt: 'Notícia 1',
    hint: 'gavel justice law'
  },
  {
    slug: 'tecnologia-assistiva-para-comunicacao',
    title: 'Tecnologia na Comunicação e Aplicativos Assistivos',
    category: 'Tecnologia',
    src: '/noticias/noticia-2.jpg',
    alt: 'Notícia 2',
    hint: 'tablet communication'
  },
  {
    slug: 'importancia-diagnostico-precoce',
    title: 'A Importância Crítica do Diagnóstico Precoce',
    category: 'Saúde',
    src: '/noticias/noticia-3.jpg',
    alt: 'Notícia 3',
    hint: 'child development puzzle'
  },
  {
    slug: 'evento-comunitario-promove-inclusao',
    title: 'Evento Comunitário Promove Inclusão Através da Arte',
    category: 'Comunidade',
    src: '/noticias/noticia-4.jpg',
    alt: 'Notícia 4',
    hint: 'community art event'
  }
];

export default function NewsCarousel() {
  return (
    <section className="w-full py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Bloco de Título e Subtítulo */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Últimas notícias
          </h2>
          <p className="max-w-[700px] text-foreground/80 md:text-xl">
            Fique por dentro das principais novidades, pesquisas e histórias da comunidade TEA.
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
            }),
          ]}
          className="w-full relative"
        >
          <CarouselContent className="-ml-4 px-4">
            {newsArticles.map((article, index) => (
              <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <Link 
                  href={`/noticias/${article.slug}`} 
                  className="block group relative h-[180px] w-full overflow-hidden rounded-2xl border border-border/40 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  
                  {/* Imagem de Fundo Completa */}
                  <Image
                    src={article.src}
                    alt={article.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    data-ai-hint={article.hint}
                    priority={index < 3}
                  />
                  
                  {/* Gradiente sutil inferior */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  {/* Conteúdo sobreposto */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white z-10">
                    <div className="space-y-2 min-w-0">
                      
                      <Badge className="bg-[#2b5694] group-hover:bg-[#2b5694]/75 text-[#e2e8f0] border-none rounded-xl px-3 py-1 text-[11px] font-semibold tracking-wide w-fit shadow-sm transition-all duration-300">
                        {article.category}
                      </Badge>
                      
                      <h3 className="font-bold text-sm md:text-base leading-snug font-headline text-white line-clamp-2 transition-colors">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                  
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Efeito de desfoque nas bordas laterais */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none hidden xl:block" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none hidden xl:block" />
          
          {/* Setas de navegação */}
          <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2 z-20 bg-background/80 border-border text-foreground hover:bg-background shadow-md" />
          <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2 z-20 bg-background/80 border-border text-foreground hover:bg-background shadow-md" />
        </Carousel>
        
      </div>
    </section>
  );
}