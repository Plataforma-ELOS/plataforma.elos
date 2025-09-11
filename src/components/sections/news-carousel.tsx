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
    title: 'Nova Lei Amplia Direitos',
    category: 'Legislação',
    src: 'https://placehold.co/600x400.png',
    alt: 'Notícia 1',
    hint: 'gavel justice law'
  },
  {
    slug: 'tecnologia-assistiva-para-comunicacao',
    title: 'Tecnologia na Comunicação',
    category: 'Tecnologia',
    src: 'https://placehold.co/600x400.png',
    alt: 'Notícia 2',
    hint: 'tablet communication'
  },
  {
    slug: 'importancia-diagnostico-precoce',
    title: 'Diagnóstico Precoce',
    category: 'Saúde',
    src: 'https://placehold.co/600x400.png',
    alt: 'Notícia 3',
    hint: 'child development puzzle'
  },
  {
    slug: 'evento-comunitario-promove-inclusao',
    title: 'Inclusão Através da Arte',
    category: 'Comunidade',
    src: 'https://placehold.co/600x400.png',
    alt: 'Notícia 4',
    hint: 'community art event'
  },
  {
    slug: 'nova-lei-amplia-direitos-no-trabalho',
    title: 'Direitos no Trabalho',
    category: 'Legislação',
    src: 'https://placehold.co/600x400.png',
    alt: 'Notícia 5',
    hint: 'publication'
  },
    {
    slug: 'tecnologia-assistiva-para-comunicacao',
    title: 'Apps para o dia-a-dia',
    category: 'Tecnologia',
    src: 'https://placehold.co/600x400.png',
    alt: 'Notícia 6',
    hint: 'apps on phone'
  },
];

export default function NewsCarousel() {
  return (
    <section className="w-full py-20 md:py-24 bg-primary/10 dark:bg-primary/20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-center mb-16">
          Últimas notícias
        </h2>
      </div>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
              playOnInit: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {newsArticles.concat(newsArticles).map((article, index) => (
              <CarouselItem key={index} className="pl-2 basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Link href={`/noticias/${article.slug}`} className="p-1 block group relative overflow-hidden rounded-lg">
                  <Image
                    src={article.src}
                    alt={article.alt}
                    width={600}
                    height={400}
                    className="rounded-lg object-cover w-full aspect-video transition-transform duration-300 group-hover:scale-110"
                    data-ai-hint={article.hint}
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                   <div className="absolute bottom-0 left-0 p-4 text-white">
                      <Badge variant="secondary" className="mb-1">{article.category}</Badge>
                      <h3 className="font-bold text-sm leading-tight">{article.title}</h3>
                   </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
