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
import { criarAvaliacao } from '@/app/actions/reviews';
import type { ProfessionalDetailData, ReviewData, ReviewSummary } from '@/lib/data/professionals';

function LeaveReviewDialog({
  children,
  professionalName,
  entityId,
  entityType,
}: {
  children: React.ReactNode;
  professionalName: string;
  entityId: string;
  entityType: 'professional' | 'clinic';
}) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [enviando, setEnviando] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Avaliação incompleta",
        description: "Por favor, selecione uma nota de 1 a 5 estrelas.",
      });
      return;
    }

    const content = (e.currentTarget.elements.namedItem('review-text') as HTMLTextAreaElement).value;

    setEnviando(true);
    const alvo = entityType === 'professional' ? { professionalId: entityId } : { clinicId: entityId };
    const { ok, erro } = await criarAvaliacao(alvo, rating, content);
    setEnviando(false);

    if (!ok) {
      toast({
        variant: "destructive",
        title: "Não foi possível enviar",
        description: erro,
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
            Compartilhe sua experiência para ajudar outros membros da comunidade.
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
              <Textarea id="review-text" name="review-text" placeholder="Descreva sua experiência..." rows={5} required />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button id="close-dialog-btn" type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar Avaliação'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type ProfessionalProfileClientProps = {
  professional: ProfessionalDetailData;
  reviews: ReviewData[];
  reviewSummary: ReviewSummary;
  entityType: 'professional' | 'clinic';
};

export default function ProfessionalProfileClient({ professional, reviews, reviewSummary, entityType }: ProfessionalProfileClientProps) {
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
                                    {professional.contact.instagram && (
                                      <div className="flex items-center gap-4">
                                          <Instagram className="h-5 w-5 text-primary flex-shrink-0" />
                                          <a href={`https://instagram.com/${professional.contact.instagram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                              {professional.contact.instagram}
                                          </a>
                                      </div>
                                    )}
                                </CardContent>
                           </Card>
                        </TabsContent>
                         <TabsContent value="avaliacoes" className="text-left space-y-6 mt-6">
                            <div className="flex justify-between items-baseline mb-4">
                               <h3 className="text-xl font-bold">Avaliações dos pacientes</h3>
                               <p className="text-sm text-muted-foreground">
                                {reviewSummary.total > 0
                                  ? `Média: ${reviewSummary.average} de 5 (${reviewSummary.total} avaliações)`
                                  : 'Ainda sem avaliações'}
                               </p>
                            </div>

                            {reviewSummary.total > 0 && (
                              <>
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
                              </>
                            )}

                             <LeaveReviewDialog professionalName={professional.name} entityId={professional.id} entityType={entityType}>
                                <Button variant="outline" className="w-full h-12 rounded-lg bg-muted hover:bg-muted/80 border-border">
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Deixar minha avaliação
                                </Button>
                            </LeaveReviewDialog>

                            <Separator className="my-8" />

                            {reviews.length === 0 ? (
                              <p className="text-muted-foreground text-center py-4">Seja o primeiro a avaliar.</p>
                            ) : (
                              <div>
                                  {reviews.map((review) => (
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
                            )}
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
