// src/app/comunidade/grupos/[id]/client-page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Users, Check, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { entrarNoGrupo, sairDoGrupo } from '@/app/actions/groups';
import type { GroupMember } from '@/lib/data/groups';

type GroupDetailClientProps = {
  group: { id: string; name: string; description: string; tags: string[] };
  members: GroupMember[];
  isMember: boolean;
  isLoggedIn: boolean;
};

export default function GroupDetailClient({ group, members, isMember, isLoggedIn }: GroupDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [membro, setMembro] = useState(isMember);
  const [processando, setProcessando] = useState(false);

  const handleJoinToggle = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    setProcessando(true);
    const isNowMember = !membro;
    const { ok, erro } = isNowMember ? await entrarNoGrupo(group.id) : await sairDoGrupo(group.id);
    setProcessando(false);

    if (!ok) {
      toast({ variant: 'destructive', title: 'Não foi possível concluir', description: erro });
      return;
    }

    setMembro(isNowMember);
    // Recarrega os dados do Server Component (lista de membros/contagem atualizadas).
    router.refresh();
    toast({
      title: isNowMember ? 'Você entrou no grupo!' : 'Você saiu do grupo',
      description: `Agora você ${isNowMember ? 'faz parte' : 'não faz mais parte'} de "${group.name}".`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <HeaderSecondary />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <Link href="/comunidade/explorar-grupos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Voltar para Explorar Grupos
            </Link>

            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <CardTitle className="text-2xl">{group.name}</CardTitle>
                  <CardDescription className="mt-1">{group.description}</CardDescription>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="text-sm text-muted-foreground">{members.length} membros</span>
                    {group.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <Button onClick={handleJoinToggle} disabled={processando} variant={membro ? 'default' : 'outline'}>
                  {membro ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                  {membro ? 'Participando' : 'Participar'}
                </Button>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Membros</CardTitle>
              </CardHeader>
              <CardContent>
                {members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum membro ainda. Seja o primeiro a entrar!</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {members.map((member) => (
                      <div key={member.profileId} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate">{member.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
