
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
import Footer from '@/components/layout/footer';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock data, in a real app this would be fetched based on the id
const professionalsData: { [key: string]: any } = {
  'dra-cristiane': { 
    name: 'Dra. Cristiane', 
    imageUrl: 'https://placehold.co/128x128.png', 
    hint: 'woman doctor portrait', 
    specialty: 'Psicóloga Especialista em TEA', 
    crm: 'CRP 06/123456', 
    description: 'Com mais de 10 anos de experiência, Dra. Cristiane é especializada em terapias comportamentais e no suporte a famílias, oferecendo uma abordagem acolhedora e baseada em evidências.',
    contact: {
      phone: '(11) 9 1234-5678',
      email: 'cristiane.psico@elos.com.br',
      instagram: '@dra.cristiane.tea',
    },
    experiences: [
      "Graduação em Psicologia na USP",
      "Pós-graduação em Análise do Comportamento Aplicada (ABA)",
      "10+ anos de prática clínica com foco em TEA",
      "Certificação em Terapia de Aceitação e Compromisso (ACT)",
      "Atendimento a todas as faixas etárias",
      "Idiomas: Português e Inglês",
    ],
    skills: [
      "Terapia ABA",
      "Regulação emocional",
      "Habilidades sociais",
      "Gestão de comportamento desafiador",
      "Orientação de pais",
      "Inclusão escolar",
    ],
  },
  'dr-fernando': { 
    name: 'Dr. Fernando', 
    imageUrl: 'https://placehold.co/128x128.png', 
    hint: 'man doctor portrait', 
    specialty: 'Neuropediatra', 
    crm: 'CRM 123456 - SP', 
    description: 'Dr. Fernando foca no diagnóstico precoce e acompanhamento do desenvolvimento neurológico de crianças com TEA, trabalhando em conjunto com uma equipe multidisciplinar.',
    contact: {
      phone: '(21) 9 9876-5432',
      email: 'dr.fernando.neuro@elos.com.br',
      instagram: '@drfernando.neurokids',
    },
    experiences: [
      "Residência em Neurologia Infantil na UFRJ",
      "Membro da Sociedade Brasileira de Neurologia Infantil",
      "8 anos de experiência em diagnóstico de TEA",
      "Foco em intervenção precoce",
      "Especialista em comorbidades associadas ao TEA",
      "Idiomas: Português",
    ],
    skills: [
      "Diagnóstico precoce",
      "Acompanhamento neurológico",
      "Manejo de medicação",
      "Tratamento de comorbidades (TDAH, ansiedade)",
      "Eletroencefalograma (EEG)",
      "Trabalho em equipe multidisciplinar",
    ],
  },
  'dra-beatriz': { 
    name: 'Dra. Beatriz', 
    imageUrl: 'https://placehold.co/128x128.png', 
    hint: 'woman psychologist portrait', 
    specialty: 'Fonoaudióloga', 
    crm: 'CRFa 2-12345', 
    description: 'Dra. Beatriz é especialista em comunicação alternativa e aumentativa, ajudando crianças e adolescentes a desenvolverem suas habilidades de comunicação e interação social.',
    contact: {
      phone: '(31) 9 8765-4321',
      email: 'bia.fono@elos.com.br',
      instagram: '@beatriz.fono.tea',
    },
     experiences: [
      "Graduação em Fonoaudiologia pela UFMG",
      "Especialização em Linguagem com foco em TEA",
      "Certificação no método PECS",
      "5 anos de experiência com comunicação alternativa",
      "Atuação em clínicas e escolas",
      "Idiomas: Português",
    ],
    skills: [
      "Comunicação Alternativa (CAA)",
      "Método PECS",
      "Terapia de fala e linguagem",
      "Seletividade alimentar",
      "Habilidades de conversação",
      "Interação social",
    ],
  },
  'dr-ricardo': { 
    name: 'Dr. Ricardo', 
    imageUrl: 'https://placehold.co/128x128.png', 
    hint: 'man therapist portrait', 
    specialty: 'Terapeuta Ocupacional', 
    crm: 'CREFITO-3 54321 - SP', 
    description: 'Dr. Ricardo utiliza abordagens lúdicas e criativas para ajudar na integração sensorial e no desenvolvimento da autonomia nas atividades de vida diária.',
    contact: {
      phone: '(41) 9 7654-3210',
      email: 'ricardo.to@elos.com.br',
      instagram: '@ricardo.to.infantil',
    },
    experiences: [
      "Graduação em Terapia Ocupacional pela UFPR",
      "Certificação Internacional em Integração Sensorial de Ayres",
      "7 anos de experiência com crianças no espectro",
      "Especialista em desenvolvimento da autonomia",
      "Experiência com adaptação de ambientes",
      "Idiomas: Português",
    ],
    skills: [
      "Integração Sensorial",
      "Atividades de Vida Diária (AVDs)",
      "Coordenação motora fina",
      "Brincar terapêutico",
      "Adaptação de materiais",
      "Autonomia e independência",
    ],
  },
  'dra-ana': { 
    name: 'Dra. Ana', 
    imageUrl: 'https://placehold.co/128x128.png', 
    hint: 'woman teacher portrait', 
    specialty: 'Psicopedagoga', 
    crm: 'ABPp 1234 - SP', 
    description: 'Apoio no processo de aprendizagem e desenvolvimento de habilidades acadêmicas, criando estratégias personalizadas para cada aluno.',
     contact: {
      phone: '(51) 9 6543-2109',
      email: 'ana.psicopedagoga@elos.com.br',
      instagram: '@ana.aprendizagem.tea',
    },
     experiences: [
      "Graduação em Pedagogia e Psicopedagogia",
      "Especialização em Educação Inclusiva",
      "Foco em adaptação curricular (PEI)",
      "12 anos de experiência em ambiente escolar",
      "Mediação de conflitos e bullying",
      "Idiomas: Português e Libras",
    ],
    skills: [
      "Plano de Ensino Individualizado (PEI)",
      "Adaptação de atividades",
      "Alfabetização",
      "Funções executivas",
      "Dificuldades de aprendizagem",
      "Mediação escolar",
    ],
  },
  'dr-marcos': { 
    name: 'Dr. Marcos', 
    imageUrl: 'https://placehold.co/128x128.png', 
    hint: 'man companion portrait', 
    specialty: 'Acompanhante Terapêutico', 
    crm: 'N/A', 
    description: 'Auxílio na socialização e participação em atividades cotidianas, dentro e fora de casa, promovendo a independência e a inclusão social.',
     contact: {
      phone: '(81) 9 5432-1098',
      email: 'marcos.at@elos.com.br',
      instagram: '@marcos.inclusao.social',
    },
     experiences: [
      "Formação em Acompanhamento Terapêutico",
      "Estudante de Psicologia",
      "4 anos de experiência como AT",
      "Trabalho em diversos contextos (escola, casa, comunidade)",
      "Foco em generalização de habilidades",
      "Idiomas: Português",
    ],
    skills: [
      "Habilidades sociais em contexto real",
      "Generalização de aprendizados",
      "Manejo de crises em público",
      "Autonomia em atividades externas",
      "Inclusão em grupos",
      "Comunicação com a família e a escola",
    ],
  },
   'clinica-superar': { 
    name: 'Clínica Superar', 
    imageUrl: 'https://placehold.co/128x128.png', 
    hint: 'clinic logo', 
    specialty: 'Centro Multidisciplinar', 
    crm: 'CNPJ: 12.345.678/0001-90', 
    description: 'Com uma equipe completa e integrada, a Clínica Superar oferece um cuidado humanizado e multidisciplinar, focando no desenvolvimento global de cada paciente. Nosso ambiente é preparado para acolher famílias e promover o bem-estar.',
    contact: {
      phone: '(11) 9 8888-1111',
      email: 'contato@clinicasuperar.com.br',
      instagram: '@clinicasuperar',
    },
    experiences: [
      "Mais de 5 anos de atuação",
      "Equipe com Psicólogos, Fonoaudiólogos, T.O. e mais",
      "Estrutura com salas de integração sensorial",
      "Programas de intervenção precoce",
      "Grupos de habilidades sociais",
      "Parceria com escolas para inclusão",
    ],
    skills: [
      "Avaliação Multidisciplinar",
      "Terapia ABA",
      "Integração Sensorial",
      "Grupos Terapêuticos",
      "Orientação Familiar",
      "Fonoaudiologia",
      "Psicomotricidade",
    ],
  },
    'espaco-crescer': { 
    name: 'Espaço Crescer', 
    imageUrl: 'https://placehold.co/128x128.png', 
    hint: 'child climbing logo', 
    specialty: 'Terapia Infantil e Familiar', 
    crm: 'CNPJ: 22.333.444/0001-55', 
    description: 'Um lugar pensado para o desenvolvimento infantil, com foco na intervenção precoce e no apoio à família como um todo. Nossas terapias são baseadas no brincar.',
    contact: {
      phone: '(21) 9 7777-2222',
      email: 'contato@espacocrescer.com.br',
      instagram: '@espacocrescer.tea',
    },
    experiences: [
      "Foco em intervenção precoce (0 a 6 anos)",
      "Terapeutas especializados no modelo Denver",
      "Ambiente lúdico e acolhedor",
      "Sessões de terapia em grupo e individuais",
      "Workshops e palestras para pais",
      "Consultoria escolar",
    ],
    skills: [
      "Modelo Denver de Intervenção Precoce",
      "Terapia Ocupacional Pediátrica",
      "Psicologia Infantil",
      "Apoio e treinamento para pais",
      "Brincar terapêutico",
      "Desenvolvimento da comunicação",
    ],
  },
};

