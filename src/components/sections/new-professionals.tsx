// src/components/sections/new-professionals.tsx
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
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

const professionals = [
  { id: 'dra-cristiane', name: 'Dra. Cristiane', specialty: 'Psicóloga Especialista em TEA', imageUrl: 'https://placehold.co/200x200.png', hint: 'woman doctor portrait' },
  { id: 'dr-fernando', name: 'Dr. Fernando', specialty: 'Neuropediatra', imageUrl: 'https://placehold.co/200x200.png', hint: 'man doctor portrait' },
  { id: 'dra-beatriz', name: 'Dra. Beatriz', specialty: 'Fonoaudióloga', imageUrl: 'https://placehold.co/200x200.png', hint: 'woman psychologist portrait' },
  { id: 'dr-ricardo', name: 'Dr. Ricardo', specialty: 'Terapeuta Ocupacional', imageUrl: 'https://placehold.co/200x200.png', hint: 'man therapist portrait' },
  { id: 'dra-ana', name: 'Dra. Ana', specialty: 'Psicopedagoga', imageUrl: 'https://placehold.co/200x200.png', hint: 'woman teacher portrait' },
  { id: 'dr-marcos', name: 'Dr. Marcos', specialty: 'Acompanhante Terapêutico', imageUrl: 'https://placehold.co/200x200.png', hint: 'man companion portrait' },
];

export default function NewProfessionals() {
  return (
    <section className="w-full py-20 md:py-24 lg:py-32 relative bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Profissionais de Confiança
          </h2>
          <p className="max-w-[700px] text-foreground/80 md:text-xl">
            Onde o cuidado é valorizado e mantido. Especialistas dedicados e avaliados pela nossa comunidade.
          </p>
        </div>
        <Carousel
          opts={{ align: "start", loop: true, }}
           plugins={[
                Autoplay({
                  delay: 3000,
                  stopOnInteraction: true,
                  playOnInit: true,
                }),
              ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {professionals.map((prof, index) => (
               <CarouselItem key={prof.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                 <Link href={`/profissionais/${prof.id}`} className="group block">
                    <Card className="text-center p-6 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full bg-card border-0">
                        <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all">
                            <AvatarImage src={prof.imageUrl} alt={prof.name} data-ai-hint={prof.hint} />
                            <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="p-0">
                            <div className="text-xl group-hover:text-primary font-bold">{prof.name}</div>
                            <div className="text-primary font-semibold text-sm">{prof.specialty}</div>
                        </div>
                        <div className="mt-4">
                             <Button variant="link" className="text-primary">Ver Perfil</Button>
                        </div>
                    </Card>
                 </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
           <div className="absolute inset-y-0 inset-x-0 flex items-center justify-between pointer-events-none">
                <div className="h-full w-32 bg-gradient-to-r from-background to-transparent"></div>
                <div className="h-full w-32 bg-gradient-to-l from-background to-transparent"></div>
            </div>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 pointer-events-auto bg-background/50 border-none text-foreground hover:bg-background/80 hover:text-foreground" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-auto bg-background/50 border-none text-foreground hover:bg-background/80 hover:text-foreground" />
        </Carousel>
      </div>
    </section>
  );
}
