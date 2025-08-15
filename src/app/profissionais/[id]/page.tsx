// src/app/profissionais/[id]/page.tsx
"use client";

import { useState } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Share2, Star, ThumbsUp, Instagram } from 'lucide-react';
import Link from 'next/link';
import FeatureInProgress from '@/components/feature-in-progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';


// Mock data, in a real app this would be fetched based on the id
const professionalsData: { [key: string]: any } = {
  'dra-cristiane': { name: 'Dra. Cristiane', imageUrl: 'https://placehold.co/128x128.png', hint: 'woman doctor portrait', specialty: 'Psicóloga Especialista em TEA', crm: 'CRP 06/123456', description: 'Com mais de 10 anos de experiência, Dra. Cristiane é especializada em terapias comportamentais e no suporte a famílias, oferecendo uma abordagem acolhedora e baseada em evidências.' },
  'dr-fernando': { name: 'Dr. Fernando', imageUrl: 'https://placehold.co/128x128.png', hint: 'man doctor portrait', specialty: 'Neuropediatra', crm: 'CRM 123456 - SP', description: 'Dr. Fernando foca no diagnóstico precoce e acompanhamento do desenvolvimento neurológico de crianças com TEA, trabalhando em conjunto com uma equipe multidisciplinar.' },
  'dra-beatriz': { name: 'Dra. Beatriz', imageUrl: 'https://placehold.co/128x128.png', hint: 'woman psychologist portrait', specialty: 'Fonoaudióloga', crm: 'CRFa 2 - 12345', description: 'Dra. Beatriz é especialista em comunicação alternativa e aumentativa, ajudando crianças e adolescentes a desenvolverem suas habilidades de comunicação e interação social.' },
  'dr-ricardo': { name: 'Dr. Ricardo', imageUrl: 'https://placehold.co/128x128.png', hint: 'man therapist portrait', specialty: 'Terapeuta Ocupacional', crm: 'CRP 123456 - UF', description: 'Dr. Ricardo utiliza abordagens lúdicas e criativas para ajudar na integração sensorial e no desenvolvimento da autonomia nas atividades de vida diária.' },
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

const generateReviews = (professionalName: string) => [
    {
        id: 1,
        author: "Mariana S.",
        date: "15 de Julho, 2024",
        rating: 5,
        content: `A ${professionalName} foi um anjo em nossas vidas. A abordagem dela com meu filho foi incrível e vimos um progresso enorme em pouco tempo. Recomendo de olhos fechados!`,
        likes: 12,
    },
    {
        id: 2,
        author: "Rafael P.",
        date: "2 de Julho, 2024",
        rating: 5,
        content: "Excelente profissional! Muito atenciosa e dedicada. Nos ajudou a entender melhor o diagnóstico e os próximos passos. Gratidão!",
        likes: 8,
    },
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

  const reviews = generateReviews(professional.name);

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
                        <TabsContent value="contato" className="text-left space-y-4">
                           <Card>
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="font-semibold text-lg">Informações de Contato</h3>
                                    <div className="flex items-center gap-4">
                                        <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                                        <a href="tel:+5581984041883" className="text-muted-foreground hover:text-primary">
                                            (81) 9 8404-1883
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                                        <a href="mailto:psicogabrielsouto@gmail.com" className="text-muted-foreground hover:text-primary">
                                            psicogabrielsouto@gmail.com
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Instagram className="h-5 w-5 text-primary flex-shrink-0" />
                                        <a href="https://instagram.com/psicogabrielsouto" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                            @psicogabrielsouto
                                        </a>
                                    </div>
                                </CardContent>
                           </Card>
                        </TabsContent>
                         <TabsContent value="avaliacoes" className="text-left space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-4">O que os pacientes dizem</h3>
                                <div className="flex items-center gap-4 mb-6 p-4 bg-muted rounded-lg">
                                    <div className='text-center'>
                                        <p className="text-4xl font-bold text-primary">5.0</p>
                                        <div className="flex justify-center text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                    <Separator orientation='vertical' className="h-12"/>
                                    <div>
                                        <p className="font-semibold">Excelente</p>
                                        <p className="text-sm text-muted-foreground">Baseado em {reviews.length} avaliações</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {reviews.map(review => (
                                        <div key={review.id}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex text-yellow-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                                <p className="font-semibold text-sm">{review.author}</p>
                                                <p className="text-xs text-muted-foreground">&middot; {review.date}</p>
                                            </div>
                                            <p className="text-muted-foreground">{review.content}</p>
                                            <div className="mt-2">
                                                <Button variant="ghost" size="sm" className="text-muted-foreground h-auto p-1">
                                                    <ThumbsUp className="w-4 h-4 mr-2"/> {review.likes}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <FeatureInProgress>
                                    <Button variant="outline" className="w-full mt-6">Deixar uma avaliação</Button>
                                </FeatureInProgress>
                            </div>
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
