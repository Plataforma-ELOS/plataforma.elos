"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, HelpCircle, Search, AppWindow, BadgeHelp, BookUser, ShieldQuestion } from 'lucide-react';
import Link from 'next/link';

const supportCards = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'Conheça seus direitos',
    description: 'Navegue por guias práticos sobre legislação, BPC, laudos e mais.',
    href: '#',
  },
  {
    icon: <AppWindow className="h-8 w-8 text-primary" />,
    title: 'Acesse seus benefícios',
    description: 'Encontre programas e serviços de saúde, educação e transporte.',
    href: '#',
  },
  {
    icon: <HelpCircle className="h-8 w-8 text-primary" />,
    title: 'Perguntas Frequentes',
    description: 'Respostas rápidas para as dúvidas mais comuns da comunidade.',
    href: '#',
  },
];

const popularTopics = [
    { text: "Como solicitar o BPC?", icon: <ShieldQuestion className="h-4 w-4 mr-2" /> },
    { text: "Quais são os primeiros passos após o diagnóstico?", icon: <BookUser className="h-4 w-4 mr-2" /> },
    { text: "Direitos na escola: o que eu preciso saber?", icon: <BadgeHelp className="h-4 w-4 mr-2" /> },
]

export default function AiSupport() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
            Como podemos te ajudar hoje?
          </h1>
          <p className="max-w-[700px] text-foreground/80 md:text-xl">
            A ponte entre você e seus direitos, benefícios e próximos passos. Use nossa busca inteligente ou explore os tópicos abaixo.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
            <div className="relative mb-8">
                <Input
                type="search"
                placeholder="Deixe sua dúvida aqui. Ex: 'Como obter o laudo para TEA?'"
                className="w-full h-16 pl-6 pr-16 rounded-full text-base shadow-lg border-2 border-border focus:border-primary focus:ring-primary"
                />
                <Button type="submit" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full h-12 w-12">
                <Search className="h-6 w-6" />
                <span className="sr-only">Buscar</span>
                </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm mb-16">
                <span className="font-semibold mr-2">Tópicos populares:</span>
                {popularTopics.map((topic, index) => (
                    <Button key={index} variant="outline" className="rounded-full" asChild>
                       <Link href="#">
                         {topic.icon}
                         {topic.text}
                       </Link>
                    </Button>
                ))}
            </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {supportCards.map((card, index) => (
            <Card key={index} className="p-8 bg-white rounded-2xl shadow-xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between text-left">
              <div>
                <CardHeader className="flex flex-col items-start gap-4 p-0">
                  <div className="bg-primary/10 p-4 rounded-xl mb-2">
                    {card.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-3">
                  <p className="text-foreground/80">{card.description}</p>
                </CardContent>
              </div>
              <div className="mt-6">
                <Link href={card.href} className="font-semibold text-primary hover:text-primary/80 flex items-center group">
                    Ver mais <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
