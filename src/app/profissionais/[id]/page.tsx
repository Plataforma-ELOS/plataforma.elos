
// src/app/profissionais/[id]/page.tsx
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Phone, Star, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import FeatureInProgress from '@/components/feature-in-progress';

// Mock data, in a real app this would be fetched based on the id
const professionalsData: { [key: string]: any } = {
  'dra-cristiane': { name: 'Dra. Cristiane', imageUrl: 'https://placehold.co/128x128.png', hint: 'woman doctor portrait', specialty: 'Psicóloga Especialista em TEA', description: 'Com mais de 10 anos de experiência, Dra. Cristiane é especializada em terapias comportamentais e no suporte a famílias, oferecendo uma abordagem acolhedora e baseada em evidências.' },
  'dr-fernando': { name: 'Dr. Fernando', imageUrl: 'https://placehold.co/128x128.png', hint: 'man doctor portrait', specialty: 'Neuropediatra', description: 'Dr. Fernando foca no diagnóstico precoce e acompanhamento do desenvolvimento neurológico de crianças com TEA, trabalhando em conjunto com uma equipe multidisciplinar.' },
  'dra-beatriz': { name: 'Dra. Beatriz', imageUrl: 'https://placehold.co/128x128.png', hint: 'woman psychologist portrait', specialty: 'Fonoaudióloga', description: 'Dra. Beatriz é especialista em comunicação alternativa e aumentativa, ajudando crianças e adolescentes a desenvolverem suas habilidades de comunicação e interação social.' },
  'dr-ricardo': { name: 'Dr. Ricardo', imageUrl: 'https://placehold.co/128x128.png', hint: 'man therapist portrait', specialty: 'Terapeuta Ocupacional', description: 'Dr. Ricardo utiliza abordagens lúdicas e criativas para ajudar na integração sensorial e no desenvolvimento da autonomia nas atividades de vida diária.' },
};

export default function ProfessionalProfilePage({ params }: { params: { id: string } }) {
  const professional = professionalsData[params.id] || {
    name: "Profissional não encontrado",
    imageUrl: "https://placehold.co/128x128.png",
    specialty: "",
    description: "O perfil que você está tentando acessar não foi encontrado.",
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <HeaderSecondary />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4" />
                Voltar para a página inicial
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna do Perfil */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 text-center">
                        <Avatar className="h-32 w-32 mx-auto mb-4 ring-4 ring-primary">
                            <AvatarImage src={professional.imageUrl} alt={professional.name} data-ai-hint={professional.hint} />
                            <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardHeader className="p-0">
                            <CardTitle className="text-2xl">{professional.name}</CardTitle>
                            <CardDescription className="text-primary font-semibold">{professional.specialty}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 mt-4 space-y-4">
                            <div className="flex justify-center items-center gap-1">
                                <Star className="text-yellow-400 fill-yellow-400" />
                                <Star className="text-yellow-400 fill-yellow-400" />
                                <Star className="text-yellow-400 fill-yellow-400" />
                                <Star className="text-yellow-400 fill-yellow-400" />
                                <Star className="text-muted-foreground/50" />
                                <span className="text-sm text-muted-foreground ml-2">(123 avaliações)</span>
                            </div>
                             <div className="flex justify-center gap-4 pt-4">
                                <FeatureInProgress>
                                    <Button variant="outline" size="icon">
                                        <Mail className="h-5 w-5" />
                                    </Button>
                                </FeatureInProgress>
                                <FeatureInProgress>
                                    <Button variant="outline" size="icon">
                                        <Phone className="h-5 w-5" />
                                    </Button>
                                </FeatureInProgress>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Coluna de Informações */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sobre</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{professional.description}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Especialidades</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <span className="bg-primary/10 text-primary font-medium py-1 px-3 rounded-full text-sm">Terapia Comportamental Aplicada (ABA)</span>
                            <span className="bg-primary/10 text-primary font-medium py-1 px-3 rounded-full text-sm">Avaliação Diagnóstica</span>
                            <span className="bg-primary/10 text-primary font-medium py-1 px-3 rounded-full text-sm">Aconselhamento Parental</span>
                            <span className="bg-primary/10 text-primary font-medium py-1 px-3 rounded-full text-sm">Intervenção Precoce</span>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Verificação</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                <span className="font-semibold">Profissional Verificado pela Elos</span>
                           </div>
                           <p className="text-sm text-muted-foreground mt-1">Este profissional teve suas credenciais e experiência confirmadas por nossa equipe.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
