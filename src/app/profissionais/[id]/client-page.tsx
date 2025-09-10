// src/app/profissionais/[id]/client-page.tsx
"use client";

import { useState } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Share2, Star, ThumbsUp, Instagram, Edit2, Check } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';

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

// Mock data for the new review summary
const reviewSummary = {
  average: 4.9,
  total: 37,
  distribution: [
    { stars: 5, percentage: 85 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 3 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 0 },
  ],
  criteria: [
    { name: 'Atendimento', score: 4.9 },
    { name: 'Empatia', score: 5.0 },
    { name: 'Clareza', score: 4.9 },
    { name: 'Organização', score: 4.0 },
  ]
};

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
                        starValue <= (hoverRating || rating) ? 'fill-current' : 'fill-transparent stroke-current'
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


export default function ProfessionalProfileClient({ professional }: { professional: any }) {
  const reviews = generateReviews(professional.name);

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <HeaderSecondary />
      <main className="flex-1 pb-24">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="max-w-2xl mx-auto">
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

            <div className="relative">
              <div className="h-28 bg-gradient-to-b from-primary/20 to-muted/40 rounded-t-3xl" />
              <div className="absolute top-28 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <Avatar className="h-36 w-36 ring-8 ring-background">
                    <AvatarImage src={professional.imageUrl} alt={professional.name} data-ai-hint={professional.hint} />
                    <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <Card className="rounded-b-3xl rounded-t-none pt-20 text-center shadow-lg">
                <CardContent className="p-6 md:p-8">
                    <h1 className="text-3xl font-bold font-headline">{professional.name}</h1>
                    <p className="text-primary font-semibold mt-1">{professional.specialty}</p>
                    <p className="text-muted-foreground text-sm">{professional.crm}</p>

                    <Tabs defaultValue="sobre" className="w-full mt-8">
                        <TabsList className="grid w-full grid-cols-3 bg-muted">
                            <TabsTrigger value="sobre">Sobre</TabsTrigger>
                            <TabsTrigger value="contato">Contato</TabsTrigger>
                            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
                        </TabsList>

                        <TabsContent value="sobre" className="text-left space-y-8 mt-6">
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
                        <TabsContent value="contato" className="text-left space-y-4 mt-6">
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
                         <TabsContent value="avaliacoes" className="text-left space-y-6 mt-6">
                            <div className="flex justify-between items-baseline mb-4">
                               <h3 className="text-xl font-bold">Avaliações dos pacientes</h3>
                               <p className="text-sm text-muted-foreground">Média: {reviewSummary.average} de 5 ({reviewSummary.total} avaliações)</p>
                            </div>

                            <div className="space-y-2 mb-8">
                               {reviewSummary.distribution.map((item) => (
                                <div key={item.stars} className="flex items-center gap-4">
                                  <div className="flex items-center gap-1 text-yellow-400">
                                    <span className="text-sm font-medium text-muted-foreground">{item.stars}</span>
                                    <Star className="w-4 h-4 fill-current"/>
                                  </div>
                                  <Progress value={item.percentage} className="w-full h-2" />
                                  <span className="w-10 text-right text-sm text-muted-foreground">{item.percentage}%</span>
                                </div>
                               ))}
                            </div>

                            <Separator />

                            <div className="py-6 space-y-3">
                              {reviewSummary.criteria.map((criterion) => (
                                <div key={criterion.name} className="flex justify-between items-center text-muted-foreground">
                                  <p>{criterion.name}</p>
                                  <p className="font-semibold text-foreground">{criterion.score.toFixed(1)}</p>
                                </div>
                              ))}
                            </div>

                             <LeaveReviewDialog professionalName={professional.name}>
                                <Button variant="outline" className="w-full h-12 rounded-lg bg-muted hover:bg-muted/80 border-border">
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Deixar minha avaliação
                                </Button>
                            </LeaveReviewDialog>

                            <Separator className="my-8" />

                            <div>
                                {reviews.map((review: any) => (
                                    <div key={review.id} className="mb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex text-yellow-400">
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
