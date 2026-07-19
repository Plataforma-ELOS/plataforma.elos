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
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';

// 🟢 LISTA LOCAL DEFINITIVA: Puxa as imagens diretamente da pasta public do teu projeto
const professionals = [
  { 
    id: 'dra-cristiane', 
    name: 'Dra. Cristiane', 
    specialty: 'Psicóloga Especialista em TEA', 
    imageUrl: '/perfis/liberais/profissional-1.jpg', 
    hint: 'Dra Cristiane'
  },
  { 
    id: 'dr-fernando', 
    name: 'Dr. Fernando', 
    specialty: 'Neuropediatra', 
    imageUrl: '/perfis/liberais/profissional-2.jpg', 
    hint: 'Dr Fernando'
  },
  { 
    id: 'dra-beatriz', 
    name: 'Dra. Beatriz', 
    specialty: 'Fonoaudióloga', 
    imageUrl: '/perfis/liberais/profissional-3.jpg', 
    hint: 'Dra Beatriz'
  },
  { 
    id: 'dr-ricardo', 
    name: 'Dr. Ricardo', 
    specialty: 'Terapeuta Ocupacional', 
    imageUrl: '/perfis/liberais/profissional-4.jpg', 
    hint: 'Dr Ricardo'
  },
  { 
    id: 'dra-ana', 
    name: 'Dra. Ana', 
    specialty: 'Psicopedagoga', 
    imageUrl: '/perfis/liberais/profissional-5.jpg', 
    hint: 'Dra Ana'
  },
];

export default function NewProfessionals() {
  return (
    <section className="w-full py-20 md:py-24 relative bg-background overflow-hidden">
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
          opts={{ 
            align: "start", 
            loop: true,
            skipSnaps: false
          }}
          plugins={[
            Autoplay({
              delay: 3500,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
            }),
          ]}
          className="w-full relative"
        >
          <CarouselContent className="-ml-4 px-4">
            {professionals.map((prof: any) => (
              <CarouselItem key={prof.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 p-1">
                <Link href={`/profissionais/${prof.id}`} className="group block py-4 h-full">
                  
                  <Card className="text-center p-6 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between h-full bg-card border-0">
                    
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all overflow-hidden relative">
                        {prof.imageUrl ? (
                          <Image 
                            src={prof.imageUrl} 
                            alt={prof.name} 
                            fill
                            sizes="96px"
                            data-ai-hint={prof.hint} 
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                      
                      <CardHeader className="p-0 space-y-1">
                        <CardTitle className="text-xl group-hover:text-primary font-bold line-clamp-1 transition-colors">
                          {prof.name}
                        </CardTitle>
                        <CardDescription className="text-primary font-semibold text-sm line-clamp-2 min-h-[40px] flex items-center justify-center">
                          {prof.specialty}
                        </CardDescription>
                      </CardHeader>
                    </div>

                    <div className="mt-4 pt-2 border-t border-border/50">
                      <Button variant="link" className="text-primary group-hover:underline p-0 h-auto">
                        Ver Perfil
                      </Button>
                    </div>
                    
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none hidden xl:block"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none hidden xl:block"></div>
          
          <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2 z-20 bg-background/80 border-border text-foreground hover:bg-background shadow-md" />
          <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2 z-20 bg-background/80 border-border text-foreground hover:bg-background shadow-md" />
        </Carousel>
      </div>
    </section>
  );
}