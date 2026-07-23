
// src/app/profissionais/page.tsx
"use client";

import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Search, ShieldCheck, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FeatureInProgress from '@/components/feature-in-progress';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { mapProfessionalCard, mapClinicCard, type ProfessionalCardData } from '@/lib/data/professionals';

const specialties = [
    { name: 'Psicólogos', tag: 'Psicóloga' },
    { name: 'Fonoaudiólogos', tag: 'Fonoaudióloga' },
    { name: 'Terapeutas Ocupacionais', tag: 'Terapeuta Ocupacional' },
    { name: 'Neurologistas e Psiquiatras', tag: 'Neuropediatra' },
    { name: 'Psicopedagogos', tag: 'Psicopedagoga' },
    { name: 'Acompanhantes Terapêuticos', tag: 'Acompanhante Terapêutico' },
]

export default function ProfessionalsPage() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [professionals, setProfessionals] = useState<ProfessionalCardData[]>([]);
  const [clinics, setClinics] = useState<ProfessionalCardData[]>([]);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from('professionals')
      .select('id, display_name, specialty, description, image_url, registration_number, phone, email, instagram')
      .in('kind', ['liberal', 'clinic_professional'])
      .then(({ data, error }) => {
        if (error) {
          console.error('[profissionais] erro ao buscar profissionais:', error.message);
          return;
        }
        setProfessionals((data ?? []).map(mapProfessionalCard));
      });

    supabase
      .from('clinics')
      .select('id, name, specialty, description, image_url, cnpj, phone, email')
      .then(({ data, error }) => {
        if (error) {
          console.error('[profissionais] erro ao buscar clinicas:', error.message);
          return;
        }
        setClinics((data ?? []).map(mapClinicCard));
      });
  }, []);

  const handleSpecialtyClick = (tag: string) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = tag;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderSecondary />
      <main className="flex-1">

        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 bg-primary/10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-primary/20 p-4 rounded-full">
                <Users className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                Encontre o Profissional Ideal
            </h1>
            <p className="max-w-[600px] text-foreground/80 md:text-xl">
                Conectamos você a profissionais e clínicas avaliados e comprometidos com o cuidado no TEA.
            </p>
            <FeatureInProgress>
                <div className="relative w-full max-w-sm mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                        ref={searchInputRef}
                        placeholder="Buscar por especialidade ou nome..." 
                        className="w-full h-10 pl-9 pr-4 rounded-full border bg-card text-card-foreground" 
                    />
                </div>
            </FeatureInProgress>
        </section>

        {/* Quality Section */}
        <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <Badge variant="secondary">Qualidade e Confiança</Badge>
                        <h2 className="text-3xl font-bold tracking-tighter font-headline">Nosso Compromisso com Você</h2>
                        <p className="text-muted-foreground">
                            Cada profissional e clínica na Plataforma E.L.O.S passa por um processo de verificação para garantir que você tenha acesso a um cuidado seguro e de alta qualidade.
                        </p>
                        <ul className="space-y-3 pt-2">
                            <li className="flex items-center gap-3">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                                <span className="font-medium">Verificação de Credenciais e Experiência</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Star className="h-6 w-6 text-primary" />
                                <span className="font-medium">Avaliações Reais da Comunidade</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Image src="/perfis/compromisso.jpg" alt="Selo de qualidade" width={600} height={400} className="rounded-2xl shadow-lg" data-ai-hint="quality certificate" />
                    </div>
                </div>
            </div>
        </section>
        
        {/* Specialties Section */}
        <section className="w-full py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Explore por Especialidade</h2>
                    <p className="max-w-[700px] text-foreground/80 md:text-xl">
                        Encontre o suporte certo para cada necessidade específica da sua jornada.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 max-w-7xl mx-auto">
                    {specialties.map((specialty, index) => (
                        <div key={index} className="group cursor-pointer" onClick={() => handleSpecialtyClick(specialty.tag)}>
                           <Card className="p-6 rounded-2xl shadow-lg border bg-card hover:border-primary hover:bg-primary/5 hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex items-center justify-center min-h-[130px] text-center">
                           <h3 className="font-semibold text-card-foreground text-base group-hover:text-primary transition-colors">
                                    {specialty.name}
                                </h3>
                            </Card>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <FeatureInProgress>
                        <Button variant="outline" size="lg">Não encontrou o que procurava? Veja mais!</Button>
                    </FeatureInProgress>
                </div>
            </div>
        </section>

        {/* Professionals Section */}
        <section className="w-full py-16 md:py-24 relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Profissionais Liberais</h2>
                    <p className="max-w-[700px] text-foreground/80 md:text-xl">
                        Especialistas dedicados e avaliados pela nossa comunidade.
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
                  <CarouselContent className="-ml-4 px-4 py-4">
                    {professionals.map((prof, index) => (
                       <CarouselItem key={prof.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                         <Link href={`/profissionais/${prof.id}`} className="group block h-full">
                            <Card className="text-center p-6 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full bg-card border-0">
                                <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all">
                                    <AvatarImage src={prof.imageUrl} alt={prof.name} data-ai-hint={prof.hint} className="object-cover" />
                                    <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <CardHeader className="p-0 flex-grow">
                                    <CardTitle className="text-xl group-hover:text-primary font-bold">{prof.name}</CardTitle>
                                    <CardDescription className="text-primary font-semibold">{prof.specialty}</CardDescription>
                                </CardHeader>
                                <div className="mt-auto pt-4">
                                     <Button variant="link" className="text-primary">Ver Perfil</Button>
                                </div>
                            </Card>
                         </Link>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  
                  {/* Blur effect */}
                  <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none hidden md:block"></div>
                  <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none hidden md:block"></div>
                  
                  <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2 z-20 bg-background/50 border-none text-foreground hover:bg-background/80 hover:text-foreground" />
                  <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2 z-20 bg-background/50 border-none text-foreground hover:bg-background/80 hover:text-foreground" />
                </Carousel>
            </div>
        </section>

        {/* Clinics Section */}
        <section className="w-full py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Clínicas Parceiras</h2>
                    <p className="max-w-[700px] text-foreground/80 md:text-xl">
                        Espaços multidisciplinares para um cuidado completo e integrado.
                    </p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {clinics.map((clinic, index) => (
                        <Link href={`/profissionais/${clinic.id}`} key={index} className="group block">
                            <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full cursor-pointer bg-card">
                                <Image src={clinic.imageUrl} alt={clinic.name} width={800} height={450} className="w-full h-56 object-cover" data-ai-hint={clinic.hint} />
                                <div className="p-6 flex flex-col flex-grow">
                                    <CardHeader className="p-0">
                                        <CardTitle className="text-xl group-hover:text-primary font-bold">{clinic.name}</CardTitle>
                                        <CardDescription className="text-primary font-semibold">{clinic.specialty}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0 mt-3 text-muted-foreground flex-grow">
                                        <p>{clinic.description}</p>
                                    </CardContent>
                                    <div className="mt-6">
                                        <Button variant="outline">
                                            Ver Detalhes da Clínica
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <FeatureInProgress>
                        <Button size="lg">Explorar mais clínicas</Button>
                    </FeatureInProgress>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}