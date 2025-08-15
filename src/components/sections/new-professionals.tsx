
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

const professionals = [
  { name: 'Dra. Cristiane', role: 'Psiquiatra', imageUrl: 'https://placehold.co/200x200.png', hint: 'woman doctor portrait' },
  { name: 'Dr. Fernando', role: 'Acompanhante terapêutico', imageUrl: 'https://placehold.co/200x200.png', hint: 'man therapist portrait' },
  { name: 'Dra. Vera', role: 'Psicopedagoga', imageUrl: 'https://placehold.co/200x200.png', hint: 'woman teacher portrait' },
  { name: 'Dr. Ricardo', role: 'Terapeuta Ocupacional', imageUrl: 'https://placehold.co/200x200.png', hint: 'man doctor portrait' },
  { name: 'Dra. Ana', role: 'Fonoaudióloga', imageUrl: 'https://placehold.co/200x200.png', hint: 'woman therapist portrait' },
];

export default function NewProfessionals() {
  return (
    <section className="w-full relative py-20 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-24">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Profissionais de segurança
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-foreground/80 md:text-xl">
            Onde o cuidado é valorizado e mantido.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1">
            {professionals.map((prof, index) => (
               <CarouselItem key={index} className="pl-1 basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="flex flex-col items-center text-center p-1">
                  <div className="relative mb-4">
                    <Image
                      src={prof.imageUrl}
                      alt={`Foto de ${prof.name}`}
                      width={160}
                      height={160}
                      className="rounded-full object-cover ring-8 ring-background"
                      data-ai-hint={prof.hint}
                    />
                  </div>
                  <h3 className="text-xl font-bold">{prof.name}</h3>
                  <p className="text-muted-foreground">{prof.role}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
                <div className="h-full w-32 bg-gradient-to-r from-background to-transparent pointer-events-auto">
                     <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto bg-transparent border-none text-foreground hover:bg-white/50 hover:text-foreground" />
                </div>
                <div className="h-full w-32 bg-gradient-to-l from-background to-transparent pointer-events-auto">
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto bg-transparent border-none text-foreground hover:bg-white/50 hover:text-foreground" />
                </div>
            </div>
        </Carousel>
      </div>
    </section>
  );
}
