
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, FileText, HelpCircle, Search, AppWindow, BadgeHelp, BookUser, ShieldQuestion, Terminal } from 'lucide-react';
import Link from 'next/link';
import { askLegalAssistant } from '@/ai/flows/legal-assistant-flow';

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
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAiResponse(null);
    try {
      const response = await askLegalAssistant(query);
      setAiResponse(response);
    } catch (error) {
      console.error(error);
      setAiResponse('Desculpe, não consegui processar sua pergunta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = async (topic: string) => {
    setQuery(topic);
    setLoading(true);
    setAiResponse(null);
    try {
      const response = await askLegalAssistant(topic);
      setAiResponse(response);
    } catch (error) {
      console.error(error);
      setAiResponse('Desculpe, não consegui processar sua pergunta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

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
            <form onSubmit={handleSearch} className="relative mb-8">
                <Input
                  type="search"
                  placeholder="Deixe sua dúvida aqui. Ex: 'Como obter o laudo para TEA?'"
                  className="w-full h-16 pl-6 pr-16 rounded-full text-base shadow-lg border-2 border-border focus:border-primary focus:ring-primary"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={loading}
                />
                <Button type="submit" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full h-12 w-12" disabled={loading}>
                  <Search className="h-6 w-6" />
                  <span className="sr-only">Buscar</span>
                </Button>
            </form>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm mb-16">
                <span className="font-semibold mr-2">Tópicos populares:</span>
                {popularTopics.map((topic, index) => (
                    <Button key={index} variant="outline" className="rounded-full" onClick={() => handleTopicClick(topic.text)} disabled={loading}>
                        {topic.icon}
                        {topic.text}
                    </Button>
                ))}
            </div>
        </div>

        {loading && (
          <div className="max-w-3xl mx-auto text-center">
            <p>Buscando a melhor resposta para você...</p>
          </div>
        )}
        
        {aiResponse && (
          <div className="max-w-3xl mx-auto my-8">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Resposta da A.I.</AlertTitle>
              <AlertDescription>
                {aiResponse}
              </AlertDescription>
            </Alert>
          </div>
        )}
        
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
