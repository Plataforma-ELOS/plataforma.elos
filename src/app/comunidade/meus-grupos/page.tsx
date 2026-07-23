
// src/app/comunidade/meus-grupos/page.tsx
'use client';
import { useState, useEffect } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Search } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

type UserGroup = {
  id: string;
  name: string;
  description: string;
  members: number;
  tags: string[];
};

export default function MyGroupsPage() {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setCarregando(false);
        return;
      }

      const { data, error } = await supabase
        .from('group_members')
        .select('group:groups!group_members_group_id_fkey ( id, name, description, tags, group_members(count) )')
        .eq('profile_id', user.id);

      if (error) {
        console.error('[meus-grupos] erro ao buscar grupos:', error.message);
        setCarregando(false);
        return;
      }

      setUserGroups(
        (data ?? [])
          .map((row: any) => row.group)
          .filter(Boolean)
          .map((g: any) => ({
            id: g.id,
            name: g.name,
            description: g.description ?? '',
            members: g.group_members?.[0]?.count ?? 0,
            tags: g.tags ?? [],
          }))
      );
      setCarregando(false);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <HeaderSecondary />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/comunidade" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="w-4 h-4" />
              Voltar para a Comunidade
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold font-headline text-primary">Meus Grupos</h1>
                    <p className="text-muted-foreground mt-1">Seus espaços para conversas e conexões.</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/comunidade/explorar-grupos">
                    <Search className="mr-2 h-4 w-4" />
                    Explorar novos grupos
                  </Link>
                </Button>
            </div>

            {carregando ? (
              <p className="text-muted-foreground text-center py-8">Carregando seus grupos...</p>
            ) : userGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userGroups.map((group) => (
                  <Card key={group.id} className="flex flex-col p-6 gap-4 shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          <Users className="w-6 h-6 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <CardDescription className="mt-1">{group.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{group.members} membros</span>
                      <div className="flex gap-2">
                        {group.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center p-12 border-dashed shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
                <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Você ainda não faz parte de nenhum grupo</h2>
                <p className="text-muted-foreground mb-6">Que tal explorar os grupos existentes ou criar o seu próprio?</p>
                <div className="flex justify-center gap-4">
                  <Button asChild>
                    <Link href="/comunidade/explorar-grupos">
                      Explorar Grupos
                    </Link>
                  </Button>
                  <Button variant="secondary" asChild>
                     <Link href="/comunidade/criar-grupo">Criar um Grupo</Link>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

    