
// src/app/noticias-ai/[slug]/ai-chat.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Terminal } from 'lucide-react';
import { askAboutArticle } from '@/ai/flows/news-flow';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';

export function AiChat({ articleContent }: { articleContent: string }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAiResponse(null);

    try {
      const response = await askAboutArticle({ article: articleContent, question: query });
      setAiResponse(response);
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
      setQuery('');
    }
  };

  return (
    <Card className="mt-12 bg-muted/40">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
                <Terminal className="h-6 w-6" />
                Pergunte à IA sobre esta notícia
            </CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <Input
                    placeholder="Ex: 'Quais os principais pontos da lei?'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                />
                <Button type="submit" disabled={loading}>
                    <Search className="h-4 w-4 mr-2" />
                    Perguntar
                </Button>
            </form>
            {loading && (
                <div className="space-y-2 pt-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            )}
            {aiResponse && (
                <div className="pt-4 prose prose-sm max-w-none text-foreground">
                    <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </div>
            )}
        </CardContent>
    </Card>
  );
}
