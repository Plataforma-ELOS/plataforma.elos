// src/components/sections/ai-support.tsx

"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, HelpCircle, Search, AppWindow, BadgeHelp, BookUser, ShieldQuestion, Terminal, User, Sparkles } from 'lucide-react';
import { askLegalAssistant } from '@/ai/flows/legal-assistant-flow';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';

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

type Message = {
    role: 'user' | 'ai';
    content: string;
}

export default function AiSupport() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSearch = async (queryString: string) => {
    if (!queryString.trim() || loading) return;

    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: queryString }]);
    
    try {
      const responseStream = await askLegalAssistant(queryString);
      const reader = responseStream.getReader();
      const decoder = new TextDecoder();

      let accumulatedResponse = '';
      setMessages(prev => [...prev, { role: 'ai', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = accumulatedResponse;
            return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description: "Não foi possível processar sua pergunta. Tente novamente.",
      });
      setMessages(prev => prev.slice(0, -2)); // Remove user and empty AI message on error
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !query.trim()) return;
    handleSearch(query);
    setQuery('');
  };
  
  useEffect(() => {
    const queryFromUrl = searchParams.get('q');
    if (queryFromUrl && messages.length === 0) {
      handleSearch(decodeURIComponent(queryFromUrl));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTopicClick = (topic: string) => {
    if (loading) return;
    handleSearch(topic);
  }

  const SearchBar = ({ className } : { className?: string }) => (
     <div className={className}>
        <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-full blur-lg opacity-50 animate-pulse-slow"></div>
            <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Deixe sua dúvida aqui..."
                className="w-full h-16 pl-16 pr-16 rounded-full text-base shadow-lg border-2 border-transparent focus:border-primary focus:ring-primary bg-background"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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

  const renderWelcomeOrChat = () => {
    if(messages.length > 0) {
        return (
            <div className="space-y-6">
                {messages.map((message, index) => (
                    <div key={index} className={cn("flex items-start gap-4", message.role === 'user' ? "justify-end" : "justify-start")}>
                        {message.role === 'ai' && (
                            <Avatar className="w-8 h-8 bg-primary/10 text-primary">
                                <AvatarFallback><Sparkles /></AvatarFallback>
                            </Avatar>
                        )}
                         <div className={cn(
                            "max-w-xl rounded-2xl p-4", 
                            message.role === 'user' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none"
                         )}>
                            <div className="prose prose-sm max-w-none text-current">
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                        </div>
                        {message.role === 'user' && (
                            <Avatar className="w-8 h-8">
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex items-start gap-4 justify-start">
                        <Avatar className="w-8 h-8 bg-primary/10 text-primary">
                            <AvatarFallback><Sparkles className="animate-pulse"/></AvatarFallback>
                        </Avatar>
                        <div className="max-w-xl rounded-2xl p-4 bg-muted text-foreground rounded-bl-none">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-64" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                    Como podemos te ajudar hoje?
                </h1>
                <p className="max-w-[700px] text-foreground/80 md:text-xl">
                    A ponte entre você e seus direitos, benefícios e próximos passos. Use nossa busca inteligente ou explore os tópicos abaixo.
                </p>
            </div>
            
            <SearchBar className="mb-12"/>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm mb-16">
                <span className="font-semibold mr-2">Tópicos populares:</span>
                {popularTopics.map((topic, index) => (
                    <Button key={index} variant="outline" className="rounded-full" onClick={() => handleTopicClick(topic.text)} disabled={loading}>
                        {topic.icon}
                        {topic.text}
                    </Button>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto pt-8">
            {supportCards.map((card, index) => (
                <Link href={card.href} key={index} className="group">
                <Card className="p-8 bg-card dark:bg-card rounded-2xl shadow-xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between text-left cursor-pointer h-full">
                    <div>
                    <CardHeader className="flex flex-col items-start gap-4 p-0">
                        <div className="bg-primary/10 p-4 rounded-xl mb-2">
                        {card.icon}
                        </div>
                        <CardTitle className="text-xl font-semibold dark:text-card-foreground">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mt-3">
                        <p className="text-foreground/80 dark:text-muted-foreground">{card.description}</p>
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
        </>
    )
  }

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="max-w-3xl mx-auto">
            <div className="animate-in fade-in-0 duration-500 mb-8">
             {renderWelcomeOrChat()}
            </div>
            
            {messages.length > 0 && <SearchBar className="sticky bottom-6 mt-auto" />}
        </div>
      </div>
    </section>
  );
}
