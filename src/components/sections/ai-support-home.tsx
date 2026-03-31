
// src/components/sections/ai-support-home.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AiSupportHome() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const encodedQuery = encodeURIComponent(query);
      router.push(`/suporte-ia?q=${encodedQuery}`);
    }
  };

  return (
    <section className="w-full py-20 md:py-24 bg-gradient-to-b from-primary/10 to-background dark:from-primary/20 dark:to-background">
      <div className="container mx-auto px-4 md:px-6 flex justify-center">
        <div className="relative w-full max-w-2xl">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-3xl blur-lg opacity-75 animate-pulse-slow"></div>
          <Card className="relative w-full text-center p-6 md:p-8 shadow-xl rounded-2xl">
            <CardHeader className="mb-6 md:mb-8">
               <div className="flex items-center justify-center mb-6">
                <div className="flex -space-x-2">
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="User 1" data-ai-hint="generic-user-avatar-1" />
                        <AvatarFallback>U1</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="User 2" data-ai-hint="generic-user-avatar-2" />
                        <AvatarFallback>U2</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="User 3" data-ai-hint="generic-user-avatar-3" />
                        <AvatarFallback>U3</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background bg-muted">
                        <AvatarFallback><Plus className="h-4 w-4"/></AvatarFallback>
                    </Avatar>
                </div>
                <p className="text-sm text-muted-foreground ml-3">Tiraram suas dúvidas</p>
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold font-headline">Tire suas dúvidas aqui</CardTitle>
              <CardDescription className="text-base md:text-lg text-foreground/80 pt-2">
                A IA que te ajuda com a parte jurídica.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNavigate} className="flex w-full items-center space-x-2">
                <Input 
                  type="text" 
                  placeholder="Deixe sua dúvida aqui..." 
                  className="h-12 text-base"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button type="submit" size="icon" className="rounded-full h-12 w-12 flex-shrink-0">
                  <ArrowRight className="h-6 w-6 text-white" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