const generateReviews = (professionalName: string) => [
    {
        id: 1,
        author: "Mariana S.",
        date: "15 de Julho, 2024",
        rating: 5,
        content: `O(A) ${professionalName} foi um anjo em nossas vidas. A abordagem dele(a) com meu filho foi incrível e vimos um progresso enorme em pouco tempo. Recomendo de olhos fechados!`,
        likes: 12,
    },
    {
        id: 2,
        author: "Rafael P.",
        date: "2 de Julho, 2024",
        rating: 5,
        content: `Excelente profissional! Muito atencioso(a) e dedicado(a). Nos ajudou a entender melhor o diagnóstico e os próximos passos. Gratidão!`,
        likes: 8,
    },
];

function LeaveReviewDialog({ children, professionalName }: { children: React.ReactNode, professionalName: string }) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Avaliação incompleta",
        description: "Por favor, selecione uma nota de 1 a 5 estrelas.",
      });
      return;
    }

    // Fecha o dialog programaticamente ao forçar um click no botão de fechar.
    document.getElementById('close-dialog-btn')?.click();

    toast({
      title: "Avaliação Enviada!",
      description: `Obrigado por avaliar ${professionalName}. Sua contribuição ajuda toda a comunidade.`,
    });
    setRating(0);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deixar uma avaliação para {professionalName}</DialogTitle>
          <DialogDescription>
            Compartilhe sua experiência para ajudar outros membros da comunidade. Sua avaliação será analisada antes de ser publicada.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleReviewSubmit}>
          <div className="py-4 space-y-4">
            <div 
              className="flex items-center justify-center gap-2 text-yellow-400"
              onMouseLeave={() => setHoverRating(0)}
            >
                {[...Array(5)].map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <Star 
                      key={i} 
                      className={cn(
                        "w-8 h-8 cursor-pointer hover:scale-110 transition-transform",
                        starValue <= (hoverRating || rating) ? 'fill-current' : 'fill-transparent'
                      )}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onClick={() => setRating(starValue)}
                    />
                  );
                })}
            </div>
            <div>
              <Label htmlFor="review-text" className="sr-only">Sua avaliação</Label>
              <Textarea id="review-text" placeholder="Descreva sua experiência..." rows={5} required />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button id="close-dialog-btn" type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Enviar Avaliação</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export default function ProfessionalProfilePage({ params }: { params: { id: string } }) {
  const professionalId = params.id;
  const professional = professionalsData[professionalId] || {
    name: "Perfil não encontrado",
    imageUrl: "https://placehold.co/128x128.png",
    specialty: "",
    crm: "N/A",
    description: "O perfil que você está tentando acessar não foi encontrado.",
    contact: {},
    experiences: [],
    skills: [],
    hint: 'not found',
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
                            <TabsTrigger value="sobre">Sobre</TabsTrigger>
                            <TabsTrigger value="contato">Contato</TabsTrigger>
                            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
                        </TabsList>
                        <Separator className="my-6" />

                        {/* Conteúdo das abas */}
                        <TabsContent value="sobre" className="text-left space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-3">Apresentação</h3>
                                 <p className="text-muted-foreground">{professional.description}</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3">Experiências</h3>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1.5">
                                    {professional.experiences.map((exp: string) => <li key={exp}>{exp}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3">Áreas de atuação</h3>
                                 <div className="flex flex-wrap gap-2">
                                    {professional.skills.map((skill: string) => (
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
                                        <a href={`tel:${professional.contact.phone}`} className="text-muted-foreground hover:text-primary">
                                            {professional.contact.phone}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                                        <a href={`mailto:${professional.contact.email}`} className="text-muted-foreground hover:text-primary">
                                            {professional.contact.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Instagram className="h-5 w-5 text-primary flex-shrink-0" />
                                        <a href={`https://instagram.com/${professional.contact.instagram.substring(1)}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                            {professional.contact.instagram}
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
                                    {reviews.map((review: any) => (
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
                                <LeaveReviewDialog professionalName={professional.name}>
                                    <Button variant="outline" className="w-full mt-6">Deixar uma avaliação</Button>
                                </LeaveReviewDialog>
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
