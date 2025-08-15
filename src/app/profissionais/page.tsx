
// src/app/profissionais/page.tsx
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Search, ShieldCheck, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FeatureInProgress from '@/components/feature-in-progress';

const professionals = [
  { id: 'dra-cristiane', name: 'Dra. Cristiane', specialty: 'Psicóloga Especialista em TEA', description: 'Abordagem acolhedora e baseada em evidências para o desenvolvimento infantil e suporte familiar.', imageUrl: 'https://placehold.co/128x128.png', hint: 'woman doctor portrait' },
  { id: 'dr-fernando', name: 'Dr. Fernando', specialty: 'Neuropediatra', description: 'Foco no diagnóstico precoce e acompanhamento do desenvolvimento neurológico de crianças com TEA.', imageUrl: 'https://placehold.co/128x128.png', hint: 'man doctor portrait' },
  { id: 'dra-beatriz', name: 'Dra. Beatriz', specialty: 'Fonoaudióloga', description: 'Especialista em comunicação alternativa e aumentativa (CAA) para crianças e adolescentes.', imageUrl: 'https://placehold.co/128x128.png', hint: 'woman psychologist portrait' },
  { id: 'dr-ricardo', name: 'Dr. Ricardo', specialty: 'Terapeuta Ocupacional', description: 'Abordagens lúdicas e criativas para a integração sensorial e autonomia nas atividades diárias.', imageUrl: 'https://placehold.co/128x128.png', hint: 'man therapist portrait' },
];

const clinics = [
    { name: 'Clínica Superar', specialty: 'Centro Multidisciplinar', description: 'Oferecemos um ambiente integrado com diversas especialidades para um cuidado completo e humanizado.', imageUrl: 'https://placehold.co/800x450.png', hint: 'clinic facade' },
    { name: 'Espaço Crescer', specialty: 'Terapia Infantil e Familiar', description: 'Um lugar pensado para o desenvolvimento infantil, com foco na intervenção precoce e no apoio familiar.', imageUrl: 'https://placehold.co/800x450.png', hint: 'playroom therapy' },
];

export default function ProfessionalsPage() {
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
                          <input placeholder="Buscar por especialidade ou nome..." className="w-full h-12 pl-12 pr-4 rounded-full border bg-card text-card-foreground" />
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
                            Cada profissional e clínica na plataforma passa por um processo de verificação para garantir que você tenha acesso a um cuidado seguro e de alta qualidade.
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

        {/* Professionals Section */}
        <section className="w-full py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Profissionais Liberais</h2>
                    <p className="max-w-[700px] text-foreground/80 md:text-xl">
                        Especialistas dedicados e avaliados pela nossa comunidade.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {professionals.map((prof) => (
                        <Card key={prof.id} className="text-center p-6 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
                            <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20">
                                <AvatarImage src={prof.imageUrl} alt={prof.name} data-ai-hint={prof.hint} />
                                <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <CardHeader className="p-0">
                                <CardTitle className="text-xl">{prof.name}</CardTitle>
                                <CardDescription className="text-primary font-semibold">{prof.specialty}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 mt-3 text-muted-foreground flex-grow">
                                <p className="text-sm">{prof.description}</p>
                            </CardContent>
                            <div className="mt-6">
                                <Button asChild>
                                    <Link href={`/profissionais/${prof.id}`}>Ver Perfil Completo</Link>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Clinics Section */}
        <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Clínicas Parceiras</h2>
                    <p className="max-w-[700px] text-foreground/80 md:text-xl">
                        Espaços multidisciplinares para um cuidado completo e integrado.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {clinics.map((clinic, index) => (
                        <Card key={index} className="overflow-hidden rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
                            <Image src={clinic.imageUrl} alt={clinic.name} width={800} height={450} className="w-full h-56 object-cover" data-ai-hint={clinic.hint} />
                            <div className="p-6 flex flex-col flex-grow">
                                <CardHeader className="p-0">
                                    <CardTitle className="text-xl">{clinic.name}</CardTitle>
                                    <CardDescription className="text-primary font-semibold">{clinic.specialty}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 mt-3 text-muted-foreground flex-grow">
                                    <p>{clinic.description}</p>
                                </CardContent>
                                <div className="mt-6">
                                    <FeatureInProgress>
                                      <Button variant="outline">
                                        Ver Detalhes da Clínica
                                      </Button>
                                    </FeatureInProgress>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
