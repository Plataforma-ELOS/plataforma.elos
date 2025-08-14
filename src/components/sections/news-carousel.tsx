
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

const images = [
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 1', hint: 'news article' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 2', hint: 'headline' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 3', hint: 'journalism' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 4', hint: 'report' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 5', hint: 'publication' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 6', hint: 'media' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 7', hint: 'press' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 8', hint: 'news article' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 9', hint: 'headline' },
  { src: 'https://placehold.co/600x400.png', alt: 'Notícia 10', hint: 'journalism' },
];

export default function NewsCarousel() {
  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-white overflow-hidden">
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
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-1 basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="p-1">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={400}
                    className="rounded-lg object-cover"
                    data-ai-hint={image.hint}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
           <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                <div className="h-full w-32 bg-gradient-to-r from-white to-transparent pointer-events-auto">
                     <CarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-auto bg-transparent border-none text-foreground hover:bg-white/50 hover:text-foreground" />
                </div>
                <div className="h-full w-32 bg-gradient-to-l from-white to-transparent pointer-events-auto">
                    <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-auto bg-transparent border-none text-foreground hover:bg-white/50 hover:text-foreground" />
                </div>
            </div>
        </Carousel>
      </div>
    </section>
  );
}
