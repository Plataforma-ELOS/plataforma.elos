
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
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import imagesData from '@/app/lib/placeholder-images.json';

const professionals = [
  { id: 'dra-cristiane', name: 'Dra. Cristiane', specialty: 'Psicóloga Especialista em TEA', description: 'Abordagem acolhedora e baseada em evidências para o desenvolvimento infantil e suporte familiar.', imageUrl: imagesData.professionals["dra-cristiane"].url, hint: imagesData.professionals["dra-cristiane"].hint },
  { id: 'dr-fernando', name: 'Dr. Fernando', specialty: 'Neuropediatra', description: 'Foco no diagnóstico precoce e acompanhamento do desenvolvimento neurológico de crianças com TEA.', imageUrl: imagesData.professionals["dr-fernando"].url, hint: imagesData.professionals["dr-fernando"].hint },
  { id: 'dra-beatriz', name: 'Dra. Beatriz', specialty: 'Fonoaudióloga', description: 'Especialista em comunicação alternativa e aumentativa (CAA) para crianças e adolescentes.', imageUrl: imagesData.professionals["dra-beatriz"].url, hint: imagesData.professionals["dra-beatriz"].hint },
  { id: 'dr-ricardo', name: 'Dr. Ricardo', specialty: 'Terapeuta Ocupacional', description: 'Abordagens lúdicas e criativas para a integração sensorial e autonomia nas atividades diárias.', imageUrl: imagesData.professionals["dr-ricardo"].url, hint: imagesData.professionals["dr-ricardo"].hint },
  { id: 'dra-ana', name: 'Dra. Ana', specialty: 'Psicopedagoga', description: 'Apoio no processo de aprendizagem e desenvolvimento de habilidades acadêmicas.', imageUrl: imagesData.professionals["dra-ana"].url, hint: imagesData.professionals["dra-ana"].hint },
];

const clinics = [
    { id: 'clinica-superar', name: 'Clínica Superar', specialty: 'Centro Multidisciplinar', description: 'Oferecemos um ambiente integrado com diversas especialidades para um cuidado completo e humanizado.', imageUrl: 'https://placehold.co/800x450.png', hint: 'clinic facade' },
    { id: 'espaco-crescer', name: 'Espaço Crescer', specialty: 'Terapia Infantil e Familiar', description: 'Um lugar pensado para o desenvolvimento infantil, com foco na intervenção precoce e no apoio familiar.', imageUrl: 'https://placehold.co/800x450.png', hint: 'playroom therapy' },
    { id: 'clinica-evoluir', name: 'Clínica Evoluir', specialty: 'Foco em ABA e Integração Sensorial', description: 'Equipe especializada em Terapia Comportamental Aplicada (ABA) e Integração Sensorial.', imageUrl: 'https://placehold.co/800x450.png', hint: 'sensory room' },
    { id: 'nucleo-conectar', name: 'Núcleo Conectar', specialty: 'Apoio Psicossocial e Educacional', description: 'Promovemos a inclusão e o bem-estar através de programas de apoio psicossocial e educacional para famílias.', imageUrl: 'https://placehold.co/800x450.png', hint: 'group therapy' },
];

const specialties = [
    { name: 'Psicólogos', imageUrl: 'https://placehold.co/400x400.png', hint: 'psychology session', tag: 'Psicóloga' },
    { name: 'Fonoaudiólogos', imageUrl: 'https://placehold.co/400x400.png', hint: 'speech therapy', tag: 'Fonoaudióloga' },
    { name: 'Terapeutas Ocupacionais', imageUrl: 'https://placehold.co/400x400.png', hint: 'occupational therapy', tag: 'Terapeuta Ocupacional' },
    { name: 'Neurologistas e Psiquiatras', imageUrl: 'https://placehold.co/400x400.png', hint: 'doctor brain', tag: 'Neuropediatra' },
    { name: 'Psicopedagogos', imageUrl: 'https://placehold.co/400x400.png', hint: 'educational psychology', tag: 'Psicopedagoga' },
    { name: 'Acompanhantes Terapêuticos', imageUrl: 'https://placehold.co/400x400.png', hint: 'therapeutic companion', tag: 'Acompanhante Terapêutico' },
]

export default function ProfessionalsPage() {
  const searchInputRef = useRef<HTMLInputElement>(null);

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
        <section className="w-full py-16 md:py-24 bg-primary/10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-primary/20 p-4 rounded-full">
                        <Users className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Encontre o Profissional Ideal</h1>
                    <p className="max-w-[700px] text-foreground/80 md:text-xl">
                        Conectamos você a profissionais e clínicas avaliados e comprometidos com o cuidado no TEA.
                    </p>
                    <FeatureInProgress>
                      <div className="relative w-full max-w-lg mt-4">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <input 
                            ref={searchInputRef}
                            placeholder="Buscar por especialidade ou nome..." 
                            className="w-full h-12 pl-12 pr-4 rounded-full border bg-card text-card-foreground" 
                           />
                      </div>
                    </FeatureInProgress>
                </div>
            </div>
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
                        <Image src="https://placehold.co/600x400.png" alt="Selo de qualidade" width={600} height={400} className="rounded-2xl shadow-lg" data-ai-hint="quality certificate" />
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
                            <Card className="overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
                                <Image 
                                    src={specialty.imageUrl} 
                                    alt={specialty.name} 
                                    width={400} 
                                    height={400} 
                                    className="w-full h-auto object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
                                    data-ai-hint={specialty.hint}
                                />
                            </Card>
                            <div className="bg-card p-3 rounded-b-xl -mt-2 relative shadow-sm">
                                <h3 className="font-semibold text-center text-card-foreground text-sm">{specialty.name}</h3>
                            </div>
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
                  <CarouselContent className="-ml-4 px-4">
                    {professionals.map((prof, index) => (
                       <CarouselItem key={prof.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                         <Link href={`/profissionais/${prof.id}`} className="group block">
                            <Card className="text-center p-6 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full bg-card border-0">
                                <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all">
                                    <AvatarImage src={prof.imageUrl} alt={prof.name} data-ai-hint={prof.hint} className="object-cover" />
                                    <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <CardHeader className="p-0">
                                    <CardTitle className="text-xl group-hover:text-primary font-bold">{prof.name}</CardTitle>
                                    <CardDescription className="text-primary font-semibold">{prof.specialty}</CardDescription>
                                </CardHeader>
                                <div className="mt-4">
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
