// src/app/profissionais/[id]/page.tsx
"use client";

import { useState } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import FeatureInProgress from '@/components/feature-in-progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';


// Mock data, in a real app this would be fetched based on the id
const professionalsData: { [key: string]: any } = {
  'dra-cristiane': { name: 'Dra. Cristiane', imageUrl: 'https://placehold.co/128x128.png', hint: 'woman doctor portrait', specialty: 'Psicóloga Especialista em TEA', crm: 'CRP 06/123456', description: 'Com mais de 10 anos de experiência, Dra. Cristiane é especializada em terapias comportamentais e no suporte a famílias, oferecendo uma abordagem acolhedora e baseada em evidências.' },
  'dr-fernando': { name: 'Dr. Fernando', imageUrl: 'https://placehold.co/128x128.png', hint: 'man doctor portrait', specialty: 'Neuropediatra', crm: 'CRM 123456 - SP', description: 'Dr. Fernando foca no diagnóstico precoce e acompanhamento do desenvolvimento neurológico de crianças com TEA, trabalhando em conjunto com uma equipe multidisciplinar.' },
  'dra-beatriz': { name: 'Dra. Beatriz', imageUrl: 'https://placehold.co/128x128.png', hint: 'woman psychologist portrait', specialty: 'Fonoaudióloga', crm: 'CRFa 2 - 12345', description: 'Dra. Beatriz é especialista em comunicação alternativa e aumentativa, ajudando crianças e adolescentes a desenvolverem suas habilidades de comunicação e interação social.' },
  'dr-ricardo': { name: 'Dr. Ricardo', imageUrl: 'https://placehold.co/128x128.png', hint: 'man therapist portrait', specialty: 'Terapeuta Ocupacional', crm: 'CREFITO-3/12345-TO', description: 'Dr. Ricardo utiliza abordagens lúdicas e criativas para ajudar na integração sensorial e no desenvolvimento da autonomia nas atividades de vida diária.' },
  'dra-ana': { name: 'Dra. Ana', imageUrl: 'https://placehold.co/128x128.png', hint: 'woman teacher portrait', specialty: 'Psicopedagoga', crm: 'N/A', description: 'Apoio no processo de aprendizagem e desenvolvimento de habilidades acadêmicas.' },
  'dr-marcos': { name: 'Dr. Marcos', imageUrl: 'https://placehold.co/128x128.png', hint: 'man companion portrait', specialty: 'Acompanhante Terapêutico', crm: 'N/A', description: 'Auxílio na socialização e participação em atividades cotidianas, dentro e fora de casa.' },
};

const experiences = [
    "Graduação em Psicologia",
    "Pós-graduação em Análise do Comportamento Aplicada (ABA)",
    "3 anos de prática clínica",
    "Curso complementar em Intervenção Precoce no TEA",
    "Atendimento a todas as faixas etárias",
    "Idiomas: Português e Espanhol",
];

const skills = [
    "Ansiedade",
    "Depressão",
    "Autoconhecimento",
    "Habilidades sociais e de comunicação",
    "Seletividade alimentar",
    "Regulação emocional",
];

export default function ProfessionalProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('sobre');
  
  const professional = professionalsData[params.id] || {
    name: "Profissional não encontrado",
    imageUrl: "https://placehold.co/128x128.png",
    specialty: "",
    crm: "N/A",
    description: "O perfil que você está tentando acessar não foi encontrado.",
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <HeaderSecondary />
      <main className="flex-1 pb-24">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Botão de voltar e compartilhar */}
             <div className="flex justify-between items-center mb-4">
                 <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                    <Link href="/profissionais">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Link>
                </Button>
                <FeatureInProgress>
                    <Button variant="ghost" size="icon">
                        <Share2 className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </FeatureInProgress>
             </div>

            {/* Fundo do card e imagem */}
            <div className="relative">
              <div className="h-28 bg-gradient-to-b from-primary/20 to-muted/40 rounded-t-3xl" />
              <div className="absolute top-28 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <Avatar className="h-36 w-36 ring-8 ring-background">
                    <AvatarImage src={professional.imageUrl} alt={professional.name} data-ai-hint={professional.hint} />
                    <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Conteúdo principal do card */}
            <Card className="rounded-b-3xl rounded-t-none pt-20 text-center shadow-lg">
                <CardContent className="p-6 md:p-8">
                     {/* Informações básicas */}
                    <h1 className="text-3xl font-bold font-headline">{professional.name}</h1>
                    <p className="text-primary font-semibold mt-1">{professional.specialty}</p>
                    <p className="text-muted-foreground text-sm">{professional.crm}</p>

                     {/* Navegação por abas */}
                    <Tabs defaultValue="sobre" className="w-full mt-8">
                        <TabsList className="grid w-full grid-cols-3 bg-muted">
                            <TabsTrigger value="sobre">Sobre mim</TabsTrigger>
                            <TabsTrigger value="contato">Contato</TabsTrigger>
                            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
                        </TabsList>
                        <Separator className="my-6" />

                        {/* Conteúdo das abas */}
                        <TabsContent value="sobre" className="text-left space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-3">Experiências</h3>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1.5">
                                    {experiences.map(exp => <li key={exp}>{exp}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3">Áreas de atuação</h3>
                                 <div className="flex flex-wrap gap-2">
                                    {skills.map(skill => (
                                        <Badge key={skill} variant="secondary" className="font-normal text-base py-1 px-3">{skill}</Badge>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="contato" className="text-left">
                           <FeatureInProgress>
                                <p className="text-muted-foreground">Informações de contato ainda não disponíveis.</p>
                           </FeatureInProgress>
                        </TabsContent>
                        <TabsContent value="avaliacoes" className="text-left">
                            <FeatureInProgress>
                                <p className="text-muted-foreground">A seção de avaliações está em construção.</p>
                            </FeatureInProgress>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4 z-10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-2xl mx-auto">
                    <FeatureInProgress>
                        <Button size="lg" className="w-full">
                            Agendar Consulta
                        </Button>
                    </FeatureInProgress>
                </div>
            </div>
        </footer>
    </div>
  );
}
