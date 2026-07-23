
// src/app/comunidade/explorar-grupos/page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Search, Check, Plus } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';
import { entrarNoGrupo, sairDoGrupo } from '@/app/actions/groups';

type GroupCardData = {
  id: string;
  name: string;
  description: string;
  members: number;
  isMember: boolean;
  tags: string[];
};

export default function ExploreGroupsPage() {
    const [groups, setGroups] = useState<GroupCardData[]>([]);
    const [carregando, setCarregando] = useState(true);
    const { toast } = useToast();

    const carregarGrupos = useCallback(async () => {
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();

        const [{ data: groupRows, error }, { data: membershipRows }] = await Promise.all([
            supabase.from('groups').select('id, name, description, tags, group_members(count)'),
            user
                ? supabase.from('group_members').select('group_id').eq('profile_id', user.id)
                : Promise.resolve({ data: [] as { group_id: string }[] }),
        ]);

        if (error) {
            console.error('[explorar-grupos] erro ao buscar grupos:', error.message);
            setCarregando(false);
            return;
        }

        const meusGrupos = new Set((membershipRows ?? []).map((m) => m.group_id));

        setGroups(
            (groupRows ?? []).map((g: any) => ({
                id: g.id,
                name: g.name,
                description: g.description ?? '',
                members: g.group_members?.[0]?.count ?? 0,
                isMember: meusGrupos.has(g.id),
                tags: g.tags ?? [],
            }))
        );
        setCarregando(false);
    }, []);

    useEffect(() => {
        carregarGrupos();
    }, [carregarGrupos]);

    const handleJoinToggle = async (groupId: string) => {
        const group = groups.find((g) => g.id === groupId);
        if (!group) return;

        const isNowMember = !group.isMember;
        setGroups(groups.map((g) => (g.id === groupId ? { ...g, isMember: isNowMember, members: g.members + (isNowMember ? 1 : -1) } : g)));

        const { ok, erro } = isNowMember ? await entrarNoGrupo(groupId) : await sairDoGrupo(groupId);

        if (!ok) {
            setGroups(groups);
            toast({ variant: 'destructive', title: 'Não foi possível concluir', description: erro });
            return;
        }

        toast({
            title: isNowMember ? "Você entrou no grupo!" : "Você saiu do grupo",
            description: `Agora você ${isNowMember ? "faz parte" : "não faz mais parte"} de "${group.name}".`,
        });
    };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <HeaderSecondary />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/comunidade/meus-grupos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="w-4 h-4" />
              Voltar para Meus Grupos
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold font-headline text-primary">Explorar Grupos</h1>
                    <p className="text-muted-foreground mt-1">Encontre novas comunidades e conecte-se.</p>
                </div>
            </div>
            
            {carregando ? (
              <p className="text-muted-foreground text-center py-8">Carregando grupos...</p>
            ) : groups.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhum grupo por aqui ainda.</p>
            ) : (
              <div className="space-y-6">
                {groups.map(group => (
                  <Card key={group.id} className="flex flex-col md:flex-row items-start p-6 gap-6 shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
                      <Avatar className="h-16 w-16 hidden md:flex">
                          <AvatarFallback>
                              <Users className="w-8 h-8 text-muted-foreground" />
                          </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                          <CardTitle className="text-xl">{group.name}</CardTitle>
                          <CardDescription className="mt-1">{group.description}</CardDescription>
                          <div className="flex items-center text-sm text-muted-foreground mt-3 gap-4">
                              <span>{group.members} membros</span>
                              <div className="flex gap-2">
                                  {group.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                              </div>
                          </div>
                      </div>
                      <Button
                          variant={group.isMember ? 'default' : 'outline'}
                          className="w-full md:w-auto"
                          onClick={() => handleJoinToggle(group.id)}
                      >
                          {group.isMember ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                          {group.isMember ? 'Participando' : 'Participar'}
                      </Button>
                  </Card>
                ))}
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

    