// src/app/suporte-ia/page.tsx
"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, HelpCircle, Search, AppWindow, BadgeHelp, BookUser, ShieldQuestion, Sparkles } from 'lucide-react';
import { askLegalAssistant } from '@/ai/flows/legal-assistant-flow';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';

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

// SearchBar
const SearchBar = ({ className, onSubmit, query, onQueryChange, loading }: { className?: string, onSubmit: (e: React.FormEvent) => void, query: string, onQueryChange: (value: string) => void, loading: boolean }) => (
    <div className={className}>
       <div className="relative">
           <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-full blur-lg opacity-50 animate-pulse-slow"></div>
           <form onSubmit={onSubmit} className="relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
               <Input
               type="search"
               placeholder="Deixe sua dúvida aqui..."
               className="w-full h-16 pl-16 pr-16 rounded-full text-base shadow-lg border-2 border-transparent focus:border-primary focus:ring-primary bg-background"
               value={query}
               onChange={(e) => onQueryChange(e.target.value)}
               disabled={loading}
               />
               <Button type="submit" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full h-12 w-12" disabled={loading || !query.trim()}>
               <ArrowRight className="h-6 w-6" />
               <span className="sr-only">Buscar</span>
               </Button>
           </form>
       </div>
   </div>
 );
 SearchBar.displayName = 'SearchBar';

function AiSupportPageContent() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const responseEndRef = useRef<HTMLDivElement | null>(null);
  const hasSearchedFromUrl = useRef(false);

  const scrollToBottom = () => {
    responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (aiResponse || loading) {
      scrollToBottom();
    }
  }, [aiResponse, loading]);

  const handleSearch = async (queryString: string) => {
    if (!queryString.trim() || loading) return;

    setLoading(true);
    setAiResponse(null);
    
    try {
      const responseStream = await askLegalAssistant(queryString);
      const reader = responseStream.getReader();
      const decoder = new TextDecoder();

      let accumulatedResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;
        setAiResponse(accumulatedResponse);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description: "Não foi possível processar sua pergunta. Tente novamente.",
      });
      setAiResponse(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
    setQuery('');
  };
  
  useEffect(() => {
    const queryFromUrl = searchParams.get('q');
    if (queryFromUrl && !hasSearchedFromUrl.current) {
      handleSearch(decodeURIComponent(queryFromUrl));
      hasSearchedFromUrl.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTopicClick = (topic: string) => {
    if (loading) return;
    setQuery(topic);
    handleSearch(topic);
    setQuery('');
  }

  return (
    <section className="w-full pt-8 md:pt-12 pb-12 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Container para o Cabeçalho e Busca */}
        <div className="max-w-3xl mx-auto">
            <div className="animate-in fade-in-0 duration-500 mb-6">
              <div className="flex flex-col items-center text-center space-y-2 mb-6">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                      Como podemos te ajudar hoje?
                  </h1>
                  <p className="max-w-[700px] text-foreground/80 md:text-xl">
                      A ponte entre você e seus direitos, benefícios e próximos passos. Use nossa busca inteligente ou explore os tópicos abaixo.
                  </p>
              </div>
            
              <SearchBar 
                className="mb-12"
                onSubmit={handleSubmit}
                query={query}
                onQueryChange={setQuery}
                loading={loading}
              />

              <div className="flex flex-wrap items-center justify-center gap-3 text-sm mb-12">
                  <span className="font-semibold mr-2">Tópicos populares:</span>
                  {popularTopics.map((topic, index) => (
                      <Button key={index} variant="outline" className="rounded-full" onClick={() => handleTopicClick(topic.text)} disabled={loading}>
                          {topic.icon}
                          {topic.text}
                      </Button>
                  ))}
              </div>

              {(loading || aiResponse) && (
                 <div className="space-y-6 mt-12">
                    <div className="flex items-start gap-4 justify-start">
                        <Avatar className="w-8 h-8 bg-primary/10 text-primary">
                            <AvatarFallback><Sparkles className={loading ? "animate-pulse" : ""}/></AvatarFallback>
                        </Avatar>
                         <div className="max-w-xl rounded-2xl p-4 bg-muted text-foreground rounded-bl-none">
                            {loading && !aiResponse ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-64" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            ) : (
                                <div className="prose prose-sm max-w-none text-current">
                                    <ReactMarkdown>{aiResponse}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                     <div ref={responseEndRef} />
                </div>
              )}
            </div>
        </div>

        {/* Container mais amplo exclusivo para os Cards (max-w-5xl) */}
        {!(loading || aiResponse) && (
          <div className="max-w-5xl mx-auto pt-4">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3 items-stretch">
              {supportCards.map((card, index) => (
                <Link href={card.href} key={index} className="group flex h-full">
                  <Card className="p-6 bg-card dark:bg-card rounded-2xl shadow-md hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between text-left cursor-pointer w-full h-full border border-border">
                    <div>
                      <CardHeader className="flex flex-col items-start gap-3 p-0">
                        <div className="bg-primary/10 p-3 rounded-xl">
                          {card.icon}
                        </div>
                        <CardTitle className="text-xl font-semibold dark:text-card-foreground">
                          {card.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 mt-3">
                        <p className="text-sm text-foreground/80 dark:text-muted-foreground leading-relaxed">
                          {card.description}
                        </p>
                      </CardContent>
                    </div>
                    
                    <div className="mt-6 pt-2">
                      <span className="font-semibold text-sm text-primary hover:text-primary/80 flex items-center">
                        Ver mais <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default function AiSupportPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <HeaderSecondary />
            <main className="flex-1">
                <Suspense fallback={null}>
                    <AiSupportPageContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}