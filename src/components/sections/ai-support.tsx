
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, HelpCircle, Search, AppWindow, BadgeHelp, BookUser, ShieldQuestion, Terminal, User } from 'lucide-react';
import { askLegalAssistant } from '@/ai/flows/legal-assistant-flow';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';

const supportCards = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'Conheça seus direitos',
    description: 'Navegue por guias práticos sobre legislação, BPC, laudos e mais.',
    href: '/faq',
  },
  {
    icon: <AppWindow className="h-8 w-8 text-primary" />,
    title: 'Explore o Acervo',
    description: 'Encontre materiais, vídeos e documentos úteis para o dia a dia.',
    href: '/acervo-digital',
  },
  {
    icon: <HelpCircle className="h-8 w-8 text-primary" />,
    title: 'Perguntas Frequentes',
    description: 'Respostas rápidas para as dúvidas mais comuns da comunidade.',
    href: '/faq',
  },
];

const popularTopics = [
    { text: "Como solicitar o BPC?", icon: <ShieldQuestion className="h-4 w-4 mr-2" /> },
    { text: "Quais são os primeiros passos após o diagnóstico?", icon: <BookUser className="h-4 w-4 mr-2" /> },
    { text: "Direitos na escola: o que eu preciso saber?", icon: <BadgeHelp className="h-4 w-4 mr-2" /> },
]

export default function AiSupport() {
  const [query, setQuery] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent, queryString?: string) => {
    e.preventDefault();
    const currentQuery = queryString || query;
    if (!currentQuery.trim()) return;

    setLoading(true);
    setAiResponse('');
    setLastQuery(currentQuery);
    setQuery('');
    
    try {
      const responseStream = await askLegalAssistant(currentQuery);
      const reader = responseStream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        setAiResponse(prev => (prev || '') + chunk);
      }

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description: "Não foi possível processar sua pergunta. Tente novamente.",
      });
      setAiResponse(null);
      setLastQuery('');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topic: string) => {
    handleSearch(new Event('submit') as any, topic);
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
            <div className="relative mb-8">
                 <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-full blur-lg opacity-75 animate-pulse-slow"></div>
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Deixe sua dúvida aqui. Ex: 'Como obter o laudo para TEA?'"
                    className="w-full h-16 pl-16 pr-16 rounded-full text-base shadow-lg border-2 border-transparent focus:border-primary focus:ring-primary bg-background"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                    />
                    <Button type="submit" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full h-12 w-12" disabled={loading}>
                    <ArrowRight className="h-6 w-6" />
                    <span className="sr-only">Buscar</span>
                    </Button>
                </form>
            </div>
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

        <div className="animate-in fade-in-0 duration-500">
          {lastQuery && (
            <Card className="max-w-3xl mx-auto my-8 p-6">
              <div className="flex items-start space-x-4">
                <User className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <p className="font-semibold">Sua pergunta</p>
                  <p className="text-muted-foreground">{lastQuery}</p>
                </div>
              </div>
            </Card>
          )}

          {(loading && !aiResponse) && (
            <div className="max-w-3xl mx-auto my-8">
              <Card className="p-6">
                  <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                          <Terminal className="h-6 w-6 text-primary animate-pulse" />
                      </div>
                      <div className="space-y-3 flex-1">
                          <p className="font-semibold">A.I. está respondendo...</p>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-4/5" />
                           <Skeleton className="h-4 w-full" />
                      </div>
                  </div>
              </Card>
          </div>
          )}
          
          {aiResponse && (
            <div className="max-w-3xl mx-auto my-8">
              <Card className="p-6">
                 <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Terminal className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <p className="font-semibold">Resposta da A.I.</p>
                       <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground">
                          <ReactMarkdown>
                            {aiResponse}
                          </ReactMarkdown>
                        </div>
                    </div>
                 </div>
              </Card>
            </div>
          )}
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto pt-16">
          {supportCards.map((card, index) => (
            <Link href={card.href} key={index} className="group">
              <Card className="p-8 bg-white rounded-2xl shadow-xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between text-left cursor-pointer h-full">
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
                  <span className="font-semibold text-primary hover:text-primary/80 flex items-center">
                      Ver mais <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
