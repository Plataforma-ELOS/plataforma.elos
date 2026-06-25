
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
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import imagesData from '@/app/lib/placeholder-images.json';

const professionals = [
  { 
    id: 'dra-cristiane', 
    name: 'Dra. Cristiane', 
    specialty: 'Psicóloga Especialista em TEA', 
    imageUrl: imagesData.professionals["dra-cristiane"].url, 
    hint: imagesData.professionals["dra-cristiane"].hint
  },
  { 
    id: 'dr-fernando', 
    name: 'Dr. Fernando', 
    specialty: 'Neuropediatra', 
    imageUrl: imagesData.professionals["dr-fernando"].url, 
    hint: imagesData.professionals["dr-fernando"].hint
  },
  { 
    id: 'dra-beatriz', 
    name: 'Dra. Beatriz', 
    specialty: 'Fonoaudióloga', 
    imageUrl: imagesData.professionals["dra-beatriz"].url, 
    hint: imagesData.professionals["dra-beatriz"].hint
  },
  { 
    id: 'dr-ricardo', 
    name: 'Dr. Ricardo', 
    specialty: 'Terapeuta Ocupacional', 
    imageUrl: imagesData.professionals["dr-ricardo"].url, 
    hint: imagesData.professionals["dr-ricardo"].hint
  },
  { 
    id: 'dra-ana', 
    name: 'Dra. Ana', 
    specialty: 'Psicopedagoga', 
    imageUrl: imagesData.professionals["dra-ana"].url, 
    hint: imagesData.professionals["dra-ana"].hint
  },
];

export default function NewProfessionals() {
  return (
    <section className="w-full py-20 md:py-24 relative bg-background">
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
          className="w-full relative"
        >
          <CarouselContent className="-ml-4 px-4">
            {professionals.map((prof, index) => (
               <CarouselItem key={prof.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 p-1">
                 <Link href={`/profissionais/${prof.id}`} className="group block py-4">
                    <Card className="text-center p-6 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full bg-card border-0">
                        <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all">
                            <AvatarImage src={prof.imageUrl} alt={prof.name} data-ai-hint={prof.hint} className="object-cover" />
                            <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardHeader className="p-0">
                            <CardTitle className="text-xl group-hover:text-primary font-bold">{prof.name}</CardTitle>
                            <CardDescription className="text-primary font-semibold text-sm">{prof.specialty}</CardDescription>
                        </CardHeader>
                        <div className="mt-4">
                             <Button variant="link" className="text-primary">Ver Perfil</Button>
                        </div>
                    </Card>
                 </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none hidden md:block"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none hidden md:block"></div>
          
          <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2 z-20 bg-background/50 border-none text-foreground hover:bg-background/80 hover:text-foreground" />
          <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2 z-20 bg-background/50 border-none text-foreground hover:bg-background/80 hover:text-foreground" />
        </Carousel>
      </div>
    </section>
  );
}
