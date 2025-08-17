
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

const newsArticles = [
  { slug: 'nova-lei-amplia-direitos-no-trabalho', src: 'https://placehold.co/600x400.png', alt: 'Notícia 1', hint: 'news article' },
  { slug: 'tecnologia-assistiva-para-comunicacao', src: 'https://placehold.co/600x400.png', alt: 'Notícia 2', hint: 'headline' },
  { slug: 'importancia-diagnostico-precoce', src: 'https://placehold.co/600x400.png', alt: 'Notícia 3', hint: 'journalism' },
  { slug: 'evento-comunitario-promove-inclusao', src: 'https://placehold.co/600x400.png', alt: 'Notícia 4', hint: 'report' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 5', hint: 'publication', slug: 'nova-lei-amplia-direitos-no-trabalho' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 6', hint: 'media', slug: 'nova-lei-amplia-direitos-no-trabalho' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 7', hint: 'press', slug: 'nova-lei-amplia-direitos-no-trabalho' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 8', hint: 'news article', slug: 'nova-lei-amplia-direitos-no-trabalho' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 9', hint: 'headline', slug: 'nova-lei-amplia-direitos-no-trabalho' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 10', hint: 'journalism', slug: 'nova-lei-amplia-direitos-no-trabalho' },
];

export default function NewsCarousel() {
  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-background dark:bg-transparent overflow-hidden">
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
          <CarouselContent className="-ml-1">
            {newsArticles.map((article, index) => (
              <CarouselItem key={index} className="pl-1 basis-1/2 md:basis-1/3 lg:basis-1/5">
                <Link href={`/noticias/${article.slug}`} className="p-1 block">
                  <Image
                    src={article.src}
                    alt={article.alt}
                    width={600}
                    height={400}
                    className="rounded-lg object-cover"
                    data-ai-hint={article.hint}
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
           <div className="absolute inset-y-0 inset-x-0 flex items-center justify-between pointer-events-none">
                <div className="h-full w-32 bg-gradient-to-r from-background to-transparent"></div>
                <div className="h-full w-32 bg-gradient-to-l from-background to-transparent"></div>
            </div>
          <CarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-auto bg-background/50 border-none text-foreground hover:bg-background/80 hover:text-foreground" />
          <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-auto bg-background/50 border-none text-foreground hover:bg-background/80 hover:text-foreground" />
        </Carousel>
      </div>
    </section>
  );
}
