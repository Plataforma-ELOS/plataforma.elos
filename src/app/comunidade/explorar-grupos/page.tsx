
// src/app/comunidade/explorar-grupos/page.tsx
'use client';
import { useState } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Search, Check, Plus } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const allGroups = [
  {
    id: '1',
    name: 'Dicas de Terapia Ocupacional',
    description: 'Compartilhando atividades e estratégias de T.O. para fazer em casa e no dia a dia.',
    members: 128,
    isMember: false,
    tags: ['T.O.', 'Atividades', 'Sensorial'],
  },
  {
    id: '2',
    name: 'BPC/LOAS: Dúvidas e Processos',
    description: 'Um grupo para tirar dúvidas, compartilhar experiências e se ajudar no processo do BPC.',
    members: 256,
    isMember: false,
    tags: ['Direitos', 'BPC', 'Legislação'],
  },
  {
    id: '3',
    name: 'Pais de Adolescentes com TEA',
    description: 'Espaço de apoio e troca para os desafios e vitórias da adolescência no espectro.',
    members: 97,
    isMember: false,
    tags: ['Adolescência', 'Família', 'Apoio'],
  },
  {
    id: '4',
    name: 'Comunicação Alternativa (CAA)',
    description: 'Tudo sobre CAA: aplicativos, métodos, dicas de implementação e histórias de sucesso.',
    members: 154,
    isMember: false,
    tags: ['Comunicação', 'Tecnologia', 'CAA'],
  },
];

export default function ExploreGroupsPage() {
    const [groups, setGroups] = useState(allGroups);
    const { toast } = useToast();

    const handleJoinToggle = (groupId: string) => {
        const updatedGroups = groups.map(group => {
            if (group.id === groupId) {
                const isNowMember = !group.isMember;
                toast({
                    title: isNowMember ? "Você entrou no grupo!" : "Você saiu do grupo",
                    description: `Agora você ${isNowMember ? "faz parte" : "não faz mais parte"} de "${group.name}".`,
                });
                return { ...group, isMember: isNowMember };
            }
            return group;
        });
        setGroups(updatedGroups);
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
            
            <div className="space-y-6">
              {groups.map(group => (
                <Card key={group.id} className="flex flex-col md:flex-row items-start p-6 gap-6">
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

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
